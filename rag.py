import os
import re
import sqlite3
from datetime import datetime
from pypdf import PdfReader
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()

DB_PATH = "sensitive_data_log.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS flagged_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_type TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    last_flagged TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")
conn.commit()
conn.close()

def log_flagged_data(data_type: str):
    """Logs the sensitive data attempt in the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT count FROM flagged_data WHERE data_type = ?", (data_type,))
    result = cursor.fetchone()
    
    if result:
        new_count = result[0] + 1
        cursor.execute("""
            UPDATE flagged_data
            SET count = ?, last_flagged = CURRENT_TIMESTAMP
            WHERE data_type = ?
        """, (new_count, data_type))
    else:
        cursor.execute("INSERT INTO flagged_data (data_type) VALUES (?)", (data_type,))
    
    conn.commit()
    conn.close()

#read pdf 
PDF_PATH = "policy4.pdf"
pdf_reader = PdfReader(PDF_PATH)

raw_text = ""
for page in pdf_reader.pages:
    page_text = page.extract_text()
    raw_text += page_text

#clean text
def clean_extracted_text(text: str) -> str:
    cleaned = re.sub(r'\s+', ' ', text)
    cleaned = re.sub(r'[\x00-\x1F\x7F]', '', cleaned)
    return cleaned.strip()

document_text = clean_extracted_text(raw_text)

#split text into chunks
chunk_size = 1000
chunk_overlap = 200

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=chunk_size,
    chunk_overlap=chunk_overlap,
    length_function=len,
    separators=["\n\n", "\n", ". ", " ", ""]
)
text_chunks = text_splitter.split_text(document_text)

#embedding
embedding_model = OllamaEmbeddings(model="llama3.1")

documents = []
for i, chunk in enumerate(text_chunks):
    doc = Document(
        page_content=chunk,
        metadata={
            "chunk_id": i,
            "chunk_length": len(chunk),
            "source": "pdf_document"
        }
    )
    documents.append(doc)

#vector store
vector_store = FAISS.from_documents(
    documents=documents,
    embedding=embedding_model
)

#retriever
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

#llm model 
llm = OllamaLLM(
    model="llama3.1",
    temperature=0.0
)

system_prompt = """
You are a compliance assistant for business employees handling sensitive company and customer data. Your job is to explain, using only the provided policy context, whether sharing a specific piece of information is allowed, and why.

Rules:
1. Only answer about the specific data type or example in the question (e.g., PASSPORT). Do not mention other clauses or data types unless the policy explicitly links them.
2. Be clear, specific, and concise.
3. Do not output your thinking process, only output the answer which is "Clause [clause_number]: [reason/explanation]"
4. Format: "Clause [clause_number]: [reason/explanation]"

Context:
{context}

Example of expected output:
Question: "Why is PASSPORT like 'K98765432' sensitive?"
Answer: "Clause 5.1: Passport numbers are considered personal data and require consent for disclosure."

Question: {input}
Answer based on the context above:
"""
prompt_template = ChatPromptTemplate.from_template(system_prompt)


rag_chain = (
    {
        "context": retriever | format_docs,
        "input": RunnablePassthrough()
    }
    | prompt_template
    | llm
    | StrOutputParser()
)

sensitive_terms = [
    "NRIC", "FIN", "PASSPORT",  # Personal Identifiers
    "API_KEY", "ACCESS_TOKEN",   # Authentication & Access Credentials
    "SALARY", "COMMISSION_RATE", "AMOUNT_MONEY", "ACCOUNT_BALANCE",  # Financial Data
    "BUDGET", "INVOICE_ID", "PO_NUMBER", "FINANCIAL_REPORT", "PRICING_TERM",  # Business Confidential Information
    "PROJECT_CODE", "SOURCE_CODE",  # Intellectual Property
    "EMAIL", "PHONE", "SSN", "CREDIT_CARD", "ACCOUNT_NUMBER", "PERSON", "KEY", "FINANCIAL"  # Additional Sensitive Data
]


#query function 
def ask_document_question(question: str):
    for term in sensitive_terms:
        if term.lower() in question.lower():
            log_flagged_data(term)
    
    # Get answer from RAG
    response = rag_chain.invoke(question)
    return response


if __name__ == "__main__":
    print("PDF RAG system loaded. Ask your question about sensitive data!")
    while True:
        user_question = input("\nEnter your question (or type 'exit' to quit): ")
        if user_question.strip().lower() == "exit":
            print("Exiting. Goodbye!")
            break
        answer = ask_document_question(user_question)
        print("\nAnswer:", answer)