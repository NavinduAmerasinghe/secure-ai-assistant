import os

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db_dependency
from app.core.config import settings
from app.core.file_security import (
    generate_safe_filename,
    is_allowed_extension,
    sanitize_filename,
)
from app.models.submission import Submission
from app.models.user import User
from app.schemas.submission import CodePasteRequest, SubmissionResponse
from app.services.submission_service import (
    create_file_submission,
    create_paste_submission,
    get_submission_by_id,
    get_user_submissions,
)

router = APIRouter(prefix="/submissions", tags=["Submissions"])


@router.post("/paste", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def submit_pasted_code(
    payload: CodePasteRequest,
    db: Session = Depends(get_db_dependency),
    current_user: User = Depends(get_current_user),
):
    submission = create_paste_submission(
        db=db,
        user_id=current_user.id,
        content=payload.content,
        language=payload.language,
    )
    return submission


@router.post("/upload", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def upload_code_file(
    file: UploadFile = File(...),
    language: str | None = Form(default=None),
    db: Session = Depends(get_db_dependency),
    current_user: User = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided",
        )

    safe_original_name = sanitize_filename(file.filename)

    if not is_allowed_extension(safe_original_name):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not allowed",
        )

    content = await file.read()

    if len(content) > settings.max_file_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds allowed limit",
        )

    try:
        decoded_content = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only text-based source files are allowed",
        )

    os.makedirs(settings.upload_dir, exist_ok=True)

    safe_stored_name = generate_safe_filename(safe_original_name)
    file_path = os.path.join(settings.upload_dir, safe_stored_name)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(decoded_content)

    submission = create_file_submission(
        db=db,
        user_id=current_user.id,
        original_filename=safe_original_name,
        stored_filename=safe_stored_name,
        file_path=file_path,
        language=language,
    )
    return submission


@router.get("/", response_model=list[SubmissionResponse])
def list_my_submissions(
    db: Session = Depends(get_db_dependency),
    current_user: User = Depends(get_current_user),
):
    return get_user_submissions(db, current_user.id)


@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_my_submission(
    submission_id: int,
    db: Session = Depends(get_db_dependency),
    current_user: User = Depends(get_current_user),
):
    submission = get_submission_by_id(db, submission_id)

    if not submission or submission.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    return submission