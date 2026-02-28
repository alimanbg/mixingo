# Architecture Overview

Mixingo follows a clean separation between frontend, backend, and AI services, with a built-in demo mode for reliability.

## System Components

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend  │────▶│   Backend    │────▶│   AI Service    │
│  (Next.js)  │◀────│  (FastAPI)   │◀────│   (OpenAI)      │
└─────────────┘     └──────────────┘     └─────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Demo Mode    │
                    │ JSON Cache   │
                    └──────────────┘
```

## Data Flow

1. **User Onboarding & Warm-up**
   - Frontend collects native/target languages and warm-up answers.
   - `POST /api/warmup/submit` stores answers and computes signals (accuracy, error distribution, etc.).

2. **Cognitive Transfer Mapping (CTM)**
   - `POST /api/ctm/analyze` uses warm-up signals and language profile.
   - If `DEMO_MODE=true`, returns cached `ctm.json`.
   - Otherwise, calls OpenAI with a structured prompt, validates JSON, and returns.
   - CTM includes:
     - Transfer advantages & interference risks
     - Recommended module order & modules to skip
     - Redundancy removed percentage
     - Explainability bullets
     - Heatmap (risk per module/area)

3. **Heatmap Visualization**
   - Frontend renders a grid of modules with severity colors (0=green,1=yellow,2=red).

4. **Exercise Generation**
   - `POST /api/exercises/generate` takes a module ID (and optionally user ID).
   - Returns micro-explanation and 3 practice questions with feedback.

## Demo Mode
- Controlled by `DEMO_MODE` environment variable.
- When `true`, all AI-dependent endpoints return pre-defined JSON from `backend/demo/`.
- Guarantees the app works offline and during presentations.

## Scoring Formula
The `redundancy_removed_percent` is computed as:
```bash
base_overlap = 0.3 (if known languages share structures)
error_penalty = 0.1 * error_rate
redundancy_removed = clamp(base_overlap - error_penalty, 0, 50)
```
In practice, the AI refines this based on actual performance.

## Key Design Decisions
- **In-memory storage:** No database needed for demo; simplifies deployment.
- **Structured AI output:** Enforces JSON schema with Pydantic validation.
- **Fallback to demo JSON:** Prevents live failures during judging.

