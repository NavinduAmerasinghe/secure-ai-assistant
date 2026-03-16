from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    input_type = Column(String, nullable=False)  # "paste" or "file"
    original_filename = Column(String, nullable=True)
    stored_filename = Column(String, nullable=True)
    file_path = Column(String, nullable=True)

    language = Column(String, nullable=True)
    content = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())