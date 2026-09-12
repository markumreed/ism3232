// lab-pyodide.mjs — lazy Pyodide loader + a Python run harness.
//
// Browser-only (Pyodide is WebAssembly). NOT unit-tested under Node — only
// syntax-checked with `node --check`; the real behaviour is verified in the
// reveal.js browser harness (Task 6). The contract below is frozen so the
// interactive Python widgets (Tasks 5, 6, 8) can rely on it.
//
// Exports:
//   pyReady()                              -> Promise<Pyodide>
//   runPython(code, { stdin, onStatus })   -> Promise<{ stdout, stderr, ok }>
//   loadPackages(names)                    -> Promise<void>
//
// Pinned exactly to Pyodide 0.26.4 (script + indexURL on cdn.jsdelivr.net).

const PYODIDE_VERSION = '0.26.4';
const PYODIDE_JS_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// ---------------------------------------------------------------------------
// Singleton loader
// ---------------------------------------------------------------------------

let pyodidePromise = null; // cached Promise<Pyodide>; shared by concurrent callers
let booted = false; // flips true once a cold boot has completed

// Inject the CDN <script> exactly once. Guarded on window.loadPyodide so a
// page that already pulled pyodide.js in some other way is reused as-is.
function injectPyodideScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.loadPyodide) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[data-lab-pyodide]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load pyodide.js')),
      );
      return;
    }
    const s = document.createElement('script');
    s.src = PYODIDE_JS_URL;
    s.async = true;
    s.dataset.labPyodide = '1';
    s.addEventListener('load', () => resolve());
    s.addEventListener('error', () =>
      reject(new Error('Failed to load pyodide.js from ' + PYODIDE_JS_URL)),
    );
    document.head.appendChild(s);
  });
}

// Idempotent singleton. First call injects the script, calls loadPyodide once,
// and caches the promise. Concurrent callers get the same promise. A failed
// boot clears the cache so a later call can retry.
export function pyReady() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await injectPyodideScript();
      const pyodide = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
      booted = true;
      return pyodide;
    })();
    pyodidePromise.catch(() => {
      pyodidePromise = null;
    });
  }
  return pyodidePromise;
}

// await pyReady() then load one or more packages (pandas, matplotlib, ...).
export async function loadPackages(names) {
  const pyodide = await pyReady();
  await pyodide.loadPackage(names);
}

// ---------------------------------------------------------------------------
// runPython
// ---------------------------------------------------------------------------

const RESTORE_INPUT_PY = `
import builtins as __b
if hasattr(__b, "__lab_saved_input__"):
    __b.input = __b.__lab_saved_input__
`;

const INSTALL_INPUT_PY = `
import builtins as __b
if not hasattr(__b, "__lab_saved_input__"):
    __b.__lab_saved_input__ = __b.input
def __lab_input(prompt=""):
    __line = __lab_next_line(str(prompt))
    if __line is None:
        raise EOFError("EOF when reading a line")
    return __line
__b.input = __lab_input
`;

const INSTALL_STREAMS_PY = `
import sys as __sys
class __LabStream:
    def __init__(self, __w):
        self.__w = __w
    def write(self, __s):
        self.__w(__s)
        return len(__s)
    def flush(self):
        pass
    def isatty(self):
        return False
__sys.__lab_saved_stdout = __sys.stdout
__sys.__lab_saved_stderr = __sys.stderr
__sys.stdout = __LabStream(__lab_write_out)
__sys.stderr = __LabStream(__lab_write_err)
`;

const RESTORE_STREAMS_PY = `
import sys as __sys
if hasattr(__sys, "__lab_saved_stdout"):
    __sys.stdout = __sys.__lab_saved_stdout
    __sys.stderr = __sys.__lab_saved_stderr
    del __sys.__lab_saved_stdout
    del __sys.__lab_saved_stderr
`;

