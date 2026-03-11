from datetime import date

import httpx
from app.services.youtube_api.constants import (
    YOUTUBE_ANALYTICS_URL,
    YOUTUBE_CHANNELS_URL,
    YOUTUBE_SEARCH_URL,
    YOUTUBE_VIDEOS_URL,
)
from fastapi import HTTPException, status


class YouTubeDataClient:
    def __init__(self, client: httpx.AsyncClient, access_token: str) -> None:
        self._client = client
        self._headers = {"Authorization": f"Bearer {access_token}"}

    async def _get(self, url: str, params: dict) -> dict:
        response = await self._client.get(url, params=params, headers=self._headers)
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"YouTube Data API error: {response.text}",
            )
        return response.json()

    async def get_channel(self, parts: str = "snippet,statistics") -> dict:
        data = await self._get(
            YOUTUBE_CHANNELS_URL,
            params={"part": parts, "mine": "true"},
        )
        items = data.get("items", [])
        if not items:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No YouTube channel found",
            )
        return items[0]

    async def search_my_videos(self, max_results: int = 50) -> list[str]:
        data = await self._get(
            YOUTUBE_SEARCH_URL,
            params={
                "part": "id",
                "forMine": "true",
                "type": "video",
                "maxResults": max_results,
            },
        )
        return [item["id"]["videoId"] for item in data.get("items", [])]

    async def get_videos_by_ids(self, video_ids: list[str]) -> list[dict]:
        if not video_ids:
            return []
        data = await self._get(
            YOUTUBE_VIDEOS_URL,
            params={
                "part": "snippet,contentDetails,status",
                "id": ",".join(video_ids),
            },
        )
        return data.get("items", [])


class YouTubeAnalyticsClient:
    def __init__(self, client: httpx.AsyncClient, access_token: str) -> None:
        self._client = client
        self._headers = {"Authorization": f"Bearer {access_token}"}

    async def get_report(
        self,
        start_date: date,
        end_date: date,
        metrics: str,
    ) -> dict:
        response = await self._client.get(
            YOUTUBE_ANALYTICS_URL,
            params={
                "ids": "channel==MINE",
                "startDate": start_date.isoformat(),
                "endDate": end_date.isoformat(),
                "metrics": metrics,
            },
            headers=self._headers,
        )

        if response.status_code == 500:
            metric_names = metrics.split(",")
            return {name: 0 for name in metric_names}

        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"YouTube Analytics API error: {response.text}",
            )

        data = response.json()
        headers = [h["name"] for h in data.get("columnHeaders", [])]
        rows = data.get("rows", [])
        row = rows[0] if rows else [0] * len(headers)

        return dict(zip(headers, row))
