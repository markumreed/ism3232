/* ═══════════════════════════════════════════════════════════════════════════
   ISM3232 Site-wide JS — nav, theme toggle, font size, dropdown, state
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Theme ──────────────────────────────────────────────────────────── */
  var THEME_KEY = 'ism3232-theme';

  function prefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || (prefersDark() ? 'dark' : 'light');
  }

  function applyTheme(t) {
    /* Set on <html> so all CSS selectors can target it */
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);

    var btn = document.getElementById('sn-theme-btn');
    if (btn) {
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      var label = btn.querySelector('.sn-theme-label');
      if (label) { label.textContent = t === 'dark' ? 'Light' : 'Dark'; }
    }
  }

  /* Apply immediately — before paint — to prevent flash */
  applyTheme(getTheme());

  /* ── 2. Font size ──────────────────────────────────────────────────────── */
  var FONT_KEY  = 'ism3232-fontsize';
  var FONT_SCALE = [0.85, 1, 1.15, 1.3];   /* multipliers applied to root */
  var fontIdx   = parseInt(localStorage.getItem(FONT_KEY) || '1', 10);
  var fontStyleEl = null;

  function applyFont(idx) {
    fontIdx = Math.max(0, Math.min(FONT_SCALE.length - 1, idx));
    localStorage.setItem(FONT_KEY, String(fontIdx));

    /* Inject a <style> block that scales all common text sizes */
    if (!fontStyleEl) {
      fontStyleEl = document.createElement('style');
      fontStyleEl.id = 'ism-font-scale';
      document.head.appendChild(fontStyleEl);
    }

    var s = FONT_SCALE[fontIdx];
    /* Scale the key text sizes used across all page types */
    fontStyleEl.textContent = [
      'body, .wrapper { font-size: ' + Math.round(16 * s) + 'px !important; }',
      'p, li, .term-def, .cs-def, .rub-req { font-size: ' + Math.round(15 * s) + 'px !important; }',
      'pre code, .sb-code { font-size: ' + Math.round(13 * s) + 'px !important; }',
      'h1 { font-size: ' + Math.round(28 * s) + 'px !important; }',
      'h2 { font-size: ' + Math.round(20 * s) + 'px !important; }',
      'h3 { font-size: ' + Math.round(16 * s) + 'px !important; }',
      '.section-title { font-size: ' + Math.round(20 * s) + 'px !important; }',
      '.concept p, .warn p, .ok p { font-size: ' + Math.round(14 * s) + 'px !important; }',
    ].join('\n');
  }

  applyFont(fontIdx);

  /* ── 3. Nav data ───────────────────────────────────────────────────────── */
  var WEEKS = [
    [1,  'Developer Mindset & Setup',         1],
    [2,  'zsh Navigation & File Ops',          1],
    [3,  'Virtual Environments & .zshrc',      1],
    [4,  'Search Tools, Ritual & Git',         1],
    [5,  'Variables, Data Types & Operators',  2],
    [6,  'Conditionals, Loops & Dicts',        2],
    [7,  'Functions, Modules & pytest',        2],
    [8,  'Debugging, AI Literacy & Review',    2],
    [9,  'Midterm',                            2],
    [10, 'OOP I — Classes & Objects',          3],
    [11, 'OOP II — Composition & Inheritance', 3],
    [12, 'OOP III — Design & Practice',        3],
    [13, 'Capstone Design & SQL',              4],
    [14, 'Python + SQL Integration',           4],
    [15, 'Streamlit Interface',                4],
    [16, 'GenAI Feature & Final Demo',         4],
  ];

  var UNIT_COLORS = {1:'#00c9a7', 2:'#818cf8', 3:'#fb7185', 4:'#fbbf24'};
  var UNIT_NAMES  = {1:'Foundations', 2:'Python', 3:'OOP', 4:'Capstone'};

  /* ── 4. Path detection ─────────────────────────────────────────────────── */
  var path   = window.location.pathname;
  var fname  = path.split('/').pop().replace('.html', '') || 'index';
  var inDocs = path.indexOf('/docs/') !== -1;
  var root   = inDocs ? '../' : './';
  var docs   = inDocs ? './'  : './docs/';

  var wkMatch      = fname.match(/week(\d+)/);
  var currentWeek  = wkMatch ? parseInt(wkMatch[1], 10) : 0;

  function inUnit(u) {
    for (var i = 0; i < WEEKS.length; i++) {
      if (WEEKS[i][2] === u && WEEKS[i][0] === currentWeek) return true;
    }
    return false;
  }

  function isActive(testFname) {
    return fname.indexOf(testFname) !== -1;
  }

  /* ── 5. Build nav HTML ─────────────────────────────────────────────────── */
  function ddItem(wn, suffix, label) {
    var href    = docs + 'week' + (wn < 10 ? '0' : '') + wn + '_' + suffix + '.html';
    var active  = (currentWeek === wn && fname.indexOf(suffix) !== -1) ? ' active' : '';
    var title   = '';
    for (var i = 0; i < WEEKS.length; i++) {
      if (WEEKS[i][0] === wn) { title = WEEKS[i][1]; break; }
    }
    return '<a class="sn-dd-item' + active + '" href="' + href + '">'
         + '<span class="sn-dd-num">W' + wn + ' ' + label + '</span>'
         + '<span>' + title + '</span></a>';
  }

  function buildDD(unitNum) {
    var html = '';
    var color = UNIT_COLORS[unitNum];
    for (var i = 0; i < WEEKS.length; i++) {
      var w = WEEKS[i];
      if (w[2] !== unitNum) continue;
      var wn = w[0];
      html += '<div style="padding:4px 16px 2px;font-size:9px;letter-spacing:.1em;'
            + 'text-transform:uppercase;color:' + color + ';opacity:.8;">W' + wn + '</div>';
      html += ddItem(wn, 'reading', '· Reading');
      html += ddItem(wn, 'lecture', '· Lecture');
      if (wn !== 9) html += ddItem(wn, 'lab', '· Lab');
      html += ddItem(wn, 'slides', '· Slides');
      html += '<div class="sn-dd-sep"></div>';
    }
    return html;
  }

  function unitBtn(u) {
    var active  = inUnit(u);
    var color   = UNIT_COLORS[u];
    var style   = active ? 'color:' + color + ';border-bottom-color:' + color + ';' : '';
    var cls     = 'sn-week-btn' + (active ? ' active' : '');
    return '<div class="sn-week-group" id="dd-u' + u + '">'
         + '<button class="' + cls + '" style="' + style + '"'
         + ' aria-haspopup="true" aria-expanded="false"'
         + ' aria-controls="dd-u' + u + '-panel"'
         + ' onclick="ISM.toggleDD(\'dd-u' + u + '\')">'
         + '<span style="color:' + color + '">U' + u + '</span>&nbsp;' + UNIT_NAMES[u]
         + '<svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5"'
         + ' aria-hidden="true" style="width:10px;height:10px;margin-left:4px;">'
         + '<path d="M1 1l4 4 4-4"/></svg></button>'
         + '<div class="sn-week-dropdown" id="dd-u' + u + '-panel" role="menu">'
         + buildDD(u) + '</div></div>';
  }

  function navLink(href, label, activeTest) {
    var active = isActive(activeTest) ? ' active' : '';
    return '<a class="sn-link' + active + '" href="' + href + '">' + label + '</a>';
  }

  var navHTML = ''
    + '<a class="sn-logo" href="' + root + 'index.html" aria-label="ISM3232 Home">ISM3232</a>'
    + '<div class="sn-div" aria-hidden="true"></div>'
    + '<div class="sn-links" role="menubar">'
    + navLink(docs + 'course_map.html',    'Map',          'course_map')
    + navLink(docs + 'precourse.html',     'Pre-Course',   'precourse')
    + '<div class="sn-div" aria-hidden="true"></div>'
    + unitBtn(1)
    + unitBtn(2)
    + unitBtn(3)
    + unitBtn(4)
    + '<div class="sn-div" aria-hidden="true"></div>'
    + navLink(docs + 'unit_1_cheatsheet.html',  'Cheat Sheets',   'cheatsheet')
    + navLink(docs + 'unit_all_overview.html',   'Overviews',      'overview')
    + navLink(docs + 'glossary.html',            'Glossary',       'glossary')
    + navLink(docs + 'troubleshooting.html',     'Help',           'troubleshooting')
    + navLink(docs + 'capstone_rubric.html',     'Rubric',         'capstone_rubric')
    + navLink(docs + 'expectations.html',        'Expectations',   'expectations')
    + '</div>'
    + '<div class="sn-right" aria-label="Display controls">'
    + '<div class="sn-font-btns" role="group" aria-label="Font size">'
    + '<button class="sn-font-btn" onclick="ISM.fontDown()" aria-label="Decrease font size" title="Smaller text">A-</button>'
    + '<button class="sn-font-btn" onclick="ISM.fontUp()"   aria-label="Increase font size" title="Larger text">A+</button>'
    + '</div>'
    + '<button class="sn-theme-toggle" id="sn-theme-btn"'
    + ' onclick="ISM.toggleTheme()"'
    + ' aria-label="Switch to dark mode" aria-pressed="false">'
    + '<span class="sn-pill" aria-hidden="true"></span>'
    + '<span class="sn-theme-label">Dark</span>'
    + '</button>'
    + '</div>';

  /* ── 6. Insert nav ─────────────────────────────────────────────────────── */
  var nav = document.createElement('nav');
  nav.id = 'site-nav';
  nav.setAttribute('aria-label', 'Site navigation');
  nav.innerHTML = navHTML;

  var skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#main-content';
  skip.textContent = 'Skip to main content';

  /* Insert at the very top of body */
  if (document.body.firstChild) {
    document.body.insertBefore(nav,  document.body.firstChild);
    document.body.insertBefore(skip, document.body.firstChild);
  } else {
    document.body.appendChild(skip);
    document.body.appendChild(nav);
  }

  /* Tag main content region */
  var wrapper = document.querySelector('.wrapper, main, article, #content');
  if (wrapper && !wrapper.id) { wrapper.id = 'main-content'; }

  /* ── 7. Dropdown logic ─────────────────────────────────────────────────── */
  function toggleDD(id) {
    var group  = document.getElementById(id);
    if (!group) return;
    var wasOpen = group.classList.contains('open');

    /* Close all */
    var allGroups = document.querySelectorAll('.sn-week-group.open');
    for (var i = 0; i < allGroups.length; i++) {
      allGroups[i].classList.remove('open');
      var btn = allGroups[i].querySelector('.sn-week-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    if (!wasOpen) {
      group.classList.add('open');
      var btn = group.querySelector('.sn-week-btn');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.sn-week-group')) {
      var open = document.querySelectorAll('.sn-week-group.open');
      for (var i = 0; i < open.length; i++) {
        open[i].classList.remove('open');
        var btn = open[i].querySelector('.sn-week-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var open = document.querySelectorAll('.sn-week-group.open');
      for (var i = 0; i < open.length; i++) {
        open[i].classList.remove('open');
        var btn = open[i].querySelector('.sn-week-btn');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      }
    }
  });

  /* ── 8. Public API ─────────────────────────────────────────────────────── */
  window.ISM = {
    toggleTheme: function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    },
    fontUp:   function () { applyFont(fontIdx + 1); },
    fontDown: function () { applyFont(fontIdx - 1); },
    toggleDD: toggleDD,
  };

  /* Ensure state is applied after nav is in DOM */
  applyTheme(getTheme());
  applyFont(fontIdx);

})();
