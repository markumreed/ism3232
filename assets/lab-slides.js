// lab-slides.js — framework entry for interactive lab decks.
//
// A deck loads this last, as <script type="module">, AFTER the classic
// reveal.js CDN scripts (which set window.Reveal / RevealHighlight /
// RevealNotes). On import it initializes reveal.js; on the 'ready' event it
// upgrades every interactive component (.quiz, .predict, .run) and starts the
// drawing overlay.
//
// Byte-identical between the ISM3232 and ISM2411 submodules — no
// course-specific strings live here; the accent is read from the --accent CSS
// custom property that lab-slides.css defines per course.

import { createShell, run, prompt } from './lab-shell.mjs';
import { runPython, loadPackages } from './lab-pyodide.mjs';
import { upgradeAll } from './lab-widgets.mjs';
import { initDraw } from './lab-draw.mjs';

const Reveal = window.Reveal;

// --- reveal.js init (auto-runs on import) ----------------------------------
Reveal.initialize({
  width: 1180,
  height: 760,
  margin: 0.06,
  hash: true,
  slideNumber: 'c/t',
  transition: 'fade',
  plugins: [window.RevealHighlight, window.RevealNotes].filter(Boolean),
});
Reveal.on('ready', bootstrap);

// element -> its run function, so 'slidechanged' can fire data-autorun widgets
const RUNNERS = new WeakMap();

function bootstrap() {
  upgradeAll(document);
  upgradeRunners(document);
  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim() || '#2dd4bf';
  initDraw({ accent });

  Reveal.on('slidechanged', (ev) => {
    const slide = ev && ev.currentSlide;
    if (!slide || !slide.querySelectorAll) return;
    slide.querySelectorAll('div.run[data-autorun]').forEach((el) => {
      const fn = RUNNERS.get(el);
      if (fn && !el.dataset.autorunDone) {
        el.dataset.autorunDone = '1';
        fn();
      }
    });
  });
}

// --- error text helper ----------------------------------------------------
function errText(e) {
  return String((e && e.message) || e);
}

// --- data-stdin parsing (carry-in 1) ------------------------------------
// Newline- or "&#10;"-separated; a trailing empty line is dropped.
function parseStdin(raw) {
  const parts = String(raw == null ? '' : raw).split(/\r?\n|&#10;/);
  if (parts.length && parts[parts.length - 1] === '') parts.pop();
  return parts;
}

// --- matplotlib → PNG (only for data-packages="…,matplotlib") -----------
// Forces the headless AGG backend, then AFTER the user code tries to grab any
// open figure and print it as a base64 PNG on a "__LABPNG__" sentinel line
// (buildPython's writeStdout turns that into an <img>). Guarded so a block that
// draws nothing stays silent and a matplotlib import error is not masked.
function wrapFigure(code) {
  return (
    'import matplotlib; matplotlib.use("AGG")\n' +
    code +
    '\ntry:\n' +
    '    import matplotlib.pyplot as _p, io as _io, base64 as _b64\n' +
    '    if _p.get_fignums():\n' +
    '        _bf = _io.BytesIO(); _p.savefig(_bf, format="png")\n' +
    '        print("__LABPNG__" + _b64.b64encode(_bf.getvalue()).decode())\n' +
    'except Exception:\n' +
    '    pass\n'
  );
}

// --- component upgrade ---------------------------------------------------
function upgradeRunners(root) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll('div.run').forEach((el) => {
    if (el.dataset.wired) return;
    el.dataset.wired = '1';
    const lang = el.dataset.lang === 'shell' ? 'shell' : 'python';
    // el.textContent is already HTML-unescaped by the browser.
    const src = (el.textContent || '').replace(/\r\n/g, '\n').trim();
    el.textContent = '';
    if (lang === 'shell') buildShell(el, src);
    else buildPython(el, src);
  });
}

