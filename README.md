# Day 09: Generative AI & LLM Engineering I
## Interactive Training Portal, Engineering Laboratories & Course Handbook

**Session Title:** *Generative AI & LLM Fundamentals: From Prompt Engineering to an AI HR Assistant*  
**Duration:** 5 Hours (Morning & Afternoon Sessions + Assessment)  
**Target Audience:** Saratha University / Be Practical Training - Phase III Engineering Students & Trainers  

---

### 🚀 Quick Start
To launch the training portal:
1. Double-click or open [`index.html`](file:///e:/Training_out/Saratha%20University%201.0/Saratha_Presentation%20DAYs%201.0/SARATHA_PPTs_D/Day-09/TRaining_PE01/index.html) in any modern web browser (Chrome, Edge, Firefox, Safari).
2. To view or print the course handbook as a PDF, click **Export PDF** in the top bar or open [`handbook.html`](file:///e:/Training_out/Saratha%20University%201.0/Saratha_Presentation%20DAYs%201.0/SARATHA_PPTs_D/Day-09/TRaining_PE01/handbook.html) and press `Ctrl+P` (or `Cmd+P` on Mac).
3. To run the Python companion script locally or in Google Colab:
   ```bash
   python notebook_starter.py
   ```

---

### 📂 File Structure

| File | Description |
| :--- | :--- |
| [**`index.html`**](file:///e:/Training_out/Saratha%20University%201.0/Saratha_Presentation%20DAYs%201.0/SARATHA_PPTs_D/Day-09/TRaining_PE01/index.html) | Complete interactive training portal with live simulators, tokenizers, rubric evaluation, dark/light mode, and global search. |
| [**`handbook.html`**](file:///e:/Training_out/Saratha%20University%201.0/Saratha_Presentation%20DAYs%201.0/SARATHA_PPTs_D/Day-09/TRaining_PE01/handbook.html) | Publication-ready standalone printable A4 PDF course handbook with table of contents, cover page, and full 70-section course text. |
| [**`styles.css`**](file:///e:/Training_out/Saratha%20University%201.0/Saratha_Presentation%20DAYs%201.0/SARATHA_PPTs_D/Day-09/TRaining_PE01/styles.css) | Custom styling, glassmorphism, responsive adjustments, token pill animations, and print/export stylesheet. |
| [**`app.js`**](file:///e:/Training_out/Saratha%20University%201.0/Saratha_Presentation%20DAYs%201.0/SARATHA_PPTs_D/Day-09/TRaining_PE01/app.js) | Interactive simulators: 6-candidate matcher, 4 JD roles, subword tokenizer, attention resolver, hallucination tester, token budget calculator, and rubric evaluator. |
| [**`notebook_starter.py`**](file:///e:/Training_out/Saratha%20University%201.0/Saratha_Presentation%20DAYs%201.0/SARATHA_PPTs_D/Day-09/TRaining_PE01/notebook_starter.py) | Standalone executable Python companion code mapping to the 23-cell Google Colab course structure with all candidate profiles and roles. |

---

### 🌟 Expanded Interactive Features & Labs

#### 1. Diverse Multi-Candidate & Multi-Role Simulator
Switch between 6 realistic candidate profiles and 4 target job descriptions with instant real-time set calculations and dynamic circular gauges:
* **Candidates:**
  * `Rahul Kumar` &mdash; Data Analyst (2 yrs experience, Python, SQL, ML, Power BI)
  * `Priya Sharma` &mdash; Junior Analyst (1.5 yrs experience, MCA, Excel, Pandas)
  * `Arun Kumar` &mdash; Cloud & DevOps Engineer (4 yrs, Docker, Kubernetes, AWS, Terraform)
  * `Sneha Patel` &mdash; Full Stack Web Developer (2 yrs, React, Node.js, Tailwind, SQL)
  * `Vikram Verma` &mdash; Lead AI/ML Engineer (5 yrs, PyTorch, Transformers, LLMs, LangChain, RAG)
  * `Neha Rao` &mdash; Computer Science Fresher (0 yrs, Python, ML Capstone, C++, SQL)
* **Job Descriptions:** Data Scientist, AI & LLM Engineer, Cloud DevOps Engineer, Full Stack Web Developer.

#### 2. Four Specialized Interactive Engineering Exercises
* **Exercise 1: Hallucination Spotter Lab** &mdash; Test claims against candidate resumes to detect ungrounded AI fabrications with instant grading.
* **Exercise 2: Token Budget & Context Envelope Calculator** &mdash; Interactive sliders calculate input tokens, context window percentage utilization, and API costs across GPT-4o-mini, Claude 3.5 Haiku, and local Ollama.
* **Exercise 3: Few-Shot Schema Calibrator** &mdash; Side-by-side comparison of Zero-Shot vs Few-Shot prompt outputs on non-standard degree/certification strings.
* **Exercise 4: Responsible AI Bias Audit** &mdash; Interactive diagnostic identifying proxy age discrimination, university pedigree bias, and machine auto-rejection hazards with compliant enterprise solutions.

#### 3. Publication-Ready PDF Handbook (`handbook.html`)
* Styled with print-optimized CSS (`@page { size: A4; margin: 15mm; }`, page-breaks, avoid-break blocks).
* Formatted cover sheet, table of contents, diagrams, code listings, and 20-mark evaluation rubric.
* One-click "Print / Save as PDF" button.
