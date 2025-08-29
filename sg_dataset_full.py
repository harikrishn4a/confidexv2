import random, re
from typing import List, Dict
from datasets import Dataset, DatasetDict

print("Script started")
random.seed(7)

# Full label set for your ML model
BASE_LABELS = [
    "NRIC","FIN","PASSPORT",
    "API_KEY","ACCESS_TOKEN",
    "SALARY","COMMISSION_RATE","AMOUNT_MONEY","ACCOUNT_BALANCE",
    "BUDGET","INVOICE_ID","PO_NUMBER","FINANCIAL_REPORT","PRICING_TERM",
    "PROJECT_CODE","SOURCE_CODE",
    "EMAIL", "PHONE", "SSN", "CREDIT_CARD", "ACCOUNT_NUMBER", "PERSON", "KEY", "FINANCIAL"
]
LABELS = ["O"] + [f"{p}-{lab}" for lab in BASE_LABELS for p in ("B","I")]
label2id = {lab:i for i,lab in enumerate(LABELS)}
id2label = {i:lab for lab,i in label2id.items()}

def simple_tok(text:str)->List[str]:
    return re.findall(r"sk-[A-Za-z0-9]+|S\$|SGD|\$|\d+%|\d+(?:\.\d+)?[mMkK]?|[A-Za-z]+(?:[-_][A-Za-z0-9]+)*|\d+|[^\s\w]", text)

def find_span(tokens:List[str], span_tokens:List[str])->List[int]:
    for i in range(len(tokens)-len(span_tokens)+1):
        if tokens[i:i+len(span_tokens)]==span_tokens:
            return list(range(i, i+len(span_tokens)))
    return []

def tag(tokens:List[str], span_idxs:List[int], ent:str)->List[str]:
    tags = ["O"]*len(tokens)
    if not span_idxs: return tags
    for j,idx in enumerate(span_idxs):
        tags[idx] = ("B-" if j==0 else "I-")+ent
    return tags

def add_example(examples:List[Dict], text:str, span_text:str, ent:str):
    toks = simple_tok(text)
    span_toks = simple_tok(span_text)
    idxs = find_span(toks, span_toks)
    examples.append({"tokens": toks, "ner_tags": tag(toks, idxs, ent)})

# --- Generators for each label ---
def gen_nric():
    prefix = random.choice(list("STFG"))
    digits = "".join(str(random.randint(0,9)) for _ in range(7))
    suffix = random.choice(list("ABCDEFGHIZJKLMPQRTUWXVY"))
    return f"{prefix}{digits}{suffix}"

def gen_fin():
    digits = "".join(str(random.randint(0,9)) for _ in range(7))
    return f"F{digits}{random.choice(list('ABCDEFGHIZ'))}"

def gen_passport():
    return random.choice(["E12345678","K98765432","T34567891"])

