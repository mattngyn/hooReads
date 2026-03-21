import aiosqlite
from pathlib import Path

DB_PATH = Path("data/hooreads.db")

SCHEMA = """\
CREATE TABLE IF NOT EXISTS generations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    source_text TEXT NOT NULL,
    source_filename TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS moments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    generation_id TEXT NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
    moment_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    scene_description TEXT NOT NULL,
    narration_text TEXT NOT NULL,
    emotional_tone TEXT NOT NULL DEFAULT 'neutral',
    page_reference TEXT,
    scene_status TEXT NOT NULL DEFAULT 'pending',
    scene_asset_url TEXT,
    scene_asset_format TEXT,
    audio_status TEXT NOT NULL DEFAULT 'pending',
    audio_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(generation_id, moment_index)
);
"""


async def get_db() -> aiosqlite.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = await aiosqlite.connect(str(DB_PATH))
    db.row_factory = aiosqlite.Row
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA foreign_keys=ON")
    return db


async def init_db() -> None:
    db = await get_db()
    try:
        await db.executescript(SCHEMA)
        await db.commit()
    finally:
        await db.close()
