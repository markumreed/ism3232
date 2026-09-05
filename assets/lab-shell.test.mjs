import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createShell, run, prompt } from './lab-shell.mjs';

const seed = () => ({
  '~/ism3232': {
    module01_setup: { 'hello_ism3232.py': "print('hi')\n", 'README.md': '# m1\n' },
    module02_zsh: { week2_lab: {} },
    data: {}, screenshots: {},
  },
});

test('pwd starts at home and cd ~ returns there', () => {
  const sh = createShell(seed());
  assert.equal(run(sh, 'pwd').out.trim(), '/Users/student');
  run(sh, 'cd ~/ism3232/module02_zsh/week2_lab');
  assert.equal(run(sh, 'pwd').out.trim(), '/Users/student/ism3232/module02_zsh/week2_lab');
  run(sh, 'cd ~');
  assert.equal(run(sh, 'pwd').out.trim(), '/Users/student');
});

test('mkdir + cd .. + relative multi-segment cd', () => {
  const sh = createShell(seed());
  run(sh, 'cd ~/ism3232/module02_zsh');
  run(sh, 'mkdir week2_lab/practice');            // week2_lab exists
  run(sh, 'cd week2_lab/practice');
  assert.equal(run(sh, 'pwd').out.trim(), '/Users/student/ism3232/module02_zsh/week2_lab/practice');
  run(sh, 'cd ../..');
  assert.equal(run(sh, 'pwd').out.trim(), '/Users/student/ism3232/module02_zsh');
});

test('touch multi-arg then ls and ls -la ordering', () => {
  const sh = createShell(seed());
  run(sh, 'cd ~/ism3232/module02_zsh/week2_lab');
  run(sh, 'touch notes.txt commands.txt hello_week2.py');
  assert.equal(run(sh, 'ls').out.trim(), 'commands.txt  hello_week2.py  notes.txt');
  const la = run(sh, 'ls -la').out;
  assert.match(la, /^total /m);
  assert.match(la, /\.\n/);        // "." entry present
  assert.match(la, /\.\.\n/);      // ".." entry present
});

test('echo > overwrites, echo >> appends, cat concatenates', () => {
  const sh = createShell(seed());
  run(sh, 'cd ~/ism3232/module02_zsh/week2_lab');
  run(sh, "echo 'Week 2 navigation practice' > notes.txt");
  assert.equal(run(sh, 'cat notes.txt').out, 'Week 2 navigation practice\n');
  run(sh, "echo 'extra line' >> notes.txt");
  assert.equal(run(sh, 'cat notes.txt').out, 'Week 2 navigation practice\nextra line\n');
  assert.equal(run(sh, 'wc -l notes.txt').out.trim(), '2 notes.txt');
  assert.equal(run(sh, 'head -1 notes.txt').out, 'Week 2 navigation practice\n');
});

test('cp keeps original, mv does not', () => {
  const sh = createShell(seed());
  run(sh, 'cd ~/ism3232/module02_zsh/week2_lab');
  run(sh, "echo 'x' > notes.txt");
  run(sh, 'cp notes.txt notes_backup.txt');
  assert.match(run(sh, 'ls').out, /notes.txt/);
  assert.match(run(sh, 'ls').out, /notes_backup.txt/);
  run(sh, 'touch hello_week2.py');
  run(sh, 'mv hello_week2.py week2_script.py');
  const ls = run(sh, 'ls').out;
  assert.doesNotMatch(ls, /hello_week2\.py/);
  assert.match(ls, /week2_script\.py/);
});

test('rm is permanent; ls reflects removal', () => {
  const sh = createShell(seed());
  run(sh, 'cd ~/ism3232/module02_zsh/week2_lab');
  run(sh, 'touch a.txt b.txt');
  run(sh, 'rm a.txt');
  assert.equal(run(sh, 'ls').out.trim(), 'b.txt');
  assert.match(run(sh, 'rm missing.txt').err, /no such file or directory/i);
});

test('tree -L limits depth', () => {
  const sh = createShell(seed());
  run(sh, 'cd ~/ism3232');
  const t1 = run(sh, 'tree -L 1').out;
  assert.match(t1, /module01_setup/);
  assert.doesNotMatch(t1, /hello_ism3232\.py/);   // depth 1 hides file inside module01_setup
  const t2 = run(sh, 'tree -L 2').out;
  assert.match(t2, /hello_ism3232\.py/);
});

test('single pipe: ls -la | head -5', () => {
  const sh = createShell(seed());
  run(sh, 'cd ~/ism3232/module02_zsh/week2_lab');
  run(sh, 'touch f1 f2 f3 f4 f5 f6');
  const out = run(sh, 'ls -la | head -5').out;
  assert.equal(out.split('\n').filter(Boolean).length, 5);
});

test('unknown command uses zsh phrasing', () => {
  const sh = createShell(seed());
  assert.equal(run(sh, 'frobnicate x').err.trim(), 'zsh: command not found: frobnicate');
});

test('prompt shows basename or ~', () => {
  const sh = createShell(seed());
  assert.equal(prompt(sh), 'student@MacBook-Pro ~ %');
  run(sh, 'cd ~/ism3232/module02_zsh/week2_lab');
  assert.equal(prompt(sh), 'student@MacBook-Pro week2_lab %');
});
