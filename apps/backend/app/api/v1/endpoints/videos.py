from typing import Any

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.models import User
from app.schemas.video import VideoResponse
from app.services.videos import get_videos
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("", response_model=list[VideoResponse])
async def list_videos(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    return await get_videos(current_user.id, db)
