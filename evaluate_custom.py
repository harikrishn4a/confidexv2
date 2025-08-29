from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from rag import ask_document_question  # Import the function from rag.py
from seqeval.metrics import classification_report, f1_score, accuracy_score, precision_score, recall_score
import numpy as np

# Use the base Isotonic/distilbert_finetuned_ai4privacy_v2 model
model_name = "finetuned-sg-privacy-model"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

def handle_ai_output(raw_output):
    # Extract the entity and word from the raw output
    entity_group = raw_output['entity_group']  # e.g., "NRIC"
    entity_value = raw_output['word']
    # Format the query to ask why the entity is sensitive
    query = f"Is it allowed to share {entity_group} like '{entity_value}'?"
    # Get the answer from the RAG pipeline
    response = ask_document_question(query)
    # Print the explanation
    print(f"RAG answer: {response}")

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

if __name__ == "__main__":
    my_test_cases = [
        {"text": "My first name is Jane and my last name is Doe."},
        {"text": "Contact me at john.doe@example.com"},
        {"text": "My phone number is 555-123-4567"},
        {"text": "The project codename is Project Lynx."},
        {"text": "The Q2 revenue was $1,200,000."},
        {"text": "Our AWS access key is AKIAIOSFODNN7EXAMPLE."},
        {"text": "Employee SSN: 987-65-4321"},
        {"text": "Passport number K98765432 must be protected."},
        {"text": "The client's FIN is F3268656D."},
        {"text": "Client NRIC is S1234567A."},
        {"text": "Do not paste source code like: def login(user, pwd): return True"},
        {"text": "The client account number is 1234567890."}
    ]
    for i, case in enumerate(my_test_cases, 1):
        results = ner_pipeline(case["text"])
        print(f"\nTest {i}: {case['text']}")
        print("Raw model output:")
        for r in results:
            print(r)
            handle_ai_output(r)
