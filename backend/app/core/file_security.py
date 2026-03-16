import os
import uuid
from pathlib import Path


ALLOWED_EXTENSIONS = {".py", ".js", ".ts", ".java", ".txt"}


def is_allowed_extension(filename: str) -> bool:
    extension = Path(filename).suffix.lower()
    return extension in ALLOWED_EXTENSIONS


def sanitize_filename(filename: str) -> str:
    name = os.path.basename(filename)
    cleaned = "".join(c for c in name if c.isalnum() or c in {".", "_", "-"})
    return cleaned or "uploaded_file.txt"


def generate_safe_filename(original_filename: str) -> str:
    extension = Path(original_filename).suffix.lower()
    return f"{uuid.uuid4().hex}{extension}"