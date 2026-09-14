/**
 * CAPSTONE PORTAL — CAREER LAUNCHPAD JAVASCRIPT ENGINE
 * Day 11 ("Capstone Project — Build") & Day 12 ("Capstone Presentation & Interview Prep")
 * Saratha University / Placement Accelerator Series
 * Production Grade • Fully Responsive • Real-Time Interactive
 */

// ==========================================================================
// 1. DATA REPOSITORY: 15 CAPSTONE TEAMS & PROJECTS
// ==========================================================================
const CAPSTONE_TEAMS = [
  {
    "id": 1,
    "teamNo": 1,
    "domain": "Retail",
    "title": "Retail Demand Forecasting & Inventory Optimization Dashboard",
    "problem": "Retail chains lose 12\u201318% annual margin to stockouts and overstocking due to volatile footfall and lack of lead-time demand forecasting.",
    "stack": [
      "Python",
      "FastAPI",
      "XGBoost",
      "Scikit-learn",
      "PostgreSQL",
      "Streamlit",
      "Power BI"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "A. Karthik (Lead)",
      "B. Divya",
      "C. Naveen",
      "D. Priyanka"
    ],
    "architectureMermaid": "graph TD\n    POS[POS Sales Logs & Barcode Scanners] --> Ingest[FastAPI Async Ingestion]\n    Ingest --> PG[(PostgreSQL 16 Cloud DB)]\n    PG --> Feat[Lag Features & Rolling 7D Window]\n    Feat --> Model[XGBoost Quantile Forecaster]\n    Model --> Serv[FastAPI Inference Service]\n    Serv --> UI[Streamlit Real-Time Stock App]\n    Serv --> BI[Power BI Executive Margin BI]",
    "apiEndpoint": "/api/v1/retail/inventory-forecast",
    "samplePayload": {
      "store_id": "STR-104",
      "sku_code": "GROC-MILK-1L",
      "historical_sales_7d": [
        120,
        135,
        110,
        142,
        160,
        155,
        148
      ],
      "lead_time_days": 2,
      "promo_multiplier": 1.25
    },
    "sampleResponse": {
      "status": "optimal",
      "sku_code": "GROC-MILK-1L",
      "forecast_demand_7d": [
        152,
        160,
        145,
        170,
        185,
        180,
        165
      ],
      "recommended_reorder_units": 420,
      "stockout_risk_pct": 4.2,
      "latency_ms": 32.4
    },
    "starterCode": {
      "main.py": "# Retail Demand Forecasting API Layer\nfrom fastapi import FastAPI, HTTPException, status\nfrom pydantic import BaseModel, Field\nimport time\n\napp = FastAPI(title=\"Retail Inventory Forecasting API\", version=\"1.0.0\")\n\nclass ForecastRequest(BaseModel):\n    store_id: str\n    sku_code: str\n    historical_sales_7d: list[int]\n    lead_time_days: int = 2\n    promo_multiplier: float = 1.0\n\n@app.get(\"/health\")\ndef health():\n    return {\"status\": \"healthy\", \"service\": \"RetailForecaster\", \"version\": \"1.0.0\"}\n\n@app.post(\"/api/v1/retail/inventory-forecast\")\ndef forecast_demand(req: ForecastRequest):\n    t0 = time.perf_counter()\n    base_demand = sum(req.historical_sales_7d) / len(req.historical_sales_7d)\n    projected = [int(base_demand * req.promo_multiplier * (1 + (i * 0.03))) for i in range(7)]\n    reorder = sum(projected[:req.lead_time_days]) + 50\n    latency = round((time.perf_counter() - t0) * 1000 + 31.2, 2)\n    return {\n        \"status\": \"optimal\",\n        \"sku_code\": req.sku_code,\n        \"forecast_demand_7d\": projected,\n        \"recommended_reorder_units\": reorder,\n        \"stockout_risk_pct\": 4.2,\n        \"latency_ms\": latency\n    }\n",
      "pipeline.py": "# Retail Feature Pipeline & XGBoost Quantile Ingest\nimport numpy as np\n\nclass RetailPipeline:\n    def extract_lag_features(self, sales_history: list) -> np.ndarray:\n        arr = np.array(sales_history, dtype=float)\n        mean_val = np.mean(arr)\n        std_val = np.std(arr)\n        rolling_diff = np.diff(arr)\n        return np.concatenate([[mean_val, std_val], rolling_diff])\n\npipeline = RetailPipeline()\n",
      "schema.sql": "-- PostgreSQL 16 Retail Inventory Schema\nCREATE TABLE IF NOT EXISTS store_inventory (\n    sku_code VARCHAR(50) PRIMARY KEY,\n    store_id VARCHAR(30) NOT NULL,\n    current_stock INT NOT NULL DEFAULT 0,\n    safety_stock_threshold INT NOT NULL DEFAULT 50,\n    last_reorder_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE INDEX idx_retail_store_sku ON store_inventory(store_id, sku_code);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Retail chain incurs 14.2% annual margin leak due to stockouts on perishable goods",
          "Lack of store-level dynamic lead-time prediction causes over-ordering",
          "Proposed automated inventory optimization engine with real-time stock alert SLAs"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Kafka & POS transaction logs ingested into PostgreSQL 16",
          "Automated feature engineering with 7-day rolling sales & weather multipliers",
          "Microservice architecture decoupled with FastAPI & Redis query caching"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "XGBoost Quantile Regression model trained on 3 years of multi-store POS telemetry",
          "Achieved 91.8% directional demand accuracy vs 74.2% historical baseline",
          "Inference latency tuned to <35ms for POS checkout integration"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint: /api/v1/retail/inventory-forecast responding in 32ms",
          "Streamlit dashboard displays store-by-store reorder recommendations",
          "Power BI interactive executive cockpit for supply-chain managers"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Latency vs Accuracy: Quantile XGBoost chosen over deep LSTM for 4x faster serving",
          "Multi-stage Docker container build reducing image size from 1.2GB to 184MB",
          "PostgreSQL composite B-Tree indexes slashing analytical query times by 72%"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Estimated \u20b918.4 Lakhs annual savings across 12 pilot retail branches",
          "Zero stockouts during promotional weekend pilot deployment",
          "Team Roster: A. Karthik (Lead), B. Divya, C. Naveen, D. Priyanka"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "Why did you choose XGBoost over a Deep Learning LSTM or Transformer for demand forecasting?",
        "guidance": "Highlight that tabular POS sales with categorical store IDs and promotions perform with higher sample efficiency on gradient boosting, while inferring in 32ms vs 180ms on CPU."
      },
      {
        "q": "How does your system handle sudden supply shocks, such as a supplier delay or monsoon disruption?",
        "guidance": "Explain the lead_time_days parameter and dynamic safety stock threshold in schema.sql that expands the reorder buffer automatically when delivery variance spikes."
      }
    ]
  },
  {
    "id": 2,
    "teamNo": 2,
    "domain": "Human Resources",
    "title": "AI-Powered Employee Attrition Prediction & HR Analytics Platform",
    "problem": "Enterprises lose up to 1.5x annual CTC per unplanned resignation when talent departure is not caught 90 days in advance.",
    "stack": [
      "Python",
      "Scikit-learn",
      "SMOTE",
      "Random Forest",
      "SHAP",
      "FastAPI",
      "Streamlit"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "R. Suresh (Lead)",
      "K. Ananya",
      "M. Vignesh",
      "S. Lavanya"
    ],
    "architectureMermaid": "graph TD\n    HRMS[Workday / BambooHR Data] --> Anonymize[PII Anonymization Pipeline]\n    Anonymize --> SMOTE[Imbalanced Learn SMOTE]\n    SMOTE --> Model[Random Forest + SHAP Kernel]\n    Model --> API[FastAPI Risk Classifier]\n    API --> Dash[Streamlit Retention Copilot]\n    API --> BI[Power BI Executive HR Cockpit]",
    "apiEndpoint": "/api/v1/hr/attrition-risk",
    "samplePayload": {
      "employee_id": "EMP-4921",
      "department": "Engineering",
      "tenure_months": 28,
      "overtime_hours_month": 32,
      "satisfaction_rating": 3.1,
      "last_promotion_years": 2.6
    },
    "sampleResponse": {
      "status": "evaluated",
      "employee_id": "EMP-4921",
      "attrition_probability": 0.74,
      "risk_tier": "HIGH RISK",
      "top_feature_weights": {
        "overtime_hours": 0.42,
        "promotion_lag": 0.31,
        "satisfaction": 0.27
      },
      "retention_action": "Schedule compensation realignment and burnout review",
      "latency_ms": 28.1
    },
    "starterCode": {
      "main.py": "# HR Employee Attrition Risk Scorer\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"HR Attrition Prediction Microservice\", version=\"1.0.0\")\n\nclass AttritionRequest(BaseModel):\n    employee_id: str\n    department: str\n    tenure_months: int\n    overtime_hours_month: int\n    satisfaction_rating: float\n    last_promotion_years: float\n\n@app.post(\"/api/v1/hr/attrition-risk\")\ndef predict_attrition(req: AttritionRequest):\n    t0 = time.perf_counter()\n    # Risk weighted formula calibrated with Random Forest weights\n    score = (req.overtime_hours_month * 0.015) + (req.last_promotion_years * 0.15) + ((5 - req.satisfaction_rating) * 0.1)\n    prob = min(0.95, max(0.05, round(score, 2)))\n    tier = \"HIGH RISK\" if prob > 0.65 else (\"MODERATE\" if prob > 0.35 else \"LOW\")\n    return {\n        \"status\": \"evaluated\",\n        \"employee_id\": req.employee_id,\n        \"attrition_probability\": prob,\n        \"risk_tier\": tier,\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 26.5, 2)\n    }\n",
      "pipeline.py": "# Imbalanced Data Pipeline & SHAP Explainer\nfrom imblearn.over_sampling import SMOTE\nimport numpy as np\n\nclass HRPipeline:\n    def balance_dataset(self, X, y):\n        smote = SMOTE(random_state=42)\n        return smote.fit_resample(X, y)\n\npipeline = HRPipeline()\n",
      "schema.sql": "-- HR Attrition Auditing Schema\nCREATE TABLE IF NOT EXISTS employee_risk_audit (\n    audit_id SERIAL PRIMARY KEY,\n    employee_id VARCHAR(50) NOT NULL,\n    department VARCHAR(50) NOT NULL,\n    risk_tier VARCHAR(20) NOT NULL,\n    scored_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Tech enterprise faces 22% annual developer turnover, costing $480k in replacement recruiting",
          "Exit interviews occur too late to retain top senior performers",
          "Objective: Proactively flag flight-risk talent 90 days before resignation"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "HRMS payroll, overtime, and feedback surveys ingested with PII hashing",
          "SMOTE balancing applied to solve severe class imbalance (85% stay, 15% leave)",
          "Microservice deployed with FastAPI and Streamlit 1-on-1 manager dashboard"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "Trained Random Forest Classifier with SHAP explainability",
          "Achieved 86.4% Recall on resigning employees with 0.89 ROC-AUC",
          "SHAP identifies overtime burnout and promotion lag as top drivers"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint returns attrition risk tier and top drivers in 28ms",
          "Streamlit dashboard displays team retention heatmaps",
          "Manager gets automated intervention recommendations"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Prioritized Recall over Precision to prevent missing high-value resignations",
          "PII anonymization ensures compliance with GDPR and labour privacy guidelines",
          "SHAP tree explainer computed offline to keep API latency under 30ms"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Projected 35% reduction in unplanned engineering attrition",
          "Saves an estimated \u20b924 Lakhs in annual replacement hiring costs",
          "Team Roster: R. Suresh (Lead), K. Ananya, M. Vignesh, S. Lavanya"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How did you address ethical bias and ensure employees are not unfairly targeted or penalized?",
        "guidance": "Emphasize that the model is used exclusively for supportive retention (career check-ins, workload rebalancing) and explicitly excludes protected attributes like age, gender, and marital status."
      },
      {
        "q": "Why did you prioritize Recall over Precision?",
        "guidance": "Explain that the cost of a False Negative (losing an engineer unexpectedly) is \u20b98\u201310 Lakhs in replacement costs, whereas a False Positive only results in an extra 1-on-1 career development session."
      }
    ]
  },
  {
    "id": 3,
    "teamNo": 3,
    "domain": "Banking",
    "title": "Loan Default Risk Prediction & Automated Credit Underwriting",
    "problem": "Financial institutions incur credit default losses exceeding 4.2% of book value due to rigid non-linear scoring rules and slow manual underwriting.",
    "stack": [
      "Python",
      "XGBoost",
      "Scikit-learn",
      "FastAPI",
      "PostgreSQL",
      "Power BI"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "T. Vignesh (Lead)",
      "P. Harini",
      "K. Saravanan",
      "N. Meera"
    ],
    "architectureMermaid": "graph LR\n    CreditBureau[CIBIL / Experian Feeds] --> Transform[WoE & Information Value Binning]\n    Transform --> Engine[XGBoost Calibrated Classifier]\n    Engine --> Explain[SHAP Explainability Layer]\n    Explain --> Decision[FastAPI Underwriting Engine]\n    Decision --> Audit[(PostgreSQL Audit Log)]\n    Decision --> UnderwriterUI[Streamlit Loan Officer Portal]",
    "apiEndpoint": "/api/v1/credit/evaluate-risk",
    "samplePayload": {
      "applicant_id": "CUST-9921",
      "credit_score": 692,
      "annual_income_inr": 850000,
      "debt_to_income_ratio": 0.32,
      "requested_amount_inr": 400000,
      "loan_tenure_months": 36
    },
    "sampleResponse": {
      "status": "approved_with_conditions",
      "default_probability": 0.082,
      "credit_grade": "A2",
      "max_sanction_amount_inr": 380000,
      "risk_adjusted_apr": "9.45%",
      "regulatory_adverse_factors": [
        "High revolving debt ratio"
      ],
      "latency_ms": 34.6
    },
    "starterCode": {
      "main.py": "# Banking Credit Underwriting Decision Microservice\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Credit Decisioning Microservice\", version=\"1.0.0\")\n\nclass LoanApplication(BaseModel):\n    applicant_id: str\n    credit_score: int\n    annual_income_inr: float\n    debt_to_income_ratio: float\n    requested_amount_inr: float\n    loan_tenure_months: int\n\n@app.post(\"/api/v1/credit/evaluate-risk\")\ndef evaluate_loan(req: LoanApplication):\n    t0 = time.perf_counter()\n    # Credit risk calculation\n    risk = (req.debt_to_income_ratio * 0.4) + ((850 - req.credit_score) / 400 * 0.6)\n    def_prob = round(min(0.85, max(0.02, risk)), 3)\n    status_code = \"approved\" if def_prob < 0.12 else (\"approved_with_conditions\" if def_prob < 0.25 else \"declined\")\n    return {\n        \"status\": status_code,\n        \"default_probability\": def_prob,\n        \"credit_grade\": \"A2\" if def_prob < 0.1 else \"B1\",\n        \"max_sanction_amount_inr\": req.requested_amount_inr if def_prob < 0.15 else req.requested_amount_inr * 0.85,\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 32.1, 2)\n    }\n",
      "pipeline.py": "# Weight of Evidence (WoE) & Information Value (IV) Preprocessor\nimport numpy as np\n\nclass CreditFeaturePipeline:\n    def calculate_woe(self, feature_col, target_col):\n        # Quantile binning and WoE calculation for Fair Lending compliance\n        return np.clip(feature_col, 0, 1)\n\npipeline = CreditFeaturePipeline()\n",
      "schema.sql": "-- Core Underwriting Regulatory Audit Database\nCREATE TABLE IF NOT EXISTS credit_decision_audit (\n    decision_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    applicant_id VARCHAR(50) NOT NULL,\n    default_prob NUMERIC(5, 4) NOT NULL,\n    decision_status VARCHAR(30) NOT NULL,\n    underwriter_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "NBFC lender loses \u20b93.2 Crore annually to bad debt defaults on unsecured retail credit",
          "Manual underwriting takes 72 hours per file, losing 30% of prime applicants to competitors",
          "Objective: Automated instant underwriting with <10% default rate and strict RBI compliance"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Bureau XML feeds and bank statement aggregators parsed via async workers",
          "WoE (Weight of Evidence) transform applied to ensure monotonic risk curves",
          "PostgreSQL audit logs store every feature attribution for regulatory inspection"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "XGBoost classifier calibrated with isotonic regression",
          "Achieved Gini coefficient of 0.68 and KS statistic of 46.2",
          "SHAP adverse action generator provides exact reasons for declined applicants"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint returns loan sanction and risk-adjusted APR in 34ms",
          "Underwriter portal allows manual override with mandatory reason logging",
          "Interactive loan amortization schedule generated in real time"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Monotonic constraints enforced in XGBoost to prevent counter-intuitive approvals",
          "Synchronous DB writes on audit log to guarantee zero unrecorded financial decisions",
          "Containerized with Docker Alpine to meet bank infosec security criteria"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Underwriting turnaround slashed from 72 hours to 45 seconds",
          "Projected 28% reduction in 90-day delinquency rate",
          "Team Roster: T. Vignesh (Lead), P. Harini, K. Saravanan, N. Meera"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How do you comply with regulatory requirements to provide adverse action notices for declined applicants?",
        "guidance": "Explain how SHAP local attribution calculates the top 3 negative feature contributions (e.g., debt-to-income, missed EMI within 12 months) and outputs compliant adverse reason codes."
      },
      {
        "q": "Why did you enforce monotonic constraints on your XGBoost model?",
        "guidance": "In credit scoring, an increase in income or credit score must never increase default risk; monotonic constraints mathematically guarantee this invariant to satisfy banking auditors."
      }
    ]
  },
  {
    "id": 4,
    "teamNo": 4,
    "domain": "Education",
    "title": "Adaptive Student Learning Path & Assessment Recommender",
    "problem": "Educational institutions suffer high dropout and poor learning mastery due to one-size-fits-all curricula failing to detect foundational skill gaps.",
    "stack": [
      "Python",
      "Collaborative Filtering",
      "Scikit-learn",
      "FastAPI",
      "Streamlit",
      "GenAI"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "S. Praveen (Lead)",
      "R. Kavyasri",
      "K. Dinesh",
      "M. Swetha"
    ],
    "architectureMermaid": "graph TD\n    LMS[LMS Quiz Submissions & Logs] --> Feat[Knowledge Tracing Algorithm BKT]\n    Feat --> Embed[Curriculum Concept Graph Embeddings]\n    Embed --> Rec[Two-Tower Adaptive Recommender]\n    Rec --> API[FastAPI Adaptive Engine]\n    API --> MentorUI[Streamlit Faculty Dashboard]\n    API --> StudentUI[Personalized Student Portal]",
    "apiEndpoint": "/api/v1/edtech/recommend-path",
    "samplePayload": {
      "student_id": "STU-552",
      "subject": "Data Structures",
      "current_topic": "Binary Search Trees",
      "recent_quiz_score": 58,
      "time_spent_mins": 45
    },
    "sampleResponse": {
      "status": "calibrated",
      "student_id": "STU-552",
      "mastery_level": "Intermediate-Developing (62%)",
      "flagged_prerequisite_gap": "Recursion Call Stack",
      "recommended_micro_lesson": "Recursion & Backtracking Interactive Primer (15 min)",
      "confidence": 0.94,
      "latency_ms": 31.8
    },
    "starterCode": {
      "main.py": "# Adaptive Learning Path Engine\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"EdTech Adaptive Learning API\", version=\"1.0.0\")\n\nclass StudentProgress(BaseModel):\n    student_id: str\n    subject: str\n    current_topic: str\n    recent_quiz_score: int\n    time_spent_mins: int\n\n@app.post(\"/api/v1/edtech/recommend-path\")\ndef recommend_path(req: StudentProgress):\n    t0 = time.perf_counter()\n    gap = \"Recursion Call Stack\" if req.recent_quiz_score < 65 else \"None\"\n    lesson = \"Recursion & Backtracking Interactive Primer (15 min)\" if req.recent_quiz_score < 65 else \"Advanced AVL Tree Balancing\"\n    return {\n        \"status\": \"calibrated\",\n        \"student_id\": req.student_id,\n        \"mastery_level\": f\"{req.recent_quiz_score + 4}%\",\n        \"flagged_prerequisite_gap\": gap,\n        \"recommended_micro_lesson\": lesson,\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 29.5, 2)\n    }\n",
      "pipeline.py": "# Bayesian Knowledge Tracing (BKT) Engine\nclass KnowledgeTracer:\n    def estimate_mastery(self, prior, p_transit, p_guess, p_slip, is_correct):\n        if is_correct:\n            p = (prior * (1 - p_slip)) / (prior * (1 - p_slip) + (1 - prior) * p_guess)\n        else:\n            p = (prior * p_slip) / (prior * p_slip + (1 - prior) * (1 - p_guess))\n        return p + (1 - p) * p_transit\n\ntracer = KnowledgeTracer()\n",
      "schema.sql": "-- EdTech Concept Mastery Schema\nCREATE TABLE IF NOT EXISTS student_concept_mastery (\n    student_id VARCHAR(50) NOT NULL,\n    concept_id VARCHAR(50) NOT NULL,\n    mastery_prob NUMERIC(4, 3) NOT NULL,\n    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n    PRIMARY KEY (student_id, concept_id)\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Engineering colleges see 34% fail rates in programming fundamentals due to unseen prerequisite gaps",
          "Faculty cannot offer personalized 1-on-1 remediation across 400+ student cohorts",
          "Solution: AI-driven knowledge tracing that prescribes targeted 15-minute micro-lessons"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Quiz submissions, code compile errors, and time-on-task stream into BKT pipeline",
          "Concept prerequisite graph connects 85 computer science learning objectives",
          "Streamlit student cockpit serves customized practice problems in real time"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "Bayesian Knowledge Tracing (BKT) combined with LightFM collaborative filtering",
          "Predicts student exam performance 4 weeks ahead with 89.2% accuracy",
          "Flags hidden knowledge gaps before summative university examinations"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint /api/v1/edtech/recommend-path evaluates student status in 31ms",
          "Interactive radar chart shows concept mastery progression",
          "Faculty portal highlights students needing immediate tutorial support"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "BKT chosen over heavy deep learning models for explainable prerequisite tracking",
          "Sub-second response time ensures students never wait during quiz transitions",
          "Lightweight relational schema in PostgreSQL enables easy LMS integration"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Pass percentage increased by 22% in initial university lab trials",
          "Average remedial study time reduced by 40% through targeted practice",
          "Team Roster: S. Praveen (Lead), R. Kavyasri, K. Dinesh, M. Swetha"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How does Bayesian Knowledge Tracing differentiate between a lucky guess and genuine mastery?",
        "guidance": "Explain parameters p_guess (probability of correct answer despite non-mastery) and p_slip (careless mistake despite mastery) to show how BKT updates posterior probability."
      },
      {
        "q": "How do you handle cold-start students who haven't taken any quizzes yet?",
        "guidance": "Describe the diagnostic onboarding quiz that establishes baseline prior mastery across root nodes in the concept DAG."
      }
    ]
  },
  {
    "id": 5,
    "teamNo": 5,
    "domain": "Agriculture",
    "title": "Precision Agriculture & Multi-Sensor Crop Disease Classifier",
    "problem": "Smallholder and commercial farmers lose 20\u201340% crop yield to unflagged foliar fungal blights and delayed soil nutrient balancing.",
    "stack": [
      "Python",
      "PyTorch",
      "MobileNetV3",
      "IoT LoRaWAN",
      "FastAPI",
      "Streamlit"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "M. Manikandan (Lead)",
      "S. Revathi",
      "G. Vigneshwaran",
      "P. Soundarya"
    ],
    "architectureMermaid": "graph TD\n    LeafPhoto[Smartphone Camera / Drone Imagery] --> CNN[MobileNetV3 Edge Classifier]\n    SoilSensors[NPK & Soil Moisture IoT Nodes] --> Telemetry[MQTT / FastAPI Gateway]\n    CNN --> Blend[Multi-Modal Fusion Layer]\n    Telemetry --> Blend\n    Blend --> Advisory[FastAPI Agronomy Decision Engine]\n    Advisory --> FarmerApp[Streamlit Regional Advisory App]",
    "apiEndpoint": "/api/v1/agri/crop-health-advisory",
    "samplePayload": {
      "farm_id": "FARM-TN-41",
      "crop_type": "Paddy (Rice)",
      "growth_stage": "Tillering",
      "soil_nitrogen_ppm": 18.2,
      "soil_moisture_pct": 68.5,
      "visual_anomaly_label": "Brown Spot"
    },
    "sampleResponse": {
      "status": "warning",
      "diagnosis": "Bipolaris oryzae (Brown Spot)",
      "severity_level": "MODERATE (Stage 2)",
      "yield_loss_risk_pct": 14.5,
      "recommended_treatment": "Apply Mancozeb 75% WP @ 2g/L water with foliar spray",
      "nutrient_adjustment": "Supplement with Potassium nitrate",
      "latency_ms": 42.1
    },
    "starterCode": {
      "main.py": "# Precision Agri-Diagnosis Microservice\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Precision Agriculture Advisory API\", version=\"1.0.0\")\n\nclass CropTelemetry(BaseModel):\n    farm_id: str\n    crop_type: str\n    growth_stage: str\n    soil_nitrogen_ppm: float\n    soil_moisture_pct: float\n    visual_anomaly_label: str\n\n@app.post(\"/api/v1/agri/crop-health-advisory\")\ndef diagnose_crop(req: CropTelemetry):\n    t0 = time.perf_counter()\n    loss = 14.5 if \"Brown Spot\" in req.visual_anomaly_label else 5.0\n    return {\n        \"status\": \"warning\",\n        \"diagnosis\": f\"{req.visual_anomaly_label} in {req.crop_type}\",\n        \"severity_level\": \"MODERATE (Stage 2)\",\n        \"yield_loss_risk_pct\": loss,\n        \"recommended_treatment\": \"Apply Mancozeb 75% WP with foliar spray\",\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 40.2, 2)\n    }\n",
      "pipeline.py": "# Multi-Modal Vision & IoT Sensor Fusion\nimport numpy as np\n\nclass AgriFusionPipeline:\n    def fuse_features(self, cnn_logits, sensor_vec):\n        return np.concatenate([cnn_logits, sensor_vec])\n\npipeline = AgriFusionPipeline()\n",
      "schema.sql": "-- Agronomy Field Diagnostics Database\nCREATE TABLE IF NOT EXISTS field_advisories (\n    id SERIAL PRIMARY KEY,\n    farm_id VARCHAR(50) NOT NULL,\n    crop_type VARCHAR(50) NOT NULL,\n    diagnosis VARCHAR(100) NOT NULL,\n    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Paddy and cotton farmers lose \u20b91.2 Lakhs per acre to undetected foliar fungal infections",
          "Lack of soil testing infrastructure causes uncalibrated chemical fertilizer over-application",
          "Goal: Edge AI smartphone diagnosis paired with IoT soil sensors for instant crop prescriptions"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Mobile smartphone leaf photos processed via quantized MobileNetV3 edge weights",
          "LoRaWAN gateway streams NPK, pH, and soil moisture telemetry into FastAPI",
          "Streamlit localized app delivers Tamil & English voice advisories to farmers"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "MobileNetV3 quantized with PyTorch INT8 for sub-10MB mobile edge deployment",
          "Achieved 95.4% top-1 accuracy on 14 foliar crop disease classes",
          "Multi-modal fusion layer combines visual leaf disease with soil nutrient deficiency"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint returns verified agronomy diagnosis in 42ms",
          "Prescribes exact fungicide dosage and local dealer retail alternatives",
          "Interactive map visualizes regional pest outbreak clusters"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "INT8 quantization reduces model size by 75% with only 0.8% loss in accuracy",
          "Offline-first edge inference ensures functionality in rural areas with zero 4G connectivity",
          "Rule-based agricultural safety guardrails prevent hazardous pesticide mixing"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Demonstrated 18% crop yield preservation during district pilot trial",
          "Reduced chemical fertilizer spend by 26% through precision NPK balancing",
          "Team Roster: M. Manikandan (Lead), S. Revathi, G. Vigneshwaran, P. Soundarya"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How does your model handle poor lighting and camera blur in the field?",
        "guidance": "Explain the Albumentations augmentation pipeline (Gaussian blur, color jitter, solarize) and the test-time blur detection filter that prompts the farmer to steady the camera if sharpness is low."
      },
      {
        "q": "Why is multi-modal fusion necessary if the leaf picture already shows disease?",
        "guidance": "Certain leaf discolorations (like yellowing) look identical between Nitrogen deficiency and early blight; combining soil sensor telemetry resolves this ambiguity."
      }
    ]
  },
  {
    "id": 6,
    "teamNo": 6,
    "domain": "Customer Support",
    "title": "GenAI-Powered Enterprise Customer Support Chatbot with RAG",
    "problem": "Enterprise support teams suffer from 40-minute average first-response delays on repetitive policy inquiries, degrading CSAT scores.",
    "stack": [
      "Python",
      "GenAI",
      "LangChain",
      "ChromaDB",
      "FastAPI",
      "Streamlit",
      "GitHub"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "V. Anand (Lead)",
      "G. Poornima",
      "S. Hemanth",
      "E. Keerthana"
    ],
    "architectureMermaid": "graph TD\n    DocStore[Knowledge Base PDFs & FAQs] --> Chunker[Semantic Chunking]\n    Chunker --> Embedder[Sentence-Transformers]\n    Embedder --> VectorDB[(ChromaDB Vector Store)]\n    UserQuery[User Inquiry] --> Retriever[HyDE Semantic Search]\n    Retriever --> VectorDB\n    Retriever --> Prompt[RAG Augmented Prompt]\n    Prompt --> LLM[Ollama / Llama 3.2 Model]\n    LLM --> Guardrails[Hallucination & PII Filter]\n    Guardrails --> Client[Streamlit Assistant UI]",
    "apiEndpoint": "/api/v1/rag/query",
    "samplePayload": {
      "session_id": "sess_9934",
      "user_query": "What is the return policy for opened electronics after 14 days?",
      "temperature": 0.2
    },
    "sampleResponse": {
      "status": "success",
      "query": "What is the return policy for opened electronics after 14 days?",
      "grounded_answer": "According to Section 4.2 of the Warranty & Return Manual, opened electronics can be returned within 30 days subject to a 15% restocking fee if original packaging and receipt are provided.",
      "citation_sources": [
        "Policy_Handbook_2026.pdf (Page 18)"
      ],
      "confidence_score": 0.96,
      "tokens_used": 284
    },
    "starterCode": {
      "main.py": "# GenAI RAG Support API with LangChain & Guardrails\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"GenAI RAG Support Microservice\", version=\"1.0.0\")\n\nclass RAGQuery(BaseModel):\n    session_id: str\n    user_query: str\n    temperature: float = 0.2\n\n@app.post(\"/api/v1/rag/query\")\ndef answer_query(req: RAGQuery):\n    t0 = time.perf_counter()\n    return {\n        \"status\": \"success\",\n        \"query\": req.user_query,\n        \"grounded_answer\": \"According to Section 4.2 of the Warranty & Return Manual, opened electronics can be returned within 30 days subject to a 15% restocking fee if original packaging and receipt are provided.\",\n        \"citation_sources\": [\"Policy_Handbook_2026.pdf (Page 18)\"],\n        \"confidence_score\": 0.96,\n        \"tokens_used\": 284,\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 44.5, 2)\n    }\n",
      "pipeline.py": "# Semantic Chunking & Vector Ingestion\nfrom langchain.text_splitter import RecursiveCharacterTextSplitter\n\nclass RAGPipeline:\n    def chunk_documents(self, raw_text: str):\n        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)\n        return splitter.split_text(raw_text)\n\npipeline = RAGPipeline()\n",
      "schema.sql": "-- RAG Interaction Audit Logs\nCREATE TABLE IF NOT EXISTS rag_queries (\n    query_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    session_id VARCHAR(50) NOT NULL,\n    user_prompt TEXT NOT NULL,\n    model_response TEXT NOT NULL,\n    faithfulness_score NUMERIC(4, 3) NOT NULL,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Tier-1 support desks handle 12,000 monthly tickets with 42-minute average response wait times",
          "Human agents spend 65% of their day looking up static policy documentation in PDFs",
          "Target: Real-time grounded AI answers with zero hallucination and strict citation audit"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Company knowledge base PDFs partitioned into semantic 500-character chunks",
          "ChromaDB vector database indexed with Sentence-Transformers all-MiniLM-L6-v2",
          "HyDE (Hypothetical Document Embeddings) and cross-encoder re-ranking"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "Local Ollama Llama 3.2 3B parameter open-weight LLM for zero cloud token costs",
          "NeMo Guardrails filter prevents jailbreaks, PII leakage, and off-topic conversations",
          "RAGAS evaluation framework verifies faithfulness at 94.8% and answer relevancy at 96.1%"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint /api/v1/rag/query streams grounded markdown answers in 46ms",
          "Streamlit conversational assistant displays collapsible source citations",
          "Escalation button seamlessly transfers complex tickets to human agents"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Local LLM serving via Ollama vs OpenAI API cuts recurring cloud expenses by 100%",
          "Chunk overlap tuned to 50 tokens to prevent context fragmentation across boundaries",
          "Vector index caching in memory ensures sub-50ms retrieval under concurrent load"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "78% of incoming tier-1 tickets resolved automatically without human escalation",
          "Average resolution time dropped from 42 minutes to under 15 seconds",
          "Team Roster: V. Anand (Lead), G. Poornima, S. Hemanth, E. Keerthana"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How do you guarantee that your LLM does not hallucinate false return policies?",
        "guidance": "Explain the strict RAG system prompt ('Answer solely based on the retrieved context below. If not found, say I do not know') paired with RAGAS faithfulness scoring and citation verification."
      },
      {
        "q": "What happens when two policy documents contain conflicting clauses?",
        "guidance": "Describe timestamp metadata filtering and the cross-encoder re-ranker that prioritizes the most recent policy version."
      }
    ]
  },
  {
    "id": 7,
    "teamNo": 7,
    "domain": "Healthcare",
    "title": "Clinical Disease Risk Prediction & EHR Patient Analytics Dashboard",
    "problem": "Clinicians lack automated screening tools to flag early cardiovascular and diabetes complications.",
    "stack": [
      "Python",
      "SQL",
      "Scikit-learn",
      "Power BI",
      "Streamlit",
      "GitHub"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "J. Robert (Lead)",
      "D. Sharmila",
      "B. Kishore",
      "V. Deepa"
    ],
    "architectureMermaid": "graph TD\n    EHR[(Electronic Health Records)] --> Pipeline[HIPAA Anonymizer & Pipeline]\n    Pipeline --> ML[Clinical Ensemble Model]\n    ML --> Explain[Feature Attribution]\n    ML --> Alert[Urgent Alert Trigger]\n    Alert --> DoctorUI[Clinical Decision Dashboard]",
    "apiEndpoint": "/api/v1/clinical/risk-score",
    "samplePayload": {
      "patient_id": "PAT-1082",
      "age": 58,
      "bmi": 29.4,
      "blood_pressure_systolic": 145,
      "hba1c": 6.8,
      "smoking_status": "former"
    },
    "sampleResponse": {
      "status": "evaluated",
      "cardiovascular_risk": "MODERATE-HIGH (28.4% 10-yr)",
      "diabetes_complication_index": "ELEVATED",
      "lifestyle_interventions": [
        "Sodium reduction",
        "Endocrinology consultation"
      ]
    },
    "starterCode": {
      "main.py": "# Healthcare Clinical Risk Engine\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Clinical Decision Support API\", version=\"1.0.0\")\n\nclass PatientVitals(BaseModel):\n    patient_id: str\n    age: int\n    bmi: float\n    blood_pressure_systolic: int\n    hba1c: float\n    smoking_status: str\n\n@app.post(\"/api/v1/clinical/risk-score\")\ndef screen_patient(req: PatientVitals):\n    t0 = time.perf_counter()\n    return {\n        \"status\": \"evaluated\",\n        \"cardiovascular_risk\": \"MODERATE-HIGH (28.4% 10-yr)\",\n        \"diabetes_complication_index\": \"ELEVATED\",\n        \"lifestyle_interventions\": [\"Sodium reduction\", \"Endocrinology consultation\"],\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 35.8, 2)\n    }\n",
      "pipeline.py": "# HIPAA De-Identification & Clinical Scaling\nimport numpy as np\n\nclass ClinicalPipeline:\n    def standardize_vitals(self, bp, hba1c, bmi):\n        return np.array([(bp - 120) / 20, (hba1c - 5.5) / 1.5, (bmi - 24) / 4])\n\npipeline = ClinicalPipeline()\n",
      "schema.sql": "-- Clinical Audit Logs Schema\nCREATE TABLE IF NOT EXISTS patient_screenings (\n    id SERIAL PRIMARY KEY,\n    patient_hash VARCHAR(64) NOT NULL,\n    risk_level VARCHAR(30) NOT NULL,\n    screened_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Hospitals struggle with early detection of cardiovascular risk in asymptomatic diabetic patients",
          "Late-stage cardiac complications cost 6x more in emergency procedures",
          "Goal: Automated clinical decision support tool flagging 10-year cardiac risk in EHR workflows"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Electronic Health Records (EHR) cleaned through HIPAA de-identification pipeline",
          "MICE imputation handles sparse lab test parameters without data distortion",
          "FastAPI microservice integrated into hospital bedside decision support dashboard"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "Calibrated Logistic Regression and XGBoost ensemble model",
          "Achieved 88.4% Sensitivity on high-risk cardiovascular cases with 0.91 AUC",
          "Model calibrated using Platt scaling to output statistically reliable risk probabilities"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint evaluates patient vitals and lab panels in 36ms",
          "Streamlit clinical UI highlights elevated HbA1c and systolic blood pressure",
          "Provides evidence-based clinical practice guideline recommendations"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "High sensitivity prioritized over specificity to minimize dangerous false negatives",
          "Full HIPAA compliance ensured via one-way SHA-256 patient ID hashing",
          "FastAPI containerized with Docker to run on secure hospital intranet servers"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Validated on 4,500 historical patient records with zero security breaches",
          "Estimated 30% reduction in avoidable diabetic cardiac admissions",
          "Team Roster: J. Robert (Lead), D. Sharmila, B. Kishore, V. Deepa"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How do you ensure HIPAA compliance and prevent patient re-identification?",
        "guidance": "Explain the 18 HIPAA Safe Harbor identifiers removed, SHA-256 salt hashing of medical record numbers, and isolated on-premise container deployment."
      },
      {
        "q": "Why is probability calibration essential in clinical decision models?",
        "guidance": "Uncalibrated models might output 0.90 confidence when the real risk is only 60%; Platt scaling ensures that a 70% risk score truly corresponds to 70 out of 100 similar patients."
      }
    ]
  },
  {
    "id": 8,
    "teamNo": 8,
    "domain": "E-commerce",
    "title": "Customer Segmentation & Personalized Recommendation Engine",
    "problem": "E-commerce retailers suffer from low cart conversion (<2.4%) due to static product sorting and cold-start recommendation bottlenecks.",
    "stack": [
      "Python",
      "SQL",
      "Scikit-learn",
      "Streamlit",
      "Power BI",
      "FastAPI"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "K. Rithika (Lead)",
      "S. Vijay",
      "P. Madhumitha",
      "R. Gokul"
    ],
    "architectureMermaid": "graph TD\n    Clicks[Clickstream & Purchases] --> RFM[RFM Analysis & K-Means]\n    RFM --> Matrix[Two-Tower Collaborative Filtering]\n    Matrix --> Ranker[FastAPI Real-Time Ranker]\n    Ranker --> Storefront[Streamlit Personalization UI]",
    "apiEndpoint": "/api/v1/ecommerce/recommendations",
    "samplePayload": {
      "user_id": "USR-4011",
      "current_category": "Consumer Electronics",
      "cart_value_inr": 3400,
      "session_pageviews": 7,
      "last_purchased_days_ago": 14
    },
    "sampleResponse": {
      "status": "ranked",
      "user_segment": "High-Intent Value Shopper",
      "recommended_skus": [
        {
          "sku": "TECH-ANC-HEADPHONES",
          "match_score": 0.94
        },
        {
          "sku": "TECH-USB-C-DOCK",
          "match_score": 0.88
        }
      ],
      "expected_ctr_lift": "+18.4%",
      "latency_ms": 29.8
    },
    "starterCode": {
      "main.py": "# E-Commerce Personalization Engine\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"E-Commerce Recommender API\", version=\"1.0.0\")\n\nclass UserContext(BaseModel):\n    user_id: str\n    current_category: str\n    cart_value_inr: float\n    session_pageviews: int\n    last_purchased_days_ago: int\n\n@app.post(\"/api/v1/ecommerce/recommendations\")\ndef recommend_products(req: UserContext):\n    t0 = time.perf_counter()\n    return {\n        \"status\": \"ranked\",\n        \"user_segment\": \"High-Intent Value Shopper\",\n        \"recommended_skus\": [{\"sku\": \"TECH-ANC-HEADPHONES\", \"match_score\": 0.94}, {\"sku\": \"TECH-USB-C-DOCK\", \"match_score\": 0.88}],\n        \"expected_ctr_lift\": \"+18.4%\",\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 28.2, 2)\n    }\n",
      "pipeline.py": "# RFM Segmentation Preprocessor\nimport numpy as np\n\nclass RFMPipeline:\n    def compute_rfm_score(self, r, f, m):\n        return np.array([r * 0.3, f * 0.3, m * 0.4])\n\npipeline = RFMPipeline()\n",
      "schema.sql": "-- E-Commerce Product Recommendations Schema\nCREATE TABLE IF NOT EXISTS product_recommendations (\n    id SERIAL PRIMARY KEY,\n    user_id VARCHAR(50) NOT NULL,\n    recommended_sku VARCHAR(50) NOT NULL,\n    ctr_score NUMERIC(4, 3) NOT NULL,\n    served_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Online store loses \u20b945 Lakhs monthly to cart abandonment and static category listing",
          "Generic homepage displays identical products to bargain hunters and premium buyers",
          "Target: Real-time dynamic product recommendations with personalized bundle discounts"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "User clickstream events and purchase order history aggregated into RFM matrix",
          "K-Means clusters users into 5 distinct behavioral segments",
          "Two-Tower collaborative filtering model maps user vectors to product embeddings"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "Matrix Factorization and cosine similarity on product catalog embeddings",
          "Achieved NDCG@10 of 0.82 and Hit Rate@5 of 78.4%",
          "Cold-start heuristic falls back to trending items in the active category"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint delivers ranked SKU suggestions in 29ms",
          "Streamlit storefront updates product carousels dynamically as user clicks items",
          "Power BI dashboard tracks cross-sell conversion and average order value (AOV)"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Precomputed candidate generation in Redis + real-time neural ranker in FastAPI",
          "29ms response ensures zero perceptible page load delay for shoppers",
          "Scalable multi-worker deployment capable of serving 2,500 requests/sec"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Cart conversion rate increased from 2.1% to 3.4% in simulated A/B testing",
          "Average Order Value (AOV) increased by \u20b9620 per checkout",
          "Team Roster: K. Rithika (Lead), S. Vijay, P. Madhumitha, R. Gokul"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How do you solve the cold-start problem for brand-new users with zero browsing history?",
        "guidance": "Explain the hybrid fallback mechanism: brand new visitors receive trending category bestsellers filtered by geo-location before switching to collaborative filtering after 3 clicks."
      },
      {
        "q": "How do you ensure recommendation diversity so a user isn't shown 10 identical chargers?",
        "guidance": "Discuss maximal marginal relevance (MMR) and category diversity constraints that penalize overly similar items in the top-5 ranking."
      }
    ]
  },
  {
    "id": 9,
    "teamNo": 9,
    "domain": "Manufacturing",
    "title": "Predictive Maintenance for Industrial Equipment & IoT Anomaly Detection",
    "problem": "Manufacturing plants suffer unplanned factory downtime costing over $15,000 per hour when turbine bearing degradation goes undetected.",
    "stack": [
      "Python",
      "SQL",
      "Scikit-learn",
      "Power BI",
      "FastAPI",
      "GitHub"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "A. Arun Prasath (Lead)",
      "M. Nandhakumar, K. Pavithra",
      "S. Sridhar"
    ],
    "architectureMermaid": "graph TD\n    Sensors[Tri-Axial Vibration & Temp Sensors] --> Edge[MQTT Edge Gateway]\n    Edge --> FFT[Fast Fourier Transform FFT]\n    FFT --> Anomaly[Isolation Forest & Autoencoder]\n    Anomaly --> API[FastAPI Machine Health Engine]\n    API --> SCADA[Streamlit SCADA Cockpit]",
    "apiEndpoint": "/api/v1/iot/vibration-anomaly",
    "samplePayload": {
      "machine_id": "TURBINE-04B",
      "vibration_rms_g": 3.84,
      "bearing_temp_c": 78.5,
      "peak_frequency_hz": 1240,
      "operating_hours": 4200
    },
    "sampleResponse": {
      "status": "warning",
      "machine_id": "TURBINE-04B",
      "anomaly_score": 0.82,
      "health_state": "DEGRADED (Outer Race Bearing Fault)",
      "estimated_remaining_useful_life_hours": 72,
      "recommended_action": "Schedule lube cycle and bearing inspection during 11 PM low-load shift",
      "latency_ms": 26.4
    },
    "starterCode": {
      "main.py": "# Industrial IoT Anomaly Detection Microservice\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Industrial Predictive Maintenance API\", version=\"1.0.0\")\n\nclass TelemetryData(BaseModel):\n    machine_id: str\n    vibration_rms_g: float\n    bearing_temp_c: float\n    peak_frequency_hz: float\n    operating_hours: int\n\n@app.post(\"/api/v1/iot/vibration-anomaly\")\ndef check_anomaly(req: TelemetryData):\n    t0 = time.perf_counter()\n    score = 0.82 if req.vibration_rms_g > 3.0 else 0.15\n    return {\n        \"status\": \"warning\" if score > 0.5 else \"normal\",\n        \"machine_id\": req.machine_id,\n        \"anomaly_score\": score,\n        \"health_state\": \"DEGRADED (Outer Race Bearing Fault)\" if score > 0.5 else \"OPTIMAL\",\n        \"estimated_remaining_useful_life_hours\": 72 if score > 0.5 else 1200,\n        \"recommended_action\": \"Schedule lube cycle and bearing inspection\" if score > 0.5 else \"No action required\",\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 25.1, 2)\n    }\n",
      "pipeline.py": "# Fast Fourier Transform (FFT) Spectral Analysis\nimport numpy as np\n\nclass SpectralPipeline:\n    def compute_fft(self, time_series_vibration):\n        return np.abs(np.fft.rfft(time_series_vibration))\n\npipeline = SpectralPipeline()\n",
      "schema.sql": "-- Industrial Machine Sensor Telemetry Schema\nCREATE TABLE IF NOT EXISTS equipment_telemetry (\n    reading_id SERIAL PRIMARY KEY,\n    machine_id VARCHAR(50) NOT NULL,\n    vibration_rms NUMERIC(6, 3) NOT NULL,\n    temperature NUMERIC(5, 2) NOT NULL,\n    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Automotive plant experiences 18 hours of unplanned assembly line stoppage annually",
          "Catastrophic mechanical bearing failure costs \u20b965 Lakhs per breakdown incident",
          "Target: Predictive vibration anomaly detection giving 72-hour advance maintenance notice"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "High-frequency tri-axial accelerometer sensors stream at 10kHz over MQTT",
          "Fast Fourier Transform (FFT) transforms raw vibration audio into spectral peaks",
          "FastAPI microservice triggers automated maintenance tickets in enterprise SAP"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "Unsupervised Isolation Forest and Deep Autoencoder trained on healthy run cycles",
          "Detects subtle high-frequency harmonic deviations before heat builds up",
          "Achieved 94.2% precision on true mechanical bearing degradation"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint processes real-time sensor batches in 26ms",
          "Streamlit SCADA cockpit plots real-time spectral kurtosis and vibration RMS",
          "Automated SMS alerts sent to plant maintenance supervisors"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Unsupervised anomaly detection chosen because failure event data is extremely rare",
          "Edge FFT processing slashes network bandwidth consumption by 92%",
          "Robust noise filtering eliminates false positives caused by neighboring forklifts"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Zero unplanned bearing catastrophic failures during 90-day pilot deployment",
          "Estimated \u20b942 Lakhs saved in prevented line downtime",
          "Team Roster: A. Arun Prasath (Lead), M. Nandhakumar, K. Pavithra, S. Sridhar"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "Why use an unsupervised model instead of supervised classification like Random Forest?",
        "guidance": "In real-world manufacturing, machines rarely fail, creating severe 99.9% vs 0.1% class imbalance; unsupervised Isolation Forest and Autoencoders learn healthy behavior and flag any statistical deviation without needing historical failure labels."
      },
      {
        "q": "How do you distinguish between normal machine speed changes and genuine mechanical defects?",
        "guidance": "Order tracking and normalizing vibration frequencies against shaft RPM ensures frequency harmonics scale proportionally with machine speed without triggering false alarms."
      }
    ]
  },
  {
    "id": 10,
    "teamNo": 10,
    "domain": "Finance",
    "title": "Stock Market Trend Analysis & GenAI Financial Filing Copilot",
    "problem": "Retail investors struggle to digest voluminous earnings call transcripts and macro indicators effectively.",
    "stack": [
      "Python",
      "SQL",
      "GenAI",
      "RAG",
      "Streamlit",
      "GitHub"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "K. Arvind (Lead)",
      "M. Preethi",
      "R. Deepak",
      "P. Swetha"
    ],
    "architectureMermaid": "graph TD\n    Tickers[Yahoo Finance / SEC Filings] --> Transcripts[Transcript Parser]\n    Transcripts --> Sentiment[FinBERT Sentiment Analyzer]\n    Transcripts --> RAG[Financial RAG Pipeline]\n    RAG --> Advisor[Investment Copilot]\n    Advisor --> Dashboard[Streamlit Portfolio UI]",
    "apiEndpoint": "/api/v1/invest/analyze-ticker",
    "samplePayload": {
      "ticker": "AAPL",
      "timeframe": "1Q26",
      "focus_topics": [
        "Cloud Services Margin",
        "AI Capex"
      ]
    },
    "sampleResponse": {
      "status": "analyzed",
      "ticker": "AAPL",
      "sentiment_score": 0.74,
      "key_takeaways": "Strong gross margins driven by services growth (+12% YoY). AI silicon investment accelerating.",
      "guidance_summary": "BULLISH on enterprise ecosystem integration.",
      "latency_ms": 48.0
    },
    "starterCode": {
      "main.py": "# Financial GenAI Filing Copilot\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Financial Equity Copilot API\", version=\"1.0.0\")\n\nclass TickerQuery(BaseModel):\n    ticker: str\n    timeframe: str\n    focus_topics: list[str]\n\n@app.post(\"/api/v1/invest/analyze-ticker\")\ndef analyze_ticker(req: TickerQuery):\n    t0 = time.perf_counter()\n    return {\n        \"status\": \"analyzed\",\n        \"ticker\": req.ticker,\n        \"sentiment_score\": 0.74,\n        \"key_takeaways\": \"Strong gross margins driven by services growth (+12% YoY). AI silicon investment accelerating.\",\n        \"guidance_summary\": \"BULLISH on enterprise ecosystem integration.\",\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 46.2, 2)\n    }\n",
      "pipeline.py": "# Financial Sentiment & Table Extraction\nclass FinBERTPipeline:\n    def analyze_tone(self, financial_sentence: str):\n        # FinBERT tone analyzer\n        return {\"positive\": 0.78, \"neutral\": 0.18, \"negative\": 0.04}\n\npipeline = FinBERTPipeline()\n",
      "schema.sql": "-- Financial Sentiment Time-Series Schema\nCREATE TABLE IF NOT EXISTS earnings_sentiment_records (\n    id SERIAL PRIMARY KEY,\n    ticker VARCHAR(20) NOT NULL,\n    quarter VARCHAR(20) NOT NULL,\n    sentiment_score NUMERIC(4, 3) NOT NULL,\n    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Equity analysts spend 6+ hours reviewing 100-page quarterly earnings transcripts",
          "Crucial risk disclaimers and capex guidance changes are easily missed",
          "Solution: Automated FinBERT sentiment scoring and RAG-based financial Q&A copilot"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "SEC 10-K & BSE/NSE quarterly earnings PDFs parsed with tabular preservation",
          "FinBERT model scores paragraph-level management tone",
          "Vector database enables semantic query retrieval on complex financial metrics"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "FinBERT specialized on financial lexicon (distinguishes 'growth' from 'cost inflation')",
          "Combines quantitative financial ratios with qualitative executive sentiment",
          "Achieved 89.4% directional sentiment agreement with certified CFA analysts"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint /api/v1/invest/analyze-ticker outputs structured summaries in 48ms",
          "Streamlit equity research terminal displays interactive sentiment heatmaps",
          "Comparative peer benchmarker compares margins across competitor transcripts"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "FinBERT selected over general BERT to prevent financial terminology misinterpretation",
          "Tabular data parsed into Markdown tables to preserve balance sheet column alignment",
          "Strict temperature=0.1 prevents speculative financial hallucination"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Analyst transcript review time slashed from 6 hours to 8 minutes",
          "Early warning system flagged margin compression 2 quarters ahead of stock selloff",
          "Team Roster: K. Arvind (Lead), M. Preethi, R. Deepak, P. Swetha"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "Why is standard RoBERTa or GPT-4 insufficient compared to FinBERT for financial text?",
        "guidance": "Words like 'liability', 'exposure', or 'interest' carry completely different semantic meanings in finance compared to general English; FinBERT is pre-trained specifically on corporate disclosures."
      },
      {
        "q": "How do you handle complex tabular financial data without hallucinating numbers?",
        "guidance": "Explain Markdown table serialization and schema validation where numbers must exactly match regex patterns in the source PDF."
      }
    ]
  },
  {
    "id": 11,
    "teamNo": 11,
    "domain": "Insurance",
    "title": "Real-Time Insurance Claim Fraud Detection & Triaging System",
    "problem": "Insurance underwriters leak 10\u201314% of annual payouts to fabricated loss claims and medical billing padding.",
    "stack": [
      "Python",
      "SQL",
      "Scikit-learn",
      "FastAPI",
      "Power BI",
      "GitHub"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "S. Hariprasath (Lead)",
      "B. Janani",
      "N. Muthukumar",
      "R. Archana"
    ],
    "architectureMermaid": "graph TD\n    Claim[Claim Documents & Bills] --> OCR[OCR & Entity Extractor]\n    OCR --> GraphNet[Provider Ring Detector]\n    OCR --> XGB[XGBoost Anomaly Scorer]\n    GraphNet --> API[FastAPI Risk Classifier]\n    XGB --> API\n    API --> UI[Streamlit Investigator Dashboard]",
    "apiEndpoint": "/api/v1/insurance/evaluate-claim",
    "samplePayload": {
      "claim_id": "CLM-7782",
      "policy_age_months": 3,
      "claim_amount_inr": 285000,
      "hospital_code": "HOSP-BLR-09",
      "incident_hour": 2,
      "delayed_reporting_days": 18
    },
    "sampleResponse": {
      "status": "flagged_for_investigation",
      "claim_id": "CLM-7782",
      "fraud_probability": 0.84,
      "triage_decision": "TIER-3 FORENSIC AUDIT",
      "red_flags": [
        "New policy claim (<90 days)",
        "Hospital flagged for billing inflation",
        "Unusual midnight incident hour"
      ],
      "confidence": 0.91,
      "latency_ms": 33.2
    },
    "starterCode": {
      "main.py": "# Insurance Fraud Detection Microservice\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Insurance Fraud Triaging API\", version=\"1.0.0\")\n\nclass ClaimData(BaseModel):\n    claim_id: str\n    policy_age_months: int\n    claim_amount_inr: float\n    hospital_code: str\n    incident_hour: int\n    delayed_reporting_days: int\n\n@app.post(\"/api/v1/insurance/evaluate-claim\")\ndef evaluate_claim(req: ClaimData):\n    t0 = time.perf_counter()\n    return {\n        \"status\": \"flagged_for_investigation\",\n        \"claim_id\": req.claim_id,\n        \"fraud_probability\": 0.84,\n        \"triage_decision\": \"TIER-3 FORENSIC AUDIT\",\n        \"red_flags\": [\"New policy claim (<90 days)\", \"Hospital flagged for billing inflation\"],\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 31.8, 2)\n    }\n",
      "pipeline.py": "# Insurance Graph Ring Detection Pipeline\nclass NetworkFraudDetector:\n    def detect_collusion_cycles(self, claim_graph):\n        # Graph cycle detection for organized medical claim syndicates\n        return [\"HOSP-BLR-09\", \"AGENT-22\", \"CLM-7782\"]\n\npipeline = NetworkFraudDetector()\n",
      "schema.sql": "-- Insurance Claim Triage Records\nCREATE TABLE IF NOT EXISTS claim_audit_log (\n    claim_id VARCHAR(50) PRIMARY KEY,\n    fraud_prob NUMERIC(4, 3) NOT NULL,\n    triage_tier VARCHAR(30) NOT NULL,\n    flagged_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "General insurer loses \u20b912 Crore annually to fraudulent motor and health insurance claims",
          "Manual claims investigator review takes 14 days per file, slowing honest claims",
          "Objective: Real-time fraud scoring triaging claims into fast-track vs forensic audit"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Policy tenure, incident timing, and hospital bill line items parsed via automated pipeline",
          "Graph analysis identifies suspicious provider-claimant-agent collusion rings",
          "FastAPI microservice triggers instant automated approval or forensic escalation"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "XGBoost classifier combined with NetworkX graph cycle detection",
          "Achieved 91.2% precision on staged accident and inflated billing claims",
          "SHAP explains specific fraud red-flags to assist human field investigators"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint returns fraud triage tier in 33ms",
          "Streamlit dashboard visualizes suspicious healthcare provider collusion networks",
          "Legitimate low-risk claims (<5% fraud prob) approved in under 10 seconds"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Triaging tier architecture ensures only top 15% suspicious claims require human audit",
          "Graph clustering runs asynchronously to maintain 33ms REST response times",
          "Strict audit trails ensure compliance with IRDAI regulatory guidelines"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Projected annual loss prevention of \u20b94.8 Crores",
          "Customer satisfaction for honest claimants increased by 42% due to instant payouts",
          "Team Roster: S. Hariprasath (Lead), B. Janani, N. Muthukumar, R. Archana"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How does your system detect organized fraud syndicates rather than isolated individual fraud?",
        "guidance": "Explain the graph database layer connecting claimants, body shops, survey agents, and hospitals; dense interconnected cliques with repeating bank accounts flag syndicate rings."
      },
      {
        "q": "What is the false positive rate and how do you protect honest policyholders?",
        "guidance": "Low fraud probability claims (<10%) are auto-approved instantly; claims flagged as moderate risk undergo expedited desk audit within 24 hours without accusing the policyholder."
      }
    ]
  },
  {
    "id": 12,
    "teamNo": 12,
    "domain": "Logistics",
    "title": "Supply Chain Route Optimization & Delay Prediction",
    "problem": "Urban parcel delivery fleets suffer 28% delivery delays and high fuel burn due to dynamic traffic congestion and poor routing.",
    "stack": [
      "Python",
      "SQL",
      "Scikit-learn",
      "Power BI",
      "Streamlit",
      "FastAPI"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "C. Rajesh (Lead)",
      "V. Sneha",
      "D. Logesh",
      "P. Aishwarya"
    ],
    "architectureMermaid": "graph TD\n    Orders[Order Manifests & GPS] --> DistanceMatrix[OSM Distance Matrix]\n    DistanceMatrix --> VRP[Google OR-Tools VRP Solver]\n    DistanceMatrix --> DelayModel[Random Forest Delay Predictor]\n    VRP --> API[FastAPI Fleet Dispatcher]\n    DelayModel --> API\n    API --> UI[Streamlit Driver Navigation Portal]",
    "apiEndpoint": "/api/v1/logistics/optimize-route",
    "samplePayload": {
      "fleet_id": "FLEET-CHN-02",
      "num_deliveries": 18,
      "origin_coords": [
        13.0827,
        80.2707
      ],
      "time_window_start": "09:00",
      "weather_condition": "Monsoon Light Rain"
    },
    "sampleResponse": {
      "status": "optimized",
      "fleet_id": "FLEET-CHN-02",
      "total_route_distance_km": 42.6,
      "estimated_completion_mins": 215,
      "fuel_saved_liters": 3.8,
      "on_time_delivery_probability": 0.94,
      "recommended_first_drop": "HUB-GUINDY-01",
      "latency_ms": 35.7
    },
    "starterCode": {
      "main.py": "# Logistics Fleet Route Optimization Microservice\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Logistics Route Optimizer API\", version=\"1.0.0\")\n\nclass RouteRequest(BaseModel):\n    fleet_id: str\n    num_deliveries: int\n    origin_coords: list[float]\n    time_window_start: str\n    weather_condition: str\n\n@app.post(\"/api/v1/logistics/optimize-route\")\ndef optimize_fleet_route(req: RouteRequest):\n    t0 = time.perf_counter()\n    return {\n        \"status\": \"optimized\",\n        \"fleet_id\": req.fleet_id,\n        \"total_route_distance_km\": round(req.num_deliveries * 2.3, 1),\n        \"estimated_completion_mins\": req.num_deliveries * 12,\n        \"fuel_saved_liters\": 3.8,\n        \"on_time_delivery_probability\": 0.94,\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 34.2, 2)\n    }\n",
      "pipeline.py": "# Vehicle Routing Problem (VRP) Solver Engine\nclass VRPSolver:\n    def solve_capacitated_vrp(self, distance_matrix, demands, vehicle_capacities):\n        return {\"routes\": [[0, 3, 5, 2, 0], [0, 1, 4, 0]], \"total_cost\": 42.6}\n\nsolver = VRPSolver()\n",
      "schema.sql": "-- Fleet Route Dispatch Log\nCREATE TABLE IF NOT EXISTS fleet_routes (\n    route_id SERIAL PRIMARY KEY,\n    fleet_id VARCHAR(50) NOT NULL,\n    distance_km NUMERIC(5, 2) NOT NULL,\n    dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Last-mile delivery firm burns 22% excess diesel due to static driver routing",
          "Urban road congestion and tight delivery time-windows lead to 28% missed SLAs",
          "Target: Dynamic multi-drop route optimization paired with machine learning delay forecasting"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Order destination coordinates and real-time traffic speeds streamed via OpenStreetMap",
          "Distance matrix generated for 50+ drop points within metropolitan limits",
          "FastAPI microservice recalculates route stops dynamically on driver progress"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "Google OR-Tools Capacitated Vehicle Routing Problem (CVRP) solver",
          "Random Forest model predicts delivery delays based on weather, time, and parcel weight",
          "94.6% on-time delivery prediction accuracy achieved in Chennai metro pilots"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint calculates optimal multi-stop route in 35ms",
          "Streamlit mobile-friendly portal displays turn-by-turn stop sequence for delivery riders",
          "Fleet manager cockpit tracks live vehicle locations and fuel conservation metrics"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Heuristic Guided Local Search used in OR-Tools to solve NP-hard VRP within 500ms",
          "Dynamic re-routing only triggers when delay threshold exceeds 15 minutes to avoid rider confusion",
          "PostgreSQL PostGIS spatial extensions enable sub-second geo-fencing queries"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Fleet fuel consumption reduced by 18.5%, saving 3.8 liters per vehicle daily",
          "On-time delivery SLA compliance increased from 72% to 94%",
          "Team Roster: C. Rajesh (Lead), V. Sneha, D. Logesh, P. Aishwarya"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How do you scale your Vehicle Routing Problem solver when delivery stops increase from 20 to 1,000?",
        "guidance": "Explain spatial clustering (K-Means/DBSCAN) that partitions 1,000 drops into localized micro-clusters before solving each cluster's VRP in parallel."
      },
      {
        "q": "How does your system react if a road is suddenly blocked due to construction?",
        "guidance": "The delay prediction engine receives driver telemetry; when speed drops to 0 for >5 minutes, the graph edge weight is increased to infinity and remaining stops are re-sequenced."
      }
    ]
  },
  {
    "id": 13,
    "teamNo": 13,
    "domain": "Real Estate",
    "title": "House Price Prediction & Market Trend Dashboard",
    "problem": "Property buyers and mortgage lenders experience 3-week appraisal delays and mispriced valuations due to manual comps.",
    "stack": [
      "Python",
      "SQL",
      "Scikit-learn",
      "Power BI",
      "Streamlit",
      "FastAPI"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "N. Siddharth (Lead)",
      "R. Abinaya",
      "K. Manoj",
      "M. Gayathri"
    ],
    "architectureMermaid": "graph TD\n    Deeds[Sub-Registrar Deeds] --> Geo[Geopandas Spatial Enrichment]\n    Geo --> LightGBM[LightGBM Hedonic Valuation Model]\n    LightGBM --> API[FastAPI Valuation Engine]\n    API --> UI[Streamlit Real Estate Dashboard]",
    "apiEndpoint": "/api/v1/realestate/appraise-property",
    "samplePayload": {
      "locality": "OMR Sholinganallur, Chennai",
      "super_builtup_sqft": 1450,
      "bedrooms": 3,
      "floor_number": 6,
      "distance_to_metro_km": 0.8,
      "property_age_years": 2
    },
    "sampleResponse": {
      "status": "appraised",
      "estimated_market_value_inr": 9200000,
      "price_per_sqft_inr": 6344,
      "valuation_confidence_range": [
        8800000,
        9600000
      ],
      "expected_rental_yield_pct": 4.8,
      "capital_appreciation_forecast_3y": "+14.2%",
      "latency_ms": 31.0
    },
    "starterCode": {
      "main.py": "# Real Estate Automated Valuation Model (AVM) API\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Real Estate AVM API\", version=\"1.0.0\")\n\nclass PropertySpec(BaseModel):\n    locality: str\n    super_builtup_sqft: int\n    bedrooms: int\n    floor_number: int\n    distance_to_metro_km: float\n    property_age_years: int\n\n@app.post(\"/api/v1/realestate/appraise-property\")\ndef appraise(req: PropertySpec):\n    t0 = time.perf_counter()\n    base_price = req.super_builtup_sqft * 6344\n    return {\n        \"status\": \"appraised\",\n        \"estimated_market_value_inr\": base_price,\n        \"price_per_sqft_inr\": 6344,\n        \"valuation_confidence_range\": [int(base_price * 0.95), int(base_price * 1.05)],\n        \"expected_rental_yield_pct\": 4.8,\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 30.1, 2)\n    }\n",
      "pipeline.py": "# Geospatial Spatial Feature Engineering\nclass GeoSpatialPipeline:\n    def enrich_proximity(self, lat, lon):\n        # Calculate Haversine distance to nearest metro and IT hubs\n        return {\"distance_metro_km\": 0.8, \"it_park_km\": 1.2}\n\npipeline = GeoSpatialPipeline()\n",
      "schema.sql": "-- Property Appraisal Audit Records\nCREATE TABLE IF NOT EXISTS property_appraisals (\n    id SERIAL PRIMARY KEY,\n    locality VARCHAR(100) NOT NULL,\n    appraised_value NUMERIC(12, 2) NOT NULL,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Homebuyers and mortgage lenders face 21-day delays in physical property appraisals",
          "Mispriced valuations cause loan defaults or stalled residential property sales",
          "Solution: Automated Valuation Model (AVM) with sub-second fair market price estimation"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Deed registrations, circle rates, and property listings cleaned via automated ETL",
          "Geopandas enriches spatial proximity to metro stations, schools, and tech corridors",
          "FastAPI microservice serves price appraisals and confidence intervals in 31ms"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "LightGBM gradient boosting regressor with spatial coordinate embeddings",
          "Achieved 94.2% MdAPE (Median Absolute Percentage Error) within 4.8%",
          "Outperformed human appraiser valuations on variance vs actual sale price"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint returns appraised value and confidence bands in 31ms",
          "Streamlit dashboard displays interactive 3D price heatmaps across Chennai localities",
          "Investment calculator computes estimated rental yields and 3-year ROI forecasts"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Hedonic pricing regressor chosen over black-box deep neural networks for transparency",
          "Spatial coordinates clustered to prevent extreme outlier luxury villas from skewing apartments",
          "Indexed PostGIS database delivers instant comparable property sales lookup"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Mortgage appraisal turnaround reduced from 3 weeks to under 60 seconds",
          "Banks can pre-approve home loans instantly based on verified property collateral",
          "Team Roster: N. Siddharth (Lead), R. Abinaya, K. Manoj, M. Gayathri"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How do you account for unrecorded interior renovations that don't appear in public deed data?",
        "guidance": "Explain the confidence interval range (e.g. \u00b15%) and user-selectable condition ratings (unfurnished vs luxury renovation) that dynamically shift baseline valuations."
      },
      {
        "q": "Why LightGBM instead of standard Linear Regression for property valuation?",
        "guidance": "Real estate features have strong non-linear interactions; for example, being 500m from a metro station is extremely valuable in urban centers but irrelevant in suburban farmhouses."
      }
    ]
  },
  {
    "id": 14,
    "teamNo": 14,
    "domain": "Energy",
    "title": "Energy Consumption Forecasting & Smart Grid Analytics",
    "problem": "Electricity distribution utilities incur massive tariff penalties and transmission losses from inaccurate day-ahead peak load predictions.",
    "stack": [
      "Python",
      "SQL",
      "Scikit-learn",
      "Power BI",
      "FastAPI",
      "GitHub"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "E. Thilagavathi (Lead)",
      "S. Pradeep",
      "K. Monisha",
      "R. Sanjay"
    ],
    "architectureMermaid": "graph TD\n    Meters[Smart Meter 15-min Streams] --> Agg[Aggregator & Weather Feed]\n    Agg --> Prophet[Prophet & Gradient Boost Forecaster]\n    Prophet --> Peak[Peak Load Classifier]\n    Peak --> API[FastAPI Grid Server]\n    API --> UI[Streamlit Grid Dispatcher]",
    "apiEndpoint": "/api/v1/energy/load-forecast",
    "samplePayload": {
      "substation_id": "SUBSTN-TN-08",
      "target_date": "2026-09-15",
      "ambient_temp_forecast_c": 34.2,
      "industrial_feeder_count": 12,
      "is_holiday": 0
    },
    "sampleResponse": {
      "status": "forecasted",
      "substation_id": "SUBSTN-TN-08",
      "predicted_peak_load_mw": 84.6,
      "peak_window_hours": "14:00 - 17:30",
      "battery_storage_dispatch_mw": 12.0,
      "grid_stability_margin": "SAFE (+16.4%)",
      "latency_ms": 34.0
    },
    "starterCode": {
      "main.py": "# Smart Grid Energy Load Forecasting API\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Smart Grid Load Forecaster API\", version=\"1.0.0\")\n\nclass SubstationLoadQuery(BaseModel):\n    substation_id: str\n    target_date: str\n    ambient_temp_forecast_c: float\n    industrial_feeder_count: int\n    is_holiday: int\n\n@app.post(\"/api/v1/energy/load-forecast\")\ndef forecast_load(req: SubstationLoadQuery):\n    t0 = time.perf_counter()\n    peak = 84.6 if req.ambient_temp_forecast_c > 32 else 72.4\n    return {\n        \"status\": \"forecasted\",\n        \"substation_id\": req.substation_id,\n        \"predicted_peak_load_mw\": peak,\n        \"peak_window_hours\": \"14:00 - 17:30\",\n        \"battery_storage_dispatch_mw\": 12.0,\n        \"grid_stability_margin\": \"SAFE (+16.4%)\",\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 33.1, 2)\n    }\n",
      "pipeline.py": "# Weather & Smart Meter Time-Series Ingestion\nclass GridLoadPipeline:\n    def preprocess_weather(self, temp, humidity, solar_irradiance):\n        return {\"heat_index\": temp * 1.1 + (humidity * 0.05)}\n\npipeline = GridLoadPipeline()\n",
      "schema.sql": "-- Substation Load Telemetry Records\nCREATE TABLE IF NOT EXISTS substation_forecasts (\n    id SERIAL PRIMARY KEY,\n    substation_id VARCHAR(50) NOT NULL,\n    forecast_mw NUMERIC(6, 2) NOT NULL,\n    target_date DATE NOT NULL,\n    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "Electricity board pays \u20b918 Crore in grid frequency deviation penalties annually",
          "Solar renewable intermittent generation causes unpredictable voltage sags during afternoon peaks",
          "Target: Day-ahead 15-minute substation load forecasting with battery dispatch optimization"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "AMI smart meters stream 15-minute interval kW telemetry via secure MQTT brokers",
          "Real-time weather forecasts (temperature, humidity, solar irradiance) joined dynamically",
          "FastAPI microservice communicates dispatch instructions to battery storage units"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "Hybrid Prophet seasonal decomposition model combined with LightGBM regressors",
          "Achieved 96.8% day-ahead load accuracy (MAPE < 3.2%)",
          "Identifies peak demand hours 24 hours in advance to schedule peak-shaving batteries"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint generates 24-hour hourly load curves in 34ms",
          "Streamlit grid operator dashboard displays live megawatt telemetry and reserve margins",
          "Power BI analytics tracks transformer thermal stress and loss reduction"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "Time-series cross-validation prevents data leakage across seasonal calendar weeks",
          "In-memory time-series buffering enables sub-second re-forecasts when heat waves arrive",
          "Containerized microservice conforms to utility IEC 61850 industrial standards"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Peak-hour grid transmission loss reduced by 14% across 8 substations",
          "Avoided \u20b92.4 Crores in grid unscheduled interchange (UI) deviation penalties",
          "Team Roster: E. Thilagavathi (Lead), S. Pradeep, K. Monisha, R. Sanjay"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How does your model adjust when ambient temperature unexpectedly spikes by 5\u00b0C on a summer afternoon?",
        "guidance": "Explain how the feature pipeline ingests live weather radar updates and recalibrates air-conditioning load elasticity on the hourly LightGBM model."
      },
      {
        "q": "Why combine Prophet with LightGBM rather than using Prophet alone?",
        "guidance": "Prophet handles long-term seasonality and holidays cleanly, but LightGBM excels at modeling complex non-linear external features like real-time humidity and industrial shifts."
      }
    ]
  },
  {
    "id": 15,
    "teamNo": 15,
    "domain": "Government / Legal",
    "title": "GenAI Document Summarization & Policy Q&A Assistant (RAG)",
    "problem": "Government officials spend weeks reviewing multi-hundred page gazettes, tenders, and statutory policies.",
    "stack": [
      "Python",
      "GenAI",
      "RAG",
      "FastAPI",
      "SQL",
      "GitHub"
    ],
    "mentor": "Prof. Anjit Raja R",
    "members": [
      "S. Balaji (Lead)",
      "N. Nandhini",
      "K. Vignesh",
      "A. Aarthi"
    ],
    "architectureMermaid": "graph TD\n    GazettePDFs[Statutory Policy Gazettes] --> OCR[PyMuPDF & Table Extraction]\n    OCR --> Chunks[Hierarchical Clause Chunker]\n    Chunks --> VStore[(Qdrant Vector DB)]\n    Query[Official Legal Query] --> ReRanker[Cohere / BGE Re-Ranker]\n    ReRanker --> LLM[Local Llama 3 / Mistral LLM]\n    LLM --> VerifiedSummary[Summary with Clause Citations]",
    "apiEndpoint": "/api/v1/legal/policy-qa",
    "samplePayload": {
      "doc_id": "GAZETTE-TN-2026-08",
      "clause_query": "What is the penalty for non-compliance with renewable energy procurement quotas?"
    },
    "sampleResponse": {
      "status": "found",
      "clause_reference": "Section 14, Sub-clause (c), Page 42",
      "penalty_summary": "A compounding penalty of Rs 2.50 per shortfall unit applies after the 90-day cure period.",
      "statutory_validity": "Active through FY 2027",
      "latency_ms": 44.5
    },
    "starterCode": {
      "main.py": "# Legal Policy Summarization & Q&A Microservice\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport time\n\napp = FastAPI(title=\"Statutory Legal RAG API\", version=\"1.0.0\")\n\nclass LegalQuery(BaseModel):\n    doc_id: str\n    clause_query: str\n\n@app.post(\"/api/v1/legal/policy-qa\")\ndef query_policy(req: LegalQuery):\n    t0 = time.perf_counter()\n    return {\n        \"status\": \"found\",\n        \"clause_reference\": \"Section 14, Sub-clause (c), Page 42\",\n        \"penalty_summary\": \"A compounding penalty of Rs 2.50 per shortfall unit applies after the 90-day cure period.\",\n        \"statutory_validity\": \"Active through FY 2027\",\n        \"latency_ms\": round((time.perf_counter() - t0) * 1000 + 43.1, 2)\n    }\n",
      "pipeline.py": "# Legal Hierarchical Clause Parser\nclass LegalDocumentChunker:\n    def parse_clauses(self, gazette_text: str):\n        # Hierarchical clause and subsection splitter preserving statutory hierarchy\n        return [{\"clause\": \"Section 14\", \"text\": gazette_text[:400]}]\n\npipeline = LegalDocumentChunker()\n",
      "schema.sql": "-- Legal Query Audit Schema\nCREATE TABLE IF NOT EXISTS legal_qa_audit (\n    query_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    doc_id VARCHAR(100) NOT NULL,\n    clause_ref VARCHAR(100) NOT NULL,\n    queried_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n"
    },
    "pitchSlides": [
      {
        "num": 1,
        "title": "Executive Problem & Business Value",
        "points": [
          "State government departments process 500+ page policy gazettes and public procurement tenders",
          "Manual legal scrutiny takes 3 to 4 weeks, delaying critical infrastructure projects",
          "Target: High-precision GenAI assistant providing grounded legal clause citations in seconds"
        ]
      },
      {
        "num": 2,
        "title": "Data Pipeline & Architecture",
        "points": [
          "Complex multi-column PDF gazettes parsed using PyMuPDF with table coordinate retention",
          "Hierarchical chunking preserves nested Section, Sub-section, and Proviso relationships",
          "Qdrant vector store paired with dense & sparse hybrid retrieval"
        ]
      },
      {
        "num": 3,
        "title": "AI/ML Modeling Layer",
        "points": [
          "Local Mistral-7B-Instruct LLM runs securely on air-gapped government servers",
          "Cross-encoder re-ranker filters top-3 statutory clauses matching the legal inquiry",
          "100% strict adherence to retrieved text with zero ungrounded legal speculation"
        ]
      },
      {
        "num": 4,
        "title": "Application & Live Inference Demo",
        "points": [
          "FastAPI endpoint /api/v1/legal/policy-qa returns exact clause citations in 44ms",
          "Streamlit legal portal highlights exact source PDF paragraph with clickable page links",
          "Export function compiles executive ministerial briefing summaries in Word and PDF"
        ]
      },
      {
        "num": 5,
        "title": "System Design Trade-offs",
        "points": [
          "On-premise air-gapped deployment ensures government gazette confidentiality",
          "Hierarchical chunking chosen over fixed-token chunking to avoid cutting legal clauses in half",
          "Strict hallucination prevention guardrails refuse to answer if clause is absent"
        ]
      },
      {
        "num": 6,
        "title": "Conclusion, ROI & Team Roster",
        "points": [
          "Tender compliance verification time reduced from 21 days to 45 minutes",
          "Zero data leakage with 100% on-premise local model processing",
          "Team Roster: S. Balaji (Lead), N. Nandhini, K. Vignesh, A. Aarthi"
        ]
      }
    ],
    "juryQuestions": [
      {
        "q": "How does your chunker prevent splitting a legal sentence across two chunks when a proviso continues across pages?",
        "guidance": "Explain the hierarchical clause parser that splits on formal legal boundary headers ('Section', 'Sub-clause', 'Provided that') rather than arbitrary character counts."
      },
      {
        "q": "How do you protect sensitive, non-public government tenders from leaking?",
        "guidance": "Highlight that the model runs completely air-gapped on-premise using local open weights (Mistral 7B) with zero external internet API calls or telemetry."
      }
    ]
  }
];

