"""
Fetch account-level statistics from YouTube Data API v3 and YouTube Analytics API.
"""

from datetime import date, datetime, timedelta, timezone
from typing import Optional

import httpx
from fastapi import HTTPException, status

from app.models.models import PeriodType

YOUTUBE_CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels"
YOUTUBE_ANALYTICS_URL = "https://youtubeanalytics.googleapis.com/v2/reports"

ANALYTICS_METRICS = "views,estimatedMinutesWatched,estimatedRevenue,likes"


async def _fetch_channel_data(client: httpx.AsyncClient, access_token: str) -> dict:
    """Call YouTube Data API v3 to get subscriber count and publishedAt."""
    response = await client.get(
        YOUTUBE_CHANNELS_URL,
        params={"part": "snippet,statistics", "mine": "true"},
        headers={"Authorization": f"Bearer {access_token}"},
    )
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"YouTube Data API error: {response.text}",
        )

    items = response.json().get("items", [])
    if not items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No YouTube channel found",
        )

    channel = items[0]
    snippet = channel.get("snippet", {})
    statistics = channel.get("statistics", {})

    return {
        "subscriber_count": int(statistics.get("subscriberCount", 0)),
        "published_at": snippet.get("publishedAt"),  # ISO 8601 string e.g. "2012-04-23T18:25:43.000Z"
    }


async def _fetch_analytics(
    client: httpx.AsyncClient,
    access_token: str,
    start_date: date,
    end_date: date,
) -> dict:
    """Call YouTube Analytics API for a date range. Returns a dict of metric_name -> value."""
    response = await client.get(
        YOUTUBE_ANALYTICS_URL,
        params={
            "ids": "channel==MINE",
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "metrics": ANALYTICS_METRICS,
        },
        headers={"Authorization": f"Bearer {access_token}"},
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


async def fetch_account_statistics(
    access_token: str,
    channel_published_at: Optional[datetime] = None,
) -> dict:
    """
    Fetch account-level statistics from YouTube APIs.

    Makes 1 Data API call (subscriber count + publishedAt) and 3 Analytics API
    calls (SEVEN_DAYS, ONE_MONTH, ALL_TIME).

    Returns:
        {
            "subscriber_count": int,
            "published_at": datetime | None,
            "periods": {
                PeriodType.SEVEN_DAYS: {"total_views": ..., "total_min_watched": ..., "total_revenue": ..., "total_likes": ...},
                PeriodType.ONE_MONTH: {...},
                PeriodType.ALL_TIME: {...},
            }
        }
    """
    today = date.today()

    async with httpx.AsyncClient() as client:
        # 1. Data API: subscriber count + publishedAt
        channel_data = await _fetch_channel_data(client, access_token)

        # Determine the ALL_TIME start date
        if channel_published_at:
            all_time_start = channel_published_at.date()
        elif channel_data["published_at"]:
            all_time_start = datetime.fromisoformat(
                channel_data["published_at"].replace("Z", "+00:00")
            ).date()
        else:
            # YouTube founding date as ultimate fallback
            all_time_start = date(2005, 4, 23)

        # Parse published_at for caller to store on the Account
        published_at_dt: Optional[datetime] = None
        if channel_data["published_at"]:
            published_at_dt = datetime.fromisoformat(
                channel_data["published_at"].replace("Z", "+00:00")
            )

        # 2. Analytics API: one call per period
        period_ranges: dict[PeriodType, date] = {
            PeriodType.SEVEN_DAYS: today - timedelta(days=7),
            PeriodType.ONE_MONTH: today - timedelta(days=30),
            PeriodType.ALL_TIME: all_time_start,
        }

        periods: dict[PeriodType, dict] = {}
        for period_type, start_date in period_ranges.items():
            analytics = await _fetch_analytics(client, access_token, start_date, today)
            periods[period_type] = {
                "total_views": int(analytics.get("views", 0)),
                "total_min_watched": int(analytics.get("estimatedMinutesWatched", 0)),
                "total_revenue": float(analytics.get("estimatedRevenue", 0)),
                "total_likes": int(analytics.get("likes", 0)),
            }

    return {
        "subscriber_count": channel_data["subscriber_count"],
        "published_at": published_at_dt,
        "periods": periods,
    }