// --- python widget -----------------------------------------------------
function buildPython(el, src) {
  const wantStdin = /\binput\s*\(/.test(src) || 'stdin' in el.dataset;
  let stdinBox = null;
  if (wantStdin) {
    stdinBox = document.createElement('textarea');
    stdinBox.className = 'stdin';
    stdinBox.setAttribute('aria-label', 'standard input');
    stdinBox.placeholder = 'stdin — one value per line';
    if ('stdin' in el.dataset) stdinBox.value = parseStdin(el.dataset.stdin).join('\n');
    el.appendChild(stdinBox);
  }

  let editor = null;
  if (!('readonly' in el.dataset)) {
    editor = document.createElement('textarea');
    editor.className = 'code';
    editor.spellcheck = false;
    editor.value = src;
    editor.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Tab') return;
      ev.preventDefault();
      const s = editor.selectionStart;
      const e = editor.selectionEnd;
      editor.value = editor.value.slice(0, s) + '  ' + editor.value.slice(e);
      editor.selectionStart = editor.selectionEnd = s + 2;
    });
    el.appendChild(editor);
  }

  const bar = document.createElement('div');
  bar.className = 'bar';
  const runBtn = document.createElement('button');
  runBtn.type = 'button';
  runBtn.className = 'go';
  runBtn.textContent = 'Run ▶';
  bar.appendChild(runBtn);
  if (editor) {
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset';
    resetBtn.textContent = 'reset';
    resetBtn.addEventListener('click', () => { editor.value = src; });
    bar.appendChild(resetBtn);
  }
  el.appendChild(bar);

  const status = document.createElement('div');
  status.className = 'status';
  el.appendChild(status);

  // --- data-packages preload (ISM2411 data weeks) ----------------------
  // Comma-separated Pyodide package list, e.g. "pandas" or "pandas,matplotlib".
  // The Run button's FIRST activation preloads them; later Runs skip it. A
  // block WITHOUT data-packages is completely unaffected — `pkgs` is empty and
  // every branch below is guarded on `pkgs.length`.
  const pkgs = (el.dataset.packages || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const wrapFig = pkgs.includes('matplotlib');
  let pkgsLoaded = false;
  let pkgStatus = null;
  if (pkgs.length) {
    pkgStatus = document.createElement('span');
    pkgStatus.className = 'pkg-status';
    el.appendChild(pkgStatus);
  }

  const out = document.createElement('pre');
  out.className = 'out';
  el.appendChild(out);

  const onStatus = (s) => {
    if (s === 'loading') {
      runBtn.disabled = true;
      runBtn.textContent = 'starting Python…';
      status.textContent = 'loading the Python runtime…';
    } else {
      status.textContent = '';
    }
  };

  const writeErr = (text) => {
    const span = document.createElement('span');
    span.className = 'err';
    span.textContent = text;
    out.appendChild(span);
  };

  // Only used for matplotlib blocks: split stdout on our sentinel lines and
  // render each captured figure as an <img> in place of that line.
  const FIG_RE = /^__LABPNG__([A-Za-z0-9+/=]+)$/;
  const writeStdout = (text) => {
    const buf = [];
    const flush = () => {
      if (buf.length) {
        out.appendChild(document.createTextNode(buf.join('\n')));
        buf.length = 0;
      }
    };
    for (const line of String(text).split('\n')) {
      const m = FIG_RE.exec(line);
      if (m) {
        flush();
        const img = document.createElement('img');
        img.className = 'fig';
        img.alt = 'matplotlib figure';
        img.src = 'data:image/png;base64,' + m[1];
        out.appendChild(img);
      } else {
        buf.push(line);
      }
    }
    flush();
  };

  const execute = async () => {
    const code = editor ? editor.value : src;
    const stdin = stdinBox ? parseStdin(stdinBox.value) : [];
    out.textContent = '';
    runBtn.disabled = true;
    try {
      if (pkgs.length && !pkgsLoaded) {
        if (pkgStatus) pkgStatus.textContent = 'loading packages…';
        try {
          await loadPackages(pkgs);
          pkgsLoaded = true;
        } finally {
          if (pkgStatus) pkgStatus.textContent = '';
        }
      }
      // runPython may REJECT on a Pyodide loader failure (carry-in 3), and
      // loadPackages above rejects when offline — both land in catch, no throw.
      const res = await runPython(wrapFig ? wrapFigure(code) : code, { stdin, onStatus });
      if (wrapFig) writeStdout(res.stdout || '');
      else out.textContent = res.stdout || '';
      if (res.stderr) writeErr((res.stdout ? '\n' : '') + res.stderr);
    } catch (e) {
      writeErr(errText(e));
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = 'Run ▶';
    }
  };

  runBtn.addEventListener('click', execute);
  RUNNERS.set(el, execute);

  if ('autorun' in el.dataset) {
    const slide = el.closest('section');
    if (slide && slide.classList.contains('present') && !el.dataset.autorunDone) {
      el.dataset.autorunDone = '1';
      execute();
    }
  }
}

