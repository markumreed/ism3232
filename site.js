/* ═══════════════════════════════════════════════════════════════════════════
   ISM3232 Site-wide JS
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Theme ─────────────────────────────────────────────────────────────── */
  var THEME_KEY = 'ism3232-theme';

  function prefersDark() { return window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function getTheme()    { return localStorage.getItem(THEME_KEY) || (prefersDark() ? 'dark' : 'light'); }

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
  var fontEl     = null;

  function applyFont(idx) {
    fontIdx = Math.max(0, Math.min(FONT_SCALE.length - 1, idx));
    localStorage.setItem(FONT_KEY, String(fontIdx));
    if (!fontEl) {
      fontEl    = document.createElement('style');
      fontEl.id = 'ism-font-scale';
      document.head.appendChild(fontEl);
    }
    var s = FONT_SCALE[fontIdx];
    fontEl.textContent =
      'body,.wrapper{font-size:' + Math.round(16*s) + 'px!important}' +
      'p,li,.term-def,.cs-def,.rub-req{font-size:' + Math.round(15*s) + 'px!important}' +
      'pre code{font-size:' + Math.round(13*s) + 'px!important}' +
      'h1{font-size:' + Math.round(28*s) + 'px!important}' +
      'h2{font-size:' + Math.round(20*s) + 'px!important}' +
      'h3{font-size:' + Math.round(16*s) + 'px!important}' +
      '.concept p,.warn p,.ok p{font-size:' + Math.round(14*s) + 'px!important}';
  }

  applyFont(fontIdx);

  /* ── Week / unit data ──────────────────────────────────────────────────── */
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
  var UCOL  = {1:'#00c9a7',2:'#818cf8',3:'#fb7185',4:'#fbbf24'};
  var UNAME = {1:'Foundations',2:'Python',3:'OOP',4:'Capstone'};

  /* ── Path detection ────────────────────────────────────────────────────── */
  var path   = window.location.pathname;
  var fname  = path.split('/').pop().replace('.html','') || 'index';
  var inDocs = path.indexOf('/docs/') !== -1;
  var root   = inDocs ? '../' : './';
  var docs   = inDocs ? './'  : './docs/';
  var wkM    = fname.match(/week(\d+)/);
  var curWk  = wkM ? parseInt(wkM[1],10) : 0;

  function inUnit(u) {
    for (var i=0;i<WEEKS.length;i++) { if(WEEKS[i][2]===u && WEEKS[i][0]===curWk) return true; }
    return false;
  }

  /* ── Build dropdown items ──────────────────────────────────────────────── */
  function ddHTML(unitNum) {
    var out = '';
    var col = UCOL[unitNum];
    for (var i=0;i<WEEKS.length;i++) {
      var w = WEEKS[i];
      if (w[2] !== unitNum) continue;
      var wn = w[0];
      var pad = wn < 10 ? '0' : '';
      out += '<div style="padding:4px 14px 2px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:' + col + ';opacity:.8">W' + wn + '</div>';
      function mkItem(suffix, label) {
        var href   = docs + 'week' + pad + wn + '_' + suffix + '.html';
        var active = (curWk===wn && fname.indexOf(suffix)!==-1) ? ' active' : '';
        var title  = '';
        for (var j=0;j<WEEKS.length;j++) { if(WEEKS[j][0]===wn){title=WEEKS[j][1];break;} }
        return '<a class="sn-dd-item' + active + '" href="' + href + '"><span class="sn-dd-num">W' + wn + ' ' + label + '</span><span>' + title + '</span></a>';
      }
      out += mkItem('reading','Reading');
      out += mkItem('lecture','Lecture');
      if (wn!==9) out += mkItem('lab','Lab');
      out += mkItem('slides','Slides');
      out += '<div class="sn-dd-sep"></div>';
    }
    return out;
  }

  /* ── Build nav using createElement (no inline onclick, no template literals) */
  function el(tag, props) {
    var e = document.createElement(tag);
    if (props) {
      for (var k in props) {
        if (k === 'text')  { e.textContent = props[k]; }
        else if (k === 'html') { e.innerHTML = props[k]; }
        else if (k === 'cls')  { e.className = props[k]; }
        else { e.setAttribute(k, props[k]); }
      }
    }
    return e;
  }
  function ch(parent) {
    for (var i=1;i<arguments.length;i++) {
      if (arguments[i]) parent.appendChild(arguments[i]);
    }
    return parent;
  }
  function txt(s) { return document.createTextNode(s); }
  function svgEl(tag, attrs) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function chevron() {
    var s = svgEl('svg',{viewBox:'0 0 10 6',fill:'none',stroke:'currentColor','stroke-width':'1.5','aria-hidden':'true'});
    s.style.cssText = 'width:10px;height:10px;margin-left:4px;flex-shrink:0;';
    ch(s, svgEl('path',{d:'M1 1l4 4 4-4'}));
    return s;
  }

  function mkLink(href, label, activeKey) {
    var active = fname.indexOf(activeKey) !== -1 ? ' active' : '';
    return el('a', {cls:'sn-link'+active, href:href, text:label});
  }
  function mkDiv() { return el('div',{cls:'sn-div','aria-hidden':'true'}); }

  /* Build one unit dropdown group — sits DIRECTLY in nav, not inside sn-links-scroll */
  function mkUnit(u) {
    var active = inUnit(u);
    var col    = UCOL[u];

    var group = el('div', {cls:'sn-week-group', id:'dd-u'+u});

    var btn = el('button', {cls:'sn-week-btn'+(active?' active':''), 'aria-haspopup':'true',
                            'aria-expanded':'false', 'aria-controls':'dd-u'+u+'-panel',
                            'data-dd':'dd-u'+u});
    if (active) btn.style.cssText = 'color:'+col+';border-bottom-color:'+col+';';

    var uspan = el('span', {text:'U'+u});
    uspan.style.color = col;
    ch(btn, uspan, txt('\u00a0'+UNAME[u]), chevron());

    var panel = el('div', {cls:'sn-week-dropdown', id:'dd-u'+u+'-panel', role:'menu', html:ddHTML(u)});

    ch(group, btn, panel);
    return group;
  }

  /* ── Assemble nav ──────────────────────────────────────────────────────── */
  var nav = el('nav', {id:'site-nav', 'aria-label':'Site navigation'});

  /* Logo */
  ch(nav, el('a', {cls:'sn-logo', href:root+'index.html', 'aria-label':'ISM3232 Home', text:'ISM3232'}));

  /* Plain links in a scrollable container */
  var scroll = el('div', {cls:'sn-links-scroll'});
  var linksWrap = el('div', {cls:'sn-links'});
  ch(linksWrap, scroll);

  ch(scroll,
    mkLink(docs+'course_map.html',       'Map',          'course_map'),
    mkLink(docs+'precourse.html',        'Pre-Course',   'precourse'),
    mkDiv(),
    mkLink(docs+'unit_1_cheatsheet.html','Cheat Sheets', 'cheatsheet'),
    mkLink(docs+'unit_all_overview.html','Overviews',    'overview'),
    mkLink(docs+'glossary.html',         'Glossary',     'glossary'),
    mkLink(docs+'troubleshooting.html',  'Help',         'troubleshooting'),
    mkLink(docs+'capstone_rubric.html',  'Rubric',       'capstone_rubric'),
    mkLink(docs+'expectations.html',     'Expectations', 'expectations')
  );

  ch(nav, linksWrap, mkDiv());

  /* Unit dropdowns sit DIRECTLY in nav — not inside the overflow:auto scroll area */
  ch(nav, mkUnit(1), mkUnit(2), mkUnit(3), mkUnit(4));

  ch(nav, mkDiv());

  /* Right controls */
  var right = el('div', {cls:'sn-right', 'aria-label':'Display controls'});
  right.innerHTML =
    '<div class="sn-font-btns" role="group" aria-label="Font size">' +
      '<button class="sn-font-btn" id="sn-font-down" aria-label="Decrease font size" title="Smaller text">A-</button>' +
      '<button class="sn-font-btn" id="sn-font-up"   aria-label="Increase font size" title="Larger text">A+</button>' +
    '</div>' +
    '<button class="sn-theme-toggle" id="sn-theme-btn" aria-label="Switch to dark mode" aria-pressed="false">' +
      '<span class="sn-pill" aria-hidden="true"></span>' +
      '<span class="sn-theme-label">Dark</span>' +
    '</button>';
  ch(nav, right);

  /* ── Insert nav + skip link at top of body ─────────────────────────────── */
  var skip = el('a', {cls:'skip-link', href:'#main-content', text:'Skip to main content'});

  var first = document.body.firstChild;
  if (first) {
    document.body.insertBefore(nav,  first);
    document.body.insertBefore(skip, nav);
  } else {
    document.body.appendChild(skip);
    document.body.appendChild(nav);
  }

  /* Tag main content */
  var wrapper = document.querySelector('.wrapper, main, article');
  if (wrapper && !wrapper.id) wrapper.id = 'main-content';

  /* ── Dropdown toggle ───────────────────────────────────────────────────── */
  function toggleDD(id) {
    var group = document.getElementById(id);
    if (!group) return;
    var wasOpen = group.classList.contains('open');
    /* Close all */
    var all = document.querySelectorAll('.sn-week-group.open');
    for (var i=0;i<all.length;i++) {
      all[i].classList.remove('open');
      var b = all[i].querySelector('[data-dd]');
      if (b) b.setAttribute('aria-expanded','false');
    }
    if (!wasOpen) {
      group.classList.add('open');
      var btn = group.querySelector('[data-dd]');
      if (btn) btn.setAttribute('aria-expanded','true');
    }
  }

  /* Single delegated click listener — catches data-dd buttons, font, theme */
  document.addEventListener('click', function(e) {
    var t = e.target;

    /* Theme toggle */
    if (t.id==='sn-theme-btn' || (t.closest && t.closest('#sn-theme-btn'))) {
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur==='dark' ? 'light' : 'dark');
      return;
    }

    /* Font buttons */
    if (t.id==='sn-font-down') { applyFont(fontIdx-1); return; }
    if (t.id==='sn-font-up')   { applyFont(fontIdx+1); return; }

    /* Dropdown buttons (have data-dd attribute) */
    var ddBtn = t.closest ? t.closest('[data-dd]') : null;
    if (ddBtn) {
      e.stopPropagation();
      toggleDD(ddBtn.getAttribute('data-dd'));
      return;
    }

    /* Click outside — close all dropdowns */
    if (!t.closest || !t.closest('.sn-week-group')) {
      var open = document.querySelectorAll('.sn-week-group.open');
      for (var i=0;i<open.length;i++) {
        open[i].classList.remove('open');
        var b = open[i].querySelector('[data-dd]');
        if (b) b.setAttribute('aria-expanded','false');
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key==='Escape') {
      var open = document.querySelectorAll('.sn-week-group.open');
      for (var i=0;i<open.length;i++) {
        open[i].classList.remove('open');
        var b = open[i].querySelector('[data-dd]');
        if (b) { b.setAttribute('aria-expanded','false'); b.focus(); }
      }
    }
  });

  /* ── Public API ────────────────────────────────────────────────────────── */
  window.ISM = {
    toggleTheme: function() {
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur==='dark' ? 'light' : 'dark');
    },
    fontUp:   function() { applyFont(fontIdx+1); },
    fontDown: function() { applyFont(fontIdx-1); },
    toggleDD: toggleDD,
  };

  applyTheme(getTheme());
  applyFont(fontIdx);

})();
