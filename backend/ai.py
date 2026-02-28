import os
import json
from openai import OpenAI
from heatmap import generate_heatmap_from_signals  # fixed import
from schemas import CTMResponse
from modules import MODULES

# Load demo JSON files
DEMO_DIR = os.path.join(os.path.dirname(__file__), "demo")

def load_demo_json(filename):
    with open(os.path.join(DEMO_DIR, filename), "r") as f:
        return json.load(f)

def get_ctm_from_ai(warmup_signals: dict, native_lang: str, target_lang: str, known_langs: list) -> dict:
    """
    Call LLM to generate CTM JSON based on warm-up signals and language profile.
    If DEMO_MODE is True or API key missing, return demo CTM.
    """
    # Check demo mode first
    if os.getenv("DEMO_MODE", "false").lower() == "true":
        return load_demo_json("ctm.json")

    # If not in demo mode, we need an API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Warning: OPENAI_API_KEY not set, falling back to demo mode.")
        return load_demo_json("ctm.json")

    # Initialize client only now
    client = OpenAI(api_key=api_key)

    # Construct the prompt
    system_prompt = """You are an AI curriculum optimizer for multilingual learners. Given the user's native language, target language, known languages, and warm-up performance signals, output a JSON object following this schema exactly:
{
  "transfer_advantages": [{"type": str, "description": str, "confidence": float}],
  "interference_risks": [{"type": str, "description": str, "confidence": float}],
  "pronunciation_risks": [{"type": str, "description": str, "confidence": float}],
  "recommended_order": [str],
  "modules_to_skip": [str],
  "redundancy_removed_percent": float,
  "explainability": [str],
  "next_best_exercises": [{"skill": str, "prompt": str, "answer_key": str}],
  "heatmap": [{"module_id": str, "area": str, "severity": int}]
}
Be realistic and base your decisions on the warm-up signals. Use the following modules (IDs and areas):
M01_FamiliarPhrases (vocabulary)
M02_Cognates (vocabulary)
M03_Pronunciation (pronunciation)
M04_WordOrder (grammar)
M05_Gender (grammar)
M06_VerbConjugation (grammar)
M07_CommonExpressions (pragmatics)
M08_Reading (script)
Severity: 0=low risk (green), 1=medium (yellow), 2=high (red).
Output ONLY valid JSON, no other text.

The heatmap severity should reflect the user's performance in each area:
- 0 = good performance (low risk) – few or no errors in that area.
- 1 = medium risk – some errors, needs practice.
- 2 = high risk – many errors, critical to address.
Base it on the warm-up signals provided.
"""

    user_prompt = f"""
Native language: {native_lang}
Target language: {target_lang}
Known languages: {', '.join(known_langs)}
Warm-up signals: {json.dumps(warmup_signals, indent=2)}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"AI call failed: {e}")
        # Fallback: start with demo CTM but replace heatmap with dynamic one
        demo = load_demo_json("ctm.json")
        demo["heatmap"] = generate_heatmap_from_signals(warmup_signals)
        return demo