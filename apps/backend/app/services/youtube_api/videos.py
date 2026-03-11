"""
Fetch video metadata from the YouTube Data API v3.
"""

from datetime import datetime, timezone

import httpx
from app.services.youtube_api.client import YouTubeDataClient


async def fetch_videos(access_token: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        data_client = YouTubeDataClient(client, access_token)

        video_ids = await data_client.search_my_videos(max_results=100)
        if not video_ids:
            return []

        items = await data_client.get_videos_by_ids(video_ids)

    return [_normalise_video(item) for item in items]


def _normalise_video(item: dict) -> dict:
    snippet = item.get("snippet", {})
    content_details = item.get("contentDetails", {})
    status = item.get("status", {})

    published_at_raw = snippet.get("publishedAt")
    published_at: datetime | None = None
    if published_at_raw:
        published_at = datetime.fromisoformat(
            published_at_raw.replace("Z", "+00:00")
        ).astimezone(timezone.utc)

    thumbnail = (
        snippet.get("thumbnails", {})
        .get("high", snippet.get("thumbnails", {}).get("default", {}))
        .get("url")
    )

    return {
        "video_id": item["id"],
        "title": snippet.get("title"),
        "description": snippet.get("description"),
        "thumbnail_url": thumbnail,
        "published_at": published_at,
        "duration": content_details.get("duration"),  # ISO 8601 e.g. "PT4M13S"
        "privacy": status.get("privacyStatus"),
    }
