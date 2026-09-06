// lab-shell.mjs — pure, framework-free zsh emulator core.
//
// An in-memory filesystem (nested Maps for directories, strings for files)
// plus a small command interpreter covering exactly the commands the
// ISM3232 shell labs use. No DOM, no dependencies. Consumed by the reveal.js
// terminal widget (Task 5) and unit-tested directly with `node --test`.
//
// Exports: createShell(seed) -> shell
//          run(shell, line)  -> { out, err, cleared }
//          prompt(shell)     -> string
//          listing(shell, path?) -> string[]

const HOME = '/Users/student';
const HOSTNAME = 'MacBook-Pro';
const USER = 'student';
const STAMP = 'Sep  5 10:00';

const KNOWN_COMMANDS = new Set([
  'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'echo', 'rm', 'cp', 'mv',
  'tree', 'head', 'tail', 'wc', 'clear', 'whoami', 'which', 'history',
  'code', 'python3',
]);

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

function normalize(p) {
  const parts = p.split('/').filter((x) => x !== '' && x !== '.');
  const stack = [];
  for (const part of parts) {
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return '/' + stack.join('/');
}

function resolvePath(shell, p) {
  if (p === undefined || p === null || p === '') return shell.cwd;
  let base;
  if (p === '~') base = HOME;
  else if (p.startsWith('~/')) base = HOME + '/' + p.slice(2);
  else if (p.startsWith('/')) base = p;
  else base = shell.cwd + '/' + p;
  return normalize(base);
}

// macOS's default locale sorts filenames case-insensitively (so `ls` shows
// `hello.py` before `README.md`), unlike a raw JS codepoint `.sort()` which
// orders all capitals ahead of all lowercase. The shell labs compare the
// emulator's output to a stock macOS terminal, so fold case first. Comparison
// is still codepoint-wise on the lowercased names (NOT localeCompare, whose
// locale collation reweights punctuation and would put `notes_backup.txt`
// before `notes.txt`); original case only breaks an exact fold tie.
function sortNames(names) {
  return [...names].sort((a, b) => {
    const la = a.toLowerCase();
    const lb = b.toLowerCase();
    if (la < lb) return -1;
    if (la > lb) return 1;
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

function basename(p) {
  const parts = p.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '/';
}

function parentPath(p) {
  const parts = p.split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/');
}

// ---------------------------------------------------------------------------
// Filesystem helpers (root is a Map)
// ---------------------------------------------------------------------------

function nodeAt(root, path) {
  if (path === '/' || path === '') return root;
  const parts = path.split('/').filter(Boolean);
  let node = root;
  for (const part of parts) {
    if (!(node instanceof Map) || !node.has(part)) return null;
    node = node.get(part);
  }
  return node;
}

function mkdirp(root, path) {
  const parts = path.split('/').filter(Boolean);
  let node = root;
  for (const part of parts) {
    if (!node.has(part)) node.set(part, new Map());
    node = node.get(part);
    if (!(node instanceof Map)) return null; // collided with a file
  }
  return node;
}

function deepCopy(node) {
  if (!(node instanceof Map)) return node; // string files are immutable values
  const copy = new Map();
  for (const [k, v] of node) copy.set(k, deepCopy(v));
  return copy;
}

function buildSeed(root, obj, basePath) {
  for (const [key, val] of Object.entries(obj)) {
    let keyPath = key;
    if (keyPath.startsWith('~')) keyPath = HOME + keyPath.slice(1);
    const full = keyPath.startsWith('/') ? keyPath : basePath + '/' + keyPath;
    const norm = normalize(full);
    if (typeof val === 'string') {
      mkdirp(root, parentPath(norm));
      const parent = nodeAt(root, parentPath(norm));
      if (parent instanceof Map) parent.set(basename(norm), val);
    } else if (val && typeof val === 'object') {
      mkdirp(root, norm);
      buildSeed(root, val, norm);
    }
  }
}

// ---------------------------------------------------------------------------
// Tokenizer — honors single and double quotes; treats > >> | as operators.
// ---------------------------------------------------------------------------

function tokenize(line) {
  const tokens = [];
  let cur = '';
  let hasCur = false;
  const flush = () => {
    if (hasCur) {
      tokens.push({ type: 'word', value: cur });
      cur = '';
      hasCur = false;
    }
  };
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === ' ' || c === '\t') {
      flush();
      continue;
    }
    if (c === "'") {
      hasCur = true;
      i++;
      while (i < line.length && line[i] !== "'") cur += line[i++];
      continue;
    }
    if (c === '"') {
      hasCur = true;
      i++;
      while (i < line.length && line[i] !== '"') cur += line[i++];
      continue;
    }
    if (c === '|') {
      flush();
      tokens.push({ type: 'op', value: '|' });
      continue;
    }
    if (c === '>') {
      flush();
      if (line[i + 1] === '>') {
        tokens.push({ type: 'op', value: '>>' });
        i++;
      } else {
        tokens.push({ type: 'op', value: '>' });
      }
      continue;
    }
    cur += c;
    hasCur = true;
  }
  flush();
  return tokens;
}

// ---------------------------------------------------------------------------
// Content helpers
// ---------------------------------------------------------------------------

function splitLines(content) {
  const lines = content.split('\n');
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

function joinLines(lines) {
  return lines.length ? lines.join('\n') + '\n' : '';
}

// ---------------------------------------------------------------------------
// createShell
// ---------------------------------------------------------------------------

export function createShell(seed) {
  const root = new Map();
  mkdirp(root, HOME);
  if (seed && typeof seed === 'object') buildSeed(root, seed, HOME);
  mkdirp(root, HOME); // ensure it still exists

  return {
    cwd: HOME,
    home: HOME,
    prev: HOME,
    history: [],
    _fs: root,
  };
}

// ---------------------------------------------------------------------------
// Commands — each returns { out, err } (and optionally cleared).
// ---------------------------------------------------------------------------

function cmd_pwd(shell) {
  return { out: shell.cwd + '\n', err: '' };
}

function cmd_cd(shell, args) {
  const target = args[0];
  if (target === undefined || target === '~') {
    shell.prev = shell.cwd;
    shell.cwd = HOME;
    return { out: '', err: '' };
  }
  if (target === '-') {
    const dest = shell.prev;
    shell.prev = shell.cwd;
    shell.cwd = dest;
    return { out: shell.cwd + '\n', err: '' };
  }
  const path = resolvePath(shell, target);
  const node = nodeAt(shell._fs, path);
  if (!(node instanceof Map)) {
    return { out: '', err: `cd: no such file or directory: ${target}\n` };
  }
  shell.prev = shell.cwd;
  shell.cwd = path;
  return { out: '', err: '' };
}

function parseLsFlags(args) {
  let long = false;
  let all = false;
  const paths = [];
  for (const a of args) {
    if (a.startsWith('-') && a.length > 1) {
      for (const ch of a.slice(1)) {
        if (ch === 'l') long = true;
        else if (ch === 'a') all = true;
      }
    } else {
      paths.push(a);
    }
  }
  return { long, all, paths };
}

function lsLongBlock(map, parentMap, all) {
  const names = sortNames(
    [...map.keys()].filter((n) => all || !n.startsWith('.')),
  );
  const entries = [];
  if (all) {
    entries.push(['.', map]);
    entries.push(['..', parentMap || map]);
  }
  for (const n of names) entries.push([n, map.get(n)]);
  const lines = ['total ' + entries.length];
  for (const [n, node] of entries) {
    const isDir = node instanceof Map;
    const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
    const size = isDir ? 64 : String(node).length;
    lines.push(`${perms}  1 ${USER}  staff  ${size}  ${STAMP} ${n}`);
  }
  return lines.join('\n') + '\n';
}

function cmd_ls(shell, args) {
  const { long, all, paths } = parseLsFlags(args);
  const targetArg = paths[0];
  const path = targetArg ? resolvePath(shell, targetArg) : shell.cwd;
  const node = nodeAt(shell._fs, path);
  if (node === null) {
    return { out: '', err: `ls: ${targetArg}: No such file or directory\n` };
  }
  if (!(node instanceof Map)) {
    // a file path
    if (long) {
      return {
        out: `-rw-r--r--  1 ${USER}  staff  ${String(node).length}  ${STAMP} ${basename(path)}\n`,
        err: '',
      };
    }
    return { out: basename(path) + '\n', err: '' };
  }
  if (long) {
    const parent = nodeAt(shell._fs, parentPath(path));
    return { out: lsLongBlock(node, parent, all), err: '' };
  }
  let names = sortNames(
    [...node.keys()].filter((n) => all || !n.startsWith('.')),
  );
  if (all) names = ['.', '..', ...names];
  return { out: names.length ? names.join('  ') + '\n' : '', err: '' };
}

function cmd_mkdir(shell, args) {
  const recursive = args.includes('-p');
  const targets = args.filter((a) => a !== '-p');
  let err = '';
  for (const t of targets) {
    const path = resolvePath(shell, t);
    if (recursive) {
      if (mkdirp(shell._fs, path) === null) {
        err += `mkdir: ${t}: Not a directory\n`;
      }
      continue;
    }
    const parent = nodeAt(shell._fs, parentPath(path));
    if (!(parent instanceof Map)) {
      err += `mkdir: ${t}: No such file or directory\n`;
      continue;
    }
    if (parent.has(basename(path))) {
      err += `mkdir: ${t}: File exists\n`;
      continue;
    }
    parent.set(basename(path), new Map());
  }
  return { out: '', err };
}

function cmd_touch(shell, args) {
  let err = '';
  for (const t of args) {
    const path = resolvePath(shell, t);
    const parent = nodeAt(shell._fs, parentPath(path));
    if (!(parent instanceof Map)) {
      err += `touch: ${t}: No such file or directory\n`;
      continue;
    }
    if (!parent.has(basename(path))) parent.set(basename(path), '');
  }
  return { out: '', err };
}

function cmd_cat(shell, args, pipeInput) {
  if (args.length === 0 && pipeInput !== null) {
    return { out: pipeInput, err: '' };
  }
  let out = '';
  let err = '';
  for (const a of args) {
    const path = resolvePath(shell, a);
    const node = nodeAt(shell._fs, path);
    if (node === null) {
      err += `cat: ${a}: No such file or directory\n`;
    } else if (node instanceof Map) {
      err += `cat: ${a}: Is a directory\n`;
    } else {
      out += node;
    }
  }
  return { out, err };
}

function cmd_echo(shell, args) {
  return { out: args.join(' ') + '\n', err: '' };
}

function cmd_rm(shell, args) {
  const recursive = args.some((a) => a === '-r' || a === '-rf' || a === '-fr' || a === '-f');
  const targets = args.filter((a) => !a.startsWith('-'));
  let err = '';
  for (const t of targets) {
    const path = resolvePath(shell, t);
    const parent = nodeAt(shell._fs, parentPath(path));
    const node = parent instanceof Map ? parent.get(basename(path)) : undefined;
    if (node === undefined) {
      err += `rm: ${t}: No such file or directory\n`;
      continue;
    }
    if (node instanceof Map && !recursive) {
      err += `rm: ${t}: is a directory\n`;
      continue;
    }
    parent.delete(basename(path));
  }
  return { out: '', err };
}

function resolveDest(shell, srcPath, destArg) {
  const destPath = resolvePath(shell, destArg);
  const destNode = nodeAt(shell._fs, destPath);
  if (destNode instanceof Map) {
    return destPath + '/' + basename(srcPath);
  }
  return destPath;
}

function cmd_cp(shell, args) {
  const recursive = args.some((a) => a === '-r' || a === '-R');
  const rest = args.filter((a) => !a.startsWith('-'));
  const [srcArg, destArg] = rest;
  if (!srcArg || !destArg) return { out: '', err: 'usage: cp source target\n' };
  const srcPath = resolvePath(shell, srcArg);
  const srcNode = nodeAt(shell._fs, srcPath);
  if (srcNode === null) {
    return { out: '', err: `cp: ${srcArg}: No such file or directory\n` };
  }
  if (srcNode instanceof Map && !recursive) {
    return { out: '', err: `cp: ${srcArg}: is a directory\n` };
  }
  const finalPath = resolveDest(shell, srcPath, destArg);
  const parent = nodeAt(shell._fs, parentPath(finalPath));
  if (!(parent instanceof Map)) {
    return { out: '', err: `cp: ${destArg}: No such file or directory\n` };
  }
  parent.set(basename(finalPath), deepCopy(srcNode));
  return { out: '', err: '' };
}

function cmd_mv(shell, args) {
  const rest = args.filter((a) => !a.startsWith('-'));
  const [srcArg, destArg] = rest;
  if (!srcArg || !destArg) return { out: '', err: 'usage: mv source target\n' };
  const srcPath = resolvePath(shell, srcArg);
  const srcParent = nodeAt(shell._fs, parentPath(srcPath));
  const srcNode = srcParent instanceof Map ? srcParent.get(basename(srcPath)) : undefined;
  if (srcNode === undefined) {
    return { out: '', err: `mv: ${srcArg}: No such file or directory\n` };
  }
  const finalPath = resolveDest(shell, srcPath, destArg);
  const destParent = nodeAt(shell._fs, parentPath(finalPath));
  if (!(destParent instanceof Map)) {
    return { out: '', err: `mv: ${destArg}: No such file or directory\n` };
  }
  destParent.set(basename(finalPath), srcNode);
  srcParent.delete(basename(srcPath));
  return { out: '', err: '' };
}

function cmd_tree(shell, args) {
  let maxDepth = Infinity;
  let pathArg = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-L') {
      maxDepth = parseInt(args[++i], 10);
      if (Number.isNaN(maxDepth)) maxDepth = Infinity;
    } else if (!args[i].startsWith('-')) {
      pathArg = args[i];
    }
  }
  const path = pathArg ? resolvePath(shell, pathArg) : shell.cwd;
  const node = nodeAt(shell._fs, path);
  if (!(node instanceof Map)) {
    return { out: '', err: `${pathArg || '.'} [error opening dir]\n` };
  }
  const lines = [pathArg || '.'];
  const walk = (map, prefix, depth) => {
    if (depth > maxDepth) return;
    const keys = [...map.keys()];
    const dirs = sortNames(keys.filter((k) => map.get(k) instanceof Map));
    const files = sortNames(keys.filter((k) => !(map.get(k) instanceof Map)));
    const ordered = [...dirs, ...files];
    ordered.forEach((name, idx) => {
      const last = idx === ordered.length - 1;
      lines.push(prefix + (last ? '└── ' : '├── ') + name);
      const child = map.get(name);
      if (child instanceof Map) {
        walk(child, prefix + (last ? '    ' : '│   '), depth + 1);
      }
    });
  };
  walk(node, '', 1);
  return { out: lines.join('\n') + '\n\n', err: '' };
}

function parseCount(args, dflt) {
  let n = dflt;
  const files = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-n') {
      const v = parseInt(args[++i], 10);
      if (!Number.isNaN(v)) n = v;
    } else if (/^-\d+$/.test(a)) {
      n = parseInt(a.slice(1), 10);
    } else if (!a.startsWith('-')) {
      files.push(a);
    }
  }
  return { n, files };
}

