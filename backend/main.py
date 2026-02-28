import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Optional
from schemas import WarmupSubmission, CTMResponse
from scoring import compute_warmup_signals
from ai import get_ctm_from_ai, load_demo_json
from ai import get_exercises_from_ai
import uuid

from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    user_id: str

load_dotenv()

app = FastAPI(title="Mixingo API", version="1.0")

# Allow frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demo mode flag (read from env)
DEMO_MODE = os.getenv("DEMO_MODE", "false").lower() == "true"

# In-memory storage for user sessions (simplest)
user_sessions = {}

# Simple in-memory store: user_id -> {profile, warmup_signals, ctm}
# For demo, we'll generate a session ID if not provided

class WarmupResponse(BaseModel):
    user_id: str
    signals: dict

@app.post("/api/warmup/submit", response_model=WarmupResponse)
async def submit_warmup(submission: WarmupSubmission):
    user_id = submission.user_id or str(uuid.uuid4())
    signals = compute_warmup_signals(submission.answers)
    user_sessions[user_id] = {
        "profile": {
            "native_language": "English",
            "target_language": "French",
            "known_languages": ["English", "Mandarin", "Cantonese"]
        },
        "warmup_signals": signals,
        "answers": submission.answers
    }
    return {"user_id": user_id, "signals": signals}

@app.post("/api/ctm/analyze", response_model=CTMResponse)
async def analyze_ctm(request: AnalyzeRequest):
    user_id = request.user_id
    if user_id not in user_sessions:
        raise HTTPException(status_code=404, detail="User session not found")
    session = user_sessions[user_id]
    signals = session["warmup_signals"]
    profile = session["profile"]
    ctm_data = get_ctm_from_ai(
        warmup_signals=signals,
        native_lang=profile["native_language"],
        target_lang=profile["target_language"],
        known_langs=profile["known_languages"]
    )
    session["ctm"] = ctm_data
    return ctm_data

@app.get("/api/demo/profile")
async def demo_profile():
    return load_demo_json("profile.json")

@app.get("/api/demo/ctm")
async def demo_ctm():
    return load_demo_json("ctm.json")

class ExerciseRequest(BaseModel):
    module_id: str
    user_id: Optional[str] = None  # optional, to access warmup signals for personalization

@app.post("/api/exercises/generate")
async def generate_exercises(request: ExerciseRequest):
    module_id = request.module_id
    warmup_signals = None

    # If user_id provided and session exists, get warmup signals for personalization
    if request.user_id and request.user_id in user_sessions:
        warmup_signals = user_sessions[request.user_id].get("warmup_signals")

    exercises = get_exercises_from_ai(module_id, warmup_signals)
    return exercises

@app.get("/api/demo/exercises")
async def demo_exercises():
    return load_demo_json("exercises.json")
