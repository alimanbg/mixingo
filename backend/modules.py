MODULES = [
    {"id": "M01_FamiliarPhrases", "name": "Everyday Greetings & Politeness", "area": "vocabulary"},
    {"id": "M02_Cognates", "name": "English-French Cognates", "area": "vocabulary"},
    {"id": "M03_Pronunciation", "name": "Nasal Vowels & Liaison", "area": "pronunciation"},
    {"id": "M04_WordOrder", "name": "Basic Sentence Structure (SVO)", "area": "grammar"},
    {"id": "M05_Gender", "name": "Noun Genders", "area": "grammar"},
    {"id": "M06_VerbConjugation", "name": "Present Tense Regular Verbs", "area": "grammar"},
    {"id": "M07_CommonExpressions", "name": "Idioms & Politeness Levels", "area": "pragmatics"},
    {"id": "M08_Reading", "name": "Familiar Script & Accents", "area": "script"}
]

# Helper to get module by ID
def get_module(module_id: str):
    for m in MODULES:
        if m["id"] == module_id:
            return m
    return None