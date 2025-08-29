import transformers
print("Transformers version:", transformers.__version__)
from datasets import load_from_disk
from transformers import AutoTokenizer, AutoModelForTokenClassification, TrainingArguments, Trainer, DataCollatorForTokenClassification, AutoConfig
import numpy as np
from seqeval.metrics import classification_report, f1_score, accuracy_score, precision_score, recall_score

# Load your focused dataset for PERSON, EMAIL, PHONE
dataset = load_from_disk("sg_pdpa_ner_dataset_full")

# Define your label set
BASE_LABELS = [
    "NRIC","FIN","PASSPORT",
    "API_KEY","ACCESS_TOKEN",
    "SALARY","COMMISSION_RATE","AMOUNT_MONEY","ACCOUNT_BALANCE",
    "BUDGET","INVOICE_ID","PO_NUMBER","FINANCIAL_REPORT","PRICING_TERM",
    "PROJECT_CODE","SOURCE_CODE",
    # Add these data:
    "EMAIL", "PHONE", "SSN", "CREDIT_CARD", "ACCOUNT_NUMBER", "PERSON", "KEY", "FINANCIAL"
]
LABELS = ["O"] + [f"{p}-{lab}" for lab in BASE_LABELS for p in ("B","I")]
label2id = {lab:i for i,lab in enumerate(LABELS)}
id2label = {i:lab for lab,i in label2id.items()}

all_labels = set()
for split in ["train", "validation", "test"]:
    for example in dataset[split]:
        all_labels.update(example["ner_tags"])
print("All unique labels in dataset:", all_labels)

# Use base DistilBERT
model_name = "Isotonic/distilbert_finetuned_ai4privacy_v2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
config = AutoConfig.from_pretrained(model_name, num_labels=len(label2id), id2label=id2label, label2id=label2id)
model = AutoModelForTokenClassification.from_pretrained(model_name, config=config, ignore_mismatched_sizes=True)

# Pre-processing:Align labels with tokens (handles subword tokenization)
def tokenize_and_align_labels(batch):
    tokenized_inputs = tokenizer(batch["tokens"], truncation=True, is_split_into_words=True)
    labels_batch = []
    for i, labels in enumerate(batch["ner_tags"]):
        word_ids = tokenized_inputs.word_ids(batch_index=i)
        label_ids = []
        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            elif word_idx < len(labels):
                label_ids.append(label2id[labels[word_idx]])
            else:
                label_ids.append(-100)  # fallback for out-of-range
        labels_batch.append(label_ids)
    tokenized_inputs["labels"] = labels_batch
    return tokenized_inputs

tokenized_datasets = dataset.map(tokenize_and_align_labels, batched=True)

args = TrainingArguments(
    "finetuned-sg-privacy-model",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=5,
    weight_decay=0.01,
    save_total_limit=2,
    logging_steps=10,
    push_to_hub=False,
)

data_collator = DataCollatorForTokenClassification(tokenizer)

def align_predictions(predictions, label_ids):
    preds = np.argmax(predictions, axis=2)
    batch_size, seq_len = preds.shape
    out_label_list = []
    preds_list = []
    for i in range(batch_size):
        example_labels = []
        example_preds = []
        for j in range(seq_len):
            if label_ids[i, j] != -100:
                example_labels.append(id2label[label_ids[i][j]])
                example_preds.append(id2label[preds[i][j]])
        out_label_list.append(example_labels)
        preds_list.append(example_preds)
    return preds_list, out_label_list

def compute_metrics(p):
    preds_list, out_label_list = align_predictions(p.predictions, p.label_ids)
    return {
        "precision": precision_score(out_label_list, preds_list),
        "recall": recall_score(out_label_list, preds_list),
        "f1": f1_score(out_label_list, preds_list),
        "accuracy": accuracy_score(out_label_list, preds_list),
        "report": classification_report(out_label_list, preds_list, output_dict=True)
    }

trainer = Trainer(
    model,
    args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics,  # <-- This line is required!
)

trainer.train()
trainer.save_model("finetuned-sg-privacy-model")
tokenizer.save_pretrained("finetuned-sg-privacy-model")

metrics = trainer.evaluate()
print("Detailed classification report:")
import pprint
if "report" in metrics:
    pprint.pprint(metrics["report"])
else:
    print("No detailed classification report found. Metrics:", metrics)
