import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAnswer, gradeQuiz } from './lab-widgets.mjs';

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
