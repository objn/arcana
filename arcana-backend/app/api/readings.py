import os
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.database import get_db
from app.models.reading import Reading
from app.models.user import User
from app.schemas.reading import ReadingCreate, ReadingOut, ReadingListOut
from app.api.deps import get_current_user
from app.data.cards import CARDS_BY_ID

VALID_SPREADS = {"single", "three_card", "celtic_cross", "horseshoe"}
SPREAD_SIZES  = {"single": 1, "three_card": 3, "celtic_cross": 10, "horseshoe": 7}

router = APIRouter(prefix="/readings", tags=["readings"])


@router.post("/", response_model=ReadingOut, status_code=201)
async def create_reading(
    payload: ReadingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.spread_type not in VALID_SPREADS:
        raise HTTPException(400, detail=f"spread_type must be one of {VALID_SPREADS}")

    expected = SPREAD_SIZES[payload.spread_type]
    if len(payload.drawn_cards) != expected:
        raise HTTPException(400, detail=f"{payload.spread_type} requires exactly {expected} card(s)")

    # Validate card IDs
    for dc in payload.drawn_cards:
        if dc.card_id not in CARDS_BY_ID:
            raise HTTPException(400, detail=f"Unknown card_id: {dc.card_id}")

    reading = Reading(
        user_id=current_user.id,
        question=payload.question,
        spread_type=payload.spread_type,
        drawn_cards=[dc.model_dump() for dc in payload.drawn_cards],
    )
    db.add(reading)
    await db.commit()
    await db.refresh(reading)
    return reading


@router.get("/", response_model=ReadingListOut)
async def list_readings(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    offset = (page - 1) * page_size

    total_result = await db.execute(
        select(func.count()).select_from(Reading).where(Reading.user_id == current_user.id)
    )
    total = total_result.scalar()

    items_result = await db.execute(
        select(Reading)
        .where(Reading.user_id == current_user.id)
        .order_by(Reading.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    items = items_result.scalars().all()

    return ReadingListOut(items=list(items), total=total, page=page, page_size=page_size)


@router.get("/{reading_id}", response_model=ReadingOut)
async def get_reading(
    reading_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Reading).where(Reading.id == reading_id, Reading.user_id == current_user.id))
    reading = result.scalar_one_or_none()
    if not reading:
        raise HTTPException(404, detail="Reading not found")
    return reading


@router.delete("/{reading_id}", status_code=204)
async def delete_reading(
    reading_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Reading).where(Reading.id == reading_id, Reading.user_id == current_user.id))
    reading = result.scalar_one_or_none()
    if not reading:
        raise HTTPException(404, detail="Reading not found")
    await db.delete(reading)
    await db.commit()


# ── AI card interpretation ─────────────────────────────────────────────────────

class InterpretCardRequest(BaseModel):
    question: str
    card_id:  str
    position: str
    reversed: bool


@router.post("/interpret-card")
async def interpret_card(payload: InterpretCardRequest):
    """Return an AI-generated reading of one card in context of the question."""
    card = CARDS_BY_ID.get(payload.card_id)
    if not card:
        raise HTTPException(404, detail=f"Unknown card_id: {payload.card_id}")

    orientation = "reversed" if payload.reversed else "upright"
    keywords    = card["keywords_rev"] if payload.reversed else card["keywords_up"]
    meaning     = card["meaning_rev"]  if payload.reversed else card["meaning_up"]

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        # Graceful fallback — return the card's built-in meaning
        return {"meaning": meaning}

    try:
        import anthropic  # type: ignore
        client = anthropic.Anthropic(api_key=api_key)

        prompt = (
            f"You are an experienced tarot reader.\n\n"
            f"Card drawn: {card['name']} ({orientation})\n"
            f"Position in spread: {payload.position}\n"
            f"Keywords: {', '.join(keywords)}\n"
            f"General meaning: {meaning}\n\n"
            f"Querent's question: \"{payload.question}\"\n\n"
            f"Write 2–3 sentences that speak directly to the querent's question "
            f"using the energy of this card in this position. "
            f"Be warm, insightful, and personal — not generic."
        )

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=220,
            messages=[{"role": "user", "content": prompt}],
        )
        return {"meaning": message.content[0].text}

    except Exception:
        # Any failure → fall back to card's built-in meaning
        return {"meaning": meaning}
