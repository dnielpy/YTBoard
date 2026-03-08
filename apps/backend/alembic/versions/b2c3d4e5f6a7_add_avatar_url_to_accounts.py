"""Add avatar_url to accounts

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-03-08 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add avatar_url column to accounts table."""
    op.add_column(
        'accounts',
        sa.Column('avatar_url', sa.String(), nullable=True)
    )


def downgrade() -> None:
    """Remove avatar_url column from accounts table."""
    op.drop_column('accounts', 'avatar_url')
