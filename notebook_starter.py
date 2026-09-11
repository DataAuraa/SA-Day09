"""
DAY 09: GENERATIVE AI & LLM ENGINEERING I
From Generative AI Fundamentals to an AI HR Assistant

Trainer: Be Practical Training Series / Saratha University
Phase: Phase III - Generative AI & LLM Engineering
Topic: LLM Fundamentals, Prompt Engineering & Mini Project AI HR Assistant
"""

import json
import os
import re

# ==============================================================================
# 01. SAMPLE DATASETS (SYNTHETIC RESUMES & JOB SPECIFICATIONS)
# ==============================================================================

# Candidate 1: Rahul Kumar (Data Analyst &bull; 2 yrs)
RESUME_RAHUL = """
Rahul Kumar
B.Tech Computer Science

Skills:
Python, SQL, Pandas, NumPy, Scikit-learn, Machine Learning, Power BI

Experience:
2 years as Data Analyst
"""

# Candidate 2: Priya Sharma (Junior Data Analyst &bull; 1.5 yrs)
RESUME_PRIYA = """
Priya Sharma
MCA

Skills:
Python, SQL, Excel, Pandas, Power BI, Machine Learning

Experience:
1.5 years as Junior Data Analyst
"""

# Candidate 3: Arun Kumar (Cloud Infrastructure & DevOps &bull; 4 yrs)
RESUME_ARUN = """
Arun Kumar
B.Tech Information Technology

Skills:
Python, Docker, Kubernetes, AWS, Terraform, Linux, Git, MySQL, CI/CD

Experience:
4 years as Cloud Infrastructure Engineer
"""

# Candidate 4: Sneha Patel (Full Stack Web Developer &bull; 2 yrs)
RESUME_SNEHA = """
Sneha Patel
B.E. Computer Engineering

Skills:
JavaScript, React, Node.js, HTML/CSS, Tailwind, SQL, Git

Experience:
2 years as Full Stack Web Developer
"""

# Candidate 5: Vikram Verma (Lead AI & LLM Engineer &bull; 5 yrs)
RESUME_VIKRAM = """
Vikram Verma
M.Tech Artificial Intelligence

Skills:
Python, PyTorch, Transformers, LLMs, LangChain, RAG, Machine Learning, Statistics, SQL, Pandas

Experience:
5 years as Lead AI Engineer
"""

# Candidate 6: Neha Rao (Recent CS Graduate &bull; 0 yrs)
RESUME_NEHA = """
Neha Rao
B.Tech Computer Science (Recent Graduate)

Skills:
Python, Machine Learning, C++, SQL, Git

Experience:
0 years (Fresh Graduate - Academic ML Capstone)
"""

# Target Job Roles
JOB_DESCRIPTION_DATA_SCIENTIST = """
Data Scientist

Required Skills:
Python
SQL
Machine Learning
Pandas
Scikit-learn
Statistics
Power BI
"""

JOB_DESCRIPTION_GENAI_ENGINEER = """
AI & LLM Engineer

Required Skills:
Python
PyTorch
Transformers
LLMs
LangChain
RAG
Machine Learning
SQL
"""

JOB_DESCRIPTION_DEVOPS_ENGINEER = """
Cloud DevOps Engineer

Required Skills:
Python
Docker
Kubernetes
AWS
Terraform
Linux
Git
MySQL
"""

JOB_DESCRIPTION_WEB_DEVELOPER = """
Full Stack Web Developer

Required Skills:
JavaScript
React
Node.js
HTML/CSS
Tailwind
SQL
Git
"""

# ==============================================================================
# 02. PYTHON PRACTICAL 1: BASIC PROMPT TEMPLATE (Section 20 & 45)
# ==============================================================================

def basic_prompt_example():
    print("\n--- [Section 20] Basic Prompt Demonstration ---")
    prompt = f"""You are an AI HR Assistant.

Analyze the following resume.

Extract:
1. Candidate name
2. Technical skills
3. Experience
4. Recommended job roles

Do not invent information.

Resume:
{RESUME_RAHUL}
"""
    print(prompt)
    return prompt

# ==============================================================================
# 03. PYTHON PRACTICAL 2: REUSABLE PROMPT GENERATOR (Section 21 & 46)
# ==============================================================================

def create_resume_prompt(resume_text: str, jd_text: str = None) -> str:
    """Generates an Enterprise 5-Part Formula prompt with strict constraints."""
    prompt = f"""You are an AI HR Assistant.

Analyze the candidate resume against the job description.

Candidate Resume:
{resume_text}

Job Description:
{jd_text if jd_text else "General Data Science / Analytics role"}

Tasks:
1. Extract candidate technical skills.
2. Identify matched skills against the job description.
3. Identify missing skills (skill gaps).
4. Recommend suitable job roles.
5. Generate exactly 5 targeted technical interview questions.

Rules & Constraints:
- Use only information explicitly present in the candidate resume.
- Do not invent qualifications or cloud certifications.
- If information is missing, report null or an empty list.
- Do not make the final hiring decision; provide insights for the HR recruiter.

Output Format:
Return ONLY valid JSON with this exact schema:
{{
  "candidate_name": string,
  "technical_skills": list[string],
  "experience_years": number,
  "matched_skills": list[string],
  "missing_skills": list[string],
  "recommended_roles": list[string],
  "interview_questions": list[string]
}}
"""
    return prompt

# ==============================================================================
# 04. PYTHON PRACTICAL 3 & 4: DETERMINISTIC SKILL MATCHING (Sections 22, 23 & 49)
# ==============================================================================

