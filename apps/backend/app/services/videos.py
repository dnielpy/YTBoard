from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.account_repository import AccountRepository
from app.repositories.video_repository import VideoRepository
from app.schemas.video import VideoResponse
from app.services.youtube_api.videos import fetch_videos


async def sync_videos(user_id: int, db: AsyncSession, access_token: str) -> None:
    account_repo = AccountRepository(db)
    video_repo = VideoRepository(db)

    account = await account_repo.get_by_user(user_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube account connected",
        )

    videos = await fetch_videos(access_token)

    for video_data in videos:
        await video_repo.upsert(
            account_id=account.id,
            video_id=video_data.pop("video_id"),
            **video_data,
        )

async def get_videos(user_id: int, db: AsyncSession) -> list[VideoResponse]:
    account_repo = AccountRepository(db)
    video_repo = VideoRepository(db)

    account = await account_repo.get_by_user(user_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube account connected",
        )

    videos = await video_repo.get_by_account_id(account.id)
    return [VideoResponse.model_validate(v) for v in videos]