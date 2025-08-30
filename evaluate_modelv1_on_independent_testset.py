from transformers import AutoTokenizer, AutoModelForTokenClassification
from datasets import load_from_disk
from seqeval.metrics import classification_report, f1_score, accuracy_score
from tqdm import tqdm
import torch
import numpy as np

# Load model and tokenizer
model_name = "modelv1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
model.eval()

# Get id2label from model config, ensure keys are integers
id2label = {int(k): v for k, v in model.config.id2label.items()}
label2id = model.config.label2id

# Load your independent test set
test_ds = load_from_disk("super_robust_testset")

true_labels = []
pred_labels = []
examples_to_print = 5
examples_printed = 0

for ex in tqdm(test_ds, desc="Evaluating"):
    tokens = ex["tokens"]
    text = " ".join(tokens)
    # Tokenize and align
    encoding = tokenizer(tokens, is_split_into_words=True, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**encoding)
        logits = outputs.logits
        predictions = torch.argmax(logits, dim=-1).squeeze().tolist()
    # Map predictions to word level
    word_ids = encoding.word_ids()
    pred_seq = []
    last_word_idx = None
    for idx, word_idx in enumerate(word_ids):
        if word_idx is None or word_idx == last_word_idx:
            continue
        pred_label = id2label[predictions[idx]]
        pred_seq.append(pred_label)
        last_word_idx = word_idx
    true_seq = ex["ner_tags"]
    true_labels.append(true_seq)
    pred_labels.append(pred_seq)
    if examples_printed < examples_to_print:
        print("\nExample", examples_printed+1)
        print("Tokens:", tokens)
        print("True:", true_seq)
        print("Pred:", pred_seq)
        examples_printed += 1

# Print unique labels for debugging
print("Unique predicted labels:", set(l for seq in pred_labels for l in seq))
print("Unique true labels:", set(l for seq in true_labels for l in seq))

# Compute and print metrics
print(classification_report(true_labels, pred_labels, digits=4))
print("Overall F1:", f1_score(true_labels, pred_labels))
print("Overall Accuracy:", accuracy_score(true_labels, pred_labels))