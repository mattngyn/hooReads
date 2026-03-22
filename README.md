# Sceneweaver

Transform any story into immersive, explorable 3D worlds. Upload a PDF or text file, and Sceneweaver uses AI to identify the most vivid scenes, generate 3D gaussian splat environments, and produce narrated audio — all viewable in an interactive browser-based viewer.

## How It Works

1. **Upload** — Drop a PDF or TXT file containing any story, novel chapter, or text passage.
2. **Generate** — GPT analyzes the text and extracts key visual moments. For each moment, WorldGen creates a 3D gaussian splat scene and Cartesia generates narrated audio. If a fine-tuned LoRA adapter is provided, WorldGen uses it to produce scenes more faithful to a specific book's visual style.
3. **Explore** — Walk through your scenes in a first-person 3D viewer with WASD controls, mouse look, and fullscreen.

## Tech Stack


| Layer         | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| Frontend      | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Animations    | Framer Motion                                               |
| 3D Rendering  | Three.js, Spark.js (gaussian splat viewer)                  |
| Typography    | EB Garamond, Plus Jakarta Sans (Google Fonts)               |
| Backend       | FastAPI (Python), Uvicorn                                   |
| Database      | SQLite (aiosqlite, WAL mode)                                |
| Text Analysis | OpenAI GPT API                                              |
| 3D Generation | WorldGen (text-to-3D gaussian splat, FLUX.1-dev backbone)   |
| Fine-Tuning   | LoRA via PEFT + Accelerate on FLUX.1-dev diffusion model    |
| Narration     | Cartesia TTS API                                            |
| PDF Parsing   | pdfplumber                                                  |


## Project Structure

```
Sceneweaver/
├── frontend/                    # Next.js app
│   ├── app/
│   │   ├── page.tsx             # Landing page (animated hero + upload)
│   │   ├── dashboard/page.tsx   # World gallery
│   │   ├── scenes/[genId]/[momentIndex]/page.tsx  # 3D scene viewer
│   │   ├── layout.tsx           # Root layout, fonts, theme
│   │   └── globals.css          # Theme variables, animations
│   ├── components/
│   │   ├── home/
│   │   │   ├── generation-card.tsx    # Scene cards with thumbnail capture
│   │   │   ├── dashboard-bg.tsx       # Starry night background
│   │   │   ├── dashboard-content.tsx  # Animated dashboard layout
│   │   │   ├── loading-screen.tsx     # Pipeline processing screen
│   │   │   ├── scenery-bg.tsx         # Homepage landscape silhouettes
│   │   │   └── step-illustrations.tsx # SVG step illustrations
│   │   ├── viewer/
│   │   │   ├── scene-viewer.tsx       # Three.js + Spark.js gaussian splat viewer
│   │   │   ├── scene-page-content.tsx # Scene detail page layout
│   │   │   ├── scene-bg.tsx           # Scene page background
│   │   │   └── audio-player.tsx       # Audio narration player
│   │   ├── theme-provider.tsx         # Light/dark mode toggle
│   │   └── ui/                        # shadcn/ui components
│   └── lib/
│       ├── api/
│       │   ├── generations.ts   # Backend API client
│       │   └── types.ts         # TypeScript type definitions
│       └── utils.ts             # Utility functions
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── config.py            # Environment configuration (Pydantic)
│   │   ├── routes/
│   │   │   ├── generations.py   # Generation CRUD + pipeline trigger
│   │   │   ├── parse.py         # PDF text extraction endpoint
│   │   │   ├── extract_moments.py   # LLM moment extraction endpoint
│   │   │   ├── generate_scene.py    # Individual scene generation
│   │   │   ├── scene_status.py      # Job status polling
│   │   │   └── narrate.py           # TTS narration endpoint
│   │   ├── services/
│   │   │   ├── pipeline.py      # Background pipeline orchestrator
│   │   │   ├── llm.py           # OpenAI GPT integration
│   │   │   ├── tts.py           # Cartesia TTS integration
│   │   │   ├── pdf.py           # PDF text extraction
│   │   │   └── generation_store.py  # SQLite database operations
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic request/response models
│   │   └── world_model/
│   │       ├── adapter.py       # Abstract world model interface
│   │       └── worldgen_adapter.py  # WorldGen implementation (with LoRA support)
│   ├── data/                    # SQLite database files
│   └── static/                  # Generated assets
│       ├── scenes/              # 3D gaussian splat files (SPZ/PLY)
│       └── audio/               # Narration audio files (WAV)
├── finetune/                    # LoRA fine-tuning pipeline
│   ├── dataset/
│   │   ├── source_polyhaven.py      # Downloads CC0 equirectangular panoramas from Polyhaven
│   │   ├── source_worldgen.py       # Generates panoramas from curated book prompts via WorldGen
│   │   ├── build_dataset.py         # OpenAI o4-mini captioning pipeline for panoramas
│   │   ├── extract_book_scenes.py   # Extracts scene descriptions from Project Gutenberg books
│   │   └── prepare_pairs.py         # Merges sources into HuggingFace ImageFolder dataset
│   ├── train/
│   │   ├── train_book_lora.py       # FLUX.1-dev LoRA training script
│   │   ├── config.yaml              # Training hyperparameters
│   │   ├── launch.sh                # One-command training launcher
│   │   └── requirements.txt         # GPU machine dependencies
│   └── eval/
│       ├── eval_clip_score.py       # CLIP similarity evaluation
│       ├── eval_side_by_side.py     # Visual comparison report generator
│       └── test_prompts.json        # Literary scene test prompts
└── .env                         # Environment variables
```

## Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- GPU recommended for WorldGen scene generation and LoRA training

### Environment Variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
CARTESIA_API_KEY=your_cartesia_api_key
WORLD_MODEL_BACKEND=worldgen

# Optional: path to fine-tuned LoRA weights
BOOK_LORA_PATH=
BOOK_LORA_WEIGHT=0.7

FRONTEND_URL=http://localhost:3000
```

### Backend

```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

The API starts at `http://127.0.0.1:8000`. Interactive docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts at `http://localhost:3000`.

## Fine-Tuning Pipeline

Sceneweaver includes a complete LoRA fine-tuning pipeline that trains a book-specialized adapter on top of WorldGen's FLUX.1-dev diffusion backbone. The base FLUX.1-dev model was trained on plain photographic descriptions, so it struggles with literary language — metaphors, mood, sensory detail. The LoRA teaches the model to interpret literary-style prompts and generate more faithful equirectangular panoramas from them, which WorldGen then lifts into 3D gaussian splats.

### 1. Dataset Construction

Training pairs are always (equirectangular panorama, literary-style text). The data comes from two complementary approaches:

**Approach A — Panorama-first (primary):**

Real panoramas are sourced first, then OpenAI o4-mini writes literary captions to match them.

- `source_polyhaven.py` — Downloads ~500+ CC0-licensed equirectangular HDR panoramas from Polyhaven, resized to 800x1600. These provide diverse, high-quality real-world environments.
- `source_worldgen.py` — Generates panoramas from 30 curated book-themed prompts using WorldGen on a GPU machine, with 3 seeds per prompt (~90 panoramas). These teach the LoRA the WorldGen output distribution so it doesn't drift too far from the base model.
- `build_dataset.py` — Feeds all panoramas through OpenAI o4-mini to generate literary-style captions for each image — how a novelist would describe the scene with metaphors, mood, and sensory detail.

**Approach B — Text-first (supplementary):**

Literary passages are sourced first, then used to generate candidate panoramas for training.

- `extract_book_scenes.py` — Downloads 25 public domain novels from Project Gutenberg, splits them into chunks, and uses o4-mini to classify and extract scene-setting passages (not dialogue, not action — only physical environment descriptions). For each passage, o4-mini also generates a visual scene description (spatial layout, lighting, objects, atmosphere). These visual descriptions are then fed to WorldGen to generate candidate panoramas, which are human-curated for quality. The final training pair is (generated panorama, original literary passage).

**Dataset assembly** (`prepare_pairs.py`) — Merges both approaches into a single HuggingFace-compatible ImageFolder dataset with `metadata.jsonl`. Handles train/val split, resizing to 800x1600, and wraps all captions with the WorldGen prompt format:

```
"A high quality 360 panorama photo depicting a literary scene: {literary caption}. HDR, RAW, 360 consistent, omnidirectional, atmospheric, detailed environment"
```

This prefix/suffix wrapping ensures the training data matches the format used at inference time, so the LoRA activates correctly when the app pipeline sends scene descriptions to the model.

### 2. Training

**Training script** (`train_book_lora.py`) — Full FLUX.1-dev LoRA training using `accelerate`, `diffusers`, and `peft`. Trains at 800x1600 equirectangular resolution with flow matching loss. Features include:

- Rank-32 LoRA with alpha 32
- Learning rate 1e-4 with cosine schedule
- 5000 training steps in bf16 precision
- Gradient checkpointing for memory efficiency
- Validation image generation at checkpoints using literary prompts
- TensorBoard logging

```bash
cd finetune/train
bash launch.sh
```

### 3. Evaluation

**CLIP score evaluation** (`eval_clip_score.py`) — Computes CLIP cosine similarity between literary captions and generated panoramas. Compares base FLUX.1-dev, WorldGen, and book-fine-tuned variants side by side.

