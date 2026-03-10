from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.database import get_db
from app.models.models import PeriodType, User
from app.schemas.google_oauth import (
    GoogleAuthUrlResponse,
    GoogleConnectRequest,
    GoogleConnectResponse,
)
from app.services.accounts import (
    connect_google_account,
    disconnect_google_account,
    get_account_statistics as fetch_account_statistics,
    get_connected_account,
    sync_all_data,
    sync_user_account_statistics,
)
from app.schemas.account_statistics import AccountStatisticsResponse
from app.services.google_oauth import build_auth_url

router = APIRouter()


@router.get("/google/auth-url", response_model=GoogleAuthUrlResponse)
async def get_google_auth_url(
    redirect_uri: str | None = None,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Return the Google OAuth2 consent URL."""
    uri = redirect_uri or settings.GOOGLE_REDIRECT_URI
    auth_url = await build_auth_url(uri)
    return GoogleAuthUrlResponse(auth_url=auth_url)


@router.post("/google/connect", response_model=GoogleConnectResponse)
async def connect_google(
    body: GoogleConnectRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Exchange a Google auth code and connect the YouTube account."""
    result = await connect_google_account(
        user_id=current_user.id,
        code=body.code,
        redirect_uri=body.redirect_uri,
        db=db,
    )
    return GoogleConnectResponse(**result)


@router.get("/me")
async def get_my_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Return the current user's connected YouTube account."""
    account = await get_connected_account(current_user.id, db)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube account connected",
        )
    return account


@router.delete("/google/disconnect")
async def disconnect_google(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Disconnect the user's YouTube account."""
    await disconnect_google_account(current_user.id, db)
    return {"detail": "YouTube account disconnected successfully"}

@router.get("/sync")
async def sync_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    await sync_all_data(current_user.id, db)
    return {"detail": "YouTube account synced successfully"}

@router.get("/statistics", response_model=AccountStatisticsResponse)
async def get_account_statistics_endpoint(
    period_type: PeriodType,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    return await fetch_account_statistics(current_user.id, period_type, db)