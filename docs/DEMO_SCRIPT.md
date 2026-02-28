# Demo Script (90 seconds)

## Overview

- **Total Duration:** 90 seconds
- **Speakers:** Asema (Business Lead) – Narration & Pitch; Danil (Demo Ops) – Screen control & click-through
- **Demo Mode:** Ensure `DEMO_MODE=true` in backend to guarantee no live API failures.

## Speaker Roles

- **Asema (Voice):** Explains problem, solution, and key metrics.
- **Danil (Actions):** Clicks through the UI, points to relevant sections, ensures smooth transitions.

---

## Script Timeline

| Time      | Speaker | Action                                                                                              | Dialogue                                                                                                                                                                                                                                                    |
| --------- | ------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00–0:15 | Asema   | Danil shows landing page                                                                            | "Hi, we're Mixingo. Language apps assume you're monolingual, forcing multilingual learners to waste time on content they already know. We built an AI curriculum optimizer that remixes what you already know to skip the redundancy. We call it Mix & Go." |
| 0:15–0:25 | Danil   | Clicks "Start", selects languages (English, Mandarin, Cantonese → French), clicks "Start warm-up"   | (Asema continues) "Meet our user, a trilingual HK student learning French. Instead of starting with the alphabet, we begin with familiar phrases and cognates."                                                                                             |
| 0:25–0:35 | Danil   | Goes through 3 quick warm-up questions (one correct, one slightly wrong, one pronunciation mistake) | "A quick warm-up detects their strengths and weaknesses – vocabulary is solid, but pronunciation needs work."                                                                                                                                               |
| 0:35–0:50 | Danil   | Clicks "See my plan" → Dashboard with heatmap appears                                               | "Our AI generates a Cognitive Transfer Map. The heatmap shows risk areas: green for vocabulary (cognates are easy), yellow for grammar, and red for pronunciation – nasal vowels are new. We also remove 32% of redundant modules."                         |
| 0:50–1:05 | Danil   | Clicks on red module (Pronunciation) → "Generate exercises"                                         | "Based on the heatmap, we create targeted micro-exercises. Here, the AI explains nasal vowels and gives three practice questions with instant feedback."                                                                                                    |
| 1:05–1:15 | Danil   | Answers one question correctly, shows feedback                                                      | (Asema) "The exercises adapt to their specific gap – and because we built a robust demo mode, this works even without internet."                                                                                                                            |
| 1:15–1:30 | Asema   | Danil returns to dashboard, points to "32% removed"                                                 | "Mixingo saves time, boosts confidence, and helps learners progress faster. We're targeting HK students, universities, and corporate relocation. Try it yourself – our demo mode is live. Mix what you know, and go further."                               |

---

## Technical Setup Checklist

- [ ] Backend running with `DEMO_MODE=true`
- [ ] Frontend connected to `localhost:8000`
- [ ] Browser open to landing page
- [ ] All demo JSON files in place (`/backend/demo/`)
- [ ] Screen recorder ready (OBS / Loom / QuickTime)
- [ ] Practice transitions at least twice