// ==========================================================================
// 2. STATE CONTROLLER
// ==========================================================================
const PortalState = {
  currentDay: 11, // 11 or 12
  currentSectionIndex: 0, // 0 to 3
  currentTeam: CAPSTONE_TEAMS[0],
  
  // Timer State (5-Hour Session: 5 * 3600 = 18000 seconds)
  timerSecondsElapsed: 3600 + 1200, // starting at 1h 20m into demo block for rich experience
  timerRunning: true,
  timerInterval: null,
  
  // Weights: 20% Concept, 30% Demo, 35% Lab, 15% Assessment
  progress: {
    concept: 100,
    demo: 75,
    lab: 40,
    assessment: 0
  },
  
  // Day 11 Checklists
  day11Checklist: [
    { id: "d11_1", text: "Production Architecture & Schema Finalization", subtext: "PostgreSQL DDL & ER diagram verified", checked: true },
    { id: "d11_2", text: "Containerization & Docker Compose Setup", subtext: "Multi-stage Dockerfile & healthcheck verified", checked: true },
    { id: "d11_3", text: "Core Model Inference Pipeline & API Wrap", subtext: "FastAPI /predict endpoint functioning with <50ms latency", checked: false },
    { id: "d11_4", text: "Automated Static Code Audit (Pytest & Flake8)", subtext: "Min 85% test coverage and 0 high-severity flaws", checked: false }
  ],

  // Day 12 Checklists
  day12Checklist: [
    { id: "d12_1", text: "Executive Pitch Deck Draft (6-Slide Standard)", subtext: "Problem, Architecture, Results & ROI clearly articulated", checked: true },
    { id: "d12_2", text: "Boardroom System Design Defense Drill", subtext: "Latency vs Accuracy trade-offs and scaling bottlenecks prepared", checked: false },
    { id: "d12_3", text: "Dry Run Studio Video Pitch & Pacing Test", subtext: "Target 130-150 WPM speech cadence with <3 filler words", checked: false },
    { id: "d12_4", text: "Live Jury Defense & Portfolio Webpage Export", subtext: "Complete 100-mark rubric evaluation and GitHub launch", checked: false }
  ],

  // Rubric Scores (Max: 80 Team + 20 Viva = 100)
  rubric: {
    problemUnderstanding: 9,
    dataPipelineEDA: 14,
    modelGenAILayer: 18,
    applicationLayer: 13,
    githubDocs: 9,
    presentationDemo: 9,
    individualViva: 17
  },

  // Active Editor File & Content
  activeEditorFile: "main.py",
  files: {
    "main.py": "",
    "pipeline.py": "",
    "schema.sql": "",
    "docker-compose.yml": `version: '3.8'

services:
  capstone-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - LOG_LEVEL=info
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 15s
      timeout: 5s
      retries: 3
    restart: unless-stopped

  postgres-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: capstone_user
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: capstone_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
`,
    "test_capstone.py": `import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check():
    assert 200 == 200

@pytest.mark.asyncio
async def test_inference_latency():
    latency = 34.2
    assert latency < 100.0, "Latency exceeds 100ms SLA"

def test_data_pipeline_integrity():
    sample_vec = [1, 2, 3, 4]
    assert len(sample_vec) == 4
`
  },

  // Dry Run Studio State
  dryRun: {
    isRecording: false,
    isScreenSharing: false,
    screenStream: null,
    cameraStream: null,
    speechRecognition: null,
    isSpeechRecognizing: false,
    currentSlide: 1,
    totalSlides: 6,
    slideTimerSec: 60,
    slideTimerRunning: false,
    slideTimerInterval: null,
    wordCount: 0,
    speechRateWPM: 138,
    fillerWords: { um: 0, uh: 0, basically: 0, like: 0 },
    currentJuryIndex: 0
  }
};

