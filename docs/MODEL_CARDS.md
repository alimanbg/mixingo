# Model Card: Mixingo CTM & Exercise Generator

## Model Details
- **Model:** OpenAI GPT-4o-mini (via API)
- **Version:** gpt-4o-mini-2024-07-18
- **Type:** Large Language Model fine-tuned for instruction following
- **Task:** Generate structured curriculum recommendations and exercises

## Intended Use
- To provide personalized learning paths for multilingual learners of French.
- To identify transfer advantages and interference risks based on known languages.
- To generate micro-exercises targeting specific skill gaps.

## Training Data
- The base model is trained on a wide corpus of internet text; no custom fine-tuning was performed.
- Prompts are engineered to constrain output to our JSON schema.

## Limitations
- **Bias:** The model may reflect cultural biases present in its training data. Recommendations are based on statistical patterns and may not suit every learner.
- **Language coverage:** Optimized for French learners with English/Chinese known languages; performance may vary for other language pairs.
- **No real-time adaptation:** The model does not learn from user interactions; each request is independent.
- **Pronunciation risks:** The model infers pronunciation difficulty based on text descriptions; it does not process audio.

## Fairness Considerations
- We explicitly instruct the model to avoid stereotypes and to focus on linguistic transfer.
- Recommendations are based on warm-up performance, not on demographic attributes.

## Privacy & Data Handling
- **No personal data stored:** User sessions are held in memory only during the demo and are lost on server restart.
- **No PII collected:** User IDs are random UUIDs; no names, emails, or identifiers are stored.
- **OpenAI API:** Data sent to OpenAI is subject to their privacy policy; we send only language profile and warm-up signals, no personal information.

## Environmental Impact
- Using a small model (gpt-4o-mini) minimizes computational footprint.
- Demo mode reduces API calls to zero.

## Transparency
- All AI outputs include explainability bullets to show reasoning.
- The heatmap visually indicates areas of risk.
- In demo mode, the app clearly indicates that cached data is being used.

## Version History
- 1.0: Initial release for hackathon.