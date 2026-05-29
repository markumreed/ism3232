/* ═══════════════════════════════════════════════════════════════════════════
   ISM3232 Site-wide JS — nav, theme toggle, font-size controls
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  // ── path detection ──────────────────────────────────────────────────────
  const path   = location.pathname;
  const inDocs = /\/docs\//.test(path) || /docs\//.test(path);
  const root   = inDocs ? '../' : './';
  const pg     = inDocs ? './'  : 'docs/';

  // ── theme (light / dark) ────────────────────────────────────────────────
  const savedTheme  = localStorage.getItem('ism3232-theme');
  const systemDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('ism3232-theme', t);
    const icon = t === 'dark' ? '☀' : '☾';
    const btn = document.getElementById('ism-theme-btn');
    if (btn) btn.textContent = icon;
    const mobBtn = document.getElementById('ism-mob-theme-btn');
    if (mobBtn) mobBtn.textContent = icon;
  }

  // ── font size ────────────────────────────────────────────────────────────
  const fontSizes = [14, 15, 16, 17, 18, 20, 22];
  let fontIdx = parseInt(localStorage.getItem('ism3232-font') || '2', 10);
  function applyFont() {
    const px = fontSizes[fontIdx];
    let s = document.getElementById('ism-font-style');
    if (!s) {
      s = document.createElement('style');
      s.id = 'ism-font-style';
      document.head.appendChild(s);
    }
    s.textContent = `body{font-size:${px}px !important;}`;
    localStorage.setItem('ism3232-font', String(fontIdx));
  }
  applyFont();

  // ── nav HTML ─────────────────────────────────────────────────────────────
  const nav = document.createElement('nav');
  nav.className = 'ism-nav';
  nav.setAttribute('aria-label', 'Site navigation');
  nav.innerHTML = `
    <a class="nav-home" href="${root}index.html">ISM3232</a>

    <div class="nav-dd">
      <button class="nav-dd-btn" data-dd="start" aria-haspopup="true" aria-expanded="false">Start Here ▾</button>
      <div class="nav-dd-menu" data-menu="start">
        <a href="${pg}precourse.html">Pre-Course Setup</a>
        <a href="${pg}syllabus.html">Syllabus</a>
        <a href="${pg}course_map.html">Course Map</a>
        <a href="${pg}unit_all_overview.html">All Units Overview</a>
      </div>
    </div>

    <div class="nav-dd">
      <button class="nav-dd-btn" data-dd="ref" aria-haspopup="true" aria-expanded="false">Reference ▾</button>
      <div class="nav-dd-menu" data-menu="ref">
        <a href="${pg}unit_1_cheatsheet.html">Cheat Sheets</a>
        <a href="${pg}glossary.html">Glossary</a>
        <a href="${pg}troubleshooting.html">Help / Troubleshooting</a>
        <a href="${pg}capstone_rubric.html">Capstone Rubric</a>
        <a href="${pg}expectations.html">Expectations</a>
        <a href="${pg}slos.html">SLOs</a>
        <a href="${pg}slo_mindmap.html">SLO Mind Map</a>
      </div>
    </div>

    <div class="nav-dd">
      <button class="nav-dd-btn" data-dd="u1" aria-haspopup="true" aria-expanded="false">Unit 1 ▾</button>
      <div class="nav-dd-menu" data-menu="u1">
        <div class="dd-section">Unit 1 · Developer Foundations</div>
        <a href="${pg}unit_1_overview.html">Overview</a>
        <a href="${pg}unit_1_cheatsheet.html">Cheat Sheet</a>
        <a href="${pg}week01_reading.html">Module 1 · Developer Mindset &amp; Setup</a>
        <a href="${pg}week02_reading.html">Module 2 · zsh Navigation &amp; File Ops</a>
        <a href="${pg}week03_reading.html">Module 3 · Virtual Environments &amp; .zshrc</a>
        <a href="${pg}week04_reading.html">Module 4 · Search Tools, Ritual &amp; Git</a>
      </div>
    </div>

    <div class="nav-dd">
      <button class="nav-dd-btn" data-dd="u2" aria-haspopup="true" aria-expanded="false">Unit 2 ▾</button>
      <div class="nav-dd-menu" data-menu="u2">
        <div class="dd-section">Unit 2 · Python Foundations</div>
        <a href="${pg}unit_2_overview.html">Overview</a>
        <a href="${pg}unit_2_cheatsheet.html">Cheat Sheet</a>
        <a href="${pg}week05_reading.html">Module 5 · Variables, Types &amp; Operators</a>
        <a href="${pg}week06_reading.html">Module 6 · Conditionals, Loops &amp; Dicts</a>
        <a href="${pg}week07_reading.html">Module 7 · Functions, Modules &amp; pytest</a>
        <a href="${pg}week08_reading.html">Module 8 · Debugging &amp; AI Literacy</a>
        <a href="${pg}week09_reading.html">Module 9 · Midterm Review</a>
      </div>
    </div>

    <div class="nav-dd">
      <button class="nav-dd-btn" data-dd="u3" aria-haspopup="true" aria-expanded="false">Unit 3 ▾</button>
      <div class="nav-dd-menu" data-menu="u3">
        <div class="dd-section">Unit 3 · Object-Oriented Design</div>
        <a href="${pg}unit_3_overview.html">Overview</a>
        <a href="${pg}unit_3_cheatsheet.html">Cheat Sheet</a>
        <a href="${pg}week10_reading.html">Module 10 · OOP I — Classes &amp; Objects</a>
        <a href="${pg}week11_reading.html">Module 11 · OOP II — Composition &amp; Inheritance</a>
        <a href="${pg}week12_reading.html">Module 12 · OOP III — Design &amp; Practice</a>
      </div>
    </div>

    <div class="nav-dd">
      <button class="nav-dd-btn" data-dd="u4" aria-haspopup="true" aria-expanded="false">Unit 4 ▾</button>
      <div class="nav-dd-menu" data-menu="u4">
        <div class="dd-section">Unit 4 · Capstone Build</div>
        <a href="${pg}unit_4_overview.html">Overview</a>
        <a href="${pg}unit_4_cheatsheet.html">Cheat Sheet</a>
        <a href="${pg}week13_reading.html">Module 13 · Capstone Design &amp; SQL</a>
        <a href="${pg}week14_reading.html">Module 14 · Python + SQL Integration</a>
        <a href="${pg}week15_reading.html">Module 15 · Streamlit Interface</a>
        <a href="${pg}week16_reading.html">Module 16 · GenAI Feature &amp; Final Demo</a>
      </div>
    </div>

    <div class="nav-spacer"></div>

    <div class="nav-tools">
      <button id="ism-font-down" class="tool-btn" aria-label="Decrease font size" title="Smaller text">A−</button>
      <button id="ism-font-up"   class="tool-btn" aria-label="Increase font size" title="Larger text">A+</button>
      <button id="ism-theme-btn" class="tool-btn" aria-label="Toggle theme" title="Light / dark">${initialTheme === 'dark' ? '☀' : '☾'}</button>
    </div>
    <button class="nav-hamburger" id="ism-hamburger" aria-label="Open navigation" aria-expanded="false">☰</button>
  `;

  // ── insert skip link + nav ───────────────────────────────────────────────
  const skip = document.createElement('a');
  skip.href = '#main-content';
  skip.className = 'skip-link';
  skip.textContent = 'Skip to main content';

  // ── mobile nav panel ──────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.className = 'nav-mobile-panel';
  panel.id = 'nav-mobile-panel';
  panel.innerHTML = `
    <div class="mob-section">
      <div class="mob-section-label">Start Here</div>
      <a href="${pg}precourse.html">Pre-Course Setup</a>
      <a href="${pg}syllabus.html">Syllabus</a>
      <a href="${pg}course_map.html">Course Map</a>
      <a href="${pg}unit_all_overview.html">All Units Overview</a>
    </div>
    <div class="mob-section">
      <div class="mob-section-label">Reference</div>
      <a href="${pg}unit_1_cheatsheet.html">Cheat Sheets</a>
      <a href="${pg}glossary.html">Glossary</a>
      <a href="${pg}troubleshooting.html">Help / Troubleshooting</a>
      <a href="${pg}capstone_rubric.html">Capstone Rubric</a>
      <a href="${pg}expectations.html">Expectations</a>
      <a href="${pg}slos.html">SLOs</a>
      <a href="${pg}slo_mindmap.html">SLO Mind Map</a>
    </div>
    <div class="mob-section">
      <div class="mob-section-label">Unit 1 · Developer Foundations</div>
      <a href="${pg}unit_1_overview.html">Overview</a>
      <a href="${pg}unit_1_cheatsheet.html">Cheat Sheet</a>
      <a href="${pg}week01_reading.html">Module 1 · Developer Mindset &amp; Setup</a>
      <a href="${pg}week02_reading.html">Module 2 · zsh Navigation &amp; File Ops</a>
      <a href="${pg}week03_reading.html">Module 3 · Virtual Environments &amp; .zshrc</a>
      <a href="${pg}week04_reading.html">Module 4 · Search Tools, Ritual &amp; Git</a>
    </div>
    <div class="mob-section">
      <div class="mob-section-label">Unit 2 · Python Foundations</div>
      <a href="${pg}unit_2_overview.html">Overview</a>
      <a href="${pg}unit_2_cheatsheet.html">Cheat Sheet</a>
      <a href="${pg}week05_reading.html">Module 5 · Variables, Types &amp; Operators</a>
      <a href="${pg}week06_reading.html">Module 6 · Conditionals, Loops &amp; Dicts</a>
      <a href="${pg}week07_reading.html">Module 7 · Functions, Modules &amp; pytest</a>
      <a href="${pg}week08_reading.html">Module 8 · Debugging &amp; AI Literacy</a>
      <a href="${pg}week09_reading.html">Module 9 · Midterm Review</a>
    </div>
    <div class="mob-section">
      <div class="mob-section-label">Unit 3 · Object-Oriented Design</div>
      <a href="${pg}unit_3_overview.html">Overview</a>
      <a href="${pg}unit_3_cheatsheet.html">Cheat Sheet</a>
      <a href="${pg}week10_reading.html">Module 10 · OOP I — Classes &amp; Objects</a>
      <a href="${pg}week11_reading.html">Module 11 · OOP II — Composition &amp; Inheritance</a>
      <a href="${pg}week12_reading.html">Module 12 · OOP III — Design &amp; Practice</a>
    </div>
    <div class="mob-section">
      <div class="mob-section-label">Unit 4 · Capstone Build</div>
      <a href="${pg}unit_4_overview.html">Overview</a>
      <a href="${pg}unit_4_cheatsheet.html">Cheat Sheet</a>
      <a href="${pg}week13_reading.html">Module 13 · Capstone Design &amp; SQL</a>
      <a href="${pg}week14_reading.html">Module 14 · Python + SQL Integration</a>
      <a href="${pg}week15_reading.html">Module 15 · Streamlit Interface</a>
      <a href="${pg}week16_reading.html">Module 16 · GenAI Feature &amp; Final Demo</a>
    </div>
    <div class="mob-tools">
      <button id="ism-mob-font-down" class="tool-btn" aria-label="Decrease font size" title="Smaller text">A−</button>
      <button id="ism-mob-font-up"   class="tool-btn" aria-label="Increase font size" title="Larger text">A+</button>
      <button id="ism-mob-theme-btn" class="tool-btn" aria-label="Toggle theme" title="Light / dark">${initialTheme === 'dark' ? '☀' : '☾'}</button>
    </div>
  `;

  document.body.prepend(nav);
  document.body.prepend(skip);
  nav.after(panel);

  // ── dropdown behaviour ──────────────────────────────────────────────────
  document.querySelectorAll('.nav-dd-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const key  = btn.dataset.dd;
      const menu = document.querySelector(`[data-menu="${key}"]`);
      const isOpen = menu.classList.contains('open');
      document.querySelectorAll('.nav-dd-menu').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.nav-dd-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
      if (!isOpen) {
        menu.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dd-menu').forEach(m => m.classList.remove('open'));
    document.querySelectorAll('.nav-dd-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dd-menu').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.nav-dd-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // ── theme button ─────────────────────────────────────────────────────────
  document.getElementById('ism-theme-btn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'dark' ? 'light' : 'dark');
  });

  // ── font buttons ─────────────────────────────────────────────────────────
  document.getElementById('ism-font-up').addEventListener('click', () => {
    if (fontIdx < fontSizes.length - 1) { fontIdx++; applyFont(); }
  });
  document.getElementById('ism-font-down').addEventListener('click', () => {
    if (fontIdx > 0) { fontIdx--; applyFont(); }
  });

  // ── hamburger / mobile panel ─────────────────────────────────────────
  const hamburger = document.getElementById('ism-hamburger');

  function openPanel() {
    panel.classList.add('open');
    hamburger.textContent = '✕';
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation');
  }
  function closePanel() {
    panel.classList.remove('open');
    hamburger.textContent = '☰';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
  }

  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.contains('open') ? closePanel() : openPanel();
  });
  document.addEventListener('click', e => {
    if (panel.classList.contains('open') && !nav.contains(e.target) && !panel.contains(e.target)) {
      closePanel();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closePanel));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && panel.classList.contains('open')) closePanel();
  });

  // ── mobile tool buttons ──────────────────────────────────────────────
  document.getElementById('ism-mob-theme-btn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'dark' ? 'light' : 'dark');
  });
  document.getElementById('ism-mob-font-up').addEventListener('click', () => {
    if (fontIdx < fontSizes.length - 1) { fontIdx++; applyFont(); }
  });
  document.getElementById('ism-mob-font-down').addEventListener('click', () => {
    if (fontIdx > 0) { fontIdx--; applyFont(); }
  });
})();
