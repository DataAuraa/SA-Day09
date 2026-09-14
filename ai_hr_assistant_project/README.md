# AI HR Assistant & Resume Screener (Production Sample Project)

**Institution:** Saratha University / Be Practical Training  
**Curriculum Module:** Day 09: Generative AI & LLM Engineering I  
**Session Title:** *Generative AI & LLM Fundamentals: From Prompt Engineering to an AI HR Assistant*  
**Architecture:** Hybrid Deterministic NLP + Generative AI Few-Shot Calibration Microservice  

---

## 📌 Executive Project Overview

The **AI HR Assistant & Resume Screener** is an end-to-end enterprise-grade talent evaluation system designed to solve high-volume recruitment bottlenecks. It combines:
1. **Deterministic Skill & Experience Math**: Rapid, reproducible Jaccard similarity and tenure delta scoring that satisfies corporate compliance and Fair Hiring guidelines.
2. **Generative AI Few-Shot Prompt Calibration**: Structured JSON output generation for candidate executive summaries, transparent decision rationales, and customized **STAR-method** technical interview questions.
3. **Responsible AI Guardrails**: Anti-hallucination verification engine that flags any fabricated AI assertions not corroborated by the candidate's source resume.

---

## 📁 Project Directory Structure

```text
ai_hr_assistant_project/
├── config.py                 # Environment variables, model configs, and scoring weights
├── models.py                 # Pydantic v2 data contracts and response schemas
├── engine.py                 # Core deterministic scoring, NLP tokenization & STAR question generator
├── main.py                   # FastAPI production microservice with OpenAPI Swagger docs
├── cli.py                    # Standalone interactive terminal CLI tool with cohort ranking
├── web_app.py                # Standalone interactive browser web console
├── requirements.txt          # Python dependencies
├── Dockerfile                # Multi-stage production container build
├── docker-compose.yml        # Docker Compose orchestration with health checks
├── sample_data/
│   ├── resumes.json          # 6 realistic engineering candidate profiles
│   └── jobs.json             # 4 target job descriptions (Data Scientist, AI/LLM, DevOps, Web)
└── tests/
    └── test_screening_engine.py  # Comprehensive Pytest test suite (100% passing)
```

---

## 🚀 Quick Start Guide

### 1. Run the Terminal CLI Demo
To run the automated candidate evaluation and ranking demo right in your terminal:
```bash
python cli.py --demo
```
To evaluate a specific candidate against a specific job role:
```bash
python cli.py --candidate cand_01 --job job_ds
```

### 2. Launch the FastAPI Microservice & Swagger UI
Start the high-throughput REST API:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
* **Interactive OpenAPI Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Technical Specification:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Health Check Endpoint:** [http://localhost:8000/health](http://localhost:8000/health)

### 3. Launch the Interactive Web Console
To launch the browser-based dashboard:
```bash
python web_app.py
```
Open **`http://127.0.0.1:8080`** in any browser to select candidates, view match score gauges, inspect matched/missing skill pills, and generate STAR interview questions.

---

## 📡 Core API Endpoints

### 1. Health Check
* **Route:** `GET /health`
* **Response:**
  ```json
  {
    "status": "healthy",
    "service": "AI HR Assistant & Resume Screener",
    "version": "1.0.0",
    "timestamp": "2026-09-14T12:30:00Z"
  }
  ```

### 2. Screen Single Candidate
* **Route:** `POST /api/v1/screen`
* **Request:**
  ```json
  {
    "candidate": {
      "id": "cand_01",
      "name": "Rahul Kumar",
      "title": "Data Analyst",
      "education": "B.Tech Computer Science",
      "experience_years": 2.0,
      "skills": ["Python", "SQL", "Pandas", "Scikit-learn", "Machine Learning"]
    },
    "job": {
      "id": "job_ds",
      "title": "Data Scientist",
      "department": "Analytics",
      "min_experience_years": 2.0,
      "required_skills": ["Python", "SQL", "Machine Learning", "Pandas", "Scikit-learn", "Statistics"]
    },
    "include_ai_rationale": true
  }
  ```
* **Response:**
  ```json
  {
    "candidate_id": "cand_01",
    "candidate_name": "Rahul Kumar",
    "job_id": "job_ds",
    "job_title": "Data Scientist",
    "match_score": 82.5,
    "decision": "Shortlist for Interview",
    "matched_required_skills": ["Python", "SQL", "Machine Learning", "Pandas", "Scikit-learn"],
    "missing_required_skills": ["Statistics"],
    "experience_gap_years": 0.0,
    "latency_ms": 12.8
  }
  ```

### 3. Batch Screen & Rank Cohort
* **Route:** `POST /api/v1/batch-screen`
* Evaluates all candidates in an applicant pool and returns a sorted leaderboard ranked by match score.

### 4. Hallucination & Groundedness Audit
* **Route:** `POST /api/v1/audit-hallucination`
* **Request:**
  ```json
  {
    "resume_text": "Rahul Kumar is a Data Analyst with 2 years of experience in Python, SQL, and Power BI.",
    "ai_generated_claim": "Candidate led deep reinforcement learning robotics development at Google."
  }
  ```
* **Response:**
  ```json
  {
    "claim": "Candidate led deep reinforcement learning robotics development at Google.",
    "is_grounded": false,
    "verdict": "HALLUCINATION_DETECTED",
    "explanation": "Ungrounded claim: 'reinforcement, learning, robotics, google' does not appear anywhere in the source resume.",
    "confidence": 0.92
  }
  ```

---

## 🧪 Automated Testing

Execute the complete test suite using pytest:
```bash
python -m pytest tests/test_screening_engine.py -v
```
All 7 unit and integration tests test skill normalization, overlap computation, experience penalties, cohort ranking, and hallucination guardrails.

---

## 🐳 Docker Deployment

To build and launch the containerized microservice:
```bash
docker-compose up --build -d
```
Verify container health:
```bash
curl -f http://localhost:8000/health
```