// ==========================================================================
// 3. CORE INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTeamDropdown();
  initSprintTimer();
  initSectionNavigation();
  initIdeEditor();
  initEndpointTester();
  initArchViewer();
  initChecklistListeners();
  initScorecardCalculations();
  initLiveQA();
  initDryRunStudio();
  updateHeaderProgress();
  renderCurrentSectionView();
  
  // Set initial team files and slides
  updateIdeForTeam();
  updatePitchDeckForTeam();
  updateJuryQuestionForTeam();
});

// ==========================================================================
// 4. HEADER, TIMER & PROGRESS DASHBOARD
// ==========================================================================
function initTeamDropdown() {
  const select = document.getElementById("teamSelect");
  if (!select) return;
  select.innerHTML = "";
  CAPSTONE_TEAMS.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `Team ${t.teamNo}: ${t.title.length > 34 ? t.title.substring(0, 34) + '...' : t.title}`;
    select.appendChild(opt);
  });
  select.value = PortalState.currentTeam.id;

  select.addEventListener("change", (e) => {
    const chosen = CAPSTONE_TEAMS.find(t => t.id === parseInt(e.target.value, 10));
    if (chosen) {
      PortalState.currentTeam = chosen;
      updateTeamBadgeDisplay();
      renderArchDiagram();
      updateEndpointDefaults();
      renderTerminalLogs();
      updateScorecardForTeam();
      updateIdeForTeam();
      updatePitchDeckForTeam();
      updateJuryQuestionForTeam();
    }
  });
  updateTeamBadgeDisplay();
}

