from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship

# AJUSTE IMPORTANTE:
# Estamos asumiendo que tu archivo de conexión está en ../db/database.py
# Si te da error de import, ajusta esta línea.
from ..db.database import Base 

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    accounts: Mapped[List["Account"]] = relationship(back_populates="user")

class Platform(Base):
    __tablename__ = "platforms"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    
    accounts: Mapped[List["Account"]] = relationship(back_populates="platform")

class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    platform_id: Mapped[int] = mapped_column(ForeignKey("platforms.id"))
    
    platform_account_id: Mapped[str] = mapped_column(String, index=True)
    handle: Mapped[str] = mapped_column(String)
    access_token: Mapped[str] = mapped_column(String)
    refresh_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    user: Mapped["User"] = relationship(back_populates="accounts")
    platform: Mapped["Platform"] = relationship(back_populates="accounts")
    snapshots: Mapped[List["AccountSnapshot"]] = relationship(back_populates="account")
    contents: Mapped[List["Content"]] = relationship(back_populates="account")

class AccountSnapshot(Base):
    __tablename__ = "account_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"))
    
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    followers_count: Mapped[int] = mapped_column(Integer, default=0)
    views_count: Mapped[int] = mapped_column(BigInteger, default=0)
    video_count: Mapped[int] = mapped_column(Integer, default=0)

    account: Mapped["Account"] = relationship(back_populates="snapshots")

class Content(Base):
    __tablename__ = "contents"

    id: Mapped[int] = mapped_column(primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"))
    
    content_id: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    type: Mapped[str] = mapped_column(String)
    published_at: Mapped[datetime] = mapped_column(DateTime)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    account: Mapped["Account"] = relationship(back_populates="contents")
    snapshots: Mapped[List["ContentSnapshot"]] = relationship(back_populates="content")

class ContentSnapshot(Base):
    __tablename__ = "content_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True)
    content_internal_id: Mapped[int] = mapped_column(ForeignKey("contents.id"))
    
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    views: Mapped[int] = mapped_column(BigInteger, default=0)
    likes: Mapped[int] = mapped_column(Integer, default=0)
    comments: Mapped[int] = mapped_column(Integer, default=0)

    content: Mapped["Content"] = relationship(back_populates="snapshots")
