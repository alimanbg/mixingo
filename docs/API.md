# API Reference

Base URL: `http://localhost:8000` (or your deployed backend)

All endpoints return JSON. Interactive docs available at `/docs`.

## `POST /api/warmup/submit`

Submit warm-up answers and get computed signals.

**Request Body:**

```json
{
  "user_id": "optional-string",
  "answers": [
    {
      "question_id": "string",
      "answer": "string",
      "time_taken": 1.5,
      "correct": true,
      "category": "vocabulary|grammar|pronunciation|script|pragmatics"
    }
  ]
}
```

**Response:**

```json
{
  "user_id": "generated-or-provided-id",
  "signals": {
    "accuracy_rate": 0.75,
    "avg_response_time": 2.3,
    "error_distribution": {
      "grammar": 1,
      "pronunciation": 2
    },
    "confidence_proxies": 0.7,
    "script_familiarity": 0.6
  }
}
```

## `POST /api/ctm/analyze`

Generate Cognitive Transfer Mapping based on warm-up signals.

**Request Body:**

```json
{
  "user_id": "string"
}
```

**Response:** Full CTM JSON (see schema in code or Swagger).

## `POST /api/exercises/generate`

Generate micro-exercises for a specific module.

**Request Body:**

```json
{
  "module_id": "M03_Pronunciation",
  "user_id": "optional-string"
}
```

**Response:**

```json
{
  "module_id": "M03_Pronunciation",
  "micro_explanation": "string",
  "questions": [
    {
      "question": "string",
      "options": ["option1", "option2", "option3", "option4"],
      "correct_answer": "string",
      "feedback": "string"
    }
  ]
}
```

## `GET /api/demo/profile`

Returns demo user profile.

## `GET /api/demo/ctm`

Returns demo CTM.

## `GET /api/demo/exercises`

Returns demo exercises.

## `GET /api/status`

Returns demo mode status.
