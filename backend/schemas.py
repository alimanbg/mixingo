from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TransferAdvantage(BaseModel):
    type: str          # e.g., "grammar", "vocabulary", "pronunciation"
    description: str
    confidence: float  # 0.0 to 1.0

class InterferenceRisk(BaseModel):
    type: str
    description: str
    confidence: float

class PronunciationRisk(BaseModel):
    type: str
    description: str
    confidence: float

class NextBestExercise(BaseModel):
    skill: str
    prompt: str
    answer_key: str

class HeatmapItem(BaseModel):
    module_id: str
    area: str          # grammar, vocabulary, pronunciation, script, etc.
    severity: int      # 0 = green (low risk), 1 = yellow, 2 = red (high risk)

class CTMResponse(BaseModel):
    transfer_advantages: List[TransferAdvantage]
    interference_risks: List[InterferenceRisk]
    pronunciation_risks: List[PronunciationRisk]
    recommended_order: List[str]          # list of module IDs
    modules_to_skip: List[str]             # list of module IDs
    redundancy_removed_percent: float      # e.g., 32.0
    explainability: List[str]              # 3 bullet points
    next_best_exercises: List[NextBestExercise]
    heatmap: List[HeatmapItem]

# Optional: Schema for warm-up submission
class WarmupAnswer(BaseModel):
    question_id: str
    answer: str
    time_taken: float   # seconds
    correct: bool
    category: str       # grammar, vocab, pronunciation, etc.

class WarmupSubmission(BaseModel):
    user_id: str
    answers: List[WarmupAnswer]

# Optional: Schema for exercise generation request
class ExerciseRequest(BaseModel):
    module_id: str