from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from rag import ask_document_question

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
model_name = "finetuned-sg-privacy-model"
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

@app.post("/scan")
def scan(request: ScanRequest):
    try:
        entities = ner_pipeline(request.text)
        explanations = []
        for ent in entities:
            q = f"Is it allowed to share {ent['entity_group']} like '{ent['word']}'?"
            explanation = ask_document_question(q)
            print(f"Q: {q}\nA: {explanation}")  # Add logging
            explanations.append(explanation)
        verdict = "BLOCK" if explanations else "ALLOW"
        # Convert all numpy types to native Python types
        return to_python_type({
            "entities": entities,
            "explanations": explanations,
            "verdict": verdict
        })
    except Exception as e:
        print("Error in /scan:", e)
        return {
            "entities": [],
            "explanations": [],
            "verdict": "ERROR",
            "error": str(e)
        }