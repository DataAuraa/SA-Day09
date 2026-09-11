/**
 * Day 09: Generative AI & LLM Engineering I - Interactive Training Portal
 * App Logic: Tokenizer, HR Lab, Prompt Evaluator, Q&A Accordion, Theme & Search
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. KaTeX Auto-render math
  renderMath();

  // 3. Theme Management (Light / Dark)
  initTheme();

  // 4. Mobile Navigation
  initMobileMenu();

  // 5. Global Search Functionality
  initSearch();

  // 6. Conceptual Module Tabs
  initModuleTabs();

  // 7. Interactive Attention Demo
  initAttentionDemo();

  // 8. Interactive Tokenizer Simulator
  initTokenizer();

  // 9. AI HR Assistant Simulator
  initHRAssistantLab();

  // 10. Code Switcher & Simulator
  initCodeSwitcher();

  // 11. Additional Interactive Exercises (Hallucination, Tokens, Few-Shot, Bias)
  initAdditionalExercises();

  // 12. Challenge Arena & Rubric Evaluator
  initChallengeArena();

  // 13. Interview Q&A Accordion
  initQnA();
});

/* ==========================================================================
   2. KaTeX Math Render
   ========================================================================== */
function renderMath() {
  const mathElem = document.getElementById('math-attention');
  if (mathElem && window.katex) {
    try {
      window.katex.render(
        "\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V",
        mathElem,
        { displayMode: true, throwOnError: false }
      );
    } catch (e) {
      console.warn("KaTeX render notice:", e);
    }
  }
}

/* ==========================================================================
   3. Theme Management
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('day09_theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('day09_theme', isDark ? 'dark' : 'light');
      if (window.lucide) window.lucide.createIcons();
    });
  }
}

/* ==========================================================================
   4. Mobile Menu
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
    // Close when clicking nav links
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.add('hidden'));
    });
  }
}

/* ==========================================================================
   5. Search Modal & Index
   ========================================================================== */
const searchIndex = [
  { title: "Day 09 Overview & 5-Hour Schedule", section: "#overview", tag: "Agenda" },
  { title: "Traditional AI vs Generative AI", section: "#mod-genai", tag: "Module 1" },
  { title: "AI -> ML -> DL -> GenAI Hierarchy", section: "#mod-genai", tag: "Module 1" },
  { title: "What is an LLM & Statistical Continuation", section: "#mod-llm", tag: "Module 2" },
  { title: "Transformers & Scaled Dot-Product Attention", section: "#mod-transformer", tag: "Module 3" },
  { title: "Self-Attention: 'she' -> Anjali Resolver", section: "#mod-transformer", tag: "Module 3" },
  { title: "Tokens: Characters != Words != Tokens", section: "#mod-tokens", tag: "Module 4" },
  { title: "Context Window vs Persistent Memory", section: "#mod-tokens", tag: "Module 4" },
  { title: "Hallucination Reduction Checklist", section: "#mod-ethics", tag: "Responsible AI" },
  { title: "Recruitment Ethics & Human-in-the-loop", section: "#mod-ethics", tag: "Responsible AI" },
  { title: "5-Part Prompt Formula (Role, Task, Context, ...)", section: "#prompt-engineering", tag: "Prompt Engineering" },
  { title: "Zero-Shot vs Few-Shot Prompting", section: "#prompt-engineering", tag: "Prompt Engineering" },
  { title: "Structured JSON Output Schemas", section: "#prompt-engineering", tag: "Prompt Engineering" },
  { title: "Interactive AI HR Assistant Simulator", section: "#interactive-lab", tag: "Hands-on Lab" },
  { title: "Python Set Math: intersection & difference", section: "#python-practical", tag: "Code" },
  { title: "Generic LLM API Request Pseudocode", section: "#python-practical", tag: "Code" },
  { title: "Prompt Challenge Arena (Priya Sharma)", section: "#challenge", tag: "Assessment" },
  { title: "Official 20-Mark Grading Rubric", section: "#challenge", tag: "Assessment" },
  { title: "Trainer Cheatsheet & Board Pipeline", section: "#trainer-mode", tag: "Trainer" },
  { title: "6 Common Student Mistakes", section: "#trainer-mode", tag: "Trainer" },
  { title: "15 Interview Questions & Answers", section: "#qna", tag: "Interview Prep" }
];

function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  if (!searchBtn || !modal || !input) return;

  function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    input.value = '';
    input.focus();
    renderSearchResults('');
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  searchBtn.addEventListener('click', openModal);

  // Keyboard shortcut Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal();
    }
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  input.addEventListener('input', (e) => {
    renderSearchResults(e.target.value.trim());
  });

  function renderSearchResults(query) {
    if (!query) {
      resultsContainer.innerHTML = `<div class="p-3 text-xs text-slate-400 text-center">Type any keyword above to jump straight to lessons, tools or python examples.</div>`;
      return;
    }

    const filtered = searchIndex.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.tag.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `<div class="p-4 text-xs text-slate-400 text-center">No matching topics found for "${query}".</div>`;
      return;
    }

    resultsContainer.innerHTML = filtered.map(item => `
      <a href="${item.section}" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition search-result-item">
        <div class="flex items-center gap-2">
          <span class="text-brand-600 dark:text-brand-400 text-xs font-mono font-semibold">${item.tag}:</span>
          <span class="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">${item.title}</span>
        </div>
        <span class="text-xs text-slate-400 font-mono">&rarr;</span>
      </a>
    `).join('');

    resultsContainer.querySelectorAll('.search-result-item').forEach(link => {
      link.addEventListener('click', closeModal);
    });
  }
}

/* ==========================================================================
   6. Conceptual Module Tabs
   ========================================================================== */
function initModuleTabs() {
  const tabs = document.querySelectorAll('.module-tab-btn');
  const panels = document.querySelectorAll('.module-content-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(p => {
        if (p.id === targetId) {
          p.classList.remove('hidden');
          p.classList.add('block');
        } else {
          p.classList.add('hidden');
          p.classList.remove('block');
        }
      });

      if (window.lucide) window.lucide.createIcons();
    });
  });
}

/* ==========================================================================
   7. Attention Demo
   ========================================================================== */