function readSource(shell, files, pipeInput) {
  if (files.length) {
    const path = resolvePath(shell, files[0]);
    const node = nodeAt(shell._fs, path);
    if (node === null) return { content: null, err: `${files[0]}: No such file or directory\n` };
    if (node instanceof Map) return { content: null, err: `${files[0]}: Is a directory\n` };
    return { content: node, err: '' };
  }
  return { content: pipeInput === null ? '' : pipeInput, err: '' };
}

function cmd_head(shell, args, pipeInput) {
  const { n, files } = parseCount(args, 10);
  const { content, err } = readSource(shell, files, pipeInput);
  if (content === null) return { out: '', err: 'head: ' + err };
  return { out: joinLines(splitLines(content).slice(0, n)), err: '' };
}

function cmd_tail(shell, args, pipeInput) {
  const { n, files } = parseCount(args, 10);
  const { content, err } = readSource(shell, files, pipeInput);
  if (content === null) return { out: '', err: 'tail: ' + err };
  return { out: joinLines(splitLines(content).slice(-n)), err: '' };
}

function cmd_wc(shell, args, pipeInput) {
  const lineMode = args.includes('-l');
  const files = args.filter((a) => !a.startsWith('-'));
  if (!files.length) {
    const content = pipeInput === null ? '' : pipeInput;
    const count = (content.match(/\n/g) || []).length;
    return { out: `${count}\n`, err: '' };
  }
  let out = '';
  let err = '';
  for (const f of files) {
    const path = resolvePath(shell, f);
    const node = nodeAt(shell._fs, path);
    if (node === null) {
      err += `wc: ${f}: No such file or directory\n`;
      continue;
    }
    if (node instanceof Map) {
      err += `wc: ${f}: read: Is a directory\n`;
      continue;
    }
    const lc = (node.match(/\n/g) || []).length;
    if (lineMode) {
      out += `${lc} ${f}\n`;
    } else {
      const wc = node.split(/\s+/).filter(Boolean).length;
      out += `${lc} ${wc} ${node.length} ${f}\n`;
    }
  }
  return { out, err };
}

