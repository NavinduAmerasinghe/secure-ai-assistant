# Secure AI Programming Assistant for Vulnerability Detection and Secure Code Guidance

## Overview
This project is a secure web-based application that allows developers to upload or paste source code, scan it for vulnerabilities, and receive AI-assisted secure coding guidance using retrieval-augmented generation (RAG).

## Tech Stack
- Frontend: React (Vite)
- Backend: FastAPI
- Authentication: JWT
- Security Scanning: Semgrep, Bandit, secret detection
- AI/RAG: LangChain + Vector Database + OpenAI API
- Database: SQLite / PostgreSQL
- DevSecOps: GitHub Actions or Jenkins

## Project Structure
- `frontend/` - React frontend
- `backend/` - FastAPI backend
- `docs/` - project documentation
- `.github/workflows/` - CI/CD workflows

## Setup
### Backend
```bash
cd backend
python -m venv venv
# activate venv
pip install -r requirements.txt
uvicorn app.main:app --reload