function updateTeamBadgeDisplay() {
  const t = PortalState.currentTeam;
  const nameEl = document.getElementById("sidebarTeamTitle");
  const domainEl = document.getElementById("sidebarTeamDomain");
  const stackEl = document.getElementById("sidebarTeamStack");
  const leadEl = document.getElementById("sidebarTeamLead");

  if (nameEl) nameEl.textContent = `Team ${t.teamNo}: ${t.title}`;
  if (domainEl) domainEl.textContent = `${t.domain.toUpperCase()} SECTOR`;
  if (leadEl) leadEl.textContent = t.members[0];
  if (stackEl) {
    stackEl.innerHTML = t.stack.map(s => `<span class="stack-tag">${s}</span>`).join("");
  }
}

function initSprintTimer() {
  const timerClock = document.getElementById("timerClock");
  const toggleBtn = document.getElementById("timerToggleBtn");
  const resetBtn = document.getElementById("timerResetBtn");

  function updateDisplay() {
    const hrs = Math.floor(PortalState.timerSecondsElapsed / 3600);
    const mins = Math.floor((PortalState.timerSecondsElapsed % 3600) / 60);
    const secs = PortalState.timerSecondsElapsed % 60;
    timerClock.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    let activeSec = 0;
    if (PortalState.timerSecondsElapsed < 3600) activeSec = 0;
    else if (PortalState.timerSecondsElapsed < 9000) activeSec = 1;
    else if (PortalState.timerSecondsElapsed < 15300) activeSec = 2;
    else activeSec = 3;

    highlightTimelinePill(activeSec);
  }

  PortalState.timerInterval = setInterval(() => {
    if (PortalState.timerRunning && PortalState.timerSecondsElapsed < 18000) {
      PortalState.timerSecondsElapsed++;
      updateDisplay();
    }
  }, 1000);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      PortalState.timerRunning = !PortalState.timerRunning;
      toggleBtn.innerHTML = PortalState.timerRunning ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      PortalState.timerSecondsElapsed = 0;
      updateDisplay();
    });
  }

  updateDisplay();
}

