from datetime import datetime

from pydantic import BaseModel


class VulnerabilityResponse(BaseModel):
    id: int
    tool: str
    rule_id: str | None = None
    title: str
    severity: str
    description: str | None = None
    recommendation: str | None = None
    file_path: str | None = None
    line_number: int | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ScanResultResponse(BaseModel):
    id: int
    submission_id: int
    user_id: int
    status: str
    summary: str | None = None
    created_at: datetime
    vulnerabilities: list[VulnerabilityResponse] = []

    class Config:
        from_attributes = True