from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from datasets import load_from_disk
from seqeval.metrics import classification_report, accuracy_score, f1_score, precision_score, recall_score
import numpy as np

def to_flat(labels):
    return [l[2:] if l.startswith(("B-", "I-")) else l for l in labels]

def align_predictions(tokens, preds):
    pred_seq = ["O"] * len(tokens)
    for ent in preds:
        for i, token in enumerate(tokens):
            if ent['word'].replace(' ', '').lower() in token.replace(' ', '').lower():
                pred_seq[i] = ent["entity_group"]
    return pred_seq

def evaluate_model(model_name, test_dataset):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForTokenClassification.from_pretrained(model_name)
    ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

    true_labels = []
    pred_labels = []

    for example in test_dataset:
        tokens = example["tokens"]
        true_ner_tags = example["ner_tags"]
        text = " ".join(tokens)
        preds = ner_pipeline(text)
        pred_seq = align_predictions(tokens, preds)
        true_labels.append(true_ner_tags)
        pred_labels.append(pred_seq)

    flat_true_labels = [to_flat(seq) for seq in true_labels]
    flat_pred_labels = [to_flat(seq) for seq in pred_labels]

    print(f"\n=== Evaluation for {model_name} ===")
    print("Sample flat true labels:", flat_true_labels[0])
    print("Sample flat pred labels:", flat_pred_labels[0])
    print("Detailed classification report (flat labels):")
    print(classification_report(flat_true_labels, flat_pred_labels, digits=4))
    print("\nOverall metrics (flat labels):")
    print(f"Accuracy: {accuracy_score(flat_true_labels, flat_pred_labels):.4f}")
    print(f"Micro F1: {f1_score(flat_true_labels, flat_pred_labels):.4f}")
    print(f"Macro F1: {f1_score(flat_true_labels, flat_pred_labels, average='macro'):.4f}")
    print(f"Weighted F1: {f1_score(flat_true_labels, flat_pred_labels, average='weighted'):.4f}")
    print(f"Micro Precision: {precision_score(flat_true_labels, flat_pred_labels):.4f}")
    print(f"Micro Recall: {recall_score(flat_true_labels, flat_pred_labels):.4f}")

    labels = set([l for seq in flat_true_labels for l in seq if l != "O"])
    label_accuracies = []
    for label in labels:
        label_true = [[l if l == label else "O" for l in seq] for seq in flat_true_labels]
        label_pred = [[l if l == label else "O" for l in seq] for seq in flat_pred_labels]
        acc = accuracy_score(label_true, label_pred)
        label_accuracies.append(acc)
        print(f"Accuracy for {label}: {acc:.4f}")
    print(f"Average label accuracy: {np.mean(label_accuracies):.4f}")

# Load your test dataset
test_dataset = load_from_disk("testdata1")["test"]  # Adjust path/split as needed

# Evaluate both models
evaluate_model("Isotonic/distilbert_finetuned_ai4privacy_v2", test_dataset)
evaluate_model("finetuned-sg-privacy-model", test_dataset)
