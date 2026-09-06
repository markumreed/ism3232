import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAnswer, gradeQuiz, upgradePredict, upgradeQuiz } from './lab-widgets.mjs';

test('parseAnswer single and multi, case/space insensitive', () => {
  assert.deepEqual([...parseAnswer('B')], ['B']);
  assert.deepEqual([...parseAnswer('A, c')].sort(), ['A', 'C']);
});

test('gradeQuiz single answer', () => {
  assert.equal(gradeQuiz('B', 'B').correct, true);
  assert.equal(gradeQuiz('B', 'A').correct, false);
});

test('gradeQuiz multi answer needs exact set', () => {
  assert.equal(gradeQuiz('A,C', ['A', 'C']).correct, true);
  assert.equal(gradeQuiz('A,C', ['C', 'A']).correct, true);
  assert.equal(gradeQuiz('A,C', ['A']).correct, false);
  assert.equal(gradeQuiz('A,C', ['A', 'B', 'C']).correct, false);
});

// ---------------------------------------------------------------------------
// Minimal hand-rolled DOM stub for the DOM upgraders (no jsdom dependency).
// Supports the handful of selectors the upgraders use: `tag`, `.class`,
// `tag.class`, `[data-attr]`.
// ---------------------------------------------------------------------------
function selMatch(node, sel) {
  if (!node || !node.tagName) return false;
  let m;
  if ((m = sel.match(/^([a-z]+)?\.([\w-]+)$/i))) {
    const classes = String(node.className || '').split(/\s+/).filter(Boolean);
    return (!m[1] || node.tagName === m[1].toUpperCase()) && classes.includes(m[2]);
  }
  if ((m = sel.match(/^\[data-([\w-]+)\]$/))) {
    const key = m[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return node.dataset && node.dataset[key] != null;
  }
  return node.tagName === sel.toUpperCase();
}

function descendants(node, out) {
  for (const c of node.children || []) { out.push(c); descendants(c, out); }
  return out;
}

const doc = { createElement: (tag) => mkEl(tag) };

function mkEl(tag, attrs = {}) {
  const children = [];
  const listeners = {};
  const classList = {
    contains(c) { return String(el.className || '').split(/\s+/).includes(c); },
    add(c) { if (!this.contains(c)) el.className = (el.className ? el.className + ' ' : '') + c; },
    remove(c) {
      el.className = String(el.className || '').split(/\s+/).filter((x) => x && x !== c).join(' ');
    },
    toggle(c) { this.contains(c) ? this.remove(c) : this.add(c); },
  };
  const el = {
    tagName: String(tag).toUpperCase(),
    classList,
    dataset: {},
    style: {},
    hidden: false,
    disabled: false,
    textContent: '',
    className: attrs.class || '',
    attributes: { ...attrs },
    children,
    parentNode: null,
    ownerDocument: doc,
    setAttribute(k, v) { this.attributes[k] = v; if (k === 'class') this.className = v; },
    getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; },
    hasAttribute(k) { return k in this.attributes; },
    append(...kids) { for (const k of kids) { k.parentNode = el; children.push(k); } },
    appendChild(k) { k.parentNode = el; children.push(k); return k; },
    insertBefore(k, ref) {
      k.parentNode = el;
      const i = children.indexOf(ref);
      if (i < 0) children.push(k); else children.splice(i, 0, k);
      return k;
    },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    dispatchEvent(type) { (listeners[type] || []).forEach((fn) => fn({ type, target: el })); },
    click() { this.dispatchEvent('click'); },
    querySelector(sel) { return descendants(el, []).find((n) => selMatch(n, sel)) || null; },
    querySelectorAll(sel) { return descendants(el, []).filter((n) => selMatch(n, sel)); },
  };
  return el;
}

test('upgradePredict does not re-highlight an already-highlighted answer', () => {
  let calls = 0;
  global.window = { hljs: { highlightElement() { calls++; } } };
  const pre = mkEl('pre', { class: 'answer' }); pre.hidden = true; pre.dataset.highlighted = '1';
  const el = mkEl('div', { class: 'predict' }); el.append(pre);
  upgradePredict(el);
  // simulate the reveal button click the upgrader wires:
  el.querySelector('button')?.click?.();
  assert.equal(calls, 0);
  delete global.window;
});

test('upgradePredict names its button reveal-btn, not reveal', () => {
  const pre = mkEl('pre', { class: 'answer' });
  const el = mkEl('div', { class: 'predict' }); el.append(pre);
  upgradePredict(el);
  assert.equal(el.querySelector('button').className, 'reveal-btn');
});

// --- multi-answer quiz ------------------------------------------------------
function mkQuiz(answer, optLetters) {
  const el = mkEl('div', { class: 'quiz' });
  el.dataset.answer = answer;
  const why = mkEl('p', { class: 'why' });
  const opts = optLetters.map((L) => {
    const b = mkEl('button');
    b.dataset.opt = L;
    el.appendChild(b);
    return b;
  });
  el.appendChild(why);
  return { el, opts, why };
}

test('multi-answer Check with nothing selected is a no-op, not a lock', () => {
  const { el, opts, why } = mkQuiz('A,C', ['A', 'B', 'C']);
  upgradeQuiz(el);
  const check = el.querySelector('[data-check]');
  check.click();                       // Check pressed with no selection
  assert.equal(el.dataset.answered, undefined);
  assert.equal(why.hidden, true);
  assert.ok(opts.every((b) => b.disabled === false));
  // …and the question still grades normally afterwards
  opts[0].click(); opts[2].click();
  check.click();
  assert.equal(el.dataset.answered, 'correct');
  assert.equal(why.hidden, false);
  assert.ok(el.classList.contains('answered'));
});
