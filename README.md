# ISM3232 — Business Application Development

**Course website for ISM3232 at the USF Muma College of Business.**
Full-stack business application development — terminal, Python, OOP, SQL, Streamlit, and a controlled AI feature — built across 16 weeks.

🔗 **Live site:** `https://yourusername.github.io/ism3232/`

---

## What this site is

A student-facing course hub. Every page is a standalone HTML file — no framework, no build step, no dependencies. Students open a link and see the content. The site works on any device and loads instantly.

---

## Site contents

| Type | Count | Description |
|---|---|---|
| Pre-course setup | 1 | Installation and verification tutorial — complete before Week 1 |
| Unit overviews | 5 | One per unit + an all-units summary |
| Weekly readings | 16 | Purpose-written reading for each week — the *why* before the *how* |
| Weekly lectures | 16 | Student-facing lecture pages with code blocks, concept cards, and timing |
| In-class labs | 15 | Lab instructions for Weeks 1–8 and 10–16 (no lab Week 9 — midterm) |
| Unit cheat sheets | 4 | One per unit — key commands, patterns, and syntax in one place |
| **Total** | **57 pages** | |

---

## Repo structure

```
.
├── index.html          # Course hub — links to all 57 pages
└── docs/               # All content pages
    ├── precourse.html
    ├── unit_all_overview.html
    ├── unit_1_overview.html
    ├── unit_2_overview.html
    ├── unit_3_overview.html
    ├── unit_4_overview.html
    ├── unit_1_cheatsheet.html
    ├── unit_2_cheatsheet.html
    ├── unit_3_cheatsheet.html
    ├── unit_4_cheatsheet.html
    ├── week01_reading.html   # Weeks 01–16
    ├── week01_lecture.html
    ├── week01_lab.html
    └── ...
```

---

## Deploying to GitHub Pages

### First time

1. Create a new GitHub repository (e.g. `ism3232`).

2. Clone it and copy the site files in:
   ```bash
   git clone https://github.com/YOURUSERNAME/ism3232.git
   cd ism3232
   # copy index.html and docs/ into this folder
   git add .
   git commit -m "initial course site"
   git push
   ```

3. Go to **Settings → Pages → Source → Deploy from branch**.
   Set branch to `main`, folder to `/ (root)`. Save.

4. GitHub publishes the site at `https://YOURUSERNAME.github.io/ism3232/`
   within about 60 seconds.

### Updating content

Replace or update any file in `docs/`, then:
```bash
git add docs/week05_reading.html
git commit -m "update week 5 reading — add input() TypeError section"
git push
```

GitHub Pages redeploys automatically on every push to `main`.

---

## Course structure

```
Unit 1 — Developer Foundations  (Weeks 1–4)
  zsh · file system · virtual environments · pip · ruff · pytest · Git

Unit 2 — Python Foundations  (Weeks 5–8 + Week 9 midterm)
  types · operators · conditionals · loops · functions · modules · debugging

Unit 3 — Object-Oriented Design  (Weeks 10–12)
  classes · __init__ · composition · inheritance · design-first workflow

Unit 4 — Capstone Build  (Weeks 13–16)
  SQL · sqlite3 · Streamlit · Anthropic API · 6 AI controls · final demo
```

The submission ritual (ruff → pytest → git add → commit → push) runs in every unit.

---

## Tech stack used in the course

| Tool | Purpose |
|---|---|
| zsh | Shell — all terminal work |
| VS Code | Editor — integrated terminal |
| Python 3.10+ | Language |
| venv + pip | Dependency isolation |
| ruff | Linting and formatting |
| pytest | Testing |
| Git + GitHub | Version control and submission |
| SQLite | Database layer |
| Streamlit | Browser UI |
| Anthropic API | Controlled GenAI feature |

---

To preview locally, open `index.html` directly in a browser or run:
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```


