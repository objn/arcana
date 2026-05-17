from fastapi import APIRouter, Query
from app.data.cards import ALL_CARDS, CARDS_BY_ID, MAJOR_ARCANA

router = APIRouter(prefix="/cards", tags=["cards"])


@router.get("/")
async def list_cards(suit: str | None = Query(None)):
    if suit:
        return [c for c in ALL_CARDS if c.get("suit") == suit]
    return ALL_CARDS


@router.get("/major")
async def list_major():
    return MAJOR_ARCANA


@router.get("/{card_id}")
async def get_card(card_id: str):
    card = CARDS_BY_ID.get(card_id)
    if not card:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Card not found")
    return card
