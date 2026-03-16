from datetime import datetime

from pydantic import BaseModel


class ExplanationResponse(BaseModel):
    id: int
    vulnerability_id: int
    user_id: int
    retrieved_context: str | None = None
    explanation_text: str
    created_at: datetime

    class Config:
        from_attributes = True