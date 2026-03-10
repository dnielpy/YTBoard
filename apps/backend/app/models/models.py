import enum
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import String, Integer, DateTime, ForeignKey, BigInteger, Numeric, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..db.database import Base


class PeriodType(enum.Enum):
    SEVEN_DAYS = "7_days"
    ONE_MONTH = "1_month"
    ALL_TIME = "all_time"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    accounts: Mapped[List["Account"]] = relationship(back_populates="user")


class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    platform_account_id: Mapped[str] = mapped_column(String, index=True)
    handle: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    title: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    access_token: Mapped[str] = mapped_column(String)
    refresh_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    token_expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    channel_published_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    last_sync: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    user: Mapped["User"] = relationship(back_populates="accounts")
    statistics: Mapped[List["AccountStatistics"]] = relationship(back_populates="account")
    videos: Mapped[List["Video"]] = relationship(back_populates="account")


class AccountStatistics(Base):
    __tablename__ = "account_statistics"

    id: Mapped[int] = mapped_column(primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"))

    period_type: Mapped[PeriodType] = mapped_column(
        SAEnum(PeriodType, name="periodtype"), nullable=False
    )

    followers: Mapped[int] = mapped_column(BigInteger, default=0)
    total_views: Mapped[int] = mapped_column(BigInteger, default=0)
    total_revenue: Mapped[Optional[float]] = mapped_column(Numeric(12, 2), nullable=True)
    total_min_watched: Mapped[int] = mapped_column(BigInteger, default=0)
    total_likes: Mapped[int] = mapped_column(BigInteger, default=0)

    account: Mapped["Account"] = relationship(back_populates="statistics")


class Video(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"))

    video_id: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    duration: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    privacy: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    account: Mapped["Account"] = relationship(back_populates="videos")
    statistics: Mapped[List["VideoStatistics"]] = relationship(back_populates="video")


class VideoStatistics(Base):
    __tablename__ = "video_statistics"

    id: Mapped[int] = mapped_column(primary_key=True)
    video_id: Mapped[int] = mapped_column(ForeignKey("videos.id"))

    period_type: Mapped[PeriodType] = mapped_column(
        SAEnum(PeriodType, name="periodtype"), nullable=False
    )

    total_views: Mapped[int] = mapped_column(BigInteger, default=0)
    followers_gained: Mapped[int] = mapped_column(Integer, default=0)
    likes: Mapped[int] = mapped_column(Integer, default=0)
    estimated_revenue: Mapped[Optional[float]] = mapped_column(Numeric(12, 2), nullable=True)

    video: Mapped["Video"] = relationship(back_populates="statistics")
