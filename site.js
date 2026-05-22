/* ═══════════════════════════════════════════════════════════════════════════
   ISM3232 Site-wide JS — nav, theme toggle, font size, dropdown, state
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Theme ──────────────────────────────────────────────────────────── */
  const THEME_KEY = 'ism3232-theme';
  const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  function getTheme() {
    return localStorage.getItem(THEME_KEY) ||
           (prefersDark() ? 'dark' : 'light');
  }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    const btn = document.getElementById('sn-theme-btn');
    if (btn) {
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      const label = btn.querySelector('.sn-theme-label');
      if (label) label.textContent = t === 'dark' ? 'Light' : 'Dark';
    }
  }

  /* Apply immediately (before paint) to avoid flash */
  applyTheme(getTheme());

  /* ── 2. Font size ──────────────────────────────────────────────────────── */
  const FONT_KEY = 'ism3232-fontsize';
  const FONT_SIZES = [14, 16, 18, 20];
  let fontIdx = parseInt(localStorage.getItem(FONT_KEY) || '1', 10);

  function applyFont(idx) {
    fontIdx = Math.max(0, Math.min(FONT_SIZES.length - 1, idx));
    document.documentElement.style.fontSize = FONT_SIZES[fontIdx] + 'px';
    localStorage.setItem(FONT_KEY, fontIdx);
  }

  applyFont(fontIdx);

  /* ── 3. Build nav ──────────────────────────────────────────────────────── */
  const WEEKS = [
    [1,  'Developer Mindset & Setup',          1],
    [2,  'zsh Navigation & File Ops',           1],
    [3,  'Virtual Environments & .zshrc',       1],
    [4,  'Search Tools, Ritual & Git',          1],
    [5,  'Variables, Data Types & Operators',   2],
    [6,  'Conditionals, Loops & Dicts',         2],
    [7,  'Functions, Modules & pytest',         2],
    [8,  'Debugging, AI Literacy & Review',     2],
    [9,  'Midterm',                             2],
    [10, 'OOP I — Classes & Objects',           3],
    [11, 'OOP II — Composition & Inheritance',  3],
    [12, 'OOP III — Design & Practice',         3],
    [13, 'Capstone Design & SQL',               4],
    [14, 'Python + SQL Integration',            4],
    [15, 'Streamlit Interface',                 4],
    [16, 'GenAI Feature & Final Demo',          4],
  ];

  const UNIT_LABELS = {1:'Unit 1', 2:'Unit 2', 3:'Unit 3', 4:'Unit 4'};
  const UNIT_COLORS = {1:'#00c9a7', 2:'#818cf8', 3:'#fb7185', 4:'#fbbf24'};

  /* Detect current page */
  const path = window.location.pathname;
  const fname = path.split('/').pop().replace('.html','');

  /* Which week is this? */
  const wkMatch = fname.match(/week(\d+)/);
  const currentWeek = wkMatch ? parseInt(wkMatch[1], 10) : 0;

  /* Which type? */
  const isReading  = fname.includes('reading');
  const isLecture  = fname.includes('lecture');
  const isLab      = fname.includes('lab');
  const isSlides   = fname.includes('_slides') && !fname.includes('script');
  const isOverview = fname.includes('overview');
  const isCheat    = fname.includes('cheatsheet');
  const isPre      = fname.includes('precourse');
  const isMap      = fname.includes('course_map');
  const isIndex    = fname === '' || fname === 'index';

  /* Root path relative to current file */
  const inDocs = path.includes('/docs/');
  const root   = inDocs ? '../' : './';
  const docs   = inDocs ? './'  : './docs/';

  function wkLink(wn, suffix, label, extraClass='') {
    const href = `${docs}week${String(wn).padStart(2,'0')}_${suffix}.html`;
    const active = (currentWeek === wn && fname.includes(suffix)) ? ' active' : '';
    return `<a class="sn-dd-item${active}${extraClass ? ' '+extraClass : ''}" href="${href}">
      <span class="sn-dd-num">W${wn} ${label}</span>
      <span>${WEEKS.find(w=>w[0]===wn)?.[1]||''}</span>
    </a>`;
  }

  /* Build week dropdown for each unit */
  function buildUnitDD(unitNum) {
    const wks = WEEKS.filter(w => w[2] === unitNum);
    let html = '';
    wks.forEach(([wn]) => {
      html += `<div style="padding:4px 16px 2px;font-size:9px;letter-spacing:.1em;
        text-transform:uppercase;color:${UNIT_COLORS[unitNum]};opacity:.8;">W${wn}</div>`;
      html += wkLink(wn, 'reading',  '· Reading');
      html += wkLink(wn, 'lecture',  '· Lecture');
      if (wn !== 9) html += wkLink(wn, 'lab', '· Lab');
      html += wkLink(wn, 'slides',   '· Slides');
      html += `<div class="sn-dd-sep"></div>`;
    });
    return html;
  }

  /* Active check helpers */
  function a(cond) { return cond ? ' active' : ''; }
  const inUnit = (u) => WEEKS.filter(w=>w[2]===u).some(w=>w[0]===currentWeek);

  const nav = document.createElement('nav');
  nav.id = 'site-nav';
  nav.setAttribute('aria-label', 'Site navigation');
  nav.innerHTML = `
    <a class="sn-logo" href="${root}index.html" aria-label="ISM3232 Home">ISM3232</a>
    <div class="sn-div" aria-hidden="true"></div>

    <div class="sn-links" role="menubar">

      <a class="sn-link${a(isMap||isPre)}" href="${docs}course_map.html">Map</a>
      <a class="sn-link${a(isPre)}"        href="${docs}precourse.html">Pre-Course</a>

      <div class="sn-div" aria-hidden="true"></div>

      <!-- Unit 1 -->
      <div class="sn-week-group" id="dd-u1">
        <button class="sn-week-btn${a(inUnit(1))}"
                aria-haspopup="true" aria-expanded="false" aria-controls="dd-u1-panel"
                style="${inUnit(1)?'color:'+UNIT_COLORS[1]+';border-bottom-color:'+UNIT_COLORS[1]:''}"
                onclick="ISM.toggleDD('dd-u1')">
          <span style="color:${UNIT_COLORS[1]}">U1</span>&nbsp;Foundations
          <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M1 1l4 4 4-4"/>
          </svg>
        </button>
        <div class="sn-week-dropdown" id="dd-u1-panel" role="menu">${buildUnitDD(1)}</div>
      </div>

      <!-- Unit 2 -->
      <div class="sn-week-group" id="dd-u2">
        <button class="sn-week-btn${a(inUnit(2))}"
                aria-haspopup="true" aria-expanded="false" aria-controls="dd-u2-panel"
                style="${inUnit(2)?'color:'+UNIT_COLORS[2]+';border-bottom-color:'+UNIT_COLORS[2]:''}"
                onclick="ISM.toggleDD('dd-u2')">
          <span style="color:${UNIT_COLORS[2]}">U2</span>&nbsp;Python
          <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M1 1l4 4 4-4"/>
          </svg>
        </button>
        <div class="sn-week-dropdown" id="dd-u2-panel" role="menu">${buildUnitDD(2)}</div>
      </div>

      <!-- Unit 3 -->
      <div class="sn-week-group" id="dd-u3">
        <button class="sn-week-btn${a(inUnit(3))}"
                aria-haspopup="true" aria-expanded="false" aria-controls="dd-u3-panel"
                style="${inUnit(3)?'color:'+UNIT_COLORS[3]+';border-bottom-color:'+UNIT_COLORS[3]:''}"
                onclick="ISM.toggleDD('dd-u3')">
          <span style="color:${UNIT_COLORS[3]}">U3</span>&nbsp;OOP
          <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M1 1l4 4 4-4"/>
          </svg>
        </button>
        <div class="sn-week-dropdown" id="dd-u3-panel" role="menu">${buildUnitDD(3)}</div>
      </div>

      <!-- Unit 4 -->
      <div class="sn-week-group" id="dd-u4">
        <button class="sn-week-btn${a(inUnit(4))}"
                aria-haspopup="true" aria-expanded="false" aria-controls="dd-u4-panel"
                style="${inUnit(4)?'color:'+UNIT_COLORS[4]+';border-bottom-color:'+UNIT_COLORS[4]:''}"
                onclick="ISM.toggleDD('dd-u4')">
          <span style="color:${UNIT_COLORS[4]}">U4</span>&nbsp;Capstone
          <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M1 1l4 4 4-4"/>
          </svg>
        </button>
        <div class="sn-week-dropdown" id="dd-u4-panel" role="menu">${buildUnitDD(4)}</div>
      </div>

      <div class="sn-div" aria-hidden="true"></div>

      <a class="sn-link${a(isCheat)}" href="${docs}unit_1_cheatsheet.html">Cheat Sheets</a>
      <a class="sn-link${a(isOverview)}" href="${docs}unit_all_overview.html">Overviews</a>

      <div class="sn-div" aria-hidden="true"></div>

      <a class="sn-link" href="${docs}glossary.html" style="${fname==='glossary'?'color:var(--sn-active);border-bottom-color:var(--sn-active)':''}">Glossary</a>
      <a class="sn-link" href="${docs}troubleshooting.html" style="${fname==='troubleshooting'?'color:var(--sn-active);border-bottom-color:var(--sn-active)':''}">Help</a>
      <a class="sn-link" href="${docs}capstone_rubric.html">Rubric</a>
      <a class="sn-link" href="${docs}expectations.html" style="${fname==='expectations'?'color:var(--sn-active);border-bottom-color:var(--sn-active)':''}">Expectations</a>
    </div>

    <!-- Right controls -->
    <div class="sn-right" aria-label="Display controls">
      <!-- Font size -->
      <div class="sn-font-btns" role="group" aria-label="Font size">
        <button class="sn-font-btn" onclick="ISM.fontDown()" aria-label="Decrease font size" title="Smaller text">A-</button>
        <button class="sn-font-btn" onclick="ISM.fontUp()"   aria-label="Increase font size" title="Larger text">A+</button>
      </div>
      <!-- Theme toggle -->
      <button class="sn-theme-toggle" id="sn-theme-btn"
              onclick="ISM.toggleTheme()"
              aria-label="Switch to dark mode"
              aria-pressed="false">
        <span class="sn-pill" aria-hidden="true"></span>
        <span class="sn-theme-label">Dark</span>
      </button>
    </div>
  `;

  /* Insert nav after body opens — before skip link if present */
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.after(nav);
  } else {
    /* Add skip link + nav */
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main-content';
    skip.textContent = 'Skip to main content';
    document.body.prepend(nav);
    document.body.prepend(skip);
  }

  /* Tag main content for skip link */
  const wrapper = document.querySelector('.wrapper, main, article, .main');
  if (wrapper && !wrapper.id) wrapper.id = 'main-content';

  /* ── 4. Dropdown logic ─────────────────────────────────────────────────── */
  function toggleDD(id) {
    const group = document.getElementById(id);
    const wasOpen = group.classList.contains('open');
    /* Close all */
    document.querySelectorAll('.sn-week-group.open').forEach(g => {
      g.classList.remove('open');
      g.querySelector('.sn-week-btn').setAttribute('aria-expanded','false');
    });
    if (!wasOpen) {
      group.classList.add('open');
      group.querySelector('.sn-week-btn').setAttribute('aria-expanded','true');
    }
  }

  /* Close dropdowns on outside click */
  document.addEventListener('click', e => {
    if (!e.target.closest('.sn-week-group')) {
      document.querySelectorAll('.sn-week-group.open').forEach(g => {
        g.classList.remove('open');
        g.querySelector('.sn-week-btn').setAttribute('aria-expanded','false');
      });
    }
  });

  /* Keyboard: Escape closes dropdowns */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.sn-week-group.open').forEach(g => {
        g.classList.remove('open');
        g.querySelector('.sn-week-btn').setAttribute('aria-expanded','false');
        g.querySelector('.sn-week-btn').focus();
      });
    }
  });

  /* ── 5. Public API ─────────────────────────────────────────────────────── */
  window.ISM = {
    toggleTheme() {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    },
    fontUp()   { applyFont(fontIdx + 1); },
    fontDown() { applyFont(fontIdx - 1); },
    toggleDD,
  };

  /* Apply saved font on load */
  applyFont(fontIdx);
  applyTheme(getTheme());

})();
