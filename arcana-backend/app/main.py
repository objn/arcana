from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.database import engine, Base
from app.core.config import settings
from app.api import auth, cards, readings

# Import models so Alembic/SQLAlchemy can detect them
import app.models.user    # noqa
import app.models.reading  # noqa


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (dev only — use Alembic in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="Arcana Tarot API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/api")
app.include_router(cards.router,    prefix="/api")
app.include_router(readings.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "arcana-backend"}
