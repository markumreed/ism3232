/* Draw overlay v3 */
/*
 * Lab Drawing Overlay
 *
 * Ported from ism3232/docs/week02_slides.html ("Draw overlay v3" IIFE)
 * into a reusable ES module. Call initDraw() once, after window.Reveal
 * has been initialized by the page.
 *
 * Uses BroadcastChannel to sync strokes between ALL same-origin windows
 * (presentation window + notes popup). No window references needed.
 *
 * Also handles the Reveal.js notes plugin iframe pattern:
 * the notes plugin opens /?controls=... as a popup containing an iframe
 * of the presentation. BroadcastChannel crosses that boundary automatically.
 */
export function initDraw(opts = {}) {
  /* ── Idempotency guard ── */
  if (window.__labDrawInit) return;
  window.__labDrawInit = true;

  /* ── No-op on reveal PDF export ── */
  if (window.matchMedia && window.matchMedia('print').matches) return;
  if (location.search.indexOf('print-pdf') !== -1) return;

  /* ── Requires a Reveal global (already initialized by the caller) ── */
  if (!window.Reveal) return;

  var accent   = opts.accent || '#2dd4bf';
  var CHANNEL  = 'ismlab_draw';
  var bc       = null;

  /* BroadcastChannel — supported in all modern browsers */
  try { bc = new BroadcastChannel(CHANNEL); } catch (e) { bc = null; }

  /* ── State ── */
  var drawMode = false;
  var erasing  = false;
  var col      = accent;
  var sz       = 5;
  var active   = false;   /* pointer currently down */
  var lx = 0, ly = 0;
  var strokes  = {};      /* slideKey → array of stroke segments */

  /* ── Canvas — full-viewport fixed overlay ── */
  var canvas      = document.createElement('canvas');
  canvas.id       = 'labdraw-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
                          'pointer-events:none;z-index:799;';
  document.body.appendChild(canvas);

  function fit() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw(key());
  }
  window.addEventListener('resize', fit);

  /* ── Slide key ── */
  function key() {
    try {
      var s = Reveal.getState();
      return s.indexh + ',' + s.indexv;
    } catch (e) { return '0,0'; }
  }

  /* ── Normalised coords (survive resize & window-size differences) ── */
  function toNorm(x, y) {
    return [x / window.innerWidth, y / window.innerHeight];
  }
  function fromNorm(nx, ny) {
    return [nx * window.innerWidth, ny * window.innerHeight];
  }

  /* ── Rendering ── */
  function renderSeg(seg) {
    var ctx = canvas.getContext('2d');
    var p0 = fromNorm(seg[0], seg[1]);
    var p1 = fromNorm(seg[2], seg[3]);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p1[0], p1[1]);
    if (seg[6]) {                         /* erasing */
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth   = seg[5] * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = seg[4];           /* colour */
      ctx.lineWidth   = seg[5];           /* size */
    }
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  }

  function redraw(k) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var segs = strokes[k];
    if (segs) segs.forEach(renderSeg);
  }

  /* ── Add + broadcast a segment ── */
  function addSeg(k, seg) {
    if (!strokes[k]) strokes[k] = [];
    strokes[k].push(seg);
  }

  function broadcastSeg(k, seg) {
    if (!bc) return;
    try { bc.postMessage({ t: 'seg', k: k, seg: seg }); } catch (e) {}
  }

  function broadcastClear(k) {
    if (!bc) return;
    try { bc.postMessage({ t: 'clear', k: k }); } catch (e) {}
  }

  function broadcastClearAll() {
    if (!bc) return;
    try { bc.postMessage({ t: 'clearAll' }); } catch (e) {}
  }

  /* ── Receive from other windows ── */
  if (bc) {
    bc.onmessage = function (ev) {
      var d = ev.data;
      if (!d) return;
      if (d.t === 'seg') {
        addSeg(d.k, d.seg);
        if (d.k === key()) renderSeg(d.seg);
      } else if (d.t === 'clear') {
        strokes[d.k] = [];
        if (d.k === key()) redraw(d.k);
      } else if (d.t === 'clearAll') {
        strokes = {};
        redraw(key());
      }
    };
  }

  /* ── Pointer events ── */
  function getXY(e) {
    if (e.touches && e.touches.length) {
      return [e.touches[0].clientX, e.touches[0].clientY];
    }
    return [e.clientX, e.clientY];
  }

  function down(e) {
    if (!drawMode) return;
    e.preventDefault();
    active = true;
    var xy = getXY(e);
    var n  = toNorm(xy[0], xy[1]);
    lx = n[0]; ly = n[1];
  }

  function move(e) {
    if (!active || !drawMode) return;
    e.preventDefault();
    var xy = getXY(e);
    var n  = toNorm(xy[0], xy[1]);
    var seg = [lx, ly, n[0], n[1], col, sz, erasing];
    lx = n[0]; ly = n[1];
    var k = key();
    addSeg(k, seg);
    renderSeg(seg);
    broadcastSeg(k, seg);
  }

  function up() { active = false; }

  canvas.addEventListener('mousedown',  down);
  canvas.addEventListener('mousemove',  move);
  canvas.addEventListener('mouseup',    up);
  canvas.addEventListener('mouseleave', up);
  canvas.addEventListener('touchstart', down, { passive: false });
  canvas.addEventListener('touchmove',  move, { passive: false });
  canvas.addEventListener('touchend',   up);

  /* ── Toggle draw mode ── */
  function setMode(on) {
    drawMode = on;
    canvas.style.pointerEvents = on ? 'all' : 'none';
    canvas.style.cursor        = on ? 'crosshair' : 'default';
    var tb = document.getElementById('labdraw-toolbar');
    if (tb) tb.style.outline = on ? '2px solid rgba(45,212,191,.5)' : 'none';
    var tog = document.getElementById('dtog');
    if (tog) {
      tog.style.background  = on ? 'rgba(45,212,191,.35)' : 'rgba(255,255,255,.08)';
      tog.style.color       = on ? '#2dd4bf' : '#ccc';
    }
    /* Hide reveal controls while drawing so clicks don't navigate */
    var ctrl = document.querySelector('.reveal > .controls');
    if (ctrl) ctrl.style.display = on ? 'none' : '';
  }

  /* ── Keyboard: D ── */
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'd' || e.key === 'D') setMode(!drawMode);
  });

  /* ── Slide change ── */
  Reveal.on('slidechanged', function () {
    active = false;
    redraw(key());
  });

  /* ── Toolbar ── */
  var tb = document.createElement('div');
  tb.id  = 'labdraw-toolbar';
  tb.style.cssText = [
    'position:fixed', 'bottom:10px', 'right:10px', 'z-index:900',
    'display:flex', 'align-items:center', 'gap:5px', 'flex-wrap:wrap',
    'background:rgba(8,10,20,.92)', 'border:1px solid rgba(255,255,255,.13)',
    'border-radius:10px', 'padding:6px 9px',
    'backdrop-filter:blur(14px)', '-webkit-backdrop-filter:blur(14px)',
    'box-shadow:0 4px 24px rgba(0,0,0,.55)',
    'font-family:monospace', 'font-size:11px',
    'opacity:.5', 'transition:opacity .2s',
    'user-select:none', '-webkit-user-select:none',
  ].join(';');
  tb.onmouseenter = function () { this.style.opacity = '1'; };
  tb.onmouseleave = function () { this.style.opacity = drawMode ? '1' : '.5'; };
  document.body.appendChild(tb);

  /* ── Toolbar helpers ── */
  function btn(txt, cb, title, id) {
    var b = document.createElement('button');
    b.textContent = txt;
    if (title) b.title = title;
    if (id)    b.id    = id;
    b.style.cssText = [
      'font-family:monospace', 'font-size:11px', 'cursor:pointer',
      'padding:4px 9px', 'border-radius:5px',
      'border:1px solid rgba(255,255,255,.14)',
      'background:rgba(255,255,255,.08)', 'color:#ccc',
      'transition:.15s', 'white-space:nowrap',
    ].join(';');
    b.onmouseover = function () { b.style.background='rgba(255,255,255,.22)'; b.style.color='#fff'; };
    b.onmouseout  = function () {
      b.style.background = b._on ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.08)';
      b.style.color      = b._on ? '#fff' : '#ccc';
    };
    b.onclick = cb;
    return b;
  }

  function dot(c, lbl, first) {
    var d = document.createElement('span');
    d.className = 'dcdot';
    d.title     = lbl;
    d.style.cssText = 'width:15px;height:15px;border-radius:50%;' +
      'background:' + c + ';cursor:pointer;display:inline-block;' +
      'border:2px solid ' + (first ? '#fff' : 'transparent') + ';' +
      'flex-shrink:0;transition:border-color .15s;';
    d.onclick = function () {
      col = c; erasing = false;
      document.querySelectorAll('.dcdot').forEach(function (x) { x.style.borderColor = 'transparent'; });
      d.style.borderColor = '#fff';
      if (eraserB) { eraserB._on = false; eraserB.style.background='rgba(255,255,255,.08)'; eraserB.style.color='#ccc'; }
    };
    return d;
  }

  function sep() {
    var s = document.createElement('span');
    s.style.cssText = 'width:1px;height:18px;background:rgba(255,255,255,.15);flex-shrink:0;';
    return s;
  }

  /* Toggle */
  var togB = btn('✏ Draw', function () { setMode(!drawMode); }, 'Toggle drawing  [D]', 'dtog');

  /* Colours */
  var palette = [
    [accent,   'Accent', true],
    ['#ffffff','White',  false],
    ['#ff6b6b','Red',    false],
    ['#4ade80','Green',  false],
    ['#38bdf8','Blue',   false],
    ['#f97316','Orange', false],
    ['#c084fc','Purple', false],
  ];
  var colDots = palette.map(function (p) { return dot(p[0], p[1], p[2]); });

  /* Sizes */
  var sizes = [[3,'S'],[5,'M'],[10,'L'],[18,'XL']];
  var szBtns = sizes.map(function (p) {
    var b = btn(p[1], null, 'Brush ' + p[1]);
    b.onclick = function () {
      sz = p[0]; erasing = false;
      szBtns.forEach(function (x) { x._on=false; x.style.background='rgba(255,255,255,.08)'; x.style.color='#ccc'; });
      if (eraserB) { eraserB._on=false; eraserB.style.background='rgba(255,255,255,.08)'; eraserB.style.color='#ccc'; }
      b._on=true; b.style.background='rgba(255,255,255,.25)'; b.style.color='#fff';
    };
    if (p[0]===5) { b._on=true; b.style.background='rgba(255,255,255,.25)'; b.style.color='#fff'; }
    return b;
  });

  /* Eraser */
  var eraserB = btn('⌫', null, 'Eraser');
  eraserB.onclick = function () {
    erasing = !erasing;
    eraserB._on = erasing;
    eraserB.style.background = erasing ? 'rgba(251,191,36,.4)' : 'rgba(255,255,255,.08)';
    eraserB.style.color      = erasing ? '#fbbf24' : '#ccc';
    if (erasing) { colDots.forEach(function(d){d.style.borderColor='transparent';}); }
  };

  /* Clear */
  var clearB = btn('🗑', function () {
    var k = key();
    strokes[k] = [];
    redraw(k);
    broadcastClear(k);
  }, 'Clear this slide');

  var clearAllB = btn('🗑 All', function () {
    strokes = {};
    redraw(key());
    broadcastClearAll();
  }, 'Clear all');

  /* Assemble */
  [togB, sep()]
    .concat(colDots)
    .concat([sep()])
    .concat(szBtns)
    .concat([sep(), eraserB, sep(), clearB, clearAllB])
    .forEach(function (el) { tb.appendChild(el); });

  /* ── Init ── */
  fit();

}
