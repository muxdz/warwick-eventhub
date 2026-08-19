"""create initial eventhub schema

Revision ID: 35598e6f1414
Revises: 
Create Date: 2026-08-19 14:20:23.715495

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '35598e6f1414'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_name", sa.String(50), nullable=False),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("password_hash", sa.Text, nullable=False)
    )

    op.create_table(
        "societies",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("society_name", sa.String(100), nullable=False, unique=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.func.now())
    )

    op.create_table(
        "events",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("event_title", sa.String(200), nullable=False),
        sa.Column("event_location", sa.String(200), nullable=False),
        sa.Column("start_time", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("end_time", sa.TIMESTAMP),
        sa.Column("description", sa.String(500)),
        sa.Column("society_id", sa.Integer, nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("created_by_user_id", sa.Integer, nullable=False),
        sa.Column("image_key", sa.String(200)),

        sa.CheckConstraint(
            "end_time > start_time OR end_time IS NULL",
            name="valid_end_time",
        ),

        sa.ForeignKeyConstraint(
            ["society_id"],
            ["societies.id"],
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["created_by_user_id"],
            ["users.id"],
            ondelete="CASCADE",
            onupdate="CASCADE"
        )
    )

    op.create_table(
        "memberships",
        sa.Column("user_id", sa.Integer, nullable=False),
        sa.Column("society_id", sa.Integer, nullable=False),
        sa.Column("role", sa.String(100), nullable=False),

        sa.PrimaryKeyConstraint(
            "user_id", 
            "society_id",
            name="pk_memberships"
        ),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["society_id"],
            ["societies.id"],
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),

        sa.CheckConstraint(
            "role in ('organiser', 'member')",
            name="valid_role",
        ),
    )

    op.create_table(
        "bookmarks",
        sa.Column("user_id", sa.Integer, nullable=False),
        sa.Column("event_id", sa.Integer, nullable=False),

        sa.PrimaryKeyConstraint(
            "user_id", 
            "event_id",
            name="pk_bookmarks"
        ),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["event_id"],
            ["events.id"],
            ondelete="CASCADE",
            onupdate="CASCADE"
        )
    )

    op.create_index(
        "idx_events_society_id",
        "events",
        ["society_id"],
    )
    op.create_index(
        "idx_events_start_time",
        "events",
        ["start_time"],
    )
    op.create_index(
        "idx_events_created_by_user_id",
        "events",
        ["created_by_user_id"],
    )
    op.create_index(
        "idx_bookmarks_event_id",
        "bookmarks",
        ["event_id"],
    )
    op.create_index(
        "idx_memberships_society_id",
        "memberships",
        ["society_id"],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("bookmarks")
    op.drop_table("memberships")
    op.drop_table("events")
    op.drop_table("societies")
    op.drop_table("users")

