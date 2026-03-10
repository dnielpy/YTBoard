from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.account_repository import AccountRepository
from app.services.google_oauth import (
    exchange_code_for_tokens,
    get_channel_info,
    refresh_access_token,
    revoke_token,
)


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
