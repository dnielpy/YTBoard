from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import PeriodType
from app.repositories.account_repository import AccountRepository
from app.repositories.account_statistics_repository import AccountStatisticsRepository
from app.repositories.video_repository import VideoRepository
from app.schemas.account_statistics import AccountStatisticsResponse
from app.schemas.video import VideoResponse
from app.services.google_oauth import (
    exchange_code_for_tokens,
    get_channel_info,
    refresh_access_token,
    revoke_token,
)
from app.services.youtube_api.user_info import fetch_account_statistics
from app.services.youtube_api.videos import fetch_videos
from app.services.videos import sync_videos

async def connect_google_account(
    user_id: int, code: str, redirect_uri: str, db: AsyncSession
) -> dict:
    account_repo = AccountRepository(db)

    existing = await account_repo.get_by_user(user_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A YouTube account is already connected. Disconnect it first.",
        )

    token_data = await exchange_code_for_tokens(code, redirect_uri)

    channel_info = await get_channel_info(token_data["access_token"])

    account = await account_repo.create(
        user_id=user_id,
        platform_account_id=channel_info["channel_id"],
        handle=channel_info["handle"],
        title=channel_info.get("title"),
        image_url=channel_info.get("thumbnail_url"),
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        token_expires_at=token_data["expires_at"],
    )

    return {
        "account_id": account.id,
        "channel_id": channel_info["channel_id"],
        "channel_handle": channel_info["handle"],
        "channel_title": channel_info.get("title"),
        "thumbnail_url": channel_info.get("thumbnail_url"),
    }


async def disconnect_google_account(user_id: int, db: AsyncSession) -> bool:
    """Remove the user's connected YouTube account."""
    account_repo = AccountRepository(db)

    account = await account_repo.get_by_user(user_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube account connected",
        )

    if account.refresh_token:
        try:
            await revoke_token(account.refresh_token)
        except Exception:
            pass

    return await account_repo.delete(account.id)


async def get_connected_account(user_id: int, db: AsyncSession) -> dict | None:
    account_repo = AccountRepository(db)

    account = await account_repo.get_by_user(user_id)
    if not account:
        return None

    return {
        "account_id": account.id,
        "channel_id": account.platform_account_id,
        "channel_handle": account.handle,
        "channel_title": account.title,
        "image_url": account.image_url,
    }


async def get_valid_access_token(user_id: int, db: AsyncSession) -> str:
    account_repo = AccountRepository(db)

    account = await account_repo.get_by_user(user_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube account connected",
        )

    if (
        account.token_expires_at
        and account.token_expires_at.replace(tzinfo=timezone.utc)
        <= datetime.now(timezone.utc)
    ):
        if not account.refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired and no refresh token available. Please reconnect.",
            )

        new_tokens = await refresh_access_token(account.refresh_token)
        await account_repo.update_tokens(
            account_id=account.id,
            access_token=new_tokens["access_token"],
            token_expires_at=new_tokens["expires_at"],
        )
        return new_tokens["access_token"]

    return account.access_token


async def sync_user_account_statistics(user_id: int, db: AsyncSession) -> None:
    account_repo = AccountRepository(db)
    stats_repo = AccountStatisticsRepository(db)

    account = await account_repo.get_by_user(user_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube account connected",
        )

    access_token = await get_valid_access_token(user_id, db)

    result = await fetch_account_statistics(
        access_token=access_token,
        channel_published_at=account.channel_published_at,
    )

    if not account.channel_published_at and result["published_at"]:
        account.channel_published_at = result["published_at"]
        await db.commit()

    for period_type, metrics in result["periods"].items():
        await stats_repo.upsert(
            account_id=account.id,
            period_type=period_type,
            followers=result["subscriber_count"],
            **metrics,
        )

    await account_repo.update_last_sync(account.id)

async def sync_all_data(user_id: int, db: AsyncSession) -> None:
    access_token = await get_valid_access_token(user_id, db)

    await sync_user_account_statistics(user_id, db)
    await sync_videos(user_id, db, access_token)

async def get_account_statistics(
    user_id: int, period_type: PeriodType, db: AsyncSession
) -> AccountStatisticsResponse:
    account_repo = AccountRepository(db)
    stats_repo = AccountStatisticsRepository(db)

    account = await account_repo.get_by_user(user_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube account connected",
        )

    stats = await stats_repo.get_by_account_and_period(account.id, period_type)

    if not stats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No statistics found for period {period_type}",
        )

    return AccountStatisticsResponse.model_validate(stats)