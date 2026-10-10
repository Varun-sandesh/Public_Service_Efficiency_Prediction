"""SQLAlchemy ORM models. File bytes are not stored in these tables."""

from datetime import datetime, timezone
from typing import Any, Optional
from uuid import uuid4

from sqlalchemy import CheckConstraint, DateTime, Float, Integer, JSON, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

ALLOWED_FILE_TYPES = ("csv", "xlsx", "xls", "pdf")
ALLOWED_ANALYSIS_STATUSES = ("pending", "analyzed", "completed", "failed")


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def new_id() -> str:
    return str(uuid4())


class Base(DeclarativeBase):
    pass


class Prediction(Base):
    """A stored efficiency-prediction request and optional model result."""

    __tablename__ = "predictions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    input_json: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    efficiency_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    model_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    model_version: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )


class Dataset(Base):
    """Metadata for an uploaded dataset. The file itself is stored on disk, not here."""

    __tablename__ = "datasets"
    __table_args__ = (
        CheckConstraint(
            "file_type IN ('csv', 'xlsx', 'xls', 'pdf')",
            name="ck_datasets_file_type",
        ),
        CheckConstraint(
            "analysis_status IN ('pending', 'analyzed', 'completed', 'failed')",
            name="ck_datasets_analysis_status",
        ),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )
    row_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    column_names: Mapped[Optional[list[str]]] = mapped_column(JSON, nullable=True)
    analysis_status: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="pending",
    )
