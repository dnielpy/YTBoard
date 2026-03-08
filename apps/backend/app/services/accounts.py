from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.account_repository import AccountRepository, PlatformRepository
from app.services.google_oauth import (
    exchange_code_for_tokens,
    get_channel_info,
    refresh_access_token,
    revoke_token,
)

YOUTUBE_PLATFORM_NAME = "YouTube"


async def connect_google_account(
    user_id: int, code: str, redirect_uri: str, db: AsyncSession
) -> dict:
    platform_repo = PlatformRepository(db)
    account_repo = AccountRepository(db)

    platform = await platform_repo.get_or_create(YOUTUBE_PLATFORM_NAME)

    existing = await account_repo.get_by_user_and_platform(user_id, platform.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A YouTube account is already connected. Disconnect it first.",
        )

    token_data = await exchange_code_for_tokens(code, redirect_uri)

    channel_info = await get_channel_info(token_data["access_token"])

    account = await account_repo.create(
        user_id=user_id,
        platform_id=platform.id,
        platform_account_id=channel_info["channel_id"],
        handle=channel_info["handle"],
        avatar_url=channel_info.get("thumbnail_url"),
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        token_expires_at=token_data["expires_at"],
    )

    return {
        "account_id": account.id,
        "channel_id": channel_info["channel_id"],
        "channel_handle": channel_info["handle"],
        "channel_title": channel_info["title"],
        "thumbnail_url": channel_info.get("thumbnail_url"),
    }


async def disconnect_google_account(user_id: int, db: AsyncSession) -> bool:
    """Remove the user's connected YouTube account."""
    platform_repo = PlatformRepository(db)
    account_repo = AccountRepository(db)

    platform = await platform_repo.get_by_name(YOUTUBE_PLATFORM_NAME)
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube platform found",
        )

    account = await account_repo.get_by_user_and_platform(user_id, platform.id)
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
    platform_repo = PlatformRepository(db)
    account_repo = AccountRepository(db)

    platform = await platform_repo.get_by_name(YOUTUBE_PLATFORM_NAME)
    if not platform:
        return None

    account = await account_repo.get_by_user_and_platform(user_id, platform.id)
    if not account:
        return None

    return {
        "account_id": account.id,
        "channel_id": account.platform_account_id,
        "channel_handle": account.handle,
        "avatar_url": account.avatar_url,
        "platform_name": YOUTUBE_PLATFORM_NAME,
    }


async def get_valid_access_token(user_id: int, db: AsyncSession) -> str:
    platform_repo = PlatformRepository(db)
    account_repo = AccountRepository(db)

    platform = await platform_repo.get_by_name(YOUTUBE_PLATFORM_NAME)
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube platform found",
        )

    account = await account_repo.get_by_user_and_platform(user_id, platform.id)
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
