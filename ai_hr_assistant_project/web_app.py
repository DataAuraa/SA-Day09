"""
Interactive Web Application for AI HR Assistant
Serves an embedded web dashboard with candidate selector, match gauge, and live screening.
"""

import sys
import os
import json
import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    from ai_hr_assistant_project.engine import engine
    from ai_hr_assistant_project.config import settings
    from ai_hr_assistant_project.models import CandidateProfile, JobDescription
except ImportError:
    from engine import engine
    from config import settings
    from models import CandidateProfile, JobDescription

web_app = FastAPI(title="AI HR Assistant Web Console")

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI HR Assistant &bull; Interactive Web Console</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8">
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Day 09 Mini-Project Production Sample
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">AI HR Assistant &amp; Resume Screener</h1>
        <p class="text-slate-400 text-sm mt-1">Saratha University Phase III &bull; Deterministic &amp; LLM Few-Shot Matching Engine</p>
      </div>
      <a href="/docs" target="_blank" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg text-xs font-bold transition">
        &rarr; Open Swagger API Docs
      </a>
    </div>

    <!-- Interactive Grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      <!-- Selection Controls -->
      <div class="md:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Select Candidate Resume</label>
          <select id="candSelect" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none">
            <!-- Populated via JS -->
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Select Target Job Requisition</label>
          <select id="jobSelect" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none">
            <!-- Populated via JS -->
          </select>
        </div>

        <button id="btnScreen" onclick="runScreening()" class="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-sm transition shadow-lg shadow-cyan-500/20">
          Screen Candidate Now
        </button>

        <div class="border-t border-slate-800 pt-4">
          <div class="text-xs font-bold text-slate-400 uppercase mb-2">Candidate Profile Preview</div>
          <div id="candBio" class="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80"></div>
        </div>
      </div>

      <!-- Result Card -->
      <div class="md:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
        
        <!-- Score Banner -->
        <div class="flex items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-xl">
          <div>
            <div class="text-xs text-slate-400 font-bold uppercase">Evaluated Match Score</div>
            <div class="flex items-baseline gap-2 mt-1">
              <span id="scoreVal" class="text-4xl font-extrabold text-cyan-400 mono">--</span>
              <span class="text-slate-500 text-sm">/ 100</span>
            </div>
            <div id="decisionBadge" class="mt-1 text-xs font-bold uppercase tracking-wider text-emerald-400">Ready to Screen</div>
          </div>
          <div id="gaugeRing" class="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center font-bold text-lg mono text-cyan-400">
            --
          </div>
        </div>

        <!-- Matched & Missing Skills -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div class="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5 mb-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Matched Skills
            </div>
            <div id="matchedPills" class="flex flex-wrap gap-1.5">
              <span class="text-xs text-slate-500">None</span>
            </div>
          </div>

          <div class="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div class="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5 mb-2">
              <span class="w-2 h-2 rounded-full bg-rose-500"></span> Missing / Gaps
            </div>
            <div id="missingPills" class="flex flex-wrap gap-1.5">
              <span class="text-xs text-slate-500">None</span>
            </div>
          </div>
        </div>

        <!-- Executive Rationale -->
        <div>
          <div class="text-xs font-bold uppercase text-slate-400 mb-2">AI Talent Analyst Rationale</div>
          <div id="rationaleBox" class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            Select candidate and job requisition, then click "Screen Candidate Now".
          </div>
        </div>

        <!-- STAR Interview Questions -->
        <div>
          <div class="text-xs font-bold uppercase text-amber-400 mb-2 flex items-center gap-1.5">
            <span>&#9733;</span> Generated STAR Technical Interview Questions
          </div>
          <div id="questionsContainer" class="space-y-2">
            <!-- Rendered by JS -->
          </div>
        </div>

      </div>

    </div>
  </div>

  <script>
    let candidatesData = [];
    let jobsData = [];

    async function loadData() {
      const resC = await fetch('/api/v1/candidates');
      candidatesData = await resC.json();
      const resJ = await fetch('/api/v1/jobs');
      jobsData = await resJ.json();

      const candSel = document.getElementById('candSelect');
      candSel.innerHTML = candidatesData.map(c => `<option value="${c.id}">${c.name} (${c.title})</option>`).join('');

      const jobSel = document.getElementById('jobSelect');
      jobSel.innerHTML = jobsData.map(j => `<option value="${j.id}">${j.title}</option>`).join('');

      candSel.onchange = updateBio;
      updateBio();
      runScreening();
    }

    function updateBio() {
      const cand = candidatesData.find(c => c.id === document.getElementById('candSelect').value);
      if (cand) {
        document.getElementById('candBio').innerHTML = `
          <strong>${cand.name}</strong> &bull; ${cand.education}<br>
          Experience: ${cand.experience_years} years<br>
          <div class="mt-1.5 text-slate-400">${cand.summary}</div>
        `;
      }
    }

    async function runScreening() {
      const cand = candidatesData.find(c => c.id === document.getElementById('candSelect').value);
      const job = jobsData.find(j => j.id === document.getElementById('jobSelect').value);

      const resp = await fetch('/api/v1/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate: cand, job: job, include_ai_rationale: true })
      });
      const data = await resp.json();

      document.getElementById('scoreVal').textContent = data.match_score;
      document.getElementById('gaugeRing').textContent = Math.round(data.match_score) + '%';
      document.getElementById('decisionBadge').textContent = data.decision;

      const matchedEl = document.getElementById('matchedPills');
      matchedEl.innerHTML = data.matched_required_skills.length 
        ? data.matched_required_skills.map(s => `<span class="bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded">${s}</span>`).join('')
        : '<span class="text-xs text-slate-500">Zero required skills matched</span>';

      const missingEl = document.getElementById('missingPills');
      missingEl.innerHTML = data.missing_required_skills.length 
        ? data.missing_required_skills.map(s => `<span class="bg-rose-950/70 border border-rose-700/60 text-rose-300 text-[11px] font-semibold px-2 py-0.5 rounded">${s}</span>`).join('')
        : '<span class="text-xs text-emerald-400 font-bold">100% Core Skills Satisfied!</span>';

      document.getElementById('rationaleBox').innerHTML = (data.ai_rationale || data.executive_summary).replace(/\\n/g, '<br>');

      const qBox = document.getElementById('questionsContainer');
      qBox.innerHTML = (data.interview_questions || []).map((q, idx) => `
        <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
          <div class="text-amber-300 font-bold mb-1">Q${idx + 1}: ${q.topic}</div>
          <div class="text-slate-200">${q.question}</div>
          <div class="text-slate-500 text-[11px] mt-1.5 font-mono">Evaluation Target: ${q.expected_answer_guidance}</div>
        </div>
      `).join('');
    }

    window.onload = loadData;
  </script>
</body>
</html>
"""

@web_app.get("/", response_class=HTMLResponse)
def index_page():
    return HTML_TEMPLATE

# Mount API endpoints
web_app.get("/api/v1/candidates")(lambda: [CandidateProfile(**x) for x in json.load(open(settings.RESUMES_FILE, "r", encoding="utf-8"))])
web_app.get("/api/v1/jobs")(lambda: [JobDescription(**x) for x in json.load(open(settings.JOBS_FILE, "r", encoding="utf-8"))])
web_app.post("/api/v1/screen")(lambda req: engine.screen_candidate(req.candidate, req.job, include_rationale=req.include_rationale))

if __name__ == "__main__":
    print("Launching AI HR Assistant Web Console at http://127.0.0.1:8080 ...")
    uvicorn.run(web_app, host="127.0.0.1", port=8080)
