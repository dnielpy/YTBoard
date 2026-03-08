"""Add token_expires_at to accounts

Revision ID: a1b2c3d4e5f6
Revises: e88129614a02
Create Date: 2026-03-07 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'e88129614a02'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add token_expires_at column to accounts table."""
    op.add_column(
        'accounts',
        sa.Column('token_expires_at', sa.DateTime(timezone=True), nullable=True)
    )


def downgrade() -> None:
    """Remove token_expires_at column from accounts table."""
    op.drop_column('accounts', 'token_expires_at')