function initAttentionDemo() {
  const words = document.querySelectorAll('.token-word');
  const barsContainer = document.getElementById('attention-bars');
  if (!words.length || !barsContainer) return;

  const attentionMap = {
    'she': [
      { target: 'she \u2192 Anjali', weight: 0.86, color: 'bg-purple-600', note: 'Highest contextual reference' },
      { target: 'she \u2192 resume', weight: 0.08, color: 'bg-slate-400', note: '' },
      { target: 'she \u2192 job', weight: 0.06, color: 'bg-slate-400', note: '' }
    ],
    'Anjali': [
      { target: 'Anjali \u2192 submitted', weight: 0.72, color: 'bg-blue-600', note: 'Subject-Verb agreement' },
      { target: 'Anjali \u2192 she', weight: 0.22, color: 'bg-slate-400', note: 'Coreference' },
      { target: 'Anjali \u2192 resume', weight: 0.06, color: 'bg-slate-400', note: '' }
    ],
    'resume': [
      { target: 'resume \u2192 submitted', weight: 0.65, color: 'bg-emerald-600', note: 'Direct object' },
      { target: 'resume \u2192 Anjali', weight: 0.25, color: 'bg-slate-400', note: 'Possessive owner' },
      { target: 'resume \u2192 job', weight: 0.10, color: 'bg-slate-400', note: '' }
    ]
  };

  words.forEach(w => {
    w.addEventListener('click', () => {
      const token = w.getAttribute('data-token');
      words.forEach(item => {
        item.classList.remove('bg-purple-600', 'text-white', 'shadow-md', 'font-bold');
      });
      w.classList.add('bg-purple-600', 'text-white', 'shadow-md', 'font-bold');

      const weights = attentionMap[token] || [
        { target: `${token} \u2192 nearby tokens`, weight: 0.60, color: 'bg-purple-600', note: 'Contextual local window' },
        { target: `${token} \u2192 sequence root`, weight: 0.40, color: 'bg-slate-400', note: 'Sentence framing' }
      ];

      barsContainer.innerHTML = weights.map(item => `
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-mono text-slate-700 dark:text-slate-300 font-semibold">${item.target} ${item.note ? `<span class="text-[10px] text-purple-500 font-normal">(${item.note})</span>` : ''}</span>
            <span class="font-mono text-purple-600 font-bold">${item.weight}</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div class="${item.color} h-full rounded-full transition-all duration-500" style="width: ${item.weight * 100}%;"></div>
          </div>
        </div>
      `).join('');
    });
  });
}

/* ==========================================================================
   8. Subword Tokenizer Simulator
   ========================================================================== */
function initTokenizer() {
  const textarea = document.getElementById('tokenizer-input');
  const pillsContainer = document.getElementById('token-pills-container');
  const statChars = document.getElementById('stat-chars');
  const statWords = document.getElementById('stat-words');
  const statTokens = document.getElementById('stat-tokens');
  const resetBtn = document.getElementById('reset-token-sample');
  const sampleBtns = document.querySelectorAll('.sample-tok-btn');

  if (!textarea || !pillsContainer) return;

  // Subword heuristic dictionary for realistic simulation
  const subwordPrefixes = ['un', 'dis', 'anti', 'pre', 'post', 'trans', 'inter', 'sub', 'auto'];
  const subwordSuffixes = ['able', 'ing', 'tion', 'ness', 'ment', 'ized', 'ism', 'arian', 'ed', 'ly', 'er'];
  const tokenColors = [
    'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800',
    'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
  ];

  function tokenizeText(text) {
    if (!text.trim()) return [];
    
    // Heuristic BPE-style token splitting
    const rawTokens = [];
    const chunks = text.match(/[\w]+|[^\s\w]|\s+/g) || [];

    chunks.forEach(chunk => {
      if (/^\s+$/.test(chunk)) {
        // whitespace is represented as special token in BPE
        rawTokens.push({ text: '\u2581' + chunk.replace(/ /g, '\u2581'), isSpace: true });
      } else if (chunk.length > 7 && !/^\d+$/.test(chunk)) {
        // break down long words into subwords
        let remainder = chunk;
        if (remainder.toLowerCase().startsWith('un')) {
          rawTokens.push({ text: remainder.slice(0, 2), isSubword: true });
          remainder = remainder.slice(2);
        }
        if (remainder.toLowerCase().endsWith('able')) {
          const middle = remainder.slice(0, -4);
          if (middle) rawTokens.push({ text: middle, isSubword: true });
          rawTokens.push({ text: 'able', isSubword: true });
        } else {
          const mid = Math.ceil(remainder.length / 2);
          rawTokens.push({ text: remainder.slice(0, mid), isSubword: true });
          rawTokens.push({ text: remainder.slice(mid), isSubword: true });
        }
      } else if (/^\d{4,}$/.test(chunk)) {
        // Long numbers split into 2-digit pairs
        for (let i = 0; i < chunk.length; i += 3) {
          rawTokens.push({ text: chunk.slice(i, i + 3), isNum: true });
        }
      } else {
        rawTokens.push({ text: chunk });
      }
    });

    return rawTokens;
  }

  function update() {
    const text = textarea.value;
    const tokens = tokenizeText(text);

    // Update Stats
    statChars.textContent = text.length;
    statWords.textContent = (text.trim().match(/\S+/g) || []).length;
    statTokens.textContent = tokens.length;

    // Render Token Pills
    pillsContainer.innerHTML = tokens.map((tok, idx) => {
      const colorClass = tokenColors[idx % tokenColors.length];
      const cleanLabel = tok.text === '\n' ? '\\n' : tok.text;
      return `
        <span class="token-pill inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${colorClass}" title="Token #${idx + 1} | Length: ${tok.text.length}">
          ${cleanLabel}
        </span>
      `;
    }).join('');
  }

  textarea.addEventListener('input', update);
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      textarea.value = btn.getAttribute('data-text');
      update();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      textarea.value = "Artificial Intelligence with Transformers is unbelievable.";
      update();
    });
  }

  update();
}

/* ==========================================================================
   9. AI HR Assistant Lab & Matcher Simulator
   ========================================================================== */
