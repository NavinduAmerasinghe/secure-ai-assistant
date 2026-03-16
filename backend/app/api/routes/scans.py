from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db_dependency
from app.models.submission import Submission
from app.models.user import User
from app.schemas.scan import ScanResultResponse, VulnerabilityResponse
from app.services.scan_service import (
    get_scan_result_with_vulnerabilities,
    get_scans_for_submission,
    run_scan_for_submission,
)
from app.services.submission_service import get_submission_by_id

router = APIRouter(prefix="/scans", tags=["Scans"])


@router.post("/run/{submission_id}", status_code=status.HTTP_201_CREATED)
def run_scan(
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

    scan_result = run_scan_for_submission(db, submission)

    return {
        "message": "Scan completed successfully",
        "scan_result_id": scan_result.id,
        "summary": scan_result.summary,
    }


@router.get("/submission/{submission_id}", response_model=list[ScanResultResponse])
def list_scans_for_submission(
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

    scans = get_scans_for_submission(db, submission_id, current_user.id)

    response = []
    for scan in scans:
        response.append(
            ScanResultResponse(
                id=scan.id,
                submission_id=scan.submission_id,
                user_id=scan.user_id,
                status=scan.status,
                summary=scan.summary,
                created_at=scan.created_at,
                vulnerabilities=[],
            )
        )

    return response


@router.get("/{scan_result_id}", response_model=ScanResultResponse)
def get_scan_result(
    scan_result_id: int,
    db: Session = Depends(get_db_dependency),
    current_user: User = Depends(get_current_user),
):
    result = get_scan_result_with_vulnerabilities(db, scan_result_id, current_user.id)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan result not found",
        )

    scan_result, vulnerabilities = result

    return ScanResultResponse(
        id=scan_result.id,
        submission_id=scan_result.submission_id,
        user_id=scan_result.user_id,
        status=scan_result.status,
        summary=scan_result.summary,
        created_at=scan_result.created_at,
        vulnerabilities=[
            VulnerabilityResponse.model_validate(v) for v in vulnerabilities
        ],
    )