**Visual comparison** (`eval_side_by_side.py`) — Two modes: `generate` produces test panoramas with each model variant, `report` builds an HTML comparison page with labeled image grids for qualitative assessment.

**Test prompts** (`test_prompts.json`) — 10 diverse literary scene descriptions spanning attics, enchanted groves, abandoned ballrooms, harbors, alchemy labs, monasteries, speakeasies, battlefields, underwater palaces, and desert oases.

### 4. Integration

When `BOOK_LORA_PATH` is set in the environment, the WorldGen adapter automatically activates book mode:

- `worldgen_adapter.py` reads the LoRA path and weight from config
- WorldGen's `build_pano_gen_model()` composes the book LoRA with WorldGen's base LoRA via Nunchaku or PEFT (`set_adapters`)
- `gen_pano_image()` switches to literary-optimized prompt prefix/suffix formatting
- The `WorldGen` class threads `book_mode`, `book_lora_path`, and `book_lora_weight` through to the panorama generator

## API Reference

### Create a Generation

```bash
curl -X POST http://127.0.0.1:8000/api/generations \
  -F "file=@chapter1.pdf" \
  -F "num_scenes=3" \
  -F "book_title=The Hobbit"
```

Parameters:

- `file` — PDF or TXT file (multipart upload)
- `text` — Raw text (alternative to file upload)
- `num_scenes` — Number of scenes to extract (1-20, default: 5)
- `book_title` — Optional book name, included in the LLM prompt and scene generation for better context

### Poll Generation Status

```bash
curl http://127.0.0.1:8000/api/generations/{id}
```

Status progresses through: `pending` → `extracting` → `processing` → `complete` (or `failed`).

### All Endpoints


| Method | Endpoint                                     | Description                          |
| ------ | -------------------------------------------- | ------------------------------------ |
| `POST` | `/api/generations`                           | Create new generation                |
| `GET`  | `/api/generations`                           | List all generations                 |
| `GET`  | `/api/generations/{id}`                      | Get generation details + all moments |
| `GET`  | `/api/generations/{id}/scenes`               | List scenes for a generation         |
| `GET`  | `/api/generations/{id}/scenes/{index}`       | Get specific scene                   |
| `GET`  | `/api/generations/{id}/scenes/{index}/splat` | Download 3D asset                    |
| `GET`  | `/api/generations/{id}/scenes/{index}/audio` | Download narration audio             |
| `POST` | `/api/parse`                                 | Extract text from PDF                |
| `POST` | `/api/extract-moments`                       | Extract key moments via GPT          |
| `POST` | `/api/generate-scene`                        | Generate a single 3D scene           |
| `POST` | `/api/narrate`                               | Generate TTS narration               |


## Pipeline

```
User uploads PDF/TXT
        │
        ▼
  Text Extraction
    (pdfplumber)
        │
        ▼
 Key Moment Extraction
    (OpenAI GPT)
    Identifies visually significant scenes,
    generates spatial descriptions, narration
    text, and emotional tone
        │
        ▼
  For each moment (parallel):
        │
   ┌────┴────┐
   ▼         ▼
3D Scene   Audio
Generation Narration
(WorldGen  (Cartesia
 + LoRA)    TTS)
   │         │
   ▼         ▼
 SPZ/PLY   WAV file
  asset
   │         │
   └────┬────┘
        ▼
 Results persisted
   to SQLite DB
        │
        ▼
 Frontend polls API
  and renders worlds
```

## 3D Viewer Controls


| Control               | Action                                       |
| --------------------- | -------------------------------------------- |
| **W / A / S / D**     | Move forward / left / back / right           |
| **Q / E**             | Move up / down                               |
| **Shift**             | Sprint (2.5x speed)                          |
| **Mouse click**       | Lock cursor for look-around                  |
| **Mouse move**        | Look around (while locked)                   |
| **Fullscreen button** | Toggle fullscreen mode                       |
| **D key**             | Toggle light/dark theme (when not in viewer) |


## Design

- **Landing page** — Animated sky gradient with landscape silhouettes spanning distinct biomes (volcano, desert canyon, forest, snow-capped mountains, active volcano, medieval castle, ocean coastline). Animated clouds and bird flocks drift across the sky. The scenery fades smoothly as the user scrolls down.
- **Upload flow** — File upload triggers a processing screen that displays real-time pipeline status: indexing text, analyzing narrative structure, finding relevant scenes, and generating worlds.
- **Dashboard** — Starry night sky with twinkling stars, subtle nebula washes, and a moon that parallaxes and fades on scroll. Scene cards display auto-generated thumbnails.
- **Scene viewer** — Full 3D gaussian splat rendering with first-person controls, audio narration, and scene-to-scene navigation.
- **Page transitions** — Smooth full-screen transitions between pages: sky darkens when entering the dashboard, brightens when returning home.
