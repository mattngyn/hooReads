import asyncio
import uuid
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from app.config import get_settings
from .adapter import WorldModelAdapter, SceneJob, SceneStatus, SceneAsset

_executor = ThreadPoolExecutor(max_workers=2)

# In-memory job store (swap for Redis/DB in production)
_jobs: dict[str, dict] = {}


def _run_worldgen(job_id: str, prompt: str, output_dir: Path, book_lora_path: str = "", book_lora_weight: float = 0.7) -> None:
    """Blocking call to WorldGen. Runs in a thread pool to avoid blocking the event loop."""
    try:
        _jobs[job_id]["status"] = "processing"

        import torch
        from worldgen import WorldGen

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        use_book_mode = bool(book_lora_path)
        wg = WorldGen(
            mode="t2s",
            device=device,
            low_vram=True,
            book_mode=use_book_mode,
            book_lora_path=book_lora_path if use_book_mode else None,
            book_lora_weight=book_lora_weight,
        )
        splat = wg.generate_world(prompt)

        output_path = output_dir / f"{job_id}.ply"
        splat.save(str(output_path))

        _jobs[job_id]["status"] = "complete"
        _jobs[job_id]["output_path"] = str(output_path)
    except Exception as e:
        _jobs[job_id]["status"] = "failed"
        _jobs[job_id]["error"] = str(e)


class WorldGenAdapter(WorldModelAdapter):
    def __init__(self) -> None:
        settings = get_settings()
        self.output_dir = Path(settings.static_dir) / "scenes"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.book_lora_path = settings.book_lora_path
        self.book_lora_weight = settings.book_lora_weight

    async def generate_scene(self, prompt: str) -> SceneJob:
        job_id = uuid.uuid4().hex
        _jobs[job_id] = {"status": "pending", "prompt": prompt}

        loop = asyncio.get_event_loop()
        loop.run_in_executor(
            _executor, _run_worldgen, job_id, prompt, self.output_dir,
            self.book_lora_path, self.book_lora_weight,
        )

        return SceneJob(job_id=job_id)

    async def get_scene_status(self, job_id: str) -> SceneStatus:
        job = _jobs.get(job_id)
        if job is None:
            return SceneStatus(status="failed")

        progress = 0.5 if job["status"] == "processing" else (1.0 if job["status"] == "complete" else 0.0)
        return SceneStatus(status=job["status"], progress=progress)

    async def get_scene_asset(self, job_id: str) -> SceneAsset:
        job = _jobs.get(job_id)
        if job is None or job["status"] != "complete":
            raise ValueError(f"Job {job_id} is not complete")

        filename = f"{job_id}.ply"
        return SceneAsset(
            format="ply",
            url=f"/static/scenes/{filename}",
        )