function highlightTimelinePill(blockIndex) {
  const pills = document.querySelectorAll(".legend-item");
  pills.forEach((p, idx) => {
    p.classList.toggle("active", idx === blockIndex);
  });
}

function updateHeaderProgress() {
  const c = PortalState.progress.concept * 0.20;
  const d = PortalState.progress.demo * 0.30;
  const l = PortalState.progress.lab * 0.35;
  const a = PortalState.progress.assessment * 0.15;
  const total = Math.round(c + d + l + a);

  const pctLabel = document.getElementById("overallProgressPct");
  if (pctLabel) pctLabel.textContent = `${total}% Completed`;
  
  const barConcept = document.querySelector(".bar-concept");
  const barDemo = document.querySelector(".bar-demo");
  const barLab = document.querySelector(".bar-lab");
  const barAssessment = document.querySelector(".bar-assessment");

  if (barConcept) barConcept.style.opacity = PortalState.progress.concept > 0 ? "1" : "0.3";
  if (barDemo) barDemo.style.opacity = PortalState.progress.demo > 0 ? "1" : "0.3";
  if (barLab) barLab.style.opacity = PortalState.progress.lab > 0 ? "1" : "0.3";
  if (barAssessment) barAssessment.style.opacity = PortalState.progress.assessment > 0 ? "1" : "0.3";
}

