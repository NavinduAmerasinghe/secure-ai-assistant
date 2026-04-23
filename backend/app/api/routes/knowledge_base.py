from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import os

router = APIRouter(prefix="/knowledge-base", tags=["Knowledge Base"])

BASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../knowledge_base'))

@router.get("/list")
def list_knowledge_base():
    result = {}
    for root, dirs, files in os.walk(BASE_PATH):
        rel_dir = os.path.relpath(root, BASE_PATH)
        if rel_dir == ".":
            rel_dir = ""
        for file in files:
            if file.endswith('.txt'):
                key = os.path.join(rel_dir, file).replace("\\", "/")
                result[key] = os.path.join(rel_dir, file)
    return JSONResponse(result)

@router.get("/file/{path:path}")
def get_knowledge_file(path: str):
    abs_path = os.path.abspath(os.path.join(BASE_PATH, path))
    if not abs_path.startswith(BASE_PATH) or not os.path.isfile(abs_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(abs_path, media_type="text/plain")
