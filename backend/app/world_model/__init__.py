from app.config import get_settings
from .adapter import WorldModelAdapter
from .worldgen_adapter import WorldGenAdapter


def create_adapter() -> WorldModelAdapter:
    settings = get_settings()
    backend = settings.world_model_backend

    if backend == "worldgen":
        return WorldGenAdapter()

    raise ValueError(f"Unknown world model backend: {backend}")
