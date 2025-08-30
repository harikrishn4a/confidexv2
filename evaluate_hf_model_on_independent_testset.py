from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from datasets import load_from_disk
from seqeval.metrics import classification_report, f1_score, accuracy_score
from tqdm import tqdm
import sys

# --- Load label mapping from your sg_dataset_full.py ---
LABELS = ["O"] + [f"{p}-{lab}" for lab in [
    "NRIC","FIN","PASSPORT","API_KEY","ACCESS_TOKEN","SALARY","COMMISSION_RATE",
    "BUDGET","INVOICE_ID","PO_NUMBER","FINANCIAL_REPORT","PRICING_TERM",
    "PROJECT_CODE","SOURCE_CODE","EMAIL", "PHONE", "SSN", "CREDIT_CARD",
    "ACCOUNT_NUMBER", "PERSON", "KEY", "FINANCIAL"
] for p in ("B","I")]
id2label = {i: lab for i, lab in enumerate(LABELS)}

# --- Load model and tokenizer ---
model_name = "Isotonic/distilbert_finetuned_ai4privacy_v2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
nlp = pipeline("token-classification", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

# --- Load your independent test set ---
test_ds = load_from_disk("super_robust_testset")

# --- Convert label indices to label names ---
def indices_to_labels(indices):
    return [id2label[i] for i in indices]

# --- Run inference and collect predictions ---
true_labels = []
pred_labels = []

for ex in tqdm(test_ds, desc="Evaluating"):
    tokens = ex["tokens"]
    text = " ".join(tokens)
    # Get model predictions
    preds = nlp(text)
    # Build predicted label sequence (align with tokens)
    pred_seq = ["O"] * len(tokens)
    for ent in preds:
        # Find the token indices that match the entity span
        ent_text = ent['word'] if 'word' in ent else ent['entity_group']
        ent_label = ent['entity_group']
        # Try to align entity span to tokens
        for i, token in enumerate(tokens):
            if token in ent['word']:
                pred_seq[i] = ent_label
    # Use ner_tags directly as they are already label strings
    true_seq = ex["ner_tags"]
    true_labels.append(true_seq)
    pred_labels.append(pred_seq)

# --- Compute and print metrics ---
print(classification_report(true_labels, pred_labels, digits=4))
print("Overall F1:", f1_score(true_labels, pred_labels))
print("Overall Accuracy:", accuracy_score(true_labels, pred_labels))