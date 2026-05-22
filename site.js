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
  var fontIdx    = parseInt(localStorage.getItem(FONT_KEY) || '1', 10);
  var fontEl     = null;

  /* Pre-built CSS for each scale level — overrides every hardcoded px size */
  var FONT_CSS = [
    '.callout-label,.code-block .cb-label,.concept-label,.concept-table th,.concern strong,.cs-bad-label,.cs-card-title,.cs-flag,.cs-good-label,.cs-h,.exemplar strong,.glance-label,.meta-label,.notice-label,.output-box .out-label,.page-footer,.prompt .p-num,.rub-table th,.section-label,.timing-block .t-label,.topic-num,.unit-divider .label{font-size:8px!important}\n.ai-badge,.assess-table .changed,.assignment .a-header,.chip,.code-block p,.code-label,.eyebrow,.meta-pill,.nav-course,.nav-week,.pill,.section-divider .label,.stack-label,.week-badge,.wk-num{font-size:8px!important}\n.capstone-item .ci-title,.card-header-text .question,.concept-table td:first-child,.map-item,.meta-val,.prompt .p-hint,.rub-weight,.section-num,.spine-pill,.stack-pill,.step-num,.timing-block .t-time{font-size:9px!important}\n.assess-table,.callout-body,.card-header-text,.check-list li,.code-block pre,.concept-table,.concern,.cs-card pre,.cs-card pre code,.cs-cmd,.exemplar,.map-arrow,.notice-body,.output-box .out-text,.rub-table td:first-child,.step-content .step-body,.topic-sub{font-size:10px!important}\n.card p,.cs-def,.cs-row,.glance-val,.page-header .subtitle,.prompt .p-text,.rub-req,.rub-table,.step-content .step-title,.term-word,.topic-text,.wk-deck,h2.section-title + .section-sub,pre code{font-size:11px!important}\n.card-header-text .title,.card-title,.check-list li::before,.check-title,.concept p,.nav-title,.ok p,.term-def,.warn p,h3{font-size:12px!important}\n.wk-deck,li,p{font-size:13px!important}\n.assignment .d-icon,.assignment h3,.checklist li::before,html{font-size:14px!important}\n.rub-title{font-size:14px!important}\n.callout-icon,.notice-icon,h2,h2.section-title{font-size:15px!important}\n.page-header h1,.wk-title,h1{font-size:24px!important}',
    '.callout-label,.code-block .cb-label,.concept-label,.concept-table th,.concern strong,.cs-bad-label,.cs-card-title,.cs-flag,.cs-good-label,.cs-h,.exemplar strong,.glance-label,.meta-label,.notice-label,.output-box .out-label,.page-footer,.prompt .p-num,.rub-table th,.section-label,.timing-block .t-label,.topic-num,.unit-divider .label{font-size:9px!important}\n.ai-badge,.assess-table .changed,.assignment .a-header,.chip,.code-block p,.code-label,.eyebrow,.meta-pill,.nav-course,.nav-week,.pill,.section-divider .label,.stack-label,.week-badge,.wk-num{font-size:10px!important}\n.capstone-item .ci-title,.card-header-text .question,.concept-table td:first-child,.map-item,.meta-val,.prompt .p-hint,.rub-weight,.section-num,.spine-pill,.stack-pill,.step-num,.timing-block .t-time{font-size:11px!important}\n.assess-table,.callout-body,.card-header-text,.check-list li,.code-block pre,.concept-table,.concern,.cs-card pre,.cs-card pre code,.cs-cmd,.exemplar,.map-arrow,.notice-body,.output-box .out-text,.rub-table td:first-child,.step-content .step-body,.topic-sub{font-size:12px!important}\n.card p,.cs-def,.cs-row,.glance-val,.page-header .subtitle,.prompt .p-text,.rub-req,.rub-table,.step-content .step-title,.term-word,.topic-text,.wk-deck,h2.section-title + .section-sub,pre code{font-size:13px!important}\n.card-header-text .title,.card-title,.check-list li::before,.check-title,.concept p,.nav-title,.ok p,.term-def,.warn p,h3{font-size:14px!important}\n.wk-deck,li,p{font-size:15px!important}\n.assignment .d-icon,.assignment h3,.checklist li::before,html{font-size:16px!important}\n.rub-title{font-size:17px!important}\n.callout-icon,.notice-icon,h2,h2.section-title{font-size:18px!important}\n.page-header h1,.wk-title,h1{font-size:28px!important}',
    '.callout-label,.code-block .cb-label,.concept-label,.concept-table th,.concern strong,.cs-bad-label,.cs-card-title,.cs-flag,.cs-good-label,.cs-h,.exemplar strong,.glance-label,.meta-label,.notice-label,.output-box .out-label,.page-footer,.prompt .p-num,.rub-table th,.section-label,.timing-block .t-label,.topic-num,.unit-divider .label{font-size:10px!important}\n.ai-badge,.assess-table .changed,.assignment .a-header,.chip,.code-block p,.code-label,.eyebrow,.meta-pill,.nav-course,.nav-week,.pill,.section-divider .label,.stack-label,.week-badge,.wk-num{font-size:12px!important}\n.capstone-item .ci-title,.card-header-text .question,.concept-table td:first-child,.map-item,.meta-val,.prompt .p-hint,.rub-weight,.section-num,.spine-pill,.stack-pill,.step-num,.timing-block .t-time{font-size:13px!important}\n.assess-table,.callout-body,.card-header-text,.check-list li,.code-block pre,.concept-table,.concern,.cs-card pre,.cs-card pre code,.cs-cmd,.exemplar,.map-arrow,.notice-body,.output-box .out-text,.rub-table td:first-child,.step-content .step-body,.topic-sub{font-size:14px!important}\n.card p,.cs-def,.cs-row,.glance-val,.page-header .subtitle,.prompt .p-text,.rub-req,.rub-table,.step-content .step-title,.term-word,.topic-text,.wk-deck,h2.section-title + .section-sub,pre code{font-size:15px!important}\n.card-header-text .title,.card-title,.check-list li::before,.check-title,.concept p,.nav-title,.ok p,.term-def,.warn p,h3{font-size:16px!important}\n.wk-deck,li,p{font-size:17px!important}\n.assignment .d-icon,.assignment h3,.checklist li::before,html{font-size:18px!important}\n.rub-title{font-size:20px!important}\n.callout-icon,.notice-icon,h2,h2.section-title{font-size:21px!important}\n.page-header h1,.wk-title,h1{font-size:32px!important}',
    '.callout-label,.code-block .cb-label,.concept-label,.concept-table th,.concern strong,.cs-bad-label,.cs-card-title,.cs-flag,.cs-good-label,.cs-h,.exemplar strong,.glance-label,.meta-label,.notice-label,.output-box .out-label,.page-footer,.prompt .p-num,.rub-table th,.section-label,.timing-block .t-label,.topic-num,.unit-divider .label{font-size:12px!important}\n.ai-badge,.assess-table .changed,.assignment .a-header,.chip,.code-block p,.code-label,.eyebrow,.meta-pill,.nav-course,.nav-week,.pill,.section-divider .label,.stack-label,.week-badge,.wk-num{font-size:13px!important}\n.capstone-item .ci-title,.card-header-text .question,.concept-table td:first-child,.map-item,.meta-val,.prompt .p-hint,.rub-weight,.section-num,.spine-pill,.stack-pill,.step-num,.timing-block .t-time{font-size:14px!important}\n.assess-table,.callout-body,.card-header-text,.check-list li,.code-block pre,.concept-table,.concern,.cs-card pre,.cs-card pre code,.cs-cmd,.exemplar,.map-arrow,.notice-body,.output-box .out-text,.rub-table td:first-child,.step-content .step-body,.topic-sub{font-size:16px!important}\n.card p,.cs-def,.cs-row,.glance-val,.page-header .subtitle,.prompt .p-text,.rub-req,.rub-table,.step-content .step-title,.term-word,.topic-text,.wk-deck,h2.section-title + .section-sub,pre code{font-size:17px!important}\n.card-header-text .title,.card-title,.check-list li::before,.check-title,.concept p,.nav-title,.ok p,.term-def,.warn p,h3{font-size:18px!important}\n.wk-deck,li,p{font-size:20px!important}\n.assignment .d-icon,.assignment h3,.checklist li::before,html{font-size:21px!important}\n.rub-title{font-size:22px!important}\n.callout-icon,.notice-icon,h2,h2.section-title{font-size:23px!important}\n.page-header h1,.wk-title,h1{font-size:36px!important}'
  ];

  function applyFont(idx) {
    fontIdx = Math.max(0, Math.min(FONT_CSS.length - 1, idx));
    localStorage.setItem(FONT_KEY, String(fontIdx));
    if (!fontEl) {
      fontEl    = document.createElement('style');
      fontEl.id = 'ism-font-scale';
      document.head.appendChild(fontEl);
    }
    fontEl.textContent = FONT_CSS[fontIdx];
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
