from typing import List, Dict, Any
from schemas import WarmupAnswer  # we defined earlier

def compute_warmup_signals(answers: List[WarmupAnswer]) -> Dict[str, Any]:
    """
    Compute warm-up signals from answers.
    Returns a dict with:
      - accuracy_rate: float (0-1)
      - avg_response_time: float (seconds)
      - error_distribution: dict with counts per category (grammar, vocab, pronunciation, etc.)
      - confidence_proxies: optional (if multiple-choice, we could use time as proxy)
      - script_familiarity: optional (if we have script recognition tasks)
    """
    total = len(answers)
    if total == 0:
        return {
            "accuracy_rate": 0,
            "avg_response_time": 0,
            "error_distribution": {},
            "confidence_proxies": 0.5,
            "script_familiarity": 0.5
        }

    correct_count = sum(1 for a in answers if a.correct)
    accuracy_rate = correct_count / total

    avg_response_time = sum(a.time_taken for a in answers) / total

    # Error distribution per category
    error_dist = {}
    for a in answers:
        if not a.correct:
            cat = a.category
            error_dist[cat] = error_dist.get(cat, 0) + 1

    # Confidence proxy: could be based on response time (faster = more confident)
    # For simplicity, we'll just return a placeholder
    confidence_proxies = 0.7  # default

    # Script familiarity: if any answer in "script" category was correct, etc.
    # For demo, we'll hardcode or compute
    script_familiarity = 0.6

    return {
        "accuracy_rate": accuracy_rate,
        "avg_response_time": avg_response_time,
        "error_distribution": error_dist,
        "confidence_proxies": confidence_proxies,
        "script_familiarity": script_familiarity
    }