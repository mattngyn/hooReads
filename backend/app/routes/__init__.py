from fastapi import APIRouter
from .generations import router as generations_router
from .parse import router as parse_router
from .extract_moments import router as extract_moments_router
from .generate_scene import router as generate_scene_router
from .scene_status import router as scene_status_router
from .narrate import router as narrate_router

api_router = APIRouter(prefix="/api")

# Top-level orchestrated pipeline
api_router.include_router(generations_router)

# Low-level individual endpoints (still useful for debugging / direct use)
api_router.include_router(parse_router)
api_router.include_router(extract_moments_router)
api_router.include_router(generate_scene_router)
api_router.include_router(scene_status_router)
api_router.include_router(narrate_router)
