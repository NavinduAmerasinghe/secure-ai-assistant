from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, health, submissions, test_protected, users
from app.core.config import settings
from app.core.database import Base, engine
from app.models import base  # noqa: F401


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="Backend API for vulnerability detection and secure coding guidance",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(submissions.router)
app.include_router(test_protected.router)


@app.get("/", tags=["Root"])
def root():
    return {"message": f"{settings.app_name} API is running"}