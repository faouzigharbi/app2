# CLAUDE.md

Guidance for AI assistants (and humans) working in this repository.

## What this repository is

`app2` is a collection of **standalone, self-contained HTML math exercises**
for the **Devoirati** learning application (see `README.md` — *"fichier pour
l'application devoirati"*). Each `.html` file is an independent, interactive
worksheet that a student opens in a browser to practice a math topic.

Every exercise file is plain HTML + inline `<style>` + inline `<script>`.
Opening a file directly in a browser (`file://`) is the entire "run" story for
the exercises themselves — there is no build system, framework, or package
manager for them.

### The platform layer (in progress)

The repo is being extended from standalone exercises into the **Devoirati
platform**: user accounts (élève / parent / prof), gamification (XP, levels,
streaks, badges), and diagnostics for parents and teachers. Two new areas:

- **`db/schema.sql`** — the MySQL/MariaDB schema. The 3 tables (`dv_users`,
  `dv_progress`, `dv_analytics`) already exist on the host and are
  **student-centric with UUID ids**; Part 2 of the file holds non-destructive
  `ALTER TABLE`s that add the accounts/roles layer (`role`, `login`, `email`,
  `password_hash`, `parent_id`, `classe`).
- **`backend/`** — a small **PHP + PDO** backend (auth, roles/authz, account
  creation, classes, parent links, `save_progress` with XP/level/streak/badge
  logic). See `backend/README.md` for deployment. Runs on the host's shared
  hosting alongside the exercises.
- **`app/`** — the platform front-end (login/signup + élève/parent/prof/admin
  dashboards) calling the `backend/` APIs. Shared assets in `app/assets/`.
- **`docs/`** — the planning dossier (schema, permissions, migration, tests).
  Exercises connect to the platform via `app/assets/devoirati-exercice.js`
  (see `docs/integration-exercices.md`); wiring is optional and non-destructive.

⚠️ **The database is `latin1` and does not store Arabic.** Store **latin-letter
codes** (`debutant`, `fractions`, `division_fractions`) and translate them to
Arabic **at display time** (see `backend/labels.php`). Never store Arabic
strings in the DB. Real database credentials live only in `backend/config.php`,
which is git-ignored — never commit it.

### Topics covered

The exercises target middle-school arithmetic, mostly around two themes:

- **Fractions** — simplification, addition/subtraction, multiplication,
  division, decimal fractions, operations with parentheses, common-factor
  factorization (e.g. `addition fractions*.html`, `Division fractions4.html`,
  `Factorisation Fractions*.html`, `fraction-simplification-exercise.html`,
  `operations fractions .html`).
- **Powers / exponents** — products of powers, simplifying power expressions
  (e.g. `power-exponent-exercises.html`, `produit puisssance.html`,
  `puissance prod *.html`, `exe Puissance*.html`, `pUISSANCE PRODUIT (2).html`).

### Languages

Most files are in **Arabic** (`<html lang="ar" dir="rtl">`, right-to-left
layout). A few are in **French** (`lang="fr"`) and one page is an exported
English/Poe artifact. When editing an Arabic file, preserve `dir="rtl"`,
`text-align: right` on the body, and keep math expressions in LTR contexts
(`direction: ltr` on `.problem` / `.fraction` blocks) so numbers render
correctly.

## File conventions

Each exercise HTML file follows the same self-contained pattern:

1. `<!DOCTYPE html>` with `lang`/`dir` on `<html>`.
2. A single inline `<style>` block. Common CSS classes across files:
   `.container`, `.problem`, `.fraction` (with `.num` / `.den`), `.message`
   (`.correct` / `.incorrect`), `.score`, `.instructions`, and styled
   `button`s (green validate button, orange "show solution", blue "next").
3. Markup for the exercise UI (a generated problem, `<input>` fields, action
   buttons).
4. A single inline `<script>` block holding all the logic — no external JS.

### Common JavaScript building blocks

The same helper functions recur across files (names vary slightly per file):

- **GCD** — `gcd()` / `findGCD()` / `greatestCommonDivisor()`, usually the
  recursive Euclidean form: `return b === 0 ? a : gcd(b, a % b);`
- **Random problem generation** — `generateFraction()`, `generateFractions()`,
  `generateRandomFraction()`, `generateOperation()`, `generateNewProblem()`.
  Values are typically drawn with `Math.floor(Math.random() * N) + k`, often
  looping until the problem meets a constraint (e.g. reducible fraction,
  non-equal numerator/denominator).
- **Answer checking** — `checkAnswer()` / `verifyAnswer()`. Fraction equality
  is tested by cross-multiplication (`n1 * d2 === n2 * d1`), and "fully
  simplified" by checking `gcd(num, den) === 1`.
- **Solutions / corrections** — `showSolution()`, `showCorrection()`,
  `showExplanation()`, `getCorrectionSteps()`, plus scoring via `score` /
  `total` counters.
- **Rendering** — `displayFraction()` / `fractionToHTML()` build the stacked
  numerator/denominator markup.

Some files use **MathJax 3** loaded from a CDN
(`cdn.jsdelivr.net/npm/mathjax@3/...` + `polyfill.io`) to typeset expressions;
one uses `cdn.tailwindcss.com`. These CDNs require network access at view time.
Prefer keeping pages offline-capable when practical, but match whatever the file
already does.

## Working in this repo

- **To run/preview:** open the target `.html` file in a browser. There is
  nothing to install or compile.
- **When adding a new exercise:** copy the structure of the closest existing
  file for the same topic and language, keep everything inline and
  self-contained, and reuse the class names and helper-function patterns above
  so pages stay visually and behaviourally consistent.
- **Filenames** are human-readable topic labels and may contain spaces,
  parentheses, and mixed case (e.g. `pUISSANCE PRODUIT (2).html`). Always quote
  paths in shell commands. Preserve existing names unless asked to rename.
- **No tests, no linter, no CI** are configured. Verify changes by opening the
  page and exercising the generate → answer → check → solution flow manually.

## Git workflow

- Default branch: `main`. History is small (files were uploaded directly).
- Commit with clear, descriptive messages and push to the branch you were asked
  to work on. Do not open a pull request unless explicitly requested.

## ⚠️ Security note — leaked API key

`API devoirati.txt` contains what appears to be a **live OpenAI API key**
(`sk-proj-...`) committed in plaintext. No code in this repo uses it. This is a
**secret that should not be in version control**:

- Do **not** copy this key into code, commits, PRs, or chat output.
- It should be **revoked/rotated** at the provider and removed from the repo
  (and ideally purged from history). Flag this to the repository owner.
