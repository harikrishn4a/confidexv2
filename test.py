from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

model_name = "finetuned-sg-privacy-model"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

text = "Send the $50,000 report to alice@example.com with a 10% commission"
entities = ner_pipeline(text)
print("Detected entities:", entities)