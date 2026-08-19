"""add updated at to events

Revision ID: 7b89731366bd
Revises: 35598e6f1414
Create Date: 2026-08-19 16:23:19.825336

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7b89731366bd'
down_revision: Union[str, Sequence[str], None] = '35598e6f1414'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "events",
        sa.Column(
            "updated_at", 
            sa.TIMESTAMP(timezone=True), 
            nullable=False, 
            server_default=sa.func.now()
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("events", "updated_at")
