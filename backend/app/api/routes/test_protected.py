from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/protected", tags=["Test"])
def protected_route(current_user: User = Depends(get_current_user)):
    return {
        "message": "You have accessed a protected route",
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "username": current_user.username,
        },
    }