function initHRAssistantLab() {
  const resumeArea = document.getElementById('lab-resume');
  const jdArea = document.getElementById('lab-jd');
  const runBtn = document.getElementById('run-analysis-btn');
  const hallucinationBtn = document.getElementById('inject-hallucination-btn');
  
  const loadRahulBtn = document.getElementById('load-rahul');
  const loadPriyaBtn = document.getElementById('load-priya');
  const candidateBadge = document.getElementById('candidate-badge');
  const candidateNameHeader = document.getElementById('lab-candidate-name');

  const matchPctText = document.getElementById('match-pct-text');
  const matchRatioText = document.getElementById('match-ratio-text');
  const matchCircleBar = document.getElementById('match-circle-bar');
  const matchedContainer = document.getElementById('matched-skills-container');
  const missingContainer = document.getElementById('missing-skills-container');
  const countMatched = document.getElementById('count-matched');
  const countMissing = document.getElementById('count-missing');

  const tabBtnQuestions = document.getElementById('tab-btn-questions');
  const tabBtnJson = document.getElementById('tab-btn-json');
  const viewQuestions = document.getElementById('view-questions');
  const viewJson = document.getElementById('view-json');
  const questionsList = document.getElementById('interview-questions-list');
  const rawJsonDisplay = document.getElementById('raw-json-display');
  const copyJsonBtn = document.getElementById('copy-json-btn');

  if (!resumeArea || !jdArea || !runBtn) return;

  // Presets Data (6 Diverse Candidates & 4 Target JDs)
  const candidatePresets = {
    rahul: {
      name: "Rahul Kumar",
      badge: "Rahul Kumar (Data Analyst, 2y)",
      resume: `Rahul Kumar\nB.Tech Computer Science\n\nSkills:\nPython, SQL, Pandas, NumPy, Scikit-learn, Machine Learning, Power BI\n\nExperience:\n2 years as Data Analyst at Analytics Corp. Built automated reporting dashboards and customer segmentation pipelines.`
    },
    priya: {
      name: "Priya Sharma",
      badge: "Priya Sharma (Junior Analyst, 1.5y)",
      resume: `Priya Sharma\nMCA (Master of Computer Applications)\n\nSkills:\nPython, SQL, Excel, Pandas, Power BI, Machine Learning\n\nExperience:\n1.5 years as Junior Data Analyst. Performed exploratory data analysis and database query optimizations.`
    },
    arun: {
      name: "Arun Kumar",
      badge: "Arun Kumar (Cloud DevOps, 4y)",
      resume: `Arun Kumar\nB.Tech Information Technology\n\nSkills:\nPython, Docker, Kubernetes, AWS, Terraform, Linux, Git, MySQL, CI/CD\n\nExperience:\n4 years as Cloud Infrastructure Engineer. Managed containerized microservices and automated infrastructure provisioning.`
    },
    sneha: {
      name: "Sneha Patel",
      badge: "Sneha Patel (Full Stack, 2y)",
      resume: `Sneha Patel\nB.E. Computer Engineering\n\nSkills:\nJavaScript, React, Node.js, HTML/CSS, Tailwind, SQL, Git\n\nExperience:\n2 years as Full Stack Web Developer. Developed responsive SPAs, REST APIs, and integrated authentication systems.`
    },
    vikram: {
      name: "Vikram Verma",
      badge: "Vikram Verma (Sr AI/ML, 5y)",
      resume: `Vikram Verma\nM.Tech Artificial Intelligence\n\nSkills:\nPython, PyTorch, Transformers, LLMs, LangChain, RAG, Machine Learning, Statistics, SQL, Pandas\n\nExperience:\n5 years as Lead AI Engineer. Built generative AI enterprise search, fine-tuned open-source LLMs, and deployed vector database pipelines.`
    },
    neha: {
      name: "Neha Rao",
      badge: "Neha Rao (CS Graduate, 0y)",
      resume: `Neha Rao\nB.Tech Computer Science (Recent Graduate)\n\nSkills:\nPython, Machine Learning, C++, SQL, Git\n\nExperience:\n0 years (Fresh Graduate). Academic capstone project on image classification using machine learning and relational database queries.`
    }
  };

  const jdPresets = {
    ds: `Data Scientist\n\nRequired Skills:\nPython\nSQL\nMachine Learning\nPandas\nScikit-learn\nStatistics\nPower BI`,
    genai: `AI & LLM Engineer\n\nRequired Skills:\nPython\nPyTorch\nTransformers\nLLMs\nLangChain\nRAG\nMachine Learning\nSQL`,
    devops: `Cloud DevOps Engineer\n\nRequired Skills:\nPython\nDocker\nKubernetes\nAWS\nTerraform\nLinux\nGit\nMySQL`,
    web: `Full Stack Web Developer\n\nRequired Skills:\nJavaScript\nReact\nNode.js\nHTML/CSS\nTailwind\nSQL\nGit`
  };

  // Known skill normalization dictionary (Covering Data Science, GenAI, Web & DevOps)
  const knownSkills = [
    'Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'Machine Learning', 
    'Power BI', 'Statistics', 'Deep Learning', 'TensorFlow', 'Excel', 'AWS', 
    'Git', 'Django', 'MySQL', 'Java', 'Spring Boot', 'Docker', 'Kubernetes',
    'Linux', 'Terraform', 'CI/CD', 'React', 'Node.js', 'JavaScript',
    'Tailwind', 'HTML/CSS', 'PyTorch', 'Transformers', 'LLMs', 'LangChain',
    'RAG', 'C++'
  ];

  function extractSkillsFromText(text) {
    const found = new Set();
    const lower = text.toLowerCase();
    knownSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill.toLowerCase().replace(/[-/]/g, '[- /]?')}\\b`, 'i');
      if (regex.test(lower)) {
        found.add(skill);
      }
    });
    return Array.from(found);
  }

  function extractName(text) {
    const firstLine = text.trim().split('\n')[0];
    return firstLine.length < 35 ? firstLine : "Candidate";
  }

  function runAnalysis() {
    const resumeText = resumeArea.value;
    const jdText = jdArea.value;

    const candName = extractName(resumeText);
    candidateNameHeader.textContent = candName;
    candidateBadge.textContent = candName;

    // Python-style set operations
    const candSkills = new Set(extractSkillsFromText(resumeText));
    const jobSkills = new Set(extractSkillsFromText(jdText));

    const matched = new Set([...candSkills].filter(x => jobSkills.has(x)));
    const missing = new Set([...jobSkills].filter(x => !candSkills.has(x)));

    const totalRequired = jobSkills.size || 1;
    const matchPct = Math.min(100, Math.round((matched.size / totalRequired) * 100 * 10) / 10);

    // Update circular gauge
    matchPctText.textContent = `${matchPct}%`;
    matchRatioText.textContent = `${matched.size} / ${totalRequired} skills`;
    matchCircleBar.setAttribute('stroke-dasharray', `${matchPct}, 100`);

    // Dynamic color coding based on threshold
    if (matchPct >= 75) {
      matchPctText.className = "text-3xl font-extrabold text-emerald-600 dark:text-emerald-400";
      matchCircleBar.className = "text-emerald-500 transition-all duration-700 ease-out";
    } else if (matchPct >= 50) {
      matchPctText.className = "text-3xl font-extrabold text-amber-500 dark:text-amber-400";
      matchCircleBar.className = "text-amber-500 transition-all duration-700 ease-out";
    } else {
      matchPctText.className = "text-3xl font-extrabold text-rose-600 dark:text-rose-400";
      matchCircleBar.className = "text-rose-500 transition-all duration-700 ease-out";
    }

    countMatched.textContent = matched.size;
    countMissing.textContent = missing.size;

    // Render Matched Pills
    matchedContainer.innerHTML = Array.from(matched).map(s => `
      <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
        <i data-lucide="check" class="w-3 h-3 text-emerald-600"></i> ${s}
      </span>
    `).join('') || '<span class="text-xs text-slate-400">No overlapping skills found</span>';

    // Render Missing Pills
    missingContainer.innerHTML = Array.from(missing).map(s => `
      <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
        <i data-lucide="alert-circle" class="w-3 h-3 text-rose-600"></i> ${s}
      </span>
    `).join('') || '<span class="text-xs text-emerald-600 font-semibold">Zero skill gaps identified! Perfect syllabus alignment.</span>';

    // LLM Reasoning: Generate Questions
    const questions = generateInterviewQuestions(candName, matched, missing);
    questionsList.innerHTML = questions.map(q => `
      <li class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
        ${q}
      </li>
    `).join('');

    // Structured JSON Output
    const jsonOutput = {
      candidate_name: candName,
      technical_skills: Array.from(candSkills),
      experience_years: resumeText.includes('5 years') ? 5 : (resumeText.includes('4 years') ? 4 : (resumeText.includes('2 years') ? 2 : (resumeText.includes('1.5') ? 1.5 : 0))),
      matched_skills: Array.from(matched),
      missing_skills: Array.from(missing),
      recommended_roles: matchPct >= 70 ? ["Primary Role Match", "Senior Associate"] : (matchPct >= 45 ? ["Junior Role", "Bridge Candidate"] : ["Alternative Role Transition"]),
      interview_questions: questions
    };

    rawJsonDisplay.textContent = JSON.stringify(jsonOutput, null, 2);

    if (window.lucide) window.lucide.createIcons();
  }

  function generateInterviewQuestions(name, matched, missing) {
    const list = [];
    if (matched.has('Python')) {
      list.push(`How do you optimize data manipulation workflows in Python using vectorized operations in NumPy & Pandas?`);
    }
    if (matched.has('Transformers') || matched.has('LLMs')) {
      list.push(`Explain the operational difference between Decoder-only vs Encoder-only architectures, and how Self-Attention calculates token affinities.`);
    }
    if (matched.has('Machine Learning')) {
      list.push(`Walk us through your workflow for mitigating overfitting when training Scikit-learn classification algorithms.`);
    }
    if (matched.has('Docker') || matched.has('Kubernetes')) {
      list.push(`Explain how container resource limits (CPU/Memory requests) prevent cascading pod failures in a Kubernetes cluster.`);
    }
    if (matched.has('React') || matched.has('Node.js')) {
      list.push(`Describe how the Virtual DOM optimizes re-renders in modern React single-page applications.`);
    }
    if (matched.has('SQL')) {
      list.push(`Explain the operational difference between WHERE and HAVING clauses, and when you would leverage Window Functions.`);
    }
    if (missing.has('Statistics')) {
      list.push(`The role heavily requires Statistics: Can you explain how you formulate and evaluate p-values in A/B hypothesis testing?`);
    }
    if (missing.has('RAG') || missing.has('LangChain')) {
      list.push(`Since this position involves RAG pipelines: Describe how chunk size and embedding models affect retrieval precision.`);
    }
    while (list.length < 5) {
      list.push(`Describe a high-impact analytical project you completed and how you validated your model's accuracy.`);
    }
    return list.slice(0, 5);
  }

  // Load Preset Candidates Listener
  const candButtons = document.querySelectorAll('.preset-cand-btn');
  candButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const preset = candidatePresets[id];
      if (preset) {
        candButtons.forEach(b => {
          b.className = "preset-cand-btn px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition";
        });
        btn.className = "preset-cand-btn active px-2.5 py-1 rounded-lg bg-brand-600 text-white text-xs font-semibold shadow-sm transition";
        resumeArea.value = preset.resume;
        runAnalysis();
      }
    });
  });

  // Load Preset JDs Listener
  const jdButtons = document.querySelectorAll('.preset-jd-btn');
  jdButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-jd');
      const text = jdPresets[key];
      if (text) {
        jdButtons.forEach(b => {
          b.className = "preset-jd-btn px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition";
        });
        btn.className = "preset-jd-btn active px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-600 text-white font-semibold shadow-sm transition";
        jdArea.value = text;
        runAnalysis();
      }
    });
  });

  runBtn.addEventListener('click', runAnalysis);

  // Hallucination test injector
  hallucinationBtn.addEventListener('click', () => {
    alert("Hallucination Test Activated:\n\nTesting claim: 'Candidate has 5 years AWS DevOps experience'.\n\nResult: Grounded LLM Prompt verifies candidate text and flags claim as FABRICATED because AWS is not mentioned in the resume.");
  });

  // Tab Switching (Questions vs JSON)
  tabBtnQuestions.addEventListener('click', () => {
    tabBtnQuestions.className = "px-3 py-1 rounded-lg text-xs font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300";
    tabBtnJson.className = "px-3 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200";
    viewQuestions.classList.remove('hidden');
    viewJson.classList.add('hidden');
  });

  tabBtnJson.addEventListener('click', () => {
    tabBtnJson.className = "px-3 py-1 rounded-lg text-xs font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300";
    tabBtnQuestions.className = "px-3 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200";
    viewJson.classList.remove('hidden');
    viewQuestions.classList.add('hidden');
  });

  copyJsonBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(rawJsonDisplay.textContent);
    const original = copyJsonBtn.innerHTML;
    copyJsonBtn.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-emerald-500"></i> Copied!`;
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      copyJsonBtn.innerHTML = original;
      if (window.lucide) window.lucide.createIcons();
    }, 2000);
  });

  // Initial Run
  runAnalysis();
}

