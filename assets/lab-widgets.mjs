// lab-widgets.mjs — quiz + predict grading for interactive lab decks.
//
// Two layers:
//   1. Pure grading helpers (parseAnswer, gradeQuiz) — no DOM, no deps,
//      unit-tested directly with `node --test`.
//   2. DOM upgraders (upgradeQuiz, upgradePredict, upgradeAll) that turn
//      plain deck markup into interactive widgets. These touch
//      document/window only when invoked (no top-level DOM access), so the
//      module imports cleanly under Node. They are exercised in a browser
//      at Task 6, not by node --test.
//
// Exports: parseAnswer, gradeQuiz, upgradeQuiz, upgradePredict, upgradeAll

// ---------------------------------------------------------------------------
// Pure grading helpers
// ---------------------------------------------------------------------------

// "B" -> {"B"};  "A,C" / "A, c" -> {"A","C"}  (upper-cased, trimmed, no blanks)
export function parseAnswer(spec) {
  return new Set(
    String(spec == null ? '' : spec)
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean),
  );
}

// gradeQuiz(spec, chosen) -> { correct, expected: Set, chosen: Set }
// `chosen` may be a single string or an array of strings. `correct` is true
// iff the chosen set is exactly equal to the expected set.
export function gradeQuiz(spec, chosen) {
  const expected = parseAnswer(spec);
  const list = Array.isArray(chosen) ? chosen : [chosen];
  const chosenSet = new Set(
    list
      .map((s) => String(s == null ? '' : s).trim().toUpperCase())
      .filter(Boolean),
  );
  const correct =
    chosenSet.size === expected.size &&
    [...chosenSet].every((v) => expected.has(v));
  return { correct, expected, chosen: chosenSet };
}

// ---------------------------------------------------------------------------
// DOM upgraders (browser-only at call time)
// ---------------------------------------------------------------------------

function ownerDoc(el) {
  return (el && el.ownerDocument) || (typeof document !== 'undefined' ? document : null);
}

// Wire one <div class="quiz" data-answer="…"> :
//   - option buttons carry [data-opt="A"]
//   - an optional <p class="why"> is hidden until the question is answered
//   - single-answer  : first click grades immediately
//   - multi-answer   : data-answer contains a comma; clicks toggle .chosen and
//                      a "Check" button (created if absent) grades
// Idempotent: a second call is a no-op once el.dataset.wired is set.
export function upgradeQuiz(el) {
  if (!el || el.dataset.wired) return;
  el.dataset.wired = '1';

  const spec = el.dataset.answer || '';
  const expected = parseAnswer(spec);
  const multi = spec.includes(',');

  const opts = el.querySelectorAll ? [...el.querySelectorAll('[data-opt]')] : [];
  if (!opts.length) return;

  const why = el.querySelector ? el.querySelector('.why') : null;
  if (why) why.hidden = true;

  const grade = (values) => {
    if (el.dataset.answered) return;
    const result = gradeQuiz(spec, values);
    for (const btn of opts) {
      const val = String(btn.dataset.opt || '').trim().toUpperCase();
      if (result.chosen.has(val)) btn.classList.add('chosen');
      if (expected.has(val)) btn.classList.add('right');
      else if (result.chosen.has(val)) btn.classList.add('wrong');
      btn.disabled = true;
    }
    if (why) why.hidden = false;
    el.dataset.answered = result.correct ? 'correct' : 'incorrect';
  };

  if (multi) {
    for (const btn of opts) {
      btn.addEventListener('click', () => {
        if (el.dataset.answered) return;
        btn.classList.toggle('chosen');
      });
    }
    const doc = ownerDoc(el);
    let check = el.querySelector ? el.querySelector('[data-check]') : null;
    if (!check && doc) {
      check = doc.createElement('button');
      check.type = 'button';
      check.className = 'check';
      check.dataset.check = '1';
      check.textContent = 'Check';
      el.appendChild(check);
    }
    if (check) {
      check.addEventListener('click', () => {
        const picked = opts
          .filter((b) => b.classList.contains('chosen'))
          .map((b) => b.dataset.opt);
        grade(picked);
      });
    }
  } else {
    for (const btn of opts) {
      btn.addEventListener('click', () => grade([btn.dataset.opt]));
    }
  }
}

// Wire one <div class="predict"> holding prompt markup and a
// <pre class="answer" hidden>. Injects a "Reveal answer ▾" button that
// unhides the <pre> and runs window.hljs over it when available.
// Idempotent via el.dataset.wired.
export function upgradePredict(el) {
  if (!el || el.dataset.wired) return;
  el.dataset.wired = '1';

  const pre = el.querySelector ? el.querySelector('pre.answer') : null;
  if (!pre) return;
  pre.hidden = true;

  const doc = ownerDoc(el);
  if (!doc) return;

  const btn = doc.createElement('button');
  btn.type = 'button';
  btn.className = 'reveal';
  btn.textContent = 'Reveal answer ▾';
  btn.addEventListener('click', () => {
    pre.hidden = false;
    btn.hidden = true;
    const hljs = typeof window !== 'undefined' ? window.hljs : null;
    if (!hljs || typeof hljs.highlightElement !== 'function') return;
    const target = pre.querySelector('code') || pre;
    // Skip if we — or reveal.js' RevealHighlight, which stamps
    // data-highlighted="yes" per highlight.js — already highlighted it.
    // Avoids highlight.js' "Element previously highlighted" console.warn.
    if (pre.dataset.highlighted || target.dataset.highlighted) return;
    pre.dataset.highlighted = '1';
    target.dataset.highlighted = '1';
    hljs.highlightElement(target);
  });
  el.insertBefore(btn, pre);
}

// Upgrade every .quiz / .predict under `root` (defaults to document).
export function upgradeAll(root = document) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll('.quiz').forEach((el) => upgradeQuiz(el));
  root.querySelectorAll('.predict').forEach((el) => upgradePredict(el));
}
