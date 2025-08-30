# CONFIDEX - Privacy Monitoring System

A comprehensive privacy monitoring system that uses AI to detect and prevent sensitive data leaks in real-time chat applications.

## 🏗️ Architecture

- **Frontend**: React chat interface with privacy monitoring
- **Backend API**: FastAPI server with fine-tuned NER model and RAG system
- **Dashboard**: Real-time monitoring dashboard for privacy violations
- **AI Models**: Fine-tuned DistilBERT for NER + RAG with policy documents

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- Ollama (for LLM inference)
- 8GB+ RAM (for ML models)

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies

```bash
# Frontend
cd frontend
npm install

# Dashboard
cd apps/dashboard
npm install

# Dashboard Backend
cd apps/dashboard/backend
npm install
```

### 3. Setup Ollama

```bash
# Install Ollama (https://ollama.ai)
ollama pull llama3.1
```

### 4. Start the Services

#### Terminal 1: Backend API
```bash
cd /path/to/project
uvicorn backend_api:app --host 0.0.0.0 --port 8000 --reload
```

#### Terminal 2: Dashboard Backend
```bash
cd apps/dashboard/backend
npm start
```

#### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```

#### Terminal 4: Dashboard
```bash
cd apps/dashboard
npm run dev
```

### 5. Access the Applications

- **Frontend**: http://localhost:5173
- **Dashboard**: http://localhost:5174
- **Backend API**: http://localhost:8000
- **Dashboard Backend**: http://localhost:5000

## �� Configuration

### Environment Variables

Create `.env` file in the root directory:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434

# Database Configuration
DB_PATH=sensitive_data_log.db

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

### Model Configuration

The system uses:
- **Fine-tuned NER Model**: `finetuned-sg-privacy-model/` (already included)
- **RAG System**: Uses `policy4.pdf` for policy compliance
- **LLM**: Ollama with llama3.1 model

## 📊 Features

### Frontend
- Real-time chat interface
- Privacy monitoring toggle
- Live privacy analysis sidebar
- Block/allow decisions based on AI analysis

### Backend
- NER-based sensitive data detection
- RAG-powered policy compliance checking
- Real-time logging of violations
- RESTful API endpoints

### Dashboard
- Real-time violation monitoring
- Data type risk assessment
- Usage analytics
- Alert management

## 🔍 How It Works

1. **Input Processing**: User types in chat interface
2. **Privacy Check**: If monitoring is enabled, text is sent to backend
3. **NER Analysis**: Fine-tuned model detects sensitive entities
4. **Policy Check**: RAG system checks against policy documents
5. **Decision**: System decides to block or allow the message
6. **Logging**: All violations are logged to database
7. **Dashboard**: Real-time updates show violations and trends

## 🛠️ Development

### Training the Model

```bash
# Generate augmented training data
python augment_training.py

# Fine-tune the model
python finetune_sg_ner.py
```

### Testing

```bash
# Test the RAG system
python rag.py

# Test the backend API
curl -X POST http://localhost:8000/scan \
  -H "Content-Type: application/json" \
  -d '{"text": "My salary is $50,000"}'
```

## 📁 Project Structure
confidexv2/
├── frontend/ # React chat interface
├── apps/dashboard/ # React dashboard
│ ├── backend/ # Dashboard backend (Node.js)
│ └── src/ # Dashboard frontend
├── finetuned-sg-privacy-model/ # Fine-tuned NER model
├── backend_api.py # FastAPI backend
├── rag.py # RAG system
├── finetune_sg_ner.py # Model training
├── augment_training.py # Data augmentation
└── policy4.pdf # Policy document


## 🚨 Troubleshooting

### Common Issues

1. **Ollama not running**
   ```bash
   ollama serve
   ```

2. **Model loading errors**
   - Ensure `finetuned-sg-privacy-model/` directory exists
   - Check model files are complete

3. **Port conflicts**
   - Change ports in respective config files
   - Update proxy settings in `frontend/vite.config.ts`

4. **Database errors**
   - Ensure SQLite is installed
   - Check file permissions for `sensitive_data_log.db`

### Performance Optimization

- Use GPU acceleration for model inference
- Increase batch sizes for better throughput
- Optimize database queries for large datasets

## 📈 Monitoring

The dashboard provides:
- Real-time violation counts
- Data type risk scores
- Usage trends
- Alert management
- Export capabilities

## 🔒 Security

- All sensitive data is processed locally
- No data is sent to external services
- Database is encrypted and secured
- API endpoints are protected with CORS

## 📝 License

This project is for hackathon demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This is an MVP hackathon project. For production use, additional security measures, error handling, and scalability improvements would be needed.