// Run a snippet of user Python. Captures stdout/stderr into strings and feeds
// input() from `stdin` (a queue of lines). Never throws for a *Python* error —
// that comes back as { ok: false, stderr: <traceback> }. Only rejects if the
// harness itself (loader, network) fails.
export async function runPython(code, { stdin = [], onStatus } = {}) {
  const cold = !booted;
  if (cold) {
    try {
      onStatus && onStatus('loading');
    } catch (_) {
      /* onStatus must never break a run */
    }
  }
  const pyodide = await pyReady();
  if (cold) {
    try {
      onStatus && onStatus('ready');
    } catch (_) {
      /* ignore */
    }
  }

  let stdoutBuf = '';
  let stderrBuf = '';
  const queue = [...stdin]; // shift off a COPY; caller's array is untouched

  // `hasSetStreams` and `ns` are read by the `finally` below, so they live in
  // the function scope. Everything that mutates the shared Pyodide singleton
  // (stream redirection + the `input` override) happens INSIDE the `try`, so
  // the `finally` restore path runs even if a setup step throws or rejects.
  let hasSetStreams = false;
  let ns = null; // fresh per-run globals dict (PyProxy) — destroyed in finally
  let ok = true;
  try {
    // --- redirect stdout/stderr to the buffers ---------------------------
    hasSetStreams =
      typeof pyodide.setStdout === 'function' &&
      typeof pyodide.setStderr === 'function';
    if (hasSetStreams) {
      // Pyodide 0.26 native API (verified against the streams docs).
      pyodide.setStdout({
        batched: (s) => {
          stdoutBuf += s;
        },
      });
      pyodide.setStderr({
        batched: (s) => {
          stderrBuf += s;
        },
      });
    } else {
      // Fallback for a build without setStdout/setStderr: swap sys.stdout /
      // sys.stderr for a tiny Python shim that calls back into JS.
      pyodide.globals.set('__lab_write_out', (s) => {
        stdoutBuf += s;
      });
      pyodide.globals.set('__lab_write_err', (s) => {
        stderrBuf += s;
      });
      await pyodide.runPythonAsync(INSTALL_STREAMS_PY);
    }

    // --- override builtins.input to drain the queue ---------------------
    // Returns undefined (-> Python None) when the queue is empty; the Python
    // shim turns that into a real EOFError so a missing input line surfaces
    // as an ordinary Python traceback (the guide teaches it as a real error).
    pyodide.globals.set('__lab_next_line', (promptStr) => {
      if (!queue.length) return undefined;
      const v = queue.shift();
      stdoutBuf += (promptStr == null ? '' : promptStr) + v + '\n';
      return v;
    });
    await pyodide.runPythonAsync(INSTALL_INPUT_PY);

    // --- run the user code in a FRESH namespace ---------------------------
    // Every .run block on a page shares this one interpreter, so running user
    // code in pyodide.globals would let slide 4's variables leak into slide 9
    // (breaking a deliberate NameError demo) and would expose our __lab_*
    // helpers to a dir()/globals() demo. Each call therefore gets its own
    // globals dict; `globals` is a documented runPythonAsync option (Pyodide
    // FAQ, "How can I execute code in a custom namespace?" — named-only since
    // 0.21). The builtins.input override and the sys.stdout/sys.stderr
    // redirection are interpreter-global, not namespace-scoped, so they still
    // apply to code running here.
    const dictCls = pyodide.globals.get('dict');
    ns = dictCls();
    try { dictCls.destroy(); } catch (_) { /* best effort */ }
    ns.set('__name__', '__main__');
    await pyodide.runPythonAsync(code, { globals: ns });
  } catch (err) {
    ok = false;
    // PythonError.message is Pyodide's formatted Python traceback with no JS
    // frames (JS frames live on err.stack). Verified against the
    // type-conversions docs.
    const traceback =
      err && typeof err.message === 'string' ? err.message : String(err);
    if (stderrBuf && !stderrBuf.endsWith('\n')) stderrBuf += '\n';
    stderrBuf += traceback;
  } finally {
    // --- flush BEFORE unhooking the streams -------------------------------
    // Pyodide's stdout is line-buffered, so a trailing print("x", end="") is
    // still sitting in the buffer here; flushing after setStdout() reset would
    // send it to the console instead of our buffer, silently dropping it.
    try {
      pyodide.runPython('import sys; sys.stdout.flush(); sys.stderr.flush()');
    } catch (_) {
      /* best effort */
    }
    // --- ALWAYS restore default streams + builtins.input ------------------
    try {
      if (hasSetStreams) {
        pyodide.setStdout(); // no args -> restore default handler
        pyodide.setStderr();
      } else {
        await pyodide.runPythonAsync(RESTORE_STREAMS_PY);
      }
    } catch (_) {
      /* best effort */
    }
    try {
      await pyodide.runPythonAsync(RESTORE_INPUT_PY);
    } catch (_) {
      /* best effort */
    }
    for (const name of [
      '__lab_next_line',
      '__lab_write_out',
      '__lab_write_err',
      '__lab_input',
    ]) {
      try {
        pyodide.globals.delete(name);
      } catch (_) {
        /* not set — fine */
      }
    }
    if (ns) {
      try {
        ns.destroy();
      } catch (_) {
        /* best effort */
      }
      ns = null;
    }
  }

  return { stdout: stdoutBuf, stderr: stderrBuf, ok };
}
