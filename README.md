# ISM3232 — Business Application Development

**Course website for ISM3232 at the USF Muma College of Business.**
Full-stack business application development — terminal, Python, OOP, SQL, Streamlit, and a controlled AI feature — built across 16 weeks.

🔗 **Live site:** `https://yourusername.github.io/ism3232/`

---

## Features

- **Dark / light mode toggle** — persists across sessions via localStorage; respects system preference on first visit
- **Font size controls** — A− / A+ buttons in the nav, also persisted per device
- **Full navigation on every page** — unit dropdowns, direct week links, cheat sheets, overviews
- **Keyboard accessible** — skip-to-content link, Escape closes dropdowns, all interactive elements focusable
- **Skip link** — screen reader and keyboard users can jump past the nav to main content
- **ARIA labels** — nav, dropdowns, toggle buttons, and font controls are all labelled
- **No build step** — plain HTML + CSS + vanilla JS; works on any static host

---

## Site contents

| Type | Count | Description |
|---|---|---|
| Course map | 1 | Interactive unit map — click any unit to expand, keyboard shortcuts 1–4 |
| Pre-course setup | 1 | Installation and verification tutorial — complete before Week 1 |
| Unit overviews | 5 | One per unit + an all-units summary |
| Weekly readings | 16 | Purpose-written reading for each week |
| Weekly lectures | 16 | Student-facing lecture pages with annotated code blocks |
| In-class labs | 15 | Lab instructions (Weeks 1–8, 10–16) |
| Unit cheat sheets | 4 | One per unit — key commands and patterns |
| Student slides | 16 | Reveal.js decks — one per week |
| **Total** | **74 pages** | |

> **Note:** Instructor video script slides (`*_script_slides.html`) are included in `docs/` but are not linked from the public navigation. They can be shared separately.

---

## Repo structure

```
.
├── index.html              # Course hub
├── site.css                # Shared nav, theme toggle, accessibility styles
├── site.js                 # Shared nav JS, theme, font size, dropdowns
├── README.md
└── docs/
    ├── course_map.html
    ├── precourse.html
    ├── unit_all_overview.html
    ├── unit_1_overview.html    … unit_4_overview.html
    ├── unit_1_cheatsheet.html  … unit_4_cheatsheet.html
    ├── week01_reading.html     … week16_reading.html
    ├── week01_lecture.html     … week16_lecture.html
    ├── week01_lab.html         … week16_lab.html
    ├── week01_slides.html      … week16_slides.html
    └── week01_script_slides.html … (not publicly linked)
```

---

## Deploying to GitHub Pages

### First time

```bash
git clone https://github.com/YOURUSERNAME/ism3232.git
cd ism3232
# unzip site contents here — index.html, site.css, site.js, docs/, README.md
git add .
git commit -m "initial course site"
git push
```

Go to **Settings → Pages → Source → Deploy from branch → main → / (root) → Save**.

Your site is live at `https://YOURUSERNAME.github.io/ism3232/` within ~60 seconds.

### Updating a page

```bash
# Edit the file, then:
git add docs/week05_reading.html
git commit -m "update week 5 reading — expand f-string section"
git push
```

GitHub Pages redeploys automatically on every push to `main`.

---

## How the shared assets work

`site.css` and `site.js` are embedded inline into every content page at build time — so the site has **zero external dependencies** and every page works even when opened as a local file (`file://`).

The nav is built by `site.js` at runtime, which detects the current page filename to:
- Mark the active unit dropdown and week link
- Set the correct relative paths back to `index.html` (whether you're in `/docs/` or the root)
- Apply the saved theme and font size before the first paint (no flash)

---

## Course structure

```
Unit 1 — Developer Foundations  (Weeks 1–4)
  zsh · paths · virtual environments · pip · ruff · pytest · Git · ritual

Unit 2 — Python Foundations  (Weeks 5–8 + Week 9 midterm)
  types · operators · conditionals · loops · functions · modules · debugging

Unit 3 — Object-Oriented Design  (Weeks 10–12)
  classes · __init__ · composition · inheritance · design-first · OOP testing

Unit 4 — Capstone Build  (Weeks 13–16)
  SQL · sqlite3 · Streamlit · Anthropic API · 6 AI controls · final demo
```

---

## Tech stack (course content)

| Tool | Purpose |
|---|---|
| zsh | Shell |
| VS Code | Editor |
| Python 3.10+ | Language |
| venv + pip | Dependency isolation |
| ruff | Linting and formatting |
| pytest | Testing |
| Git + GitHub | Version control and submission |
| SQLite | Database |
| Streamlit | Browser UI |
| Anthropic API | Controlled GenAI feature |

---

## License

Course materials © University of South Florida. All rights reserved.
Not for redistribution without permission.