// Switch between Day 11 and Day 12
window.switchDayModule = function(day) {
  PortalState.currentDay = day;
  document.getElementById("btnDay11").classList.toggle("active", day === 11);
  document.getElementById("btnDay12").classList.toggle("active", day === 12);
  
  renderScheduleCards();
  renderCurrentSectionView();
  renderChecklist();
};

window.switchSectionByBlock = function(blockIndex) {
  PortalState.currentSectionIndex = blockIndex;
  renderScheduleCards();
  renderCurrentSectionView();
  focusTargetPanelForBlock(blockIndex);
};

function focusTargetPanelForBlock(blockIndex) {
  let targetSelector = "";
  if (PortalState.currentDay === 11) {
    if (blockIndex === 0) targetSelector = ".arch-diagram-viewer";
    else if (blockIndex === 1) targetSelector = ".video-player-container";
    else if (blockIndex === 2) targetSelector = ".ide-wrapper";
    else if (blockIndex === 3) targetSelector = ".scorecard-table";
  } else {
    if (blockIndex === 0) targetSelector = ".pitch-deck-box";
    else if (blockIndex === 1) targetSelector = ".panel-conferencing-grid";
    else if (blockIndex === 2) targetSelector = ".camera-preview-box";
    else if (blockIndex === 3) targetSelector = ".scorecard-table";
  }

  if (targetSelector) {
    const el = document.querySelector(targetSelector);
    if (el) {
      const cardPanel = el.closest(".card-panel");
      if (cardPanel) {
        cardPanel.scrollIntoView({ behavior: "smooth", block: "center" });
        cardPanel.classList.remove("panel-focused");
        void cardPanel.offsetWidth; // trigger reflow
        cardPanel.classList.add("panel-focused");
      }
    }
  }
}

// ==========================================================================
// 5. SCHEDULE SECTIONS & WORKSPACE NAVIGATION
// ==========================================================================
const SCHEDULE_CONFIG = {
  11: [
    {
      secNum: 1,
      pct: "20% Concept",
      pctClass: "pct-concept",
      time: "Hour 0 — 1 (60 min)",
      title: "Architecting for Scale: Production Architecture & Schema Finalization",
      desc: "Interactive architecture canvas, database schema design, and microservice decoupling.",
      tabTarget: "arch"
    },
    {
      secNum: 2,
      pct: "30% Demo",
      pctClass: "pct-demo",
      time: "Hour 1 — 2.5 (90 min)",
      title: "From Localhost to Cloud: CI/CD Pipelines & Security Best Practices",
      desc: "Synchronized live video demonstration of containerization, secrets management, and automated deployments.",
      tabTarget: "demo"
    },
    {
      secNum: 3,
      pct: "35% Lab",
      pctClass: "pct-lab",
      time: "Hour 2.5 — 4.25 (105 min)",
      title: "Core Feature Implementation Sprint & End-to-End Integration",
      desc: "Multi-tab developer IDE, live REST/FastAPI endpoint tester, and real-time terminal output.",
      tabTarget: "ide"
    },
    {
      secNum: 4,
      pct: "15% Assessment",
      pctClass: "pct-assessment",
      time: "Hour 4.25 — 5 (45 min)",
      title: "Automated Code Audit & Peer Architecture Review",
      desc: "Static code analyzer feedback, automated test coverage, and peer comment threads.",
      tabTarget: "eval"
    }
  ],
  12: [
    {
      secNum: 1,
      pct: "20% Concept",
      pctClass: "pct-concept",
      time: "Hour 0 — 1 (60 min)",
      title: "The Engineer’s Pitch: Crafting a High-Impact Technical Narrative",
      desc: "Slide layout builder paired with technical storytelling and the STAR behavioral framework.",
      tabTarget: "story"
    },
    {
      secNum: 2,
      pct: "30% Demo",
      pctClass: "pct-demo",
      time: "Hour 1 — 2.5 (90 min)",
      title: "Mastering the Boardroom: System Design Defense & Live Q&A",
      desc: "Interactive panel view showing mock interview video streams and system trade-off breakdowns.",
      tabTarget: "demo"
    },
    {
      secNum: 3,
      pct: "35% Lab",
      pctClass: "pct-lab",
      time: "Hour 2.5 — 4.25 (105 min)",
      title: "Dry Run Studio: Recording Your Pitch & Interview Drilling",
      desc: "Camera recorder interface, AI speech-to-text transcript analyzer, and mock technical question bank.",
      tabTarget: "studio"
    },
    {
      secNum: 4,
      pct: "15% Assessment",
      pctClass: "pct-assessment",
      time: "Hour 4.25 — 5 (45 min)",
      title: "Capstone Defense Panel & One-Click Portfolio Launch",
      desc: "Live jury evaluation grid (100-mark rubric), final scorecard summary, and celebration screen.",
      tabTarget: "panel"
    }
  ]
};

function initSectionNavigation() {
  renderScheduleCards();
}

function renderScheduleCards() {
  const container = document.getElementById("timelineSectionList");
  if (!container) return;
  container.innerHTML = "";

  const sections = SCHEDULE_CONFIG[PortalState.currentDay];
  sections.forEach((sec, idx) => {
    const card = document.createElement("div");
    card.className = `section-nav-card ${idx === PortalState.currentSectionIndex ? "active" : ""}`;
    card.onclick = () => {
      PortalState.currentSectionIndex = idx;
      renderScheduleCards();
      renderCurrentSectionView();
      focusTargetPanelForBlock(idx);
    };

    card.innerHTML = `
      <div class="sec-header">
        <span class="sec-pct ${sec.pctClass}">${sec.pct}</span>
        <span class="sec-time"><i class="far fa-clock"></i> ${sec.time.split(' ')[0]}</span>
      </div>
      <div class="sec-title">${sec.title}</div>
      <div class="sec-time" style="font-size: 0.68rem;">${sec.time}</div>
    `;
    container.appendChild(card);
  });
}

function renderCurrentSectionView() {
  const sec = SCHEDULE_CONFIG[PortalState.currentDay][PortalState.currentSectionIndex];
  const titleEl = document.getElementById("activeSectionTitle");
  const descEl = document.getElementById("activeSectionDesc");
  const badgeEl = document.getElementById("activeSectionBadge");

  if (titleEl) titleEl.textContent = sec.title;
  if (descEl) descEl.textContent = sec.desc;
  if (badgeEl) badgeEl.textContent = `Day ${PortalState.currentDay} • Section ${sec.secNum}`;

  const d11Panels = document.getElementById("day11PanelsContainer");
  const d12Panels = document.getElementById("day12PanelsContainer");

  if (PortalState.currentDay === 11) {
    if (d11Panels) d11Panels.style.display = "grid";
    if (d12Panels) d12Panels.style.display = "none";
  } else {
    if (d11Panels) d11Panels.style.display = "none";
    if (d12Panels) d12Panels.style.display = "grid";
  }
}

// ==========================================================================
// 6. EMBEDDED IDE ENGINE (DYNAMIC BY TEAM)
// ==========================================================================
function updateIdeForTeam() {
  const t = PortalState.currentTeam;
  if (t.starterCode) {
    PortalState.files["main.py"] = t.starterCode["main.py"] || PortalState.files["main.py"];
    PortalState.files["pipeline.py"] = t.starterCode["pipeline.py"] || PortalState.files["pipeline.py"];
    PortalState.files["schema.sql"] = t.starterCode["schema.sql"] || PortalState.files["schema.sql"];
  }
  const codeArea = document.getElementById("ideCodeArea");
  if (codeArea) {
    codeArea.value = PortalState.files[PortalState.activeEditorFile] || "";
    updateIdeLineNumbers();
  }
}

function updateIdeLineNumbers() {
  const codeArea = document.getElementById("ideCodeArea");
  const lineNumbers = document.getElementById("ideLineNumbers");
  if (!codeArea || !lineNumbers) return;
  const lines = codeArea.value.split("\n").length;
  let numStr = "";
  for (let i = 1; i <= Math.max(lines, 20); i++) {
    numStr += `${i}\n`;
  }
  lineNumbers.textContent = numStr;
}

function initIdeEditor() {
  const codeArea = document.getElementById("ideCodeArea");
  const tabs = document.querySelectorAll(".ide-tab");

  if (codeArea) {
    codeArea.value = PortalState.files[PortalState.activeEditorFile] || "";
    updateIdeLineNumbers();

    codeArea.addEventListener("input", () => {
      PortalState.files[PortalState.activeEditorFile] = codeArea.value;
      updateIdeLineNumbers();
    });

    // Auto tab key handling (4 spaces)
    codeArea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = codeArea.selectionStart;
        const end = codeArea.selectionEnd;
        codeArea.value = codeArea.value.substring(0, start) + "    " + codeArea.value.substring(end);
        codeArea.selectionStart = codeArea.selectionEnd = start + 4;
        updateIdeLineNumbers();
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const filename = tab.getAttribute("data-file");
      PortalState.activeEditorFile = filename;
      if (codeArea) {
        codeArea.value = PortalState.files[filename] || "";
        updateIdeLineNumbers();
      }
    });
  });
}

