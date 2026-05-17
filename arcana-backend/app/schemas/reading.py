from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any


class DrawnCard(BaseModel):
    card_id: str          # e.g. "major_0", "cups_ace"
    position: str         # e.g. "past", "present", "future"
    reversed: bool


class ReadingCreate(BaseModel):
    question: Optional[str] = None
    spread_type: str      # single | three_card | celtic_cross | horseshoe
    drawn_cards: List[DrawnCard]


class ReadingOut(BaseModel):
    id: str
    user_id: str
    question: Optional[str]
    spread_type: str
    drawn_cards: List[Any]
    created_at: datetime

    model_config = {"from_attributes": True}


class ReadingListOut(BaseModel):
    items: List[ReadingOut]
    total: int
    page: int
    page_size: int
