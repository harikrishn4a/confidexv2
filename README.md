# Confidexv2

> **Problem Statement 7**
>
> As AI technologies rapidly integrate into our daily lives, concerns about privacy and security have become more urgent than ever. With the rise of powerful generative AI models, large-scale data collection, and cloud-based deployment, users face increasing risks: sensitive data leakage, identity theft, etc.
>
> This hackathon invites participants to explore solutions in the following areas:
> - Enhancing the privacy of AI systems themselves (Privacy of AI); and/or
> - Using AI to defend user privacy and security (AI for Privacy).

A privacy AI monitoring interface for detecting and handling sensitive information in text using NER models.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/harikrishn4a/confidexv2.git
cd confidexv2
```

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Install Node.js dependencies (for frontend)
```bash
cd frontend
npm install
```

### 3. Install Node.js dependencies (for dashboard)
```bash
cd apps/dashboard
npm install
```

### 3. Install Node.js dependencies (for backend)
```bash
cd backend
npm install
```

---

## 🧪 Testing

### Test the RAG system
```bash
python rag.py
```

### Test the dashboard feature
Run the Node.js server
```bash
cd backend
node server.js
```
Launch the dashboard web application
```bash
cd apps/dashboard
npm run dev
```

---

## 📁 Project Structure

```
confidexv2/
│
├── apps/
│   └── dashboard/           # Frontend dashboard app (React, TypeScript)
│       └── src/             # Frontend source code (components, hooks, services)
├── backend/                 # Backend for dashboard (Node)
├── augmented_training/      # Augmented training data and metadata
├── modelv1/                 # Fine-tuned NER model (Hugging Face format)
├── robust_testset/          # Robust synthetic test set for evaluation
├── super_robust_testset/    # Extra-robust test set for evaluation
│
├── sg_pdpa_ner_dataset_full/ # Full NER dataset (train/val/test splits)
├── testdata1/               # Additional test dataset 1
├── testdata2/               # Additional test dataset 2
│
├── backend_api.py           # FastAPI backend for NER and privacy API
├── sg_dataset_full.py       # Script to generate synthetic NER datasets
├── finetune_sg_ner.py       # Script to fine-tune NER model
├── requirements.txt         # Python dependencies
├── package.json             # Node.js dependencies (frontend/backend)
├── .gitignore               # Git ignore rules
├── .gitattributes           # Git LFS tracking rules
└── README.md                # Project documentation (this file)
```

---

## 🤗 Check Out the Trained Model

You can view and use the trained model directly on Hugging Face:

[**hkrishn4a/modelv1 on Hugging Face Hub**](https://huggingface.co/hkrishn4a/modelv1)

[![Hugging Face](https://img.shields.io/badge/HuggingFace-modelv1-yellow?logo=huggingface)](https://huggingface.co/hkrishn4a/modelv1)

---

## 🎬 CONFIDEX Demo Video

[![Watch the demo](https://img.youtube.com/vi/PCxaYwXkVMU/hqdefault.jpg)](https://youtu.be/PCxaYwXkVMU)

---

## 🛠️ Troubleshooting

### Common Issues

**1. Ollama not running**
```bash
ollama serve
```

**2. Model loading errors**
- Ensure `modelv1/` directory exists

---

## 📄 License

[MIT](LICENSE) (or your chosen license)

---

## 🙋‍♂️ Contact

For questions or support, open an issue or contact [harikrishn4a](https://github.com/harikrishn4a).
