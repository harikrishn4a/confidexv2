import random
import re
from typing import List, Dict

random.seed(42)

# Entity generators
EMAILS = [
    "jameskin@gmail.com", "alice.tan99@example.com", "john.doe@example.com", "bob@company.sg"
]
BUDGETS = [
    "S$50,000", "$30,000", "SGD 100,000", "$75,000", "S$120,000", "$5,000"
]
COMM_RATES = [
    "ten percent", "10%", "12 percent", "8%", "15%", "twenty percent"
]

# Simple tokenizer
def simple_tok(text: str) -> List[str]:
    return re.findall(r"sk-[A-Za-z0-9]+|S\$|SGD|\$|\d+%|\d+(?:\.\d+)?[mMkK]?|[A-Za-z]+(?:[-_][A-Za-z0-9]+)*|\d+|[^\s\w]", text)

def find_span(tokens: List[str], span_tokens: List[str]) -> List[int]:
    for i in range(len(tokens) - len(span_tokens) + 1):
        if tokens[i:i+len(span_tokens)] == span_tokens:
            return list(range(i, i+len(span_tokens)))
    return []

def tag(tokens: List[str], span_idxs: List[int], ent: str) -> List[str]:
    tags = ["O"] * len(tokens)
    if not span_idxs:
        return tags
    for j, idx in enumerate(span_idxs):
        tags[idx] = ("B-" if j == 0 else "I-") + ent
    return tags

def add_example(examples: List[Dict], text: str, spans: List[Dict]):
    toks = simple_tok(text)
    tags = ["O"] * len(toks)
    for span in spans:
        span_toks = simple_tok(span["text"])
        idxs = find_span(toks, span_toks)
        tags = [t if t != "O" else tag for t, tag in zip(tags, tag(toks, idxs, span["label"]))]
    examples.append({"tokens": toks, "ner_tags": tags})

examples = []

for _ in range(50):
    budget = random.choice(BUDGETS)
    comm = random.choice(COMM_RATES)
    email = random.choice(EMAILS)
    # Example 1
    text1 = f"Our Q1 budget is {budget} and commission rate is {comm}. Contact: {email}"
    spans1 = [
        {"text": budget, "label": "BUDGET"},
        {"text": comm, "label": "COMMISSION_RATE"},
        {"text": email, "label": "EMAIL"}
    ]
    add_example(examples, text1, spans1)
    # Example 2
    text2 = f"Commission rate: {comm}. Budget: {budget}. Email: {email}"
    spans2 = [
        {"text": comm, "label": "COMMISSION_RATE"},
        {"text": budget, "label": "BUDGET"},
        {"text": email, "label": "EMAIL"}
    ]
    add_example(examples, text2, spans2)
    # Example 3
    text3 = f"The budget for this project is {budget} with a commission rate of {comm}. Please email {email} for details."
    spans3 = [
        {"text": budget, "label": "BUDGET"},
        {"text": comm, "label": "COMMISSION_RATE"},
        {"text": email, "label": "EMAIL"}
    ]
    add_example(examples, text3, spans3)
    # Example 4
    text4 = f"We have a {budget} budget and a commission rate of {comm}. Send the report to {email}"
    spans4 = [
        {"text": budget, "label": "BUDGET"},
        {"text": comm, "label": "COMMISSION_RATE"},
        {"text": email, "label": "EMAIL"}
    ]
    add_example(examples, text4, spans4)

# Print a few examples
for ex in examples[:5]:
    print(ex)

# Optionally, save to disk as a HuggingFace dataset
from datasets import Dataset
Dataset.from_list(examples).save_to_disk("augmented_training")
