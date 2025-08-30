from transformers import AutoModelForTokenClassification, AutoTokenizer

model_dir = "modelv1"  # your model directory
repo_name = "hkrishn4a/modelv1"  # your Hugging Face username/repo

# Load model and tokenizer
model = AutoModelForTokenClassification.from_pretrained(model_dir)
tokenizer = AutoTokenizer.from_pretrained(model_dir)

# Push to Hugging Face Hub
model.push_to_hub(repo_name)
tokenizer.push_to_hub(repo_name)