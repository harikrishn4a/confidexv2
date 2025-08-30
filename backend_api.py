from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from rag import ask_document_question
from collections import defaultdict

app = FastAPI()

# Allow CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load NER model and pipeline
model_name = "modelv1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

class ScanRequest(BaseModel):
    text: str

def to_python_type(obj):
    import numpy as np
    if isinstance(obj, np.generic):
        return obj.item()
    if isinstance(obj, dict):
        return {k: to_python_type(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_python_type(v) for v in obj]
    return obj

def merge_entities(entities):
    if not entities:
        return []
    merged = []
    prev = entities[0].copy()
    for ent in entities[1:]:
        # Only merge if same type and directly consecutive
        if ent['entity_group'] == prev['entity_group'] and ent['start'] == prev['end']:
            prev['word'] += ent['word']
            prev['end'] = ent['end']
            prev['score'] = max(prev['score'], ent['score'])
        else:
            merged.append(prev)
            prev = ent.copy()
    merged.append(prev)
    return merged

def merge_amount_entities(entities, text):
    merged = []
    i = 0
    while i < len(entities):
        ent = entities[i]
        if ent['entity_group'] in ['AMOUNT_MONEY', 'BUDGET', 'FINANCIAL', 'PRICING_TERM', 'COMMISSION_RATE']:
            # Merge consecutive tokens/fragments of the same type
            start = ent['start']
            end = ent['end']
            j = i + 1
            while j < len(entities) and entities[j]['entity_group'] == ent['entity_group'] and entities[j]['start'] == end:
                end = entities[j]['end']
                j += 1
            merged.append({
                **ent,
                'word': text[start:end],
                'start': start,
                'end': end
            })
            i = j
        else:
            merged.append(ent)
            i += 1
    return merged

@app.post("/scan")
def scan(request: ScanRequest):
    try:
        # Lower threshold to 0.4 for demo
        raw_entities = ner_pipeline(request.text)
        print("Raw NER output:", raw_entities)
        # Only keep entities with score >= 0.15
        entities = [ent for ent in raw_entities if ent['score'] >= 0.15]
        print("Entities used for merging:", entities)
        # Improved merging for financial/amount/percentage entities
        entities = merge_amount_entities(entities, request.text)
        print("Merged entities:", entities)

        # Group entities by type
        grouped = defaultdict(list)
        for ent in entities:
            original_word = request.text[ent['start']:ent['end']]
            grouped[ent['entity_group']].append(original_word)

        flagged = []
        for entity_group, words in grouped.items():
            words_str = ', '.join(words)
            q = f"Why is {entity_group} like '{words_str}' sensitive?"
            explanation = ask_document_question(q)
            print(f"Q: {q}\nA: {explanation}")
            flagged.append({
                "entity_group": entity_group,
                "words": words,
                "explanation": explanation
            })

        verdict = "BLOCK" if flagged else "ALLOW"
        return to_python_type({
            "verdict": verdict,
            "flagged": flagged
        })
    except Exception as e:
        print("Error in /scan:", e)
        return {
            "verdict": "ERROR",
            "flagged": [],
            "error": str(e)
        }

@app.post("/api/privacy-check")
def privacy_check(request: ScanRequest):
    return scan(request)