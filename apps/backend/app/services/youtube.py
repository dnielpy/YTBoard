from datetime import date, timedelta

import httpx
from fastapi import HTTPException, status

from app.services.accounts import get_valid_access_token
from sqlalchemy.ext.asyncio import AsyncSession

YOUTUBE_DATA_API_BASE = "https://www.googleapis.com/youtube/v3"
YOUTUBE_ANALYTICS_API_BASE = "https://youtubeanalytics.googleapis.com/v2"


async def get_channel_statistics(user_id: int, db: AsyncSession) -> dict:
    """Fetch channel statistics from YouTube Data API v3."""
    access_token = await get_valid_access_token(user_id, db)

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{YOUTUBE_DATA_API_BASE}/channels",
            params={"part": "snippet,statistics,contentDetails", "mine": "true"},
            headers={"Authorization": f"Bearer {access_token}"},
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch channel statistics from YouTube",
        )

    data = response.json()
    items = data.get("items", [])
    if not items:
        return {}

    channel = items[0]
    snippet = channel.get("snippet", {})
    statistics = channel.get("statistics", {})

    return {
        "channel_id": channel["id"],
        "title": snippet.get("title", ""),
        "description": snippet.get("description", ""),
        "thumbnail_url": snippet.get("thumbnails", {}).get("default", {}).get("url"),
        "subscriber_count": int(statistics.get("subscriberCount", 0)),
        "view_count": int(statistics.get("viewCount", 0)),
        "video_count": int(statistics.get("videoCount", 0)),
    }


async def get_recent_videos(
    user_id: int, db: AsyncSession, max_results: int = 10
) -> list[dict]:
    """Fetch recent uploads from the channel."""
    access_token = await get_valid_access_token(user_id, db)

    async with httpx.AsyncClient() as client:
        search_response = await client.get(
            f"{YOUTUBE_DATA_API_BASE}/search",
            params={
                "part": "snippet",
                "forMine": "true",
                "type": "video",
                "order": "date",
                "maxResults": str(max_results),
            },
            headers={"Authorization": f"Bearer {access_token}"},
        )

    if search_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch recent videos from YouTube",
        )

    search_data = search_response.json()
    video_ids = [
        item["id"]["videoId"]
        for item in search_data.get("items", [])
        if item.get("id", {}).get("videoId")
    ]

    if not video_ids:
        return []

    async with httpx.AsyncClient() as client:
        videos_response = await client.get(
            f"{YOUTUBE_DATA_API_BASE}/videos",
            params={
                "part": "snippet,statistics",
                "id": ",".join(video_ids),
            },
            headers={"Authorization": f"Bearer {access_token}"},
        )

    if videos_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch video details from YouTube",
        )

    videos_data = videos_response.json()
    result = []

    for item in videos_data.get("items", []):
        snippet = item.get("snippet", {})
        statistics = item.get("statistics", {})
        result.append(
            {
                "video_id": item["id"],
                "title": snippet.get("title", ""),
                "published_at": snippet.get("publishedAt", ""),
                "thumbnail_url": snippet.get("thumbnails", {})
                .get("medium", {})
                .get("url"),
                "view_count": int(statistics.get("viewCount", 0)),
                "like_count": int(statistics.get("likeCount", 0)),
                "comment_count": int(statistics.get("commentCount", 0)),
            }
        )

    return result


async def get_analytics_summary(
    user_id: int,
    db: AsyncSession,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    """Fetch analytics summary from YouTube Analytics API."""
    access_token = await get_valid_access_token(user_id, db)

    if not end_date:
        end_date = date.today()
    if not start_date:
        start_date = end_date - timedelta(days=28)

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{YOUTUBE_ANALYTICS_API_BASE}/reports",
            params={
                "ids": "channel==MINE",
                "startDate": start_date.isoformat(),
                "endDate": end_date.isoformat(),
                "metrics": "views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,dislikes",
                "dimensions": "",
            },
            headers={"Authorization": f"Bearer {access_token}"},
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch analytics from YouTube",
        )

    data = response.json()
    rows = data.get("rows", [])
    headers = [col["name"] for col in data.get("columnHeaders", [])]

    if not rows:
        return {header: 0 for header in headers}

    return dict(zip(headers, rows[0]))