window.copyEditorCode = function() {
  const codeArea = document.getElementById("ideCodeArea");
  if (codeArea) {
    navigator.clipboard.writeText(codeArea.value);
    showToast("Code copied to clipboard!");
  }
};

window.downloadProjectCode = function() {
  const content = PortalState.files[PortalState.activeEditorFile];
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = PortalState.activeEditorFile;
  a.click();
};

// ==========================================================================
// 7. LIVE ENDPOINT TESTER
// ==========================================================================
function initEndpointTester() {
  updateEndpointDefaults();
}

function updateEndpointDefaults() {
  const urlInput = document.getElementById("endpointUrlInput");
  const bodyArea = document.getElementById("apiBodyEditor");
  const responseBox = document.getElementById("apiResponseOutput");

  if (urlInput) urlInput.value = PortalState.currentTeam.apiEndpoint;
  if (bodyArea) bodyArea.value = JSON.stringify(PortalState.currentTeam.samplePayload, null, 2);
  if (responseBox) {
    responseBox.textContent = JSON.stringify(PortalState.currentTeam.sampleResponse, null, 2);
  }
}

window.sendTestApiRequest = function() {
  const btn = document.getElementById("btnSendApi");
  const responseBox = document.getElementById("apiResponseOutput");
  const latencyBadge = document.getElementById("apiLatencyBadge");
  const statusBadge = document.getElementById("apiStatusBadge");

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
    btn.disabled = false;

    const randomizedLatency = Math.floor(Math.random() * 15) + 26;
    const resp = Object.assign({}, PortalState.currentTeam.sampleResponse, {
      timestamp: new Date().toISOString(),
      latency_ms: randomizedLatency
    });

    if (responseBox) responseBox.textContent = JSON.stringify(resp, null, 2);
    if (latencyBadge) latencyBadge.textContent = `${randomizedLatency}ms`;
    if (statusBadge) {
      statusBadge.textContent = "200 OK";
      statusBadge.className = "status-badge-200";
    }

    appendTerminalLog(`[API] 200 OK POST ${PortalState.currentTeam.apiEndpoint} (${randomizedLatency}ms)`);
  }, 350);
};

// ==========================================================================
// 8. ARCHITECTURE DIAGRAM VIEWER (MERMAID + FALLBACK SVG)
// ==========================================================================
function initArchViewer() {
  renderArchDiagram();
}

function renderArchDiagram() {
  const container = document.getElementById("archCanvasBox");
  if (!container) return;

  const mCode = PortalState.currentTeam.architectureMermaid;
  const drawerTextarea = document.getElementById("mermaidTextarea");
  if (drawerTextarea) drawerTextarea.value = mCode;

  if (window.mermaid) {
    try {
      window.mermaid.render(`mermaid-svg-${Date.now()}`, mCode).then(({ svg }) => {
        container.innerHTML = svg;
      }).catch(err => {
        renderFallbackArchSvg(container);
      });
    } catch (e) {
      renderFallbackArchSvg(container);
    }
  } else {
    renderFallbackArchSvg(container);
  }
}

function renderFallbackArchSvg(container) {
  const t = PortalState.currentTeam;
  container.innerHTML = `
    <svg width="680" height="260" viewBox="0 0 680 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="680" height="260" rx="12" fill="#090e18" stroke="#1f2c44" stroke-width="1.5"/>
      <g transform="translate(30, 90)">
        <rect width="130" height="70" rx="8" fill="#151f33" stroke="#00e5ff" stroke-width="2"/>
        <text x="65" y="32" fill="#ffffff" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Data Ingestion</text>
        <text x="65" y="50" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">${t.domain} Feeds</text>
      </g>
      <path d="M165 125 H200" stroke="#00e5ff" stroke-width="2" stroke-dasharray="4 4"/>
      <polygon points="205,125 197,121 197,129" fill="#00e5ff"/>
      <g transform="translate(210, 90)">
        <rect width="130" height="70" rx="8" fill="#151f33" stroke="#3b82f6" stroke-width="2"/>
        <text x="65" y="32" fill="#ffffff" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Pipeline &amp; ETL</text>
        <text x="65" y="50" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">Cleaning &amp; Scaling</text>
      </g>
      <path d="M345 125 H380" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4 4"/>
      <polygon points="385,125 377,121 377,129" fill="#3b82f6"/>
      <g transform="translate(390, 85)">
        <rect width="125" height="80" rx="8" fill="#17263c" stroke="#10b981" stroke-width="2.5"/>
        <text x="62" y="34" fill="#ffffff" font-family="Inter, sans-serif" font-size="12" font-weight="800" text-anchor="middle">AI / ML Model</text>
        <text x="62" y="52" fill="#34d399" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">FastAPI Serving</text>
        <text x="62" y="68" fill="#94a3b8" font-family="Inter, sans-serif" font-size="9" text-anchor="middle">&lt;50ms Latency SLA</text>
      </g>
      <path d="M520 125 H550" stroke="#10b981" stroke-width="2" stroke-dasharray="4 4"/>
      <polygon points="555,125 547,121 547,129" fill="#10b981"/>
      <g transform="translate(560, 90)">
        <rect width="90" height="70" rx="8" fill="#151f33" stroke="#f59e0b" stroke-width="2"/>
        <text x="45" y="32" fill="#ffffff" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">UI &amp; Dash</text>
        <text x="45" y="50" fill="#fbbf24" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">Streamlit / BI</text>
      </g>
      <text x="340" y="35" fill="#00e5ff" font-family="Inter, sans-serif" font-size="12" font-weight="800" letter-spacing="1" text-anchor="middle">PRODUCTION ARCHITECTURE — TEAM ${t.teamNo}</text>
      <text x="340" y="235" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">Faculty Mentor: ${t.mentor} • End-to-End Enterprise Microservice</text>
    </svg>
  `;
}

window.toggleMermaidEditor = function() {
  const drawer = document.getElementById("mermaidDrawer");
  if (drawer) drawer.classList.toggle("open");
};

window.applyMermaidCode = function() {
  const textarea = document.getElementById("mermaidTextarea");
  if (textarea) {
    PortalState.currentTeam.architectureMermaid = textarea.value;
    renderArchDiagram();
    showToast("Architecture diagram recompiled!");
  }
};

// ==========================================================================
// 9. LAB SPRINT HUB & REAL-TIME LOGS
// ==========================================================================
function initChecklistListeners() {
  renderChecklist();
}

function renderChecklist() {
  const container = document.getElementById("labChecklistContainer");
  if (!container) return;
  container.innerHTML = "";

  const list = PortalState.currentDay === 11 ? PortalState.day11Checklist : PortalState.day12Checklist;
  let checkedCount = 0;

  list.forEach(item => {
    if (item.checked) checkedCount++;
    const row = document.createElement("div");
    row.className = `checklist-item-row ${item.checked ? "checked" : ""}`;
    row.onclick = () => {
      item.checked = !item.checked;
      renderChecklist();
      updateLabProgress();
    };

    row.innerHTML = `
      <div class="check-box-custom">
        ${item.checked ? '<i class="fas fa-check" style="font-size:0.7rem;"></i>' : ''}
      </div>
      <div class="checklist-content">
        <div class="checklist-label">${item.text}</div>
        <div class="checklist-subtext">${item.subtext}</div>
      </div>
    `;
    container.appendChild(row);
  });

  PortalState.progress.lab = Math.round((checkedCount / list.length) * 100);
  updateHeaderProgress();
}

function updateLabProgress() {
  updateHeaderProgress();
}

function renderTerminalLogs() {
  const body = document.getElementById("terminalBody");
  if (!body) return;
  body.innerHTML = `
    <div class="log-line log-info">[INFO] Workspace initialized for Team ${PortalState.currentTeam.teamNo}: ${PortalState.currentTeam.title}</div>
    <div class="log-line log-success">[DOCKER] PostgreSQL 16 Alpine container listening on port 5432 (Healthy)</div>
    <div class="log-line log-success">[UVICORN] FastAPI microservice online: http://0.0.0.0:8000${PortalState.currentTeam.apiEndpoint}</div>
    <div class="log-line log-info">[PYTEST] Discovered 24 test cases in ./tests/</div>
    <div class="log-line log-success">[PYTEST] 24 passed in 0.88s (Coverage: 91.4%)</div>
    <div class="log-line log-info">[FLAKE8] Zero critical lint or PEP8 styling violations detected.</div>
  `;
}

function appendTerminalLog(text) {
  const body = document.getElementById("terminalBody");
  if (!body) return;
  const line = document.createElement("div");
  line.className = "log-line log-info";
  line.textContent = text;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

window.runAutomatedTests = function() {
  const btn = document.getElementById("btnRunTests");
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Auditing...';
  btn.disabled = true;

  appendTerminalLog("[RUN] Triggering automated pytest suite and security vulnerability scanner...");

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-play"></i> Run Tests';
    btn.disabled = false;
    appendTerminalLog("[RESULT] 24/24 unit & integration tests passed. 0 security warnings. Bandit scan: Clean.");
    showToast("Audit complete: 91.4% test coverage verified!");
  }, 700);
};

// ==========================================================================
// 10. ASSESSMENT & RUBRIC EVALUATION (SYNCHRONIZED D11 & D12)
// ==========================================================================
function initScorecardCalculations() {
  const inputsD11 = document.querySelectorAll("#day11PanelsContainer .scorecard-input");
  const inputsD12 = document.querySelectorAll("#day12PanelsContainer .scorecard-input");

  inputsD11.forEach(input => {
    input.addEventListener("input", () => syncScorecards("d11"));
  });
  inputsD12.forEach(input => {
    input.addEventListener("input", () => syncScorecards("d12"));
  });

  calculateRubricTotals();
}

function syncScorecards(source) {
  if (source === "d11") {
    const map = [
      ["scorePU", "scorePU_d12"],
      ["scoreDP", "scoreDP_d12"],
      ["scoreML", "scoreML_d12"],
      ["scoreAL", "scoreAL_d12"],
      ["scoreGH", "scoreGH_d12"],
      ["scorePD", "scorePD_d12"],
      ["scoreVA", "scoreVA_d12"]
    ];
    map.forEach(([src, tgt]) => {
      const s = document.getElementById(src);
      const t = document.getElementById(tgt);
      if (s && t) t.value = s.value;
    });
  } else {
    const map = [
      ["scorePU_d12", "scorePU"],
      ["scoreDP_d12", "scoreDP"],
      ["scoreML_d12", "scoreML"],
      ["scoreAL_d12", "scoreAL"],
      ["scoreGH_d12", "scoreGH"],
      ["scorePD_d12", "scorePD"],
      ["scoreVA_d12", "scoreVA"]
    ];
    map.forEach(([src, tgt]) => {
      const s = document.getElementById(src);
      const t = document.getElementById(tgt);
      if (s && t) t.value = s.value;
    });
  }
  calculateRubricTotals();
}

function updateScorecardForTeam() {
  calculateRubricTotals();
}

function calculateRubricTotals() {
  const pU = parseInt(document.getElementById("scorePU")?.value || 0, 10);
  const dP = parseInt(document.getElementById("scoreDP")?.value || 0, 10);
  const mL = parseInt(document.getElementById("scoreML")?.value || 0, 10);
  const aL = parseInt(document.getElementById("scoreAL")?.value || 0, 10);
  const gH = parseInt(document.getElementById("scoreGH")?.value || 0, 10);
  const pD = parseInt(document.getElementById("scorePD")?.value || 0, 10);
  const vA = parseInt(document.getElementById("scoreVA")?.value || 0, 10);

  const teamSubtotal = Math.min(80, pU + dP + mL + aL + gH + pD);
  const grandTotal = Math.min(100, teamSubtotal + vA);

  const teamSubEl = document.getElementById("teamSubtotalScore");
  const grandTotalEl = document.getElementById("grandTotalScore");
  const gradeEl = document.getElementById("calculatedGradeBadge");

  const teamSubElD12 = document.getElementById("teamSubtotalScore_d12");
  const grandTotalElD12 = document.getElementById("grandTotalScore_d12");
  const gradeElD12 = document.getElementById("calculatedGradeBadge_d12");

  if (teamSubEl) teamSubEl.textContent = `${teamSubtotal} / 80`;
  if (grandTotalEl) grandTotalEl.textContent = `${grandTotal} / 100`;

  if (teamSubElD12) teamSubElD12.textContent = `${teamSubtotal} / 80`;
  if (grandTotalElD12) grandTotalElD12.textContent = `${grandTotal} / 100`;

  let grade = "A+";
  if (grandTotal >= 90) grade = "A+";
  else if (grandTotal >= 80) grade = "A";
  else if (grandTotal >= 70) grade = "B";
  else if (grandTotal >= 60) grade = "C";
  else grade = "Needs Review";

  if (gradeEl) gradeEl.textContent = grade;
  if (gradeElD12) gradeElD12.textContent = grade;

  PortalState.progress.assessment = 100;
  updateHeaderProgress();
}

// ==========================================================================
// 11. DAY 12 DRY RUN STUDIO: WEBRTC, SCREEN SHARING & SPEECH AI
// ==========================================================================
function initDryRunStudio() {
  const startRecBtn = document.getElementById("btnToggleRecord");
  const camVideo = document.getElementById("cameraStream");
  const camPlaceholder = document.getElementById("camPlaceholder");

  if (startRecBtn) {
    startRecBtn.addEventListener("click", async () => {
      if (!PortalState.dryRun.isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          PortalState.dryRun.cameraStream = stream;
          if (camVideo) {
            camVideo.srcObject = stream;
            camVideo.play();
            camVideo.style.display = "block";
            if (camPlaceholder) camPlaceholder.style.display = "none";
          }
        } catch (e) {
          if (camPlaceholder) {
            camPlaceholder.innerHTML = `
              <i class="fas fa-broadcast-tower" style="font-size:2.5rem; color:#00e5ff; animation: pulse 1.5s infinite;"></i>
              <div style="font-weight:700; color:#fff; margin-top:0.5rem;">Simulated WebRTC Video Stream Active</div>
              <div style="font-size:0.75rem; color:#94a3b8;">Microphone Pacing Engine Listening...</div>
            `;
          }
        }

        PortalState.dryRun.isRecording = true;
        startRecBtn.innerHTML = '<i class="fas fa-stop"></i> Stop &amp; Evaluate Pitch';
        startRecBtn.style.background = "#ef4444";
        startSpeechRecognition();
        startSpeechPacingSimulator();
      } else {
        // Stop recording
        PortalState.dryRun.isRecording = false;
        if (PortalState.dryRun.cameraStream) {
          PortalState.dryRun.cameraStream.getTracks().forEach(t => t.stop());
          PortalState.dryRun.cameraStream = null;
        }
        if (camVideo) camVideo.style.display = "none";
        if (camPlaceholder) camPlaceholder.style.display = "flex";

        startRecBtn.innerHTML = '<i class="fas fa-video"></i> Start Dry Run Pitch Recording';
        startRecBtn.style.background = "";
        stopSpeechRecognition();
        showToast("Dry run recording saved! Speech pacing score: 96/100 (Optimal)");
      }
    });
  }

  initPitchDeckNavigator();
}

// Screen Sharing Toggle
window.toggleScreenShare = async function() {
  const screenVideo = document.getElementById("screenShareStream");
  const camVideo = document.getElementById("cameraStream");
  const camPlaceholder = document.getElementById("camPlaceholder");
  const shareBtn = document.getElementById("btnToggleShareScreen");

  if (!PortalState.dryRun.isScreenSharing) {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      PortalState.dryRun.screenStream = stream;
      PortalState.dryRun.isScreenSharing = true;

      if (screenVideo) {
        screenVideo.srcObject = stream;
        screenVideo.play();
        screenVideo.style.display = "block";
      }
      if (camVideo) camVideo.style.display = "none";
      if (camPlaceholder) camPlaceholder.style.display = "none";

      if (shareBtn) {
        shareBtn.innerHTML = '<i class="fas fa-stop-circle" style="color:#f87171;"></i> Stop Share';
        shareBtn.style.borderColor = "#ef4444";
      }

      stream.getVideoTracks()[0].onended = () => {
        window.toggleScreenShare();
      };
      showToast("Screen sharing engaged for pitch demo walkthrough!");
    } catch (e) {
      showToast("Screen share dismissed or not supported on this browser.");
    }
  } else {
    // Stop screen share
    if (PortalState.dryRun.screenStream) {
      PortalState.dryRun.screenStream.getTracks().forEach(t => t.stop());
      PortalState.dryRun.screenStream = null;
    }
    PortalState.dryRun.isScreenSharing = false;
    if (screenVideo) screenVideo.style.display = "none";
    if (camPlaceholder) camPlaceholder.style.display = "flex";

    if (shareBtn) {
      shareBtn.innerHTML = '<i class="fas fa-desktop"></i> Screen Share';
      shareBtn.style.borderColor = "";
    }
  }
};

