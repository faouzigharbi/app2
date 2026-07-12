# CLAUDE.md

Guidance for AI assistants (and humans) working in this repository.

## What this repository is

`app2` is a collection of **standalone, self-contained HTML math exercises** for the
**"devoirati"** learning application (devoirati ≈ "my homework"). Each `.html` file is an
independent, interactive drill that a student opens directly in a browser — there is no
build step, no server, no package manager, and no shared code between files.

The exercises target school-level arithmetic and algebra, primarily in **Arabic (RTL)**
with a few in **French**:

- **Fractions** — simplification, addition, division, decimal fractions, chained "four
  operations", operations with parentheses.
- **Factorisation** — factoring by common factor (التحليل بالعامل المشترك).
- **Powers / exponents** — products of powers, simplifying power expressions (القوى / الأسس).

## Repository layout

Everything lives at the repository root. There is no nesting by topic; the topic is encoded
in the file name (which is often mixed French/Arabic-transliteration and may contain spaces,
capitals, or parentheses).

| File(s) | Purpose |
|---|---|
| `*.html` | The exercises themselves — each fully self-contained. |
| `README.md` | One-line description ("fichier pour l'application devoirati"). |
| `API devoirati.txt` | **⚠️ Contains a leaked API key — see Security below. Do not treat as config.** |
| `*_files/` | Browser "Save Page As" asset dumps for a couple of scraped pages (see below). |

### Two kinds of HTML files

1. **Purpose-built exercises** (most files, ~4–15 KB). Clean, hand/AI-authored pages with
   inline `<style>` and inline `<script>`. These are the real content of the project. Examples:
   `fraction-simplification-exercise.html`, `arabic-fraction-simplification.html`,
   `power-exponent-exercises.html`, `Division fractions4.html`.
2. **Saved web-page exports** (`addition fractions.html` ~190 KB, `puissance prod 3.html`
   ~640 KB). These are "Save As" captures of Poe.com preview pages, with a sibling
   `<name>_files/` asset folder and titles like "Aperçu Poe". Treat them as reference/scratch
   dumps, **not** as the canonical exercise — prefer the smaller siblings
   (`addition fractions2/3/4.html`, `puissance prod 2.html`) when editing.

## Conventions for a well-formed exercise

New exercises should match the structure of the small, purpose-built files. The canonical
reference is `fraction-simplification-exercise.html`. Follow these conventions:

- **Single self-contained file.** All CSS in one `<style>` block in `<head>`, all logic in one
  `<script>` block before `</body>`. No external build, no imports between files.
- **Language & direction.** Set `<html lang="ar" dir="rtl">` for Arabic exercises,
  `<html lang="fr">` for French. Always `<meta charset="UTF-8">` and the responsive
  viewport meta tag. Fonts are the system stack: `Arial, Tahoma, sans-serif`.
- **Vanilla JS only.** No frameworks. State is a few module-level `let` variables
  (e.g. `score`, `total`), DOM access via `document.getElementById`, wiring via inline
  `onclick="..."` handlers and `addEventListener('keypress', ...)` for Enter-to-submit.
- **Standard interaction loop:** generate a random problem → student types answer(s) →
  a `checkAnswer()` function validates → a message div shows correct/incorrect (green/red)
  → "Voir la solution" reveals the worked answer → "Question suivante" generates the next.
  Keep a running `Score: X / Y`.
- **Math correctness matters.** Reuse the established helpers, e.g. Euclidean `gcd(a, b)` for
  fraction reduction, and validate equivalence by cross-multiplication
  (`n1 * d2 === n2 * d1`) rather than float comparison. Loop when generating so the problem is
  actually reducible / non-trivial. Guard against zero denominators and non-numeric input.
- **Optional MathJax.** Some files render math with MathJax v3 via CDN
  (`https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js`, sometimes with a
  `polyfill.io` shim). Only add it when you need typeset notation; the simplest exercises
  render fractions with plain HTML/CSS instead.
- **UI palette.** Green primary action buttons (`#4CAF50`), amber "show solution"
  (`#f0ad4e`), blue "next" (`#5bc0de`); light card on a light-grey page. Centered layout,
  `max-width` ~600–800px.

## How to work in this repo

- **Run / preview:** just open the `.html` file in a browser (or `SendUserFile` it to the
  user). There is nothing to install, compile, or serve. No test suite or linter exists.
- **Editing an exercise:** modify the single file in place; keep everything self-contained.
  Don't factor shared code into external `.js`/`.css` — the project's whole model is one
  portable file per exercise.
- **Adding an exercise:** copy the structure of an existing small file with a matching
  language/direction, then adapt the generator and validation. Pick a descriptive file name
  consistent with the existing (loose) naming — descriptive names with spaces are fine.
- **Verifying a change:** open it in a browser and actually run the exercise — generate
  several problems, submit right and wrong answers, and confirm the score, messages, and
  "solution" output are all correct. There are no automated checks to lean on.

## Git workflow

- Default branch is `main`. Do not commit directly to `main`; use the feature branch assigned
  for the task and push with `git push -u origin <branch>`.
- Commit messages should be short and descriptive of the exercise or fix.
- Do **not** open a pull request unless explicitly asked.

## Security ⚠️

- **`API devoirati.txt` contains a real, exposed API key committed to the repository.** This
  is a leaked secret. Do not copy it into code, print it, or rely on it. It should be
  **revoked/rotated at the provider and removed from the repo (and history)**. Flag this to
  the user rather than silently working around it.
- Client-side exercises should never embed API keys or secrets — everything here runs in the
  student's browser, so any key placed in these files is public.
