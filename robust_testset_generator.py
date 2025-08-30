import random
from datasets import load_from_disk, Dataset
from sg_dataset_full import simple_tok

# Load original train/val sets
orig = load_from_disk("sg_pdpa_ner_dataset_full")
orig_train = set(tuple(ex["tokens"]) for ex in orig["train"])
orig_val = set(tuple(ex["tokens"]) for ex in orig["validation"])
orig_all = orig_train | orig_val

# New, more diverse templates
new_templates = [
    "Please send the {label} to HR immediately.",
    "The {label} is required for verification.",
    "Can you confirm your {label}?",
    "For security, do not share your {label} with anyone.",
    "The following {label} was detected: {value}.",
    "Is this your {label}: {value}?",
    "We need your {label} for the next step.",
    "Your {label} ({value}) has been updated.",
    "Contact support if your {label} is compromised.",
    "The {label} should be kept confidential."
]

# Expanded example entity values for all model labels
entity_examples = {
    "NRIC": ["S1234567A", "T7654321B", "F2345678C", "G9876543D"],
    "FIN": ["F1234567N", "G7654321Q", "F7654321Z", "G1234567X"],
    "PASSPORT": ["E12345678", "K98765432", "T34567891", "A11223344"],
    "API_KEY": ["sk-abcdef1234567890abcdef12", "sk-xyz9876543210abcd1234", "sk-1234abcd5678efgh9012", "sk-zyxw9876vuts5432"],
    "ACCESS_TOKEN": ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9", "eyJraWQiOiJrZXlJZCIsImFsZyI6IlJTMjU2"],
    "SALARY": ["S$5000", "SGD 7000", "$8000", "S$12000.00"],
    "COMMISSION_RATE": ["10%", "15%", "20%", "12 %"],
    "BUDGET": ["$10000", "SGD 20000", "S$15000", "$25000.00"],
    "INVOICE_ID": ["INV-2024-000123", "INV-2023-654321", "INV-2025-111222", "INV-2022-333444"],
    "PO_NUMBER": ["PO-123456", "PO-654321", "PO-789012", "PO-345678"],
    "FINANCIAL_REPORT": ["Q1 2024 financial report", "Q2 2023 financial report", "Q3 2022 financial report", "Q4 2021 financial report"],
    "PRICING_TERM": ["$100/user", "$200 per license", "SGD 150 per seat", "$99/month"],
    "PROJECT_CODE": ["Project LionX", "Codename TigerRay", "ProjX", "PhoenixAlpha"],
    "SOURCE_CODE": ["def login(user, pwd): return True", "api_secret = 'xyz789'", "token = get_token()", "function foo() { return 42; }"],
    "EMAIL": ["test.user@example.com", "alice.tan@company.sg", "john.doe@mail.com", "jane.smith@gmail.com"],
    "PHONE": ["9123-4567", "8123-9876", "6123-1234", "7000-0000"],
    "SSN": ["123-45-6789", "987-65-4321", "111-22-3333", "222-33-4444"],
    "CREDIT_CARD": ["1234 5678 9012 3456", "4321 8765 2109 6543", "1111 2222 3333 4444", "5555 6666 7777 8888"],
    "ACCOUNT_NUMBER": ["1234567890", "9876543210", "1122334455", "5566778899"],
    "PERSON": ["John Smith", "Jane Doe", "Alice Tan", "Harikrishnan Nandakumar"],
    "KEY": ["key-abcdef1234567890", "key-1234abcd5678efgh", "key-zyxw9876vuts5432", "key-1122aabb3344ccdd"],
    "FINANCIAL": ["$1,000,000", "$120,000", "$5,000,000", "$250,000"]
}

# Helper to robustly find value span in tokenized template
def find_span(tokens, value_tokens):
    for i in range(len(tokens) - len(value_tokens) + 1):
        if tokens[i:i+len(value_tokens)] == value_tokens:
            return list(range(i, i+len(value_tokens)))
    return []

def make_robust_examples(n_per_label=10):
    ex = []
    for label, values in entity_examples.items():
        for _ in range(n_per_label):
            value = random.choice(values)
            template = random.choice(new_templates)
            # Place value in template if needed
            if "{value}" in template:
                text = template.format(label=label, value=value)
            else:
                text = template.format(label=label)
                # If value not in template, append it
                text += f" {value}"
            tokens = simple_tok(text)
            value_tokens = simple_tok(value)
            span = find_span(tokens, value_tokens)
            if not span:
                continue  # Skip if value tokens not found as contiguous span
            ner_tags = ["O"] * len(tokens)
            for i, idx in enumerate(span):
                ner_tags[idx] = "B-" + label if i == 0 else "I-" + label
            ex.append({"tokens": tokens, "ner_tags": ner_tags})
    return ex

# Generate and filter
random.seed(2024)
robust_examples = make_robust_examples(n_per_label=20)
filtered = [ex for ex in robust_examples if tuple(ex["tokens"]) not in orig_all]

print(f"Generated {len(robust_examples)} new examples, {len(filtered)} are unique (not in train/val).")

# Save as a new test set
if filtered:
    test_dataset = Dataset.from_list(filtered)
    test_dataset.save_to_disk("super_robust_testset")
    print("Saved robust test set to 'super_robust_testset'")
else:
    print("No unique examples to save.")