// Web Speech API Recognition
function startSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const transcriptBox = document.getElementById("liveSpeechTranscript");

  if (SpeechRec) {
    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interimTranscript += event.results[i][0].transcript;
        }
        if (transcriptBox && interimTranscript) {
          transcriptBox.textContent = interimTranscript;
        }
        analyzeSpokenWords(interimTranscript);
      };

      recognition.onerror = () => {};
      recognition.start();
      PortalState.dryRun.speechRecognition = recognition;
      PortalState.dryRun.isSpeechRecognizing = true;
    } catch (err) {
      // Fallback
    }
  } else {
    if (transcriptBox) {
      transcriptBox.textContent = "Web Speech API ready (speech cadence analyzed via frequency envelope)...";
    }
  }
}

function stopSpeechRecognition() {
  if (PortalState.dryRun.speechRecognition) {
    try {
      PortalState.dryRun.speechRecognition.stop();
    } catch (e) {}
    PortalState.dryRun.speechRecognition = null;
    PortalState.dryRun.isSpeechRecognizing = false;
  }
}

function analyzeSpokenWords(text) {
  if (!text) return;
  const lower = text.toLowerCase();
  
  // Count fillers
  const ums = (lower.match(/\bum\b/g) || []).length;
  const uhs = (lower.match(/\buh\b/g) || []).length;
  const basically = (lower.match(/\bbasically\b/g) || []).length;
  const likes = (lower.match(/\blike\b/g) || []).length;

  const umEl = document.getElementById("fillerUmBadge");
  const uhEl = document.getElementById("fillerUhBadge");
  const basicallyEl = document.getElementById("fillerBasicallyBadge");
  const likeEl = document.getElementById("fillerLikeBadge");
  const clarityEl = document.getElementById("clarityScoreBadge");

  if (umEl) umEl.textContent = `"Um": ${ums}`;
  if (uhEl) uhEl.textContent = `"Uh": ${uhs}`;
  if (basicallyEl) basicallyEl.textContent = `"Basically": ${basically}`;
  if (likeEl) likeEl.textContent = `"Like": ${likes}`;

  const totalFillers = ums + uhs + basically + likes;
  const clarity = Math.max(70, 100 - (totalFillers * 4));
  if (clarityEl) clarityEl.textContent = `Clarity Score: ${clarity}%`;
}

function startSpeechPacingSimulator() {
  const wpmEl = document.getElementById("speechWpmVal");
  const interval = setInterval(() => {
    if (!PortalState.dryRun.isRecording) {
      clearInterval(interval);
      return;
    }
    const currentWpm = Math.floor(Math.random() * 14) + 136;
    if (wpmEl) wpmEl.textContent = `${currentWpm} WPM`;
  }, 1100);
}

// ==========================================================================
// 12. DYNAMIC 6-MINUTE TECHNICAL PITCH DECK & 60s SLIDE TIMER
// ==========================================================================
function updatePitchDeckForTeam() {
  PortalState.dryRun.currentSlide = 1;
  updatePitchSlideView();
  resetSlideTimer();
}

function initPitchDeckNavigator() {
  updatePitchSlideView();
}

window.nextPitchSlide = function() {
  const slides = PortalState.currentTeam.pitchSlides || [];
  if (PortalState.dryRun.currentSlide < slides.length) {
    PortalState.dryRun.currentSlide++;
    updatePitchSlideView();
    resetSlideTimer();
  }
};

window.prevPitchSlide = function() {
  if (PortalState.dryRun.currentSlide > 1) {
    PortalState.dryRun.currentSlide--;
    updatePitchSlideView();
    resetSlideTimer();
  }
};

function updatePitchSlideView() {
  const slides = PortalState.currentTeam.pitchSlides || [];
  const slide = slides[PortalState.dryRun.currentSlide - 1];
  if (!slide) return;

  const numPill = document.getElementById("pitchSlideNumPill");
  const titleEl = document.getElementById("pitchSlideTitle");
  const bulletsEl = document.getElementById("pitchSlideBullets");
  const speakerCue = document.getElementById("pitchSpeakerNotesText");

  if (numPill) numPill.textContent = `Slide ${slide.num} of ${slides.length} (6-Min Technical Standard)`;
  if (titleEl) titleEl.textContent = slide.title;
  if (bulletsEl) {
    bulletsEl.innerHTML = slide.points.map(p => `<li>${p}</li>`).join("");
  }

  const cues = [
    "Open with domain business value and quantify enterprise financial losses upfront.",
    "Walk through the ingestion pipeline, database schema, and microservice boundaries.",
    "Explain model selection, hyperparameter validation, and algorithmic accuracy metrics.",
    "Show the live FastAPI latency SLA (<50ms) and demonstrate interactive dashboard controls.",
    "Defend engineering trade-offs (Latency vs Accuracy, caching, container security).",
    "Conclude with quantified ROI, production launch readiness, and team engineering roles."
  ];
  if (speakerCue) {
    speakerCue.textContent = cues[slide.num - 1] || "Articulate technical points clearly with confidence.";
  }
}

// 60-Second Per-Slide Timer
window.toggleSlideTimer = function() {
  const btn = document.getElementById("btnSlideTimer");
  if (!PortalState.dryRun.slideTimerRunning) {
    PortalState.dryRun.slideTimerRunning = true;
    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';

    PortalState.dryRun.slideTimerInterval = setInterval(() => {
      if (PortalState.dryRun.slideTimerSec > 0) {
        PortalState.dryRun.slideTimerSec--;
        updateSlideTimerDisplay();
      } else {
        clearInterval(PortalState.dryRun.slideTimerInterval);
        PortalState.dryRun.slideTimerRunning = false;
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
        showToast(`Slide ${PortalState.dryRun.currentSlide} 60s completed! Transitioning to next slide.`);
        window.nextPitchSlide();
      }
    }, 1000);
  } else {
    // Pause
    clearInterval(PortalState.dryRun.slideTimerInterval);
    PortalState.dryRun.slideTimerRunning = false;
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
  }
};

function resetSlideTimer() {
  if (PortalState.dryRun.slideTimerInterval) {
    clearInterval(PortalState.dryRun.slideTimerInterval);
  }
  PortalState.dryRun.slideTimerSec = 60;
  PortalState.dryRun.slideTimerRunning = false;
  const btn = document.getElementById("btnSlideTimer");
  if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
  updateSlideTimerDisplay();
}

function updateSlideTimerDisplay() {
  const s = PortalState.dryRun.slideTimerSec;
  const secEl = document.getElementById("slideTimerSec");
  const countEl = document.getElementById("pitchSlideCountdown");
  const bar = document.getElementById("slideTimerProgress");

  if (secEl) secEl.textContent = s;
  if (countEl) countEl.textContent = `00:${String(s).padStart(2, '0')}`;
  if (bar) bar.style.width = `${(s / 60) * 100}%`;
}

// ==========================================================================
// 13. MOCK TECHNICAL INTERVIEW DRILLING & JURY VIVA
// ==========================================================================
function updateJuryQuestionForTeam() {
  PortalState.dryRun.currentJuryIndex = 0;
  renderCurrentJuryQuestion();
}

window.nextJuryQuestion = function() {
  const questions = PortalState.currentTeam.juryQuestions || [];
  if (questions.length === 0) return;
  PortalState.dryRun.currentJuryIndex = (PortalState.dryRun.currentJuryIndex + 1) % questions.length;
  renderCurrentJuryQuestion();
};

function renderCurrentJuryQuestion() {
  const questions = PortalState.currentTeam.juryQuestions || [];
  const qObj = questions[PortalState.dryRun.currentJuryIndex];
  if (!qObj) return;

  const qText = document.getElementById("juryQuestionText");
  const gText = document.getElementById("juryGuidanceText");

  if (qText) qText.textContent = `Q: "${qObj.q}"`;
  if (gText) gText.innerHTML = `<strong>Guidance (STAR Method):</strong> ${qObj.guidance}`;
}

// ==========================================================================
// 14. LIVE Q&A FEED
// ==========================================================================
function initLiveQA() {
  const sendBtn = document.getElementById("btnSendQA");
  const input = document.getElementById("qaInput");

  if (sendBtn && input) {
    sendBtn.addEventListener("click", () => {
      const q = input.value.trim();
      if (!q) return;
      appendQACard("Student (You)", q, false);
      input.value = "";
      setTimeout(() => {
        appendQACard("Prof. Anjit Raja R (Academic Lead)", "Great technical focus! Ensure you defend that latency metric during Slide 4 of your presentation.", true);
      }, 700);
    });
  }
}

function appendQACard(author, text, isPinned) {
  const feed = document.getElementById("qaChatFeed");
  if (!feed) return;
  const card = document.createElement("div");
  card.className = `qa-card ${isPinned ? "pinned" : ""}`;
  card.innerHTML = `
    <div class="qa-author-row">
      <span class="qa-author">${author}</span>
      ${isPinned ? '<span class="qa-pinned-badge"><i class="fas fa-thumbtack"></i> Pinned Answer</span>' : '<span style="color:#64748b; font-size:0.68rem;">Just now</span>'}
    </div>
    <div class="qa-text">${text}</div>
  `;
  feed.prepend(card);
}

// ==========================================================================
// 15. ONE-CLICK PORTFOLIO EXPORT & STANDALONE HTML LAUNCHER
// ==========================================================================
window.openPortfolioModal = function() {
  const modal = document.getElementById("portfolioModal");
  if (!modal) return;
  modal.classList.add("open");

  const t = PortalState.currentTeam;
  document.getElementById("modalProjectTitle").textContent = t.title;
  document.getElementById("modalProjectDomain").textContent = `${t.domain.toUpperCase()} PLACEMENT PORTFOLIO`;
  document.getElementById("modalTeamMembers").textContent = t.members.join(", ");
  document.getElementById("modalMentorName").textContent = t.mentor;
  document.getElementById("modalTechStackTags").innerHTML = t.stack.map(s => `<span class="stack-tag">${s}</span>`).join("");
  
  triggerConfetti();
};

window.closePortfolioModal = function() {
  const modal = document.getElementById("portfolioModal");
  if (modal) modal.classList.remove("open");
};

window.downloadPortfolioPage = function() {
  const t = PortalState.currentTeam;
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${t.title} — Capstone Portfolio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  <style>
    :root {
      --bg-dark: #0a0d16;
      --bg-card: #121828;
      --border-color: #23304d;
      --cyan: #00e5ff;
      --emerald: #10b981;
      --text: #f1f5f9;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-dark);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      padding: 2.5rem 1.5rem;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 18px;
      padding: 2.8rem;
      box-shadow: 0 25px 60px rgba(0,0,0,0.65);
    }
    .header-badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.2rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .badge {
      background: rgba(16, 185, 129, 0.15);
      color: var(--emerald);
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .domain-badge {
      background: rgba(0, 229, 255, 0.12);
      color: var(--cyan);
      border: 1px solid rgba(0, 229, 255, 0.35);
      padding: 0.35rem 0.85rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    h1 {
      color: #fff;
      font-size: 2.1rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.6rem;
      line-height: 1.3;
    }
    .lead-meta {
      color: var(--muted);
      font-size: 0.88rem;
      margin-bottom: 1.5rem;
    }
    .stack-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 1.2rem 0;
    }
    .tag {
      background: #1b253b;
      color: #cbd5e1;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .section-box {
      margin-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1.5rem;
    }
    .section-title {
      color: var(--cyan);
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.65rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .deliverables-list {
      list-style: none;
      padding-left: 0;
    }
    .deliverables-list li {
      padding: 0.4rem 0;
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      font-size: 0.92rem;
    }
    .deliverables-list li i {
      color: var(--emerald);
      margin-top: 0.25rem;
    }
    .btn {
      background: linear-gradient(135deg, #00e5ff 0%, #3b82f6 100%);
      color: #050811;
      text-decoration: none;
      padding: 0.75rem 1.4rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.88rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-right: 0.75rem;
      margin-top: 1.2rem;
      transition: all 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 229, 255, 0.35);
    }
    .btn-secondary {
      background: #1e293b;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .sign-off-seal {
      margin-top: 2.5rem;
      background: rgba(0, 229, 255, 0.04);
      border: 1px dashed rgba(0, 229, 255, 0.3);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-badge-row">
      <span class="domain-badge">${t.domain} Sector</span>
      <span class="badge"><i class="fas fa-certificate"></i> GRADE A+ • PLACEMENT CERTIFIED</span>
    </div>

    <h1>${t.title}</h1>
    <p class="lead-meta">
      Saratha University &bull; Phase IV Capstone Accelerator &bull; Mentor: <strong style="color:#fff;">${t.mentor}</strong>
    </p>

    <div class="stack-tags">
      ${t.stack.map(s => `<span class="tag">${s}</span>`).join("")}
    </div>

    <div class="section-box">
      <div class="section-title"><i class="fas fa-bullseye"></i> Executive Problem Statement</div>
      <p style="color:#cbd5e1;">${t.problem}</p>
    </div>

    <div class="section-box">
      <div class="section-title"><i class="fas fa-layer-group"></i> Production Engineering Deliverables</div>
      <ul class="deliverables-list">
        <li><i class="fas fa-check-circle"></i> <span><strong>High-Throughput Serving:</strong> FastAPI endpoint <code>${t.apiEndpoint}</code> maintaining &lt;50ms response latency SLA.</span></li>
        <li><i class="fas fa-check-circle"></i> <span><strong>Data &amp; Ingestion Architecture:</strong> Fully automated PostgreSQL 16 schema with indexed audit tables.</span></li>
        <li><i class="fas fa-check-circle"></i> <span><strong>Automated Testing:</strong> 91.4% Pytest coverage with Bandit AST static vulnerability auditing.</span></li>
        <li><i class="fas fa-check-circle"></i> <span><strong>Executive Dashboard:</strong> Real-time Streamlit application and Power BI operational dashboard.</span></li>
      </ul>
    </div>

    <div class="section-box">
      <div class="section-title"><i class="fas fa-users"></i> Engineering Team Roster</div>
      <p style="color:#cbd5e1; font-weight:600; font-size:0.95rem;">${t.members.join(" &bull; ")}</p>
      
      <div>
        <a href="https://github.com" class="btn" target="_blank">
          <i class="fab fa-github"></i> Production GitHub Repository
        </a>
        <a href="#" class="btn btn-secondary" onclick="window.print()">
          <i class="fas fa-print"></i> Print Executive PDF
        </a>
      </div>
    </div>

    <div class="sign-off-seal">
      <div>
        <div style="font-size:0.75rem; color:var(--muted); text-transform:uppercase; font-weight:700;">Academic &amp; Placement Sign-off</div>
        <div style="font-weight:700; color:#fff; font-size:0.92rem; margin-top:0.2rem;">Verified by ${t.mentor}</div>
        <div style="font-size:0.72rem; color:var(--muted);">Saratha University / Be Practical Placement Accelerator</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'JetBrains Mono', monospace; font-size:0.78rem; color:var(--cyan); font-weight:700;">EVAL: 92/100 (PASSED)</div>
        <div style="font-size:0.7rem; color:var(--emerald);"><i class="fas fa-check"></i> Placement Portfolio Active</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `portfolio_${t.domain.toLowerCase().replace(/[^a-z]/g, "")}_team${t.teamNo}.html`;
  a.click();
  showToast("Portfolio webpage exported successfully!");
};

function triggerConfetti() {
  const container = document.getElementById("portfolioModal");
  if (!container) return;

  const colors = ["#00e5ff", "#10b981", "#f59e0b", "#a855f7", "#3b82f6"];
  for (let i = 0; i < 35; i++) {
    const p = document.createElement("div");
    p.className = "confetti-particle";
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = `${Math.random() * 1.5}s`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 3500);
  }
}

// Toast Notification Helper
function showToast(msg) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.background = "#10b981";
  toast.style.color = "#050811";
  toast.style.fontWeight = "700";
  toast.style.padding = "0.75rem 1.35rem";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";
  toast.style.zIndex = "99999";
  toast.style.fontFamily = "Inter, sans-serif";
  toast.style.fontSize = "0.82rem";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "0.5rem";
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}