// --- readonly static code block -----------------------------------------
// Renders `src` as a plain, syntax-highlightable <pre><code class="language-*">.
// reveal.js' RevealHighlight picks these up on 'ready'. No interactive UI.
function renderStaticCode(el, src, lang) {
  const pre = document.createElement('pre');
  pre.className = 'static';
  const code = document.createElement('code');
  code.className = 'language-' + lang;
  code.textContent = src;
  pre.appendChild(code);
  el.appendChild(pre);
}

// --- shell (zsh terminal) widget ------------------------------------------
function buildShell(el, src) {
  // data-readonly shell steps (git / venv / pip — not runnable in the
  // emulator) render as a static block: no "Run all", no prompt/input line,
  // no createShell transcript. Mirrors buildPython's readonly handling.
  if ('readonly' in el.dataset) {
    renderStaticCode(el, src, 'bash');
    return;
  }
  el.classList.add('shell');
  let seed = {};
  try { seed = el.dataset.fs ? JSON.parse(el.dataset.fs) : {}; } catch (_) { seed = {}; }
  const shell = createShell(seed);
  // python3 <file> in the emulator delegates to Pyodide (brief Step 3 hook).
  shell.pythonRunner = async (code) => {
    try { return (await runPython(code)).stdout; }
    catch (e) { return errText(e); }
  };

  const term = document.createElement('div');
  term.className = 'term';
  el.appendChild(term);

  const cli = document.createElement('div');
  cli.className = 'cli';
  const ps1 = document.createElement('span');
  ps1.className = 'ps1';
  const input = document.createElement('input');
  input.type = 'text';
  input.autocapitalize = 'off';
  input.autocomplete = 'off';
  input.spellcheck = false;
  cli.appendChild(ps1);
  cli.appendChild(input);
  el.appendChild(cli);

  const bar = document.createElement('div');
  bar.className = 'bar';
  const runAll = document.createElement('button');
  runAll.type = 'button';
  runAll.textContent = 'Run all';
  bar.appendChild(runAll);
  el.appendChild(bar);

  const syncPrompt = () => { ps1.textContent = prompt(shell) + ' '; };
  const write = (text, cls) => {
    if (text == null || text === '') return;
    const span = document.createElement('span');
    if (cls) span.className = cls;
    span.textContent = text;
    term.appendChild(span);
    term.scrollTop = term.scrollHeight;
  };

  const submit = async (line) => {
    write(prompt(shell) + ' ' + line + '\n', 'echo');
    const res = run(shell, line);
    if (res.cleared) term.textContent = '';
    write(res.out, 'out');
    write(res.err, 'err');
    if (res.async) {
      try {
        const done = await res.async;
        write(done.out, 'out');
        write(done.err, 'err');
      } catch (e) {
        write(errText(e), 'err');
      }
    }
    syncPrompt();
  };

  input.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    const line = input.value;
    input.value = '';
    if (line.trim() === '') return; // skip blank submissions (carry-in 4)
    submit(line);
  });

  runAll.addEventListener('click', async () => {
    runAll.disabled = true;
    // Strip a trailing "# comment" only when the line carries no quotes.
    const lines = src.split('\n').map((l) => (/['"]/.test(l) ? l : l.replace(/\s+#.*$/, '')).trim());
    for (const line of lines) {
      if (line === '' || line.startsWith('#')) continue;
      await submit(line);
    }
    runAll.disabled = false;
    input.focus();
  });

  syncPrompt();
}
