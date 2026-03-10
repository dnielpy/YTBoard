from datetime import date, datetime, timedelta, timezone
from typing import Optional

import httpx

from app.models.models import PeriodType
from app.services.youtube_api.client import YouTubeAnalyticsClient, YouTubeDataClient
from app.services.youtube_api.constants import ANALYTICS_METRICS


async def fetch_account_statistics(
    access_token: str,
    channel_published_at: Optional[datetime] = None,
) -> dict:
    today = date.today()

    async with httpx.AsyncClient() as client:
        data_client = YouTubeDataClient(client, access_token)
        analytics_client = YouTubeAnalyticsClient(client, access_token)

        channel = await data_client.get_channel()
        snippet = channel.get("snippet", {})
        statistics = channel.get("statistics", {})

        channel_data = {
            "subscriber_count": int(statistics.get("subscriberCount", 0)),
            "published_at": snippet.get("publishedAt"),  # ISO 8601 e.g. "2012-04-23T18:25:43.000Z"
        }

        if channel_published_at:
            all_time_start = channel_published_at.date()
        elif channel_data["published_at"]:
            all_time_start = datetime.fromisoformat(
                channel_data["published_at"].replace("Z", "+00:00")
            ).date()
        else:
            all_time_start = date(2005, 4, 23)

        published_at_dt: Optional[datetime] = None
        if channel_data["published_at"]:
            published_at_dt = datetime.fromisoformat(
                channel_data["published_at"].replace("Z", "+00:00")
            )

        period_ranges: dict[PeriodType, date] = {
            PeriodType.SEVEN_DAYS: today - timedelta(days=7),
            PeriodType.ONE_MONTH: today - timedelta(days=30),
            PeriodType.ALL_TIME: all_time_start,
        }

        periods: dict[PeriodType, dict] = {}
        for period_type, start_date in period_ranges.items():
            report = await analytics_client.get_report(start_date, today, ANALYTICS_METRICS)
            periods[period_type] = {
                "total_views": int(report.get("views", 0)),
                "total_min_watched": int(report.get("estimatedMinutesWatched", 0)),
                "total_revenue": float(report.get("estimatedRevenue", 0)),
                "total_likes": int(report.get("likes", 0)),
            }

    return {
        "subscriber_count": channel_data["subscriber_count"],
        "published_at": published_at_dt,
        "periods": periods,
    }
