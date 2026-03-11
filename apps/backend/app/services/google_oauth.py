from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import httpx
from app.core.config import settings
from app.services.youtube_api.client import YouTubeDataClient
from fastapi import HTTPException, status

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke"


async def build_auth_url(redirect_uri: str) -> str:
    """Build the Google OAuth2 consent URL."""
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": " ".join(settings.GOOGLE_OAUTH_SCOPES),
        "access_type": "offline",
        "prompt": "consent",
    }
    return f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"


async def exchange_code_for_tokens(code: str, redirect_uri: str) -> dict:
    """Exchange the authorization code for access and refresh tokens."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to exchange authorization code: {response.text}",
        )

    data = response.json()
    expires_in = data.get("expires_in", 3600)
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

    return {
        "access_token": data["access_token"],
        "refresh_token": data.get("refresh_token"),
        "expires_at": expires_at,
        "token_type": data.get("token_type", "Bearer"),
        "scope": data.get("scope", ""),
    }


async def refresh_access_token(refresh_token: str) -> dict:
    """Use a refresh token to obtain a new access token."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to refresh access token",
        )

    data = response.json()
    expires_in = data.get("expires_in", 3600)
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

    return {
        "access_token": data["access_token"],
        "expires_at": expires_at,
    }


async def get_channel_info(access_token: str) -> dict:
    """Fetch the authenticated user's YouTube channel info."""
    async with httpx.AsyncClient() as client:
        channel = await YouTubeDataClient(client, access_token).get_channel()

    snippet = channel.get("snippet", {})
    statistics = channel.get("statistics", {})

    return {
        "channel_id": channel["id"],
        "title": snippet.get("title", ""),
        "handle": snippet.get("customUrl", snippet.get("title", "")),
        "thumbnail_url": snippet.get("thumbnails", {}).get("default", {}).get("url"),
        "published_at": snippet.get("publishedAt"),
        "subscriber_count": int(statistics.get("subscriberCount", 0)),
        "view_count": int(statistics.get("viewCount", 0)),
        "video_count": int(statistics.get("videoCount", 0)),
    }


async def revoke_token(token: str) -> None:
    """Revoke a Google OAuth token."""
    async with httpx.AsyncClient() as client:
        await client.post(GOOGLE_REVOKE_URL, params={"token": token})