/* ==========================================================================
   ADDITIONAL INTERACTIVE EXERCISES IMPLEMENTATION
   ========================================================================== */
function initAdditionalExercises() {
  // 1. Hallucination Spotter Lab
  initHallucinationInspector();

  // 2. Token Budget & Context Calculator
  initTokenBudgetCalculator();

  // 3. Few-Shot Calibrator Lab
  initFewShotCalibrator();

  // 4. Responsible AI Bias Audit Lab
  initBiasAuditLab();
}

function initHallucinationInspector() {
  const checkBtn = document.getElementById('check-hallucination-btn');
  const feedbackElem = document.getElementById('hallucination-feedback');
  const checkboxes = document.querySelectorAll('.hallucination-check');
  if (!checkBtn || !checkboxes.length) return;

  checkBtn.addEventListener('click', () => {
    let allCorrect = true;
    let correctCount = 0;

    checkboxes.forEach(cb => {
      const isHallucination = cb.getAttribute('data-is-hallucination') === 'true';
      const isChecked = cb.checked;
      if (isChecked === isHallucination) {
        correctCount++;
      } else {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      feedbackElem.className = "text-xs font-bold text-emerald-600 dark:text-emerald-400";
      feedbackElem.textContent = "\u2713 Perfect! Claim B (AWS 5y) and Claim D (MIT PhD) are unsupported hallucinations.";
      if (window.confetti) window.confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } else {
      feedbackElem.className = "text-xs font-bold text-rose-600 dark:text-rose-400";
      feedbackElem.textContent = `Score: ${correctCount}/4. Remember: Hallucinations are claims completely absent from Arun's resume!`;
    }
  });
}

function initTokenBudgetCalculator() {
  const sliderResume = document.getElementById('slider-resume');
  const sliderJd = document.getElementById('slider-jd');
  const sliderSys = document.getElementById('slider-sys');
  const sliderOut = document.getElementById('slider-out');

  const valResumePages = document.getElementById('val-resume-pages');
  const valJdPages = document.getElementById('val-jd-pages');
  const tokensResume = document.getElementById('tokens-resume');
  const tokensJd = document.getElementById('tokens-jd');
  const tokensSys = document.getElementById('tokens-sys');
  const tokensOut = document.getElementById('tokens-out');

  const totalTokensElem = document.getElementById('total-calc-tokens');
  const barContextPct = document.getElementById('bar-context-pct');
  const contextRatioText = document.getElementById('context-ratio-text');
  const costGptElem = document.getElementById('cost-gpt');

  if (!sliderResume || !sliderJd) return;

  function updateCalculator() {
    const resumeP = parseInt(sliderResume.value);
    const jdP = parseInt(sliderJd.value);
    const sysT = parseInt(sliderSys.value);
    const outT = parseInt(sliderOut.value);

    const rTokens = resumeP * 500;
    const jTokens = jdP * 400;

    valResumePages.textContent = `${resumeP} page${resumeP > 1 ? 's' : ''}`;
    valJdPages.textContent = `${jdP} page${jdP > 1 ? 's' : ''}`;

    tokensResume.textContent = `~${rTokens.toLocaleString()} tokens`;
    tokensJd.textContent = `~${jTokens.toLocaleString()} tokens`;
    tokensSys.textContent = `~${sysT.toLocaleString()} tokens`;
    tokensOut.textContent = `~${outT.toLocaleString()} tokens`;

    const inputTotal = rTokens + jTokens + sysT;
    const grandTotal = inputTotal + outT;

    totalTokensElem.textContent = `${grandTotal.toLocaleString()} tokens`;

    // 128k context utilization
    const pct = Math.min(100, (grandTotal / 128000) * 100);
    barContextPct.style.width = `${Math.max(1, pct.toFixed(1))}%`;
    contextRatioText.textContent = `${(grandTotal / 1000).toFixed(1)}k / 128,000 (GPT-4o Context)`;

    // Pricing calculation (GPT-4o-mini: $0.15/1M input, $0.60/1M output)
    const costPerRequest = (inputTotal * 0.00000015) + (outT * 0.00000060);
    const costPer1k = costPerRequest * 1000;
    costGptElem.textContent = `$${costPer1k.toFixed(2)} (GPT-4o-mini)`;
  }

  [sliderResume, sliderJd, sliderSys, sliderOut].forEach(s => {
    s.addEventListener('input', updateCalculator);
  });

  updateCalculator();
}

function initFewShotCalibrator() {
  const btnZero = document.getElementById('btn-show-zeroshot');
  const btnFew = document.getElementById('btn-show-fewshot');
  const display = document.getElementById('fewshot-output-display');
  if (!btnZero || !btnFew || !display) return;

  btnZero.addEventListener('click', () => {
    btnZero.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-brand-600 text-white shadow-sm";
    btnFew.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
    display.className = "p-3.5 rounded-xl bg-slate-950 text-xs font-mono min-h-[120px] overflow-x-auto text-amber-300 leading-relaxed";
    display.textContent = `// Zero-Shot Output (Loose Prose, Inconsistent Schema):\n"The candidate has a Bachelor of Technology degree in Mechanical Engineering completed in 2021 from Anna University scoring an 8.4 CGPA. They also hold an AWS Solutions Architect certificate acquired in 2023."`;
  });

  btnFew.addEventListener('click', () => {
    btnFew.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-brand-600 text-white shadow-sm";
    btnZero.className = "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
    display.className = "p-3.5 rounded-xl bg-slate-950 text-xs font-mono min-h-[120px] overflow-x-auto text-emerald-400 leading-relaxed";
    display.textContent = `// 2-Shot Output (Strict Programmatic JSON):\n{\n  "degree": "B.Tech Mechanical Engineering",\n  "institution": "Anna University",\n  "graduation_year": 2021,\n  "cgpa": 8.4,\n  "certifications": [\n    {\n      "title": "AWS Certified Solutions Architect",\n      "year": 2023\n    }\n  ]\n}`;
  });
}

function initBiasAuditLab() {
  const buttons = document.querySelectorAll('.bias-scenario-btn');
  const hazardText = document.getElementById('bias-hazard-text');
  const solutionText = document.getElementById('bias-solution-text');
  if (!buttons.length || !hazardText) return;

  const scenarios = {
    '1': {
      hazard: "Filtering by graduation date acts as an unlawful proxy for age discrimination (Age Discrimination in Employment Act / EEOC). Senior qualified candidates are unfairly eliminated regardless of competency.",
      solution: "Evaluate candidates strictly on demonstrable technical skills and verified project outcomes, completely blind to graduation year."
    },
    '2': {
      hazard: "Restricting applications to Tier-1 universities perpetuates historical socio-economic exclusion and overlooks self-taught developers, bootcamp graduates, and state university top performers.",
      solution: "Adopt skills-based technical evaluations, take-home projects, and verified GitHub/portfolio contributions rather than institutional elitism."
    },
    '3': {
      hazard: "Automating rejections based purely on keyword similarity generates false negatives caused by non-standard resume phrasing, different jargon, or poor PDF text extraction.",
      solution: "Implement Human-in-the-Loop: AI serves as a summarization and skill-gap highlighter for human HR professionals who make final employment decisions."
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const scId = btn.getAttribute('data-scenario');
      const item = scenarios[scId];
      if (!item) return;

      buttons.forEach(b => {
        b.className = "bias-scenario-btn w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition";
      });
      btn.className = "bias-scenario-btn w-full text-left p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 transition active";

      hazardText.textContent = item.hazard;
      solutionText.textContent = item.solution;
    });
  });
}

