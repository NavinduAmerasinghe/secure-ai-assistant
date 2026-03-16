from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db_dependency
from app.models.user import User
from app.schemas.explanation import ExplanationResponse
from app.services.explanation_service import (
    create_explanation_for_vulnerability,
    get_explanation_by_vulnerability,
    get_vulnerability_by_id,
)

router = APIRouter(prefix="/explanations", tags=["Explanations"])


@router.post("/generate/{vulnerability_id}", response_model=ExplanationResponse, status_code=status.HTTP_201_CREATED)
def generate_explanation(
    vulnerability_id: int,
    db: Session = Depends(get_db_dependency),
    current_user: User = Depends(get_current_user),
):
    vulnerability = get_vulnerability_by_id(db, vulnerability_id)

    if not vulnerability or vulnerability.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vulnerability not found",
        )

    existing = get_explanation_by_vulnerability(db, vulnerability_id, current_user.id)
    if existing:
        return existing

    explanation = create_explanation_for_vulnerability(db, vulnerability)
    return explanation


@router.get("/vulnerability/{vulnerability_id}", response_model=ExplanationResponse)
def get_explanation(
    vulnerability_id: int,
    db: Session = Depends(get_db_dependency),
    current_user: User = Depends(get_current_user),
):
    explanation = get_explanation_by_vulnerability(db, vulnerability_id, current_user.id)

    if not explanation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Explanation not found",
        )

    return explanation