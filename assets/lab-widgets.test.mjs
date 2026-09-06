import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAnswer, gradeQuiz, upgradePredict } from './lab-widgets.mjs';

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
  const el = {
    tagName: String(tag).toUpperCase(),
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