/* ==========================================================================
   10. Code Snippets & Simulator
   ========================================================================== */
function initCodeSwitcher() {
  const codeBtns = document.querySelectorAll('.code-tab-btn');
  const codeBlock = document.getElementById('active-code-block');
  const filenameElem = document.getElementById('code-filename');
  const outputTerminal = document.getElementById('code-output-terminal');
  const copyBtn = document.getElementById('copy-code-btn');

  if (!codeBlock || !codeBtns.length) return;

  const scripts = {
    'set-math': {
      file: 'practical_03_job_matching.py',
      code: `# Practical 3 & 4: Skill Matching & Match Percentage (Deterministic Python)
candidate_skills = {
    "Python",
    "SQL",
    "Pandas",
    "Machine Learning",
    "Power BI"
}

job_skills = {
    "Python",
    "SQL",
    "Pandas",
    "Machine Learning",
    "Scikit-learn",
    "Statistics",
    "Power BI"
}

# 1. Deterministic Set Operations (Zero Token Cost!)
matched_skills = candidate_skills.intersection(job_skills)
missing_skills = job_skills.difference(candidate_skills)

# 2. Percentage Calculation
match_percentage = (len(matched_skills) / len(job_skills)) * 100

print(f"Matched Skills: {matched_skills}")
print(f"Missing Skills: {missing_skills}")
print(f"Match Percentage: {match_percentage:.2f}%")`,
      output: `Matched Skills: {'Python', 'Power BI', 'SQL', 'Pandas', 'Machine Learning'}\nMissing Skills: {'Statistics', 'Scikit-learn'}\nMatch Percentage: 71.43%`
    },
    'prompt-func': {
      file: 'practical_02_prompt_template.py',
      code: `def create_resume_prompt(resume_text: str, jd_text: str) -> str:
    """Creates a production-grade 5-part prompt with strict constraints."""
    prompt = f"""You are an AI HR Assistant.
Analyze the candidate resume against the job description.

Candidate Resume:
{resume_text}

Job Description:
{jd_text}

Tasks:
1. Extract candidate technical skills.
2. Identify matched skills and missing skill gaps.
3. Generate 5 targeted interview questions.

Constraints:
- Use only information explicitly provided in the resume.
- Do not invent qualifications or cloud certifications.
- If information is missing, report it clearly.
- Return output strictly in valid JSON format.
"""
    return prompt`,
      output: `[Prompt Template successfully generated (1,248 characters / ~312 tokens)]`
    },
    'api-call': {
      file: 'practical_05_generic_llm_api.py',
      code: `import os
import requests

# Never hardcode credentials in public notebooks! (Section 25 & 44)
API_KEY = os.getenv("LLM_API_KEY", "your-env-secret-token")
API_URL = "https://api.openai.com/v1/chat/completions" # Or local Ollama

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "model": "gpt-4o-mini",
    "messages": [
        {"role": "system", "content": "You are a deterministic HR Assistant."},
        {"role": "user", "content": prompt}
    ],
    "response_format": {"type": "json_object"},
    "temperature": 0.2  # Low temperature to minimize hallucination
}

response = requests.post(API_URL, headers=headers, json=payload)
result = response.json()
print("Tokens Used:", result["usage"]["total_tokens"])`,
      output: `Status: 200 OK\nTokens Used: 486 (Prompt: 362, Completion: 124)\nModel: gpt-4o-mini`
    },
    'json-parser': {
      file: 'practical_06_json_parser.py',
      code: `import json

raw_llm_response = '''{
  "candidate_name": "Rahul Kumar",
  "skills": ["Python", "SQL", "Pandas"],
  "experience_years": 2,
  "missing_skills": ["Statistics"]
}'''

try:
    data = json.loads(raw_llm_response)
    print("Candidate:", data["candidate_name"])
    print("Extracted Skills:", data["skills"])
    print("Skill Gaps:", data["missing_skills"])
except json.JSONDecodeError as err:
    print(f"Malformed JSON detected: {err}")`,
      output: `Candidate: Rahul Kumar\nExtracted Skills: ['Python', 'SQL', 'Pandas']\nSkill Gaps: ['Statistics']`
    }
  };

  codeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const scriptKey = btn.getAttribute('data-code');
      const item = scripts[scriptKey];
      if (!item) return;

      codeBtns.forEach(b => {
        b.className = "code-tab-btn px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white";
      });
      btn.className = "code-tab-btn active px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 text-cyan-300 border border-cyan-500/30";

      filenameElem.textContent = item.file;
      codeBlock.textContent = item.code;
      outputTerminal.textContent = item.output;
    });
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeBlock.textContent);
    const original = copyBtn.innerHTML;
    copyBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> Copied!`;
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      copyBtn.innerHTML = original;
      if (window.lucide) window.lucide.createIcons();
    }, 2000);
  });
}

/* ==========================================================================
   11. Challenge Arena & Rubric Evaluator
   ========================================================================== */
function initChallengeArena() {
  const promptInput = document.getElementById('challenge-prompt-input');
  const evaluateBtn = document.getElementById('evaluate-prompt-btn');
  const loadIdealBtn = document.getElementById('load-ideal-prompt');
  const feedbackBox = document.getElementById('challenge-feedback-box');

  if (!promptInput || !evaluateBtn || !feedbackBox) return;

  const idealPrompt = `You are an AI HR Assistant.

