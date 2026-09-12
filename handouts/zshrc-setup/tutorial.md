# ISM3232 — How to Set Up Your `.zshrc`

*Companion to Week 3 (Module 2C & 2D — Virtual Environments and `.zshrc`).*
*Reference file: [`.zshrc`](./.zshrc) in this same folder.*

---

## 1. What `.zshrc` is, and why you're doing this

`.zshrc` is a hidden configuration file in your home directory. zsh reads it
every time you open a new terminal. Anything you define in it — aliases,
functions, environment variables — is instantly available in every terminal
session from then on, on that machine.

Professional developers customize their shell for the same reason they use a
code editor with extensions: it removes friction from things they do fifty
times a day. Typing `gs` instead of `git status` is trivial by itself, but by
the end of the semester you'll run the pre-submission ritual dozens of times,
and small friction adds up.

You are required to be able to explain what every line in your `.zshrc` does.
AI tools may explain the *syntax* to you (what does `$1` mean? what does
`&&` do?) — but pasting in a config you can't explain isn't the assignment.
That's why this tutorial walks through *why* each piece exists, not just
*what* to paste.

---

## 2. Before you start

- You should already have zsh as your default shell (Pre-Course Setup, Tool
  5). Confirm with:
  ```
  echo $SHELL
  ```
  Expected: `/bin/zsh` (Mac) or `/usr/bin/zsh` (WSL/Ubuntu).
- Windows students: do all of this **inside your Ubuntu/WSL terminal**, not
  PowerShell. The file lives at the same path, `~/.zshrc`, inside Ubuntu.
- This is a Week 3 topic, so you should already have a project folder (e.g.
  `~/ism3232/module02_zsh/`) from Weeks 1–2.

---

## 3. Back up your existing `.zshrc` first

Before editing any config file that already exists, follow the same safety
habit you use with `rm`: look before you touch it.

```
ls -la ~ | grep .zshrc
```

If a `.zshrc` already exists (it usually does — Homebrew or your OS may have
created one), back it up before changing it:

```
cp ~/.zshrc ~/.zshrc.backup
```

If something goes wrong later, you can always restore it:

```
cp ~/.zshrc.backup ~/.zshrc
```

If `ls` shows nothing, that's fine too — you'll create a fresh one in the next
step.

---

## 4. Open `.zshrc` in VS Code

```
code ~/.zshrc
```

This opens (or creates) the file in your editor. **If it already has content
in it — do not delete it.** Scroll to the bottom of the file; that's where
you'll add your block.

---

## 5. Paste the required block

Open [`.zshrc`](./.zshrc) in this folder, copy everything between the
`# ISM3232 START` and `# ISM3232 END` markers, and paste it at the **bottom**
of your own `~/.zshrc`. Save the file.

Here's what you're adding and why:

| Alias / function | Expands to | Why it exists |
|---|---|---|
| `ll` | `ls -la` | See hidden files (like `.venv`, `.git`, `.gitignore`) and permissions at a glance |
| `c` | `clear` | Clean up a cluttered terminal without closing it |
| `tree2` | `tree -L 2` | Quick two-level project map without the noise of `node_modules`-style deep trees |
| `py` | `python3` | This course always uses `python3`, never bare `python` — this alias makes that the path of least resistance |
| `gs` | `git status` | The command you should run *before every single `git add`* — first step of the pre-submission ritual |
| `ga` | `git add .` | Stage everything you've reviewed with `gs` |
| `gcmsg` | `git commit -m` | Commit with a message: `gcmsg 'add calculate_tax to business_rules.py'` |
| `gp` | `git push` | Send commits to GitHub — the last step of every submission |
| `gl` | `git log --oneline` | Compact commit history, to confirm your commits actually landed |
| `mkcd` | `mkdir -p "$1" && cd "$1"` | Create a new week/module folder and step into it in one command instead of two |

The bonus block (`zoxide`, `fzf`) is **not required** for grading — it's the
Week 4 "power navigation" material. It's written so it does nothing if you
haven't installed those tools yet, so it's safe to include even if you skip
that step for now.

---

## 6. Apply the changes

Editing `.zshrc` doesn't affect terminals that are already open. Reload it
into your *current* terminal with:

```
source ~/.zshrc
```

If you see no errors, it worked. From now on, every **new** terminal window
also loads it automatically — you only need `source` when you've just edited
the file.

---

## 7. Verify every piece — don't assume, test

Run each of these and confirm the behavior described:

```
ll              # should list files, including hidden ones like .git and .venv
gs              # should print "On branch main..." (or similar) if you're in a git repo
py --version    # should print a Python 3.x version
tree2           # should show your folders 2 levels deep
mkcd testdir    # should create testdir/ AND move you into it
pwd             # confirm you're now inside .../testdir
cd ..
rm -r testdir   # clean up the test folder (pwd, then ls, then rm — the safety ritual)
```

If `tree2` says `command not found`, you haven't installed `tree` yet
(`brew install tree` on Mac, `sudo apt install tree -y` on WSL) — that's a
separate tool from `.zshrc`, not a config problem.

For the Week 3 lab screenshot requirement, capture `ll`, `gs`, and `mkcd`
all working *after* `source ~/.zshrc`, in that same terminal.

---

## 8. Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| `zsh: command not found: gs` | You edited the file but never ran `source ~/.zshrc` | Run `source ~/.zshrc` in that terminal, or open a new terminal tab |
| Your old `ll` still behaves differently than expected | Something later in `.zshrc` (like an Oh My Zsh plugin) redefines it after your block | zsh uses the *last* definition of a duplicate alias — move your ISM3232 block to the very end of the file |
| `mkcd: command not found` | The function block didn't get pasted, or has a typo | Reopen `code ~/.zshrc` and confirm the `mkcd() { ... }` block is present exactly as shown, then `source ~/.zshrc` again |
| Pasted the block but nothing changed | You edited `~/.zshrc.backup` or the wrong file by mistake | Confirm you're editing `~/.zshrc` — run `code ~/.zshrc` again and check the tab name |
| `permission denied` opening `~/.zshrc` | Rare — usually a home-directory permissions issue | Ask on the course discussion board with the exact error before trying random fixes |

---

## 9. Quick reference (keep this open while you work)

```
code ~/.zshrc          # open the file
source ~/.zshrc        # apply changes to the CURRENT terminal
ll                      # ls -la
c                       # clear
py                      # python3
gs                      # git status
ga                      # git add .
gcmsg 'message'         # git commit -m 'message'
gp                      # git push
gl                      # git log --oneline
tree2                   # tree -L 2
mkcd foldername         # mkdir -p foldername && cd foldername
```

This is the same list tested on the midterm practical exam, so keep it
somewhere you'll actually look at again.
