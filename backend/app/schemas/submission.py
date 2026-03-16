from datetime import datetime

from pydantic import BaseModel, Field


class CodePasteRequest(BaseModel):
    content: str = Field(min_length=1, max_length=100000)
    language: str | None = Field(default=None, max_length=50)


class SubmissionResponse(BaseModel):
    id: int
    user_id: int
    input_type: str
    original_filename: str | None = None
    stored_filename: str | None = None
    file_path: str | None = None
    language: str | None = None
    content: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True