Analyze the candidate's resume for a Data Scientist position.

Candidate Resume:
Priya Sharma (MCA)
Skills: Python, SQL, Excel, Pandas, Power BI, Machine Learning
Experience: 1.5 years as Junior Data Analyst

Job Description:
Data Scientist
Required: Python, SQL, Machine Learning, Statistics, Deep Learning, TensorFlow, Pandas

Tasks:
1. Extract technical skills from resume.
2. Identify matched skills against the job description.
3. Identify missing skills (skill gaps).
4. Recommend suitable roles.
5. Generate 5 targeted interview questions.

Constraints:
- Use only information explicitly provided.
- Do not invent candidate qualifications or experience.
- Do not make the final hiring decision; provide insights for human HR.

Output Format:
Return strictly valid JSON with keys:
candidate_name, technical_skills, matched_skills, missing_skills, recommended_roles, interview_questions.`;

  loadIdealBtn.addEventListener('click', () => {
    promptInput.value = idealPrompt;
    evaluatePrompt();
  });

  function evaluatePrompt() {
    const text = promptInput.value.toLowerCase();

    // Check against the 5-part formula and criteria
    const hasRole = text.includes('role') || text.includes('ai hr assistant') || text.includes('you are an');
    const hasTask = text.includes('extract') || text.includes('analyze') || text.includes('identify') || text.includes('generate');
    const hasContext = text.includes('priya') || text.includes('resume') || text.includes('data scientist');
    const hasConstraints = text.includes('do not invent') || text.includes('explicit') || text.includes('only information') || text.includes('rules');
    const hasFormat = text.includes('json') || text.includes('structure') || text.includes('output format');
    const hasResponsibleAI = text.includes('not make') || text.includes('final hiring') || text.includes('human');

    let score = 0;
    const feedbackItems = [];

    // 1. Concepts
    score += 2; 

    // 2. Prompt Formula (4 M)
    if (hasRole && hasTask && hasContext) {
      score += 4;
      feedbackItems.push({ ok: true, msg: "Role, Task, and Context components clearly established (+4 M)" });
    } else {
      score += 1;
      feedbackItems.push({ ok: false, msg: "Missing clear Role or Task definition in prompt formula." });
    }

    // 3. Few-shot / formatting
    score += 2; 

    // 4. Structured JSON (3 M)
    if (hasFormat) {
      score += 3;
      feedbackItems.push({ ok: true, msg: "Strict JSON output specification detected (+3 M)" });
    } else {
      feedbackItems.push({ ok: false, msg: "No JSON output specification requested. Vague text output will break code." });
    }

    // 5. Python implementation
    score += 3;

    // 6. Resume precision
    if (text.includes('priya') || text.includes('missing')) {
      score += 2;
      feedbackItems.push({ ok: true, msg: "Candidate context specifically targeted (+2 M)" });
    } else {
      score += 1;
    }

    // 7. Hallucination constraints (2 M)
    if (hasConstraints) {
      score += 2;
      feedbackItems.push({ ok: true, msg: "Hallucination guardrail: Explicit prohibition against inventing skills (+2 M)" });
    } else {
      feedbackItems.push({ ok: false, msg: "Warning: Missing explicit constraint against inventing skills." });
    }

    // 8. Responsible AI (2 M)
    if (hasResponsibleAI) {
      score += 2;
      feedbackItems.push({ ok: true, msg: "Responsible AI clause: AI assists, does not make unilateral hiring rejections (+2 M)" });
    } else {
      score += 1;
    }

    // Cap score at 20
    score = Math.min(20, score);

    // Display Feedback
    feedbackBox.classList.remove('hidden');
    const isPassing = score >= 15;

    feedbackBox.className = `p-4 rounded-xl border ${isPassing ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'}`;

    feedbackBox.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <i data-lucide="${isPassing ? 'award' : 'alert-triangle'}" class="w-5 h-5 ${isPassing ? 'text-emerald-600' : 'text-rose-600'}"></i>
          <span class="font-bold text-sm ${isPassing ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'}">
            Prompt Evaluation Result: ${score} / 20 Marks
          </span>
        </div>
        <span class="text-xs font-mono font-bold px-2 py-0.5 rounded ${isPassing ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100' : 'bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100'}">
          ${score >= 18 ? 'EXCELLENT' : (score >= 14 ? 'PROFICIENT' : 'NEEDS REVISION')}
        </span>
      </div>
      <ul class="text-xs space-y-1.5 mb-2">
        ${feedbackItems.map(f => `
          <li class="flex items-center gap-2 ${f.ok ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}">
            <i data-lucide="${f.ok ? 'check' : 'x'}" class="w-3.5 h-3.5 shrink-0"></i>
            <span>${f.msg}</span>
          </li>
        `).join('')}
      </ul>
    `;

    if (window.lucide) window.lucide.createIcons();

    if (score >= 18 && window.confetti) {
      window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    }
  }

  evaluateBtn.addEventListener('click', evaluatePrompt);
}

/* ==========================================================================
   12. 15 Interview Q&As
   ========================================================================== */
function initQnA() {
  const container = document.getElementById('qna-accordion-container');
  const filterBtns = document.querySelectorAll('.qna-filter-btn');
  if (!container) return;

  const questions = [
    // Basic (1–5)
    {
      num: 1, level: "basic",
      q: "What is Generative AI?",
      a: "Generative AI refers to artificial intelligence systems capable of creating novel content such as text, source code, images, audio, video, or structured data based on learned patterns and user-supplied prompts."
    },
    {
      num: 2, level: "basic",
      q: "What does LLM stand for and how does it work?",
      a: "LLM stands for Large Language Model. It is a deep neural network trained on vast text/code corpuses to learn statistical patterns in language and predict/generate probable token continuations conditioned on input context."
    },
    {
      num: 3, level: "basic",
      q: "What is a token in the context of an LLM?",
      a: "A token is the fundamental subword or character chunk processed by an LLM's tokenizer. 1 word does not necessarily equal 1 token. In English, 1 token is roughly 4 characters or 0.75 words."
    },
    {
      num: 4, level: "basic",
      q: "What is the Context Window and how does it differ from Memory?",
      a: "The context window is the finite amount of prompt and output tokens a model can process concurrently in a single API call. Context is temporary per-request capacity; persistent memory requires external databases or vector stores."
    },
    {
      num: 5, level: "basic",
      q: "What is Prompt Engineering?",
      a: "Prompt engineering is the systematic design of instructions, persona, context, constraints, and format schemas to reliably guide an LLM toward producing accurate, useful, and machine-readable outputs."
    },

    // Intermediate (6–10)
    {
      num: 6, level: "intermediate",
      q: "What is Few-Shot Prompting and when should you use it?",
      a: "Few-shot prompting provides the model with 1–3 explicit input/output demonstration pairs within the prompt. It is useful for enforcing non-standard formatting, domain categorization styles, or complex entity extraction schemas."
    },
    {
      num: 7, level: "intermediate",
      q: "Why is requesting structured JSON output essential when integrating LLMs?",
      a: "Unstructured natural language paragraphs cannot be reliably parsed by downstream software. Structured JSON allows Python applications, databases, and HR analytics dashboards to consume LLM outputs predictably via standard deserializers (e.g., json.loads())."
    },
    {
      num: 8, level: "intermediate",
      q: "What is an AI Hallucination and what causes it?",
      a: "A hallucination is when an LLM generates fabricated, unsupported, or incorrect information with high linguistic fluency. It occurs because LLMs operate on statistical token likelihoods rather than deterministic database lookups."
    },
    {
      num: 9, level: "intermediate",
      q: "Why must API keys never be hard-coded into shared notebooks?",
      a: "API keys are billable authentication credentials. Exposing them in public repositories or shared Google Colab files allows unauthorized users to access billable quotas, access private organization data, and compromise security."
    },
    {
      num: 10, level: "intermediate",
      q: "Why should an AI recruitment system never make automated rejection decisions?",
      a: "Employment decisions carry severe ethical and legal ramifications. AI models can inherit historical bias, misinterpret non-standard resume formats, or hallucinate missing qualifications. The approved enterprise architecture is Human-in-the-Loop."
    },

    // Advanced (11–15)
    {
      num: 11, level: "advanced",
      q: "Why did Transformers replace RNNs in natural language processing?",
      a: "RNNs process tokens sequentially, creating bottlenecks, losing long-distance context, and preventing GPU parallelization. Transformers use Self-Attention to compute relationships across all tokens simultaneously, scaling efficiently to billions of parameters."
    },
    {
      num: 12, level: "advanced",
      q: "Why do tokens directly impact enterprise LLM cost and latency?",
      a: "Commercial LLM APIs charge per million input and output tokens. Furthermore, Transformer compute complexity grows quadratically or linearly with sequence length. Efficient prompt engineering reduces latency, context overflow risk, and billable cost."
    },
    {
      num: 13, level: "advanced",
      q: "Why combine deterministic Python with an LLM rather than using an LLM for everything?",
      a: "LLMs are probabilistic and notoriously unreliable at mathematical calculations, sorting, and strict set operations. Python executes deterministic logic (set intersections, percentages) with 100% precision at 0 token cost, while the LLM excels at unstructured parsing and reasoning."
    },
    {
      num: 14, level: "advanced",
      q: "Does fluent language output guarantee factual accuracy in an LLM?",
      a: "No. Grammatical correctness and syntactic fluency are independent of factual grounding. A model can construct elegant, convincing prose that is completely untethered from reality without grounded evidence-based prompting."
    },
    {
      num: 15, level: "advanced",
      q: "Is a larger LLM parameter size always the best architectural choice?",
      a: "No. Model selection depends on trade-offs between task complexity, inference latency, compute budgets, and privacy requirements. Smaller, task-tuned models often outperform massive general models in production while cutting latency and API expense."
    }
  ];

  function renderQnA(filter = 'all') {
    const filtered = filter === 'all' ? questions : questions.filter(item => item.level === filter);

    container.innerHTML = filtered.map(item => `
      <div class="qna-card p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer transition hover:border-brand-400">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-2.5">
            <span class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
              ${item.num}
            </span>
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider font-bold ${item.level === 'basic' ? 'text-blue-500' : (item.level === 'intermediate' ? 'text-brand-500' : 'text-purple-500')} block mb-0.5">
                ${item.level}
              </span>
              <h5 class="text-sm font-bold text-slate-900 dark:text-white leading-snug">${item.q}</h5>
            </div>
          </div>
          <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 shrink-0 transition-transform qna-icon"></i>
        </div>
        <div class="qna-answer hidden pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          ${item.a}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.qna-card').forEach(card => {
      card.addEventListener('click', () => {
        const answer = card.querySelector('.qna-answer');
        const icon = card.querySelector('.qna-icon');
        const isHidden = answer.classList.contains('hidden');

        answer.classList.toggle('hidden');
        if (icon) {
          icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderQnA(btn.getAttribute('data-filter'));
    });
  });

  renderQnA('all');
}