def gen_api_key():
    return 'sk-' + ''.join(random.choices('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=24))

def gen_access_token():
    return "eyJ" + "".join(random.choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-") for _ in range(20))

def gen_money():
    head = random.choice(["S$","SGD","$"])
    val = f"{random.randint(1,5)},{random.randint(100,999)},{random.randint(100,999)}" if random.random()<0.2 else f"{random.randint(100,20000)}"
    if random.random()<0.4: val = f"{val}.{random.randint(0,99):02d}"
    return f"{head}{val}"

def gen_percent():
    return random.choice(["18%","12 %","20%","ten percent","eighteen percent"])

def gen_project():
    return random.choice(["Project LionX","Codename TigerRay","ProjX","PhoenixAlpha"])

def gen_source_snip():
    return random.choice([
        "def login(user, pwd): return True",
        "api_secret = 'xyz789'",
        "token = get_token()"
    ])

def gen_invoice():
    return f"INV-{random.randint(2023,2026)}-{random.randint(0,999999):06d}"

def gen_po():
    return f"PO-{random.randint(10000,999999)}"

def gen_finreport():
    q = random.choice(["Q1","Q2","Q3","Q4"])
    y = random.randint(2023,2026)
    return f"{q} {y} financial report"

def gen_email():
    names = ["john.doe", "jane.smith", "alice.tan", "harikrishnan.nandakumar"]
    domains = ["example.com", "company.sg", "test.org"]
    return f"{random.choice(names)}{random.randint(1,99)}@{random.choice(domains)}"

def gen_phone():
    base = "".join(random.choices("0123456789", k=8))
    return f"{base[:4]}-{base[4:]}"

def gen_ssn():
    return f"{random.randint(100,999)}-{random.randint(10,99)}-{random.randint(1000,9999)}"

def gen_credit_card():
    return " ".join([str(random.randint(1000,9999)) for _ in range(4)])

def gen_account_number():
    return "".join(random.choices("0123456789", k=10))

def gen_person():
    names = ["Jane Doe", "John Smith", "Alice Tan", "Harikrishnan Nandakumar", "Wei Ming", "Siti Nurhaliza"]
    return random.choice(names)

def gen_key():
    return 'key-' + ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=16))

def gen_financial():
    return random.choice(["$1,200,000", "$120,000", "$5,000,000"])

def add_more_person_examples(examples, n=50):
    names = [
        "Jane Doe", "John Smith", "Alice Tan", "Harikrishnan Nandakumar", "Wei Ming", "Siti Nurhaliza",
        "Michael Tan", "Priya Singh", "David Lee", "Nur Aisyah", "Samuel Lim", "Chloe Wong"
    ]
    for _ in range(n):
        name = random.choice(names)
        add_example(examples, f"My name is {name}.", name, "PERSON")
        add_example(examples, f"Contact {name} for more info.", name, "PERSON")
        add_example(examples, f"{name} is the project lead.", name, "PERSON")
        add_example(examples, f"The manager is {name}.", name, "PERSON")
        add_example(examples, f"The employee's name is {name}.", name, "PERSON")
        add_example(examples, f"Please reach out to {name}.", name, "PERSON")
        add_example(examples, f"{name} will attend the meeting.", name, "PERSON")
        add_example(examples, f"The award goes to {name}.", name, "PERSON")
        add_example(examples, f"{name} submitted the report.", name, "PERSON")
        add_example(examples, f"Supervisor: {name}", name, "PERSON")
        # Edge cases
        add_example(examples, f"Name: {name}", name, "PERSON")
        add_example(examples, f"Employee: {name}", name, "PERSON")
        add_example(examples, f"Speaker: {name}", name, "PERSON")
        add_example(examples, f"{name} (HR)", name, "PERSON")
        add_example(examples, f"{name}, our guest.", name, "PERSON")

def add_more_email_examples(examples, n=50):
    names = ["john.doe", "jane.smith", "alice.tan", "harikrishnan.nandakumar"]
    domains = ["example.com", "company.sg", "test.org", "mail.com", "gmail.com"]
    for _ in range(n):
        email = f"{random.choice(names)}{random.randint(1,99)}@{random.choice(domains)}"
        add_example(examples, f"Contact me at {email}", email, "EMAIL")
        obf_email = email.replace("@", " at ").replace(".", " dot ")
        add_example(examples, f"Obfuscated email: {obf_email}", obf_email, "EMAIL")

# Update make_sentences to include more PERSON examples
def make_sentences(n_per_label: int = 10):
    ex = []
    # Existing positive examples for all labels
    for _ in range(n_per_label):
        nric = gen_nric()
        add_example(ex, f"Client NRIC is {nric}.", nric, "NRIC")
        fin = gen_fin()
        add_example(ex, f"The client's FIN is {fin}.", fin, "FIN")
        passport = gen_passport()
        add_example(ex, f"Passport number {passport} must be protected.", passport, "PASSPORT")
        api_key = gen_api_key()
        add_example(ex, f"Here is an API key: {api_key}.", api_key, "API_KEY")
        access_token = gen_access_token()
        add_example(ex, f"Access token {access_token} must not leave secure channels.", access_token, "ACCESS_TOKEN")
        salary = gen_money()
        add_example(ex, f"Salary is {salary}.", salary, "SALARY")
        commission = gen_percent()
        add_example(ex, f"Our commission rate is {commission}.", commission, "COMMISSION_RATE")
        amount = gen_money()
        add_example(ex, f"The amount is {amount}.", amount, "AMOUNT_MONEY")
        balance = gen_money()
        add_example(ex, f"Account balance: {balance}", balance, "ACCOUNT_BALANCE")
        budget = gen_money()
        add_example(ex, f"Budget for FY25 is {budget}.", budget, "BUDGET")
        invoice = gen_invoice()
        add_example(ex, f"Invoice {invoice} should not leave the company.", invoice, "INVOICE_ID")
        po = gen_po()
        add_example(ex, f"PO number: {po}", po, "PO_NUMBER")
        finreport = gen_finreport()
        add_example(ex, f"Please don't share the {finreport}.", finreport, "FINANCIAL_REPORT")
        pricing = gen_money()
        add_example(ex, f"Quote price: {pricing}/user.", f"{pricing}/user", "PRICING_TERM")
        project = gen_project()
        add_example(ex, f"The project codename is {project}.", project, "PROJECT_CODE")
        source = gen_source_snip()
        add_example(ex, f"Do not paste source code like: {source}", source, "SOURCE_CODE")
        email = gen_email()
        add_example(ex, f"Contact me at {email}", email, "EMAIL")
        phone = gen_phone()
        add_example(ex, f"My phone number is {phone}", phone, "PHONE")
        ssn = gen_ssn()
        add_example(ex, f"Employee SSN: {ssn}", ssn, "SSN")
        cc = gen_credit_card()
        add_example(ex, f"Credit card: {cc}", cc, "CREDIT_CARD")
        acc = gen_account_number()
        add_example(ex, f"The client account number is {acc}.", acc, "ACCOUNT_NUMBER")
        person = gen_person()
        add_example(ex, f"My name is {person}.", person, "PERSON")
        key = gen_key()
        add_example(ex, f"Here is a key: {key}", key, "KEY")
        financial = gen_financial()
        add_example(ex, f"The Q2 revenue was {financial}.", financial, "FINANCIAL")
    add_more_person_examples(ex, n=100)
    add_more_email_examples(ex, n=50)
    # Add negatives
    negatives = [
        "Let's schedule a meeting tomorrow at 3pm.",
        "The weather in Singapore is sunny.",
        "Please review the public documentation.",
        "Can we discuss the UI colors?",
        "Reminder: submit your timesheet.",
        "Our product is great.",
        "This is a general statement."
    ]
    for _ in range(n_per_label):
        s = random.choice(negatives)
        ex.append({"tokens": simple_tok(s), "ner_tags": ["O"]*len(simple_tok(s))})
    random.shuffle(ex)
    return ex

def make_pdpa_dataset(n_per_label=10) -> DatasetDict:
    examples = make_sentences(n_per_label=n_per_label)
    n = len(examples)
    train = examples[: int(0.7*n)]
    val   = examples[int(0.7*n): int(0.85*n)]
    test  = examples[int(0.85*n):]
    return DatasetDict({
        "train": Dataset.from_list(train),
        "validation": Dataset.from_list(val),
        "test": Dataset.from_list(test),
    })

if __name__ == "__main__":
    dataset = make_pdpa_dataset(n_per_label=15)
    dataset.save_to_disk("sg_pdpa_ner_dataset_full")
    print("Full dataset saved to sg_pdpa_ner_dataset_full")
