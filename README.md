# Mixingo – AI Curriculum Optimizer

**Problem:** Multilingual learners waste time on redundant content. Mixingo analyzes warm-up performance and known languages to create a personalized learning path, removing up to 32% of unnecessary modules.

**Solution:** 
- Onboarding & warm-up → Cognitive Transfer Mapping (CTM) → Heatmap dashboard → Personalized exercises.

## Demo Video
[Link to video] (to be added after recording)

## Features
- **Multilingual Transfer Analysis:** Identifies advantages and interference risks based on known languages.
- **Personalized Curriculum:** Recommends module order and skips redundant content.
- **Heatmap Dashboard:** Visualizes risk areas (green/yellow/red) across grammar, vocabulary, pronunciation, etc.
- **AI-Generated Exercises:** Micro-exercises tailored to the learner's weak spots.
- **Demo Mode:** Works fully offline with cached JSON responses – no API key needed.

## Architecture
![Architecture Diagram](assets/architecture.png) *(Add a simple diagram later)*

- **Frontend:** Next.js + Tailwind (deployed on Vercel)
- **Backend:** FastAPI (Python) with in-memory session storage
- **AI Layer:** OpenAI GPT-4o-mini with structured JSON output (fallback to demo JSON)
- **Demo Mode:** Environment variable `DEMO_MODE=true` bypasses AI calls and uses pre-defined JSON files.

## Tech Stack
- **Backend:** FastAPI, Pydantic, python-dotenv, OpenAI
- **Frontend:** Next.js, Tailwind CSS, fetch API
- **Deployment:** (Optional) Vercel (frontend) + Render (backend)

## How to Run Locally

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key (for live mode – optional if using demo mode)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env   # fill in your keys (or leave DEMO_MODE=true)
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Demo Mode
Set `DEMO_MODE=true` in `backend/.env` to use cached JSON responses (no API key needed). This is perfect for presentations or testing without internet.

### Environment Variables
- `OPENAI_API_KEY` – Your OpenAI API key (only needed if `DEMO_MODE=false`)
- `DEMO_MODE` – Set to `true` to run without AI (default: `false`)

## API Documentation
Once the backend is running, visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive Swagger documentation.

## Team
- Alima Nur Begimbaeva – ML Engineer & Backend Architect
- Assem Khassylbekova - Business Lead & Product Manager
- Danil Tomilov - Frontend Developer & Demo Strategist

## License
MIT