from sqlalchemy.orm import Session

from app.models.submission import Submission


def create_paste_submission(
    db: Session,
    user_id: int,
    content: str,
    language: str | None = None,
) -> Submission:
    submission = Submission(
        user_id=user_id,
        input_type="paste",
        content=content,
        language=language,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def create_file_submission(
    db: Session,
    user_id: int,
    original_filename: str,
    stored_filename: str,
    file_path: str,
    language: str | None = None,
) -> Submission:
    submission = Submission(
        user_id=user_id,
        input_type="file",
        original_filename=original_filename,
        stored_filename=stored_filename,
        file_path=file_path,
        language=language,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def get_user_submissions(db: Session, user_id: int) -> list[Submission]:
    return (
        db.query(Submission)
        .filter(Submission.user_id == user_id)
        .order_by(Submission.created_at.desc())
        .all()
    )


def get_submission_by_id(db: Session, submission_id: int) -> Submission | None:
    return db.query(Submission).filter(Submission.id == submission_id).first()