def deterministic_skill_matching(candidate_skills_set: set, required_skills_set: set):
    """
    Computes set intersection & difference deterministically in Python.
    Zero token cost! Connects Python foundations with GenAI workflows.
    """
    print("\n--- [Sections 22 & 23] Deterministic Skill Matching via Python Sets ---")
    
    matched = candidate_skills_set.intersection(required_skills_set)
    missing = required_skills_set.difference(candidate_skills_set)
    
    total_required = len(required_skills_set) if len(required_skills_set) > 0 else 1
    match_percentage = (len(matched) / total_required) * 100.0

    print(f"Candidate Skills ({len(candidate_skills_set)}): {candidate_skills_set}")
    print(f"Required Skills ({len(required_skills_set)}): {required_skills_set}")
    print(f"Matched Skills ({len(matched)}): {matched}")
    print(f"Missing Skills / Gaps ({len(missing)}): {missing}")
    print(f"Match Percentage: {match_percentage:.2f}%")
    print("Note: Match percentage is a baseline overlap indicator, not a final hiring score!")

    return {
        "matched": matched,
        "missing": missing,
        "match_percentage": match_percentage
    }

# ==============================================================================
# 05. GENERIC LLM API CALL PSEUDOCODE / TEMPLATE (Section 25 & 43)
# ==============================================================================

def mock_or_real_llm_call(prompt: str, use_mock: bool = True) -> str:
    """
    Demonstrates standard REST request to an LLM provider (OpenAI, Anthropic, or local Ollama).
    """
    print("\n--- [Section 25] LLM API Call Execution ---")
    
    if use_mock:
        print("[MOCK MODE ACTIVATED] Returning calibrated structured JSON response...")
        return json.dumps({
            "candidate_name": "Rahul Kumar",
            "technical_skills": [
                "Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "Machine Learning", "Power BI"
            ],
            "experience_years": 2,
            "matched_skills": [
                "Python", "SQL", "Pandas", "Scikit-learn", "Machine Learning", "Power BI"
            ],
            "missing_skills": [
                "Statistics"
            ],
            "recommended_roles": [
                "Data Scientist", "Data Analyst"
            ],
            "interview_questions": [
                "Explain the practical difference between supervised and unsupervised learning algorithms.",
                "How do you leverage Pandas and NumPy for vectorizing data cleaning transformations?",
                "What is the mathematical purpose of train-test split and cross-validation in Scikit-learn?",
                "How would you evaluate a classification model suffering from severe class imbalance?",
                "Why is understanding p-values and probability distributions critical when analyzing business metrics?"
            ]
        }, indent=2)

    # Real API Integration (requires: pip install requests)
    import requests
    api_key = os.getenv("LLM_API_KEY", "")
    if not api_key:
        raise ValueError("Please configure your LLM_API_KEY environment variable before making live calls.")
    
    api_url = "https://api.openai.com/v1/chat/completions" # Or Ollama: http://localhost:11434/v1/chat/completions
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a deterministic, evidence-based AI HR Assistant."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2
    }
    response = requests.post(api_url, headers=headers, json=payload)
    return response.json()["choices"][0]["message"]["content"]

# ==============================================================================
# 06. ROBUST JSON PARSING IN PYTHON (Section 54)
# ==============================================================================

def parse_llm_json_response(raw_response_text: str):
    print("\n--- [Section 54] Deserializing JSON into Python Objects ---")
    try:
        data = json.loads(raw_response_text)
        print("Candidate Name :", data.get("candidate_name"))
        print("Technical Skills:", data.get("technical_skills"))
        print("Experience      :", data.get("experience_years"), "years")
        print("Skill Gaps      :", data.get("missing_skills"))
        print("Interview Qs    :", len(data.get("interview_questions", [])), "questions generated")
        return data
    except json.JSONDecodeError as err:
        print(f"ERROR: LLM did not return strict JSON! Details: {err}")
        return None

# ==============================================================================
# MAIN EXECUTION PIPELINE
# ==============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("DAY 09: GENERATIVE AI & LLM ENGINEERING I - STARTER NOTEBOOK")
    print("=" * 70)

    # 1. Inspect Basic Prompt
    basic_prompt_example()

    # 2. Inspect 5-Part Formula Production Prompt
    prod_prompt = create_resume_prompt(RESUME_RAHUL, JOB_DESCRIPTION_DATA_SCIENTIST)
    print("\n[5-Part Formula Enterprise Prompt]:")
    print(prod_prompt[:400] + "\n... [truncated for display]")

    # 3. Deterministic Python Set Math (Rahul Kumar)
    rahul_skills = {"Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "Machine Learning", "Power BI"}
    ds_job_skills = {"Python", "SQL", "Machine Learning", "Pandas", "Scikit-learn", "Statistics", "Power BI"}
    deterministic_skill_matching(rahul_skills, ds_job_skills)

    # 4. Deterministic Python Set Math (Priya Sharma Challenge)
    print("\n[Student Challenge: Candidate Priya Sharma]")
    priya_skills = {"Python", "SQL", "Excel", "Pandas", "Power BI", "Machine Learning"}
    ds_job_skills_priya = {"Python", "SQL", "Machine Learning", "Statistics", "Deep Learning", "TensorFlow", "Pandas"}
    deterministic_skill_matching(priya_skills, ds_job_skills_priya)

    # 5. LLM API Call & Parsing
    raw_json = mock_or_real_llm_call(prod_prompt, use_mock=True)
    parsed = parse_llm_json_response(raw_json)

    print("\n" + "=" * 70)
    print("SUCCESS: Day 09 Pipeline verified and ready for classroom teaching!")
    print("=" * 70)
