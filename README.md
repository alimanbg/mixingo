# Mixingo – AI Curriculum Optimizer

**Problem:** Multilingual learners waste time on redundant content. Mixingo analyzes warm-up performance and known languages to create a personalized learning path, removing up to 32% of unnecessary modules.

**Solution:** 
- Onboarding & warm-up → Cognitive Transfer Mapping (CTM) → Heatmap dashboard → Personalized exercises.

## Architecture
- Frontend: Next.js + Tailwind
- Backend: FastAPI
- AI: LLM (OpenAI) with structured JSON output + fallback demo mode

## How to Run

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key (for live mode)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp ../.env.example .env   # fill in your keys
uvicorn main:app --reload
```

**Problem:** Multilingual learners waste time on redundant content. Mixingo analyzes warm-up performance and known languages to create a personalized learning path, removing up to 32% of unnecessary modules.

**Solution:** 
- Onboarding & warm-up → Cognitive Transfer Mapping (CTM) → Heatmap dashboard → Personalized exercises.

## Architecture
- Frontend: Next.js + Tailwind
- Backend: FastAPI
- AI: LLM (OpenAI) with structured JSON output + fallback demo mode

## How to Run

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key (for live mode)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp ../.env.example .env   # fill in your keys
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
Demo Mode
```

Set DEMO_MODE=true in .env to use cached JSON responses (no API key needed).

### Demo Video

[Link to video] (to be added)

### Team

Alima Nur Begimbaeva – Full-stack + ML
Assem Khassylbekova - Business Design
Danil Tomilov - Economics and Frontend

### License

MIT