function cmd_which(shell, args) {
  const name = args[0];
  if (!name) return { out: '', err: '' };
  if (KNOWN_COMMANDS.has(name)) return { out: `/usr/bin/${name}\n`, err: '' };
  return { out: `${name} not found\n`, err: '' };
}

function cmd_history(shell) {
  const lines = shell.history.map((h, i) => `  ${i + 1}  ${h}`);
  return { out: lines.length ? lines.join('\n') + '\n' : '', err: '' };
}

function cmd_code(shell, args) {
  return { out: `(VS Code would open: ${args[0] || '.'})\n`, err: '' };
}

// python3 <file.py>   — runs the file's stored contents
// python3 -c "<code>" — runs the literal code string, no FS lookup
//
// With no runner injected, returns the Task 1 stub string. When the reveal.js
// terminal widget sets shell.pythonRunner (src -> Promise<{out, err}> or
// Promise<string>), the source is handed to Pyodide and run() surfaces an
// `async` marker (a Promise resolving to { out, err }) that the widget awaits
// and appends. A missing file is a synchronous CPython-shaped error — no
// `async` key at all, so the widget has nothing to await.
function cmd_python3(shell, args) {
  if (!(shell && typeof shell.pythonRunner === 'function')) {
    return { out: '(python3 stub — wired to Pyodide in Task 5)\n', err: '' };
  }
  const argv = args || [];
  let src = null;
  const cIdx = argv.indexOf('-c');
  if (cIdx >= 0) {
    // The Python source is the next arg (already unquoted by the tokenizer).
    src = argv[cIdx + 1] === undefined ? '' : argv[cIdx + 1];
  } else {
    const file = argv.find((a) => !a.startsWith('-'));
    if (file === undefined) return { out: '', err: '' }; // bare `python3` — REPL, no-op
    const node = nodeAt(shell._fs, resolvePath(shell, file));
    if (typeof node !== 'string') {
      return {
        out: '',
        err: `python3: can't open file '${file}': [Errno 2] No such file or directory\n`,
      };
    }
    src = node;
  }
  return {
    out: '',
    err: '',
    async: Promise.resolve(shell.pythonRunner(src)).then((r) => {
      // Accept both the {out, err} shape and the legacy plain-string shape.
      if (r && typeof r === 'object') {
        return { out: r.out || '', err: r.err || '' };
      }
      return { out: r || '', err: '' };
    }),
  };
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

function execCommand(shell, argv, pipeInput) {
  if (argv.length === 0) return { out: '', err: '', cleared: false };
  const [name, ...args] = argv;
  switch (name) {
    case 'pwd': return cmd_pwd(shell);
    case 'cd': return cmd_cd(shell, args);
    case 'ls': return cmd_ls(shell, args);
    case 'mkdir': return cmd_mkdir(shell, args);
    case 'touch': return cmd_touch(shell, args);
    case 'cat': return cmd_cat(shell, args, pipeInput);
    case 'echo': return cmd_echo(shell, args);
    case 'rm': return cmd_rm(shell, args);
    case 'cp': return cmd_cp(shell, args);
    case 'mv': return cmd_mv(shell, args);
    case 'tree': return cmd_tree(shell, args);
    case 'head': return cmd_head(shell, args, pipeInput);
    case 'tail': return cmd_tail(shell, args, pipeInput);
    case 'wc': return cmd_wc(shell, args, pipeInput);
    case 'clear': return { out: '', err: '', cleared: true };
    case 'whoami': return { out: `${USER}\n`, err: '' };
    case 'which': return cmd_which(shell, args);
    case 'history': return cmd_history(shell);
    case 'code': return cmd_code(shell, args);
    case 'python3': return cmd_python3(shell, args);
    default:
      return { out: '', err: `zsh: command not found: ${name}\n` };
  }
}

function writeRedirect(shell, file, append, data) {
  const path = resolvePath(shell, file);
  const parent = nodeAt(shell._fs, parentPath(path));
  if (!(parent instanceof Map)) {
    return `zsh: no such file or directory: ${file}\n`;
  }
  const name = basename(path);
  if (append && typeof parent.get(name) === 'string') {
    parent.set(name, parent.get(name) + data);
  } else {
    parent.set(name, data);
  }
  return '';
}

// ---------------------------------------------------------------------------
// run
// ---------------------------------------------------------------------------

export function run(shell, line) {
  shell.history.push(line);
  const trimmed = String(line).trim();
  if (!trimmed) return { out: '', err: '', cleared: false };

  const tokens = tokenize(trimmed);

  // Split on a single pipe.
  const pipeIdx = tokens.findIndex((t) => t.type === 'op' && t.value === '|');
  let leftTokens;
  let rightTokens = null;
  if (pipeIdx >= 0) {
    leftTokens = tokens.slice(0, pipeIdx);
    rightTokens = tokens.slice(pipeIdx + 1);
  } else {
    leftTokens = tokens;
  }

  // Redirection applies to the final command in the line.
  const finalTokens = rightTokens || leftTokens;
  let redirect = null;
  const rIdx = finalTokens.findIndex(
    (t) => t.type === 'op' && (t.value === '>' || t.value === '>>'),
  );
  if (rIdx >= 0) {
    const fileTok = finalTokens[rIdx + 1];
    redirect = {
      append: finalTokens[rIdx].value === '>>',
      file: fileTok && fileTok.type === 'word' ? fileTok.value : null,
    };
    finalTokens.splice(rIdx);
  }

  const words = (toks) => toks.filter((t) => t.type === 'word').map((t) => t.value);

  let err = '';
  let result;
  if (rightTokens) {
    const leftRes = execCommand(shell, words(leftTokens), null);
    err += leftRes.err || '';
    result = execCommand(shell, words(finalTokens), leftRes.out);
  } else {
    result = execCommand(shell, words(finalTokens), null);
  }
  err += result.err || '';
  let out = result.out || '';

  if (redirect) {
    if (redirect.file === null) {
      err += 'zsh: parse error near `\\n\'\n';
    } else {
      const wErr = writeRedirect(shell, redirect.file, redirect.append, out);
      if (wErr) err += wErr;
      out = '';
    }
  }

  const ret = { out, err, cleared: !!result.cleared };
  if (result && result.async) ret.async = result.async;
  return ret;
}

// ---------------------------------------------------------------------------
// prompt / listing
// ---------------------------------------------------------------------------

export function prompt(shell) {
  const base = shell.cwd === shell.home ? '~' : basename(shell.cwd);
  return `${USER}@${HOSTNAME} ${base} %`;
}

export function listing(shell, path) {
  const target = path ? resolvePath(shell, path) : shell.cwd;
  const node = nodeAt(shell._fs, target);
  if (!(node instanceof Map)) return [];
  return sortNames([...node.keys()].filter((n) => !n.startsWith('.')));
}
