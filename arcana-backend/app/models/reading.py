from sqlalchemy import String, DateTime, Integer, Boolean, ForeignKey, Text, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import uuid
from datetime import datetime


class Reading(Base):
    __tablename__ = "readings"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    question: Mapped[str] = mapped_column(Text, nullable=True)
    spread_type: Mapped[str] = mapped_column(String(50), nullable=False)  # single, three_card, celtic_cross, horseshoe
    drawn_cards: Mapped[list] = mapped_column(JSON, nullable=False)        # [{card_id, position, reversed}, ...]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="readings")
