/* ═══════════════════════════════════════════════════════════════════════════
   ISM3232 Site-wide JS
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Theme ─────────────────────────────────────────────────────────────── */
  var THEME_KEY = 'ism3232-theme';

  function prefersDark() { return window.matchMedia('(prefers-color-scheme: dark)').matches; }

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || (prefersDark() ? 'dark' : 'light');
  }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    var btn = document.getElementById('sn-theme-btn');
    if (btn) {
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      var lbl = btn.querySelector('.sn-theme-label');
      if (lbl) lbl.textContent = t === 'dark' ? 'Light' : 'Dark';
    }
  }

  applyTheme(getTheme());

  /* ── Font size ─────────────────────────────────────────────────────────── */
  var FONT_KEY   = 'ism3232-fontsize';
  var FONT_SCALE = [0.85, 1, 1.15, 1.3];
  var fontIdx    = parseInt(localStorage.getItem(FONT_KEY) || '1', 10);
  var fontStyleEl = null;

  function applyFont(idx) {
    fontIdx = Math.max(0, Math.min(FONT_SCALE.length - 1, idx));
    localStorage.setItem(FONT_KEY, String(fontIdx));
    if (!fontStyleEl) {
      fontStyleEl = document.createElement('style');
      fontStyleEl.id = 'ism-font-scale';
      document.head.appendChild(fontStyleEl);
    }
    var s = FONT_SCALE[fontIdx];
    fontStyleEl.textContent = [
      'body, .wrapper { font-size: ' + Math.round(16 * s) + 'px !important; }',
      'p, li, .term-def, .cs-def, .rub-req { font-size: ' + Math.round(15 * s) + 'px !important; }',
      'pre code { font-size: ' + Math.round(13 * s) + 'px !important; }',
      'h1 { font-size: ' + Math.round(28 * s) + 'px !important; }',
      'h2 { font-size: ' + Math.round(20 * s) + 'px !important; }',
      'h3 { font-size: ' + Math.round(16 * s) + 'px !important; }',
      '.concept p, .warn p, .ok p { font-size: ' + Math.round(14 * s) + 'px !important; }',
    ].join('\n');
  }

  applyFont(fontIdx);

  /* ── Nav data ──────────────────────────────────────────────────────────── */
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

  /* ── Path detection ────────────────────────────────────────────────────── */
  var path        = window.location.pathname;
  var fname       = path.split('/').pop().replace('.html', '') || 'index';
  var inDocs      = path.indexOf('/docs/') !== -1;
  var root        = inDocs ? '../' : './';
  var docs        = inDocs ? './'  : './docs/';
  var wkMatch     = fname.match(/week(\d+)/);
  var currentWeek = wkMatch ? parseInt(wkMatch[1], 10) : 0;

  function inUnit(u) {
    for (var i = 0; i < WEEKS.length; i++) {
      if (WEEKS[i][2] === u && WEEKS[i][0] === currentWeek) return true;
    }
    return false;
  }

  /* ── Build dropdown HTML ───────────────────────────────────────────────── */
  function ddItem(wn, suffix, label) {
    var href   = docs + 'week' + (wn < 10 ? '0' : '') + wn + '_' + suffix + '.html';
    var active = (currentWeek === wn && fname.indexOf(suffix) !== -1) ? ' active' : '';
    var title  = '';
    for (var i = 0; i < WEEKS.length; i++) {
      if (WEEKS[i][0] === wn) { title = WEEKS[i][1]; break; }
    }
    return '<a class="sn-dd-item' + active + '" href="' + href + '">'
         + '<span class="sn-dd-num">W' + wn + ' ' + label + '</span>'
         + '<span>' + title + '</span></a>';
  }

  function buildDD(unitNum) {
    var html  = '';
    var color = UNIT_COLORS[unitNum];
    for (var i = 0; i < WEEKS.length; i++) {
      var w = WEEKS[i];
      if (w[2] !== unitNum) continue;
      var wn = w[0];
      html += '<div style="padding:4px 16px 2px;font-size:9px;letter-spacing:.1em;'
            + 'text-transform:uppercase;color:' + color + ';opacity:.8;">W' + wn + '</div>';
      html += ddItem(wn, 'reading', 'Reading');
      html += ddItem(wn, 'lecture', 'Lecture');
      if (wn !== 9) html += ddItem(wn, 'lab', 'Lab');
      html += ddItem(wn, 'slides',  'Slides');
      html += '<div class="sn-dd-sep"></div>';
    }
    return html;
  }

  /* ── Build nav HTML (NO inline onclick — uses data-dd + delegated listener) */
  function buildNav() {
    var nav = document.createElement('nav');
    nav.id  = 'site-nav';
    nav.setAttribute('aria-label', 'Site navigation');

    /* Logo */
    var logo = document.createElement('a');
    logo.className = 'sn-logo';
    logo.href = root + 'index.html';
    logo.setAttribute('aria-label', 'ISM3232 Home');
    logo.textContent = 'ISM3232';
    nav.appendChild(logo);

    /* Link area */
    var links = document.createElement('div');
    links.className = 'sn-links';
    links.setAttribute('role', 'menubar');
    nav.appendChild(links);

    /* Helper: plain link */
    function addLink(href, label, activeTest) {
      var a = document.createElement('a');
      a.className = 'sn-link' + (fname.indexOf(activeTest) !== -1 ? ' active' : '');
      a.href = href;
      a.textContent = label;
      links.appendChild(a);
    }

    /* Helper: divider */
    function addDiv() {
      var d = document.createElement('div');
      d.className = 'sn-div';
      d.setAttribute('aria-hidden', 'true');
      links.appendChild(d);
    }

    /* Helper: unit dropdown — button uses data-dd, NO onclick attribute */
    function addUnit(u) {
      var active = inUnit(u);
      var color  = UNIT_COLORS[u];

      var group = document.createElement('div');
      group.className = 'sn-week-group';
      group.id = 'dd-u' + u;

      var btn = document.createElement('button');
      btn.className = 'sn-week-btn' + (active ? ' active' : '');
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', 'dd-u' + u + '-panel');
      btn.setAttribute('data-dd', 'dd-u' + u);  /* ← no onclick needed */
      if (active) btn.style.cssText = 'color:' + color + ';border-bottom-color:' + color + ';';

      var uSpan = document.createElement('span');
      uSpan.style.color = color;
      uSpan.textContent = 'U' + u;
      btn.appendChild(uSpan);

      btn.appendChild(document.createTextNode('\u00a0' + UNIT_NAMES[u]));

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 10 6');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.5');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'width:10px;height:10px;margin-left:4px;';
      var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('d', 'M1 1l4 4 4-4');
      svg.appendChild(path2);
      btn.appendChild(svg);

      var panel = document.createElement('div');
      panel.className = 'sn-week-dropdown';
      panel.id = 'dd-u' + u + '-panel';
      panel.setAttribute('role', 'menu');
      panel.innerHTML = buildDD(u);

      group.appendChild(btn);
      group.appendChild(panel);
      links.appendChild(group);
    }

    addLink(docs + 'course_map.html',         'Map',          'course_map');
    addLink(docs + 'precourse.html',           'Pre-Course',   'precourse');
    addDiv();
    addUnit(1); addUnit(2); addUnit(3); addUnit(4);
    addDiv();
    addLink(docs + 'unit_1_cheatsheet.html',   'Cheat Sheets', 'cheatsheet');
    addLink(docs + 'unit_all_overview.html',   'Overviews',    'overview');
    addLink(docs + 'glossary.html',            'Glossary',     'glossary');
    addLink(docs + 'troubleshooting.html',     'Help',         'troubleshooting');
    addLink(docs + 'capstone_rubric.html',     'Rubric',       'capstone_rubric');
    addLink(docs + 'expectations.html',        'Expectations', 'expectations');

    /* Right controls */
    var right = document.createElement('div');
    right.className = 'sn-right';
    right.setAttribute('aria-label', 'Display controls');

    right.innerHTML = '<div class="sn-font-btns" role="group" aria-label="Font size">'
      + '<button class="sn-font-btn" id="sn-font-down" aria-label="Decrease font size" title="Smaller text">A-</button>'
      + '<button class="sn-font-btn" id="sn-font-up"   aria-label="Increase font size" title="Larger text">A+</button>'
      + '</div>'
      + '<button class="sn-theme-toggle" id="sn-theme-btn"'
      + ' aria-label="Switch to dark mode" aria-pressed="false">'
      + '<span class="sn-pill" aria-hidden="true"></span>'
      + '<span class="sn-theme-label">Dark</span>'
      + '</button>';
    nav.appendChild(right);

    return nav;
  }

  /* ── Insert nav ────────────────────────────────────────────────────────── */
  var nav = buildNav();

  var skip = document.createElement('a');
  skip.className   = 'skip-link';
  skip.href        = '#main-content';
  skip.textContent = 'Skip to main content';

  if (document.body.firstChild) {
    document.body.insertBefore(nav,  document.body.firstChild);
    document.body.insertBefore(skip, document.body.firstChild);
  } else {
    document.body.appendChild(skip);
    document.body.appendChild(nav);
  }

  /* Tag main content region for skip link */
  var wrapper = document.querySelector('.wrapper, main, article');
  if (wrapper && !wrapper.id) wrapper.id = 'main-content';

  /* ── Delegated click handler ───────────────────────────────────────────── */
  function toggleDD(id) {
    var group = document.getElementById(id);
    if (!group) return;
    var wasOpen = group.classList.contains('open');
    /* Close all */
    var allOpen = document.querySelectorAll('.sn-week-group.open');
    for (var i = 0; i < allOpen.length; i++) {
      allOpen[i].classList.remove('open');
      var b = allOpen[i].querySelector('[data-dd]');
      if (b) b.setAttribute('aria-expanded', 'false');
    }
    if (!wasOpen) {
      group.classList.add('open');
      var btn = group.querySelector('[data-dd]');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  document.addEventListener('click', function (e) {
    var ddBtn = e.target.closest ? e.target.closest('[data-dd]') : null;
    if (ddBtn) {
      e.stopPropagation();
      toggleDD(ddBtn.getAttribute('data-dd'));
      return;
    }
    if (!e.target.closest || !e.target.closest('.sn-week-group')) {
      var allOpen = document.querySelectorAll('.sn-week-group.open');
      for (var i = 0; i < allOpen.length; i++) {
        allOpen[i].classList.remove('open');
        var b = allOpen[i].querySelector('[data-dd]');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var allOpen = document.querySelectorAll('.sn-week-group.open');
      for (var i = 0; i < allOpen.length; i++) {
        allOpen[i].classList.remove('open');
        var b = allOpen[i].querySelector('[data-dd]');
        if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
      }
    }
  });

  /* ── Wire font + theme buttons (added to DOM above, wire here) ─────────── */
  document.addEventListener('click', function (e) {
    if (e.target.id === 'sn-font-down') { applyFont(fontIdx - 1); return; }
    if (e.target.id === 'sn-font-up')   { applyFont(fontIdx + 1); return; }
    if (e.target.id === 'sn-theme-btn' || e.target.closest('#sn-theme-btn')) {
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    }
  });

  /* ── Public API ────────────────────────────────────────────────────────── */
  window.ISM = {
    toggleTheme: function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    },
    fontUp:   function () { applyFont(fontIdx + 1); },
    fontDown: function () { applyFont(fontIdx - 1); },
    toggleDD: toggleDD,
  };

  /* Final state application */
  applyTheme(getTheme());
  applyFont(fontIdx);

})();
