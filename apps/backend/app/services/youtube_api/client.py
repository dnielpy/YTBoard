from datetime import date

import httpx
from fastapi import HTTPException, status

from app.services.youtube_api.constants import (
    YOUTUBE_ANALYTICS_URL,
    YOUTUBE_CHANNELS_URL,
)

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
