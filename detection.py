from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

# Use the base Isotonic/distilbert_finetuned_ai4privacy_v2 model for evaluation
model_name = "Isotonic/distilbert_finetuned_ai4privacy_v2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

def detect_sensitive_spans(text):
    results = ner_pipeline(text)
    return results

import re

def regex_pii(text):
    patterns = {
        "EMAIL": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
        "PHONE": r"\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b",
        "CREDIT_CARD": r"\b(?:\d[ -]*?){13,16}\b",
        # Add more as needed
    }
    matches = []
    for label, pattern in patterns.items():
        for match in re.finditer(pattern, text):
            matches.append({
                "entity_group": label,
                "score": 1.0,
                "word": match.group(),
                "start": match.start(),
                "end": match.end()
            })
    return matches

def get_all_sensitive_spans(text):
    model_spans = detect_sensitive_spans(text)
    regex_spans = regex_pii(text)
    return model_spans + regex_spans

def explain_span_with_policy(span, ask_document_question):
    # ask_document_question is your RAG function
    question = f"Is it allowed to share {span['entity_group']} like '{span['word']}'?"
    answer = ask_document_question(question)
    return {
        "span": span,
        "policy_explanation": answer
    }

if __name__ == "__main__":
    test_inputs = [
        "My email is alice@example.com and my SSN is 123-45-6789.",
        "Call me at 555-123-4567 or use my credit card 4111 1111 1111 1111.",
        "Here is an API key: sk-abcdef1234567890",
        "No sensitive info here!"
    ]

    for i, text in enumerate(test_inputs, 1):
        print(f"\nTest {i}: {text}")
        spans = get_all_sensitive_spans(text)
        if not spans:
            print("No sensitive information detected.")
        else:
            for span in spans:
                print(f"  Detected: {span['word']} ({span['entity_group']}) [score: {span['score']:.2f}]")

    # Model-only evaluation
    test_cases = [
        {
            "text": "My email is alice@example.com and my SSN is 123-45-6789.",
            "expected": [
                {"entity_group": "EMAIL", "word": "alice@example.com"},
                {"entity_group": "SSN", "word": "123-45-6789"}
            ]
        },
        {
            "text": "Call me at 555-123-4567.",
            "expected": [
                {"entity_group": "PHONE", "word": "555-123-4567"}
            ]
        },
        {
            "text": "No sensitive info here!",
            "expected": []
        }
    ]

    total = 0
    correct = 0
    for i, case in enumerate(test_cases, 1):
        print(f"\nTest {i}: {case['text']}")
        detected = detect_sensitive_spans(case["text"])
        detected_set = set((d['entity_group'], d['word']) for d in detected)
        expected_set = set((e['entity_group'], e['word']) for e in case["expected"])
        print("Detected:", detected_set)
        print("Expected:", expected_set)
        match = detected_set & expected_set
        print(f"Matched: {match}")
        correct += len(match)
        total += len(expected_set)
    if total > 0:
        print(f"\nModel-only Accuracy: {correct}/{total} ({(correct/total)*100:.2f}%)")
    else:
        print("\nNo expected entities to evaluate.")
