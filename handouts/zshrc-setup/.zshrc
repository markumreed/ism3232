# ============================================================================
# ISM3232 — Business Application Development
# Starter ~/.zshrc block
# ============================================================================
#
# What this file is:
#   A reference .zshrc you can compare your own configuration against.
#
# What to actually do with it:
#   Do NOT delete your existing ~/.zshrc and replace it with this one.
#   macOS and Homebrew sometimes add their own lines to that file, and you
#   don't want to lose those. Instead, open your real ~/.zshrc and paste the
#   block below — from the "ISM3232 START" line to the "ISM3232 END" line —
#   at the very bottom of it. See the tutorial in this folder for the full
#   step-by-step.
#
# Read every line before you paste it. You are required to be able to
# explain what each alias and function does — that's part of the Week 3
# assignment, not just having it "work."
# ============================================================================

# ---------------------------------------------------------------------------
# ISM3232 START
# ---------------------------------------------------------------------------

# --- Navigation shortcuts ---------------------------------------------------
alias ll='ls -la'          # detailed listing, including hidden files
alias c='clear'            # clear the terminal screen
alias tree2='tree -L 2'    # directory tree, 2 levels deep

# --- Python shortcut ---------------------------------------------------------
alias py='python3'         # type `py` instead of `python3`

# --- Git shortcuts (used every time in the pre-submission ritual) -----------
alias gs='git status'
alias ga='git add .'
alias gcmsg='git commit -m'   # usage: gcmsg 'a descriptive commit message'
alias gp='git push'
alias gl='git log --oneline'

# --- Shell function: make a folder and step into it in one command ---------
mkcd() {
  mkdir -p "$1" && cd "$1"
}

# --- Optional bonus tools (Week 4 — not required, but worth having) --------
# These only load if the tool is actually installed, so this block is safe
# to paste even before you've installed ripgrep, fzf, or zoxide.

# zoxide: a smarter `cd` that learns your most-visited folders.
# After you've `cd`'d into a folder a few times, `z partial-name` jumps there
# from anywhere. Install: brew install zoxide (Mac) / sudo apt install zoxide (WSL)
if command -v zoxide >/dev/null 2>&1; then
  eval "$(zoxide init zsh)"
fi

# fzf: fuzzy search over your command history and files.
# Ctrl+R fuzzy-searches your shell history once this is loaded.
# Install: brew install fzf (Mac) / sudo apt install fzf (WSL)
if command -v fzf >/dev/null 2>&1; then
  source <(fzf --zsh) 2>/dev/null
fi

# --- Sane shell history (bigger, deduplicated, shared across tabs) ---------
HISTSIZE=5000
SAVEHIST=5000
setopt SHARE_HISTORY        # share history across all open terminal tabs
setopt HIST_IGNORE_DUPS     # don't log a command right after the same one
setopt HIST_IGNORE_SPACE    # commands starting with a space aren't logged

# ---------------------------------------------------------------------------
# ISM3232 END
# ---------------------------------------------------------------------------
