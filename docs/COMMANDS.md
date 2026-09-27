# Commands

The commands are designed to be run in a specific order. Each one builds on the previous. You can't run `roadmap` before `analyse` — devarchitect will stop you and tell you what to run first. This is intentional. The workflow exists to make sure you actually think through each step before moving on.

---

## Order

```text
init → analyse → stack → roadmap → decision → progress
```

`decision`, `progress`, `drift`, `why`, `similar-decisions`, `install-hooks`, and `status` can be run at any point as the project grows.

---

## `devarchitect init`

The starting point. Run this at the beginning of any project.

If you run it inside an existing project, it automatically checks `package.json` to pre-fill the project name and description as defaults. You can also pass the `--from-git` flag to pull the first commit date from your Git history:

```bash
devarchitect init --from-git
```

Asks:

- Project name
- What problem it solves
- Who it is for
- Platform (web / mobile / cli / desktop)
- Team size

Saves to: `.devarchitect/vision.json`

If `vision.json` already exists it will ask before overwriting and back up the old file first.

---

## `devarchitect analyse`

Captures feasibility thinking — risks, timeline, scale, and budget. Forces you to think about these things before jumping into the stack and roadmap.

Needs: `vision.json`

Asks:

- Main technical risks
- Timeline (1 month / 3 months / 6 months / 1 year)
- Expected scale (small / medium / large)
- Budget (low / medium / high)

Saves to: `.devarchitect/analyse.json`

---

## `devarchitect stack`

Locks in your technology choices. Useful to have on record later when someone asks why you chose a particular database or framework.

Needs: `vision.json`, `analyse.json`

Asks:

- Frontend technology
- Backend technology
- Database
- Deployment platform (AWS / GCP / Azure / Vercel / Railway / Other)
- Other tools

Saves to: `.devarchitect/stack.json`

---

## `devarchitect roadmap`

Breaks the project into phases with milestones. You tell it how many phases, then it asks for the name and milestones of each one.

Needs: `vision.json`, `analyse.json`, `stack.json`

Saves to: `.devarchitect/roadmap.json`

---

## `devarchitect decision`

This one is different from the others — it does not overwrite anything. Every time you run it, it appends a new entry to `decisions.json`. The idea is to run this whenever you make an important call — switching a library, changing the architecture, dropping a feature — and record what you decided and why.

Before saving, devarchitect silently scans your answers against its built-in package map and automatically tags the decision with a `category` (like `database`, `testing`, or `authentication`) if it recognizes a technology or category keyword.

Needs: `vision.json`

Asks:

- What was the decision
- Why was it made
- What alternatives were considered

Appends to: `.devarchitect/decisions.json`

---

## `devarchitect why <keyword>`

Searches through all your recorded decisions in `decisions.json` and prints matching entries sorted from newest to oldest. It checks both the text fields (`what`, `why`, `alternatives`) and the auto-inferred `category` field.

Needs: `decisions.json`

Example usage:

```bash
devarchitect why database
devarchitect why express
```

---

## `devarchitect similar-decisions`

Finds pairs of recorded decisions that are conceptually related even if they don't share the exact same keywords. It tokenizes your decision logs, builds a vocabulary, calculates TF-IDF vectors for each entry, and computes pairwise cosine similarity to surface related architectural choices.

Needs: `decisions.json` (works best once you have at least 5–6 decisions logged)

---

## `devarchitect drift`

Checks whether your actual codebase still matches what you planned in `stack.json`. It reads your project's manifest files (such as `package.json` or `requirements.txt`), maps installed packages to their categories, and compares them against your declared stack.

It prints a color-coded terminal report showing:

- **Matched:** Declared technologies that are present in the project
- **Missing:** Technologies declared in `stack.json` that were not detected
- **Undeclared:** Packages detected in your manifest files that were never declared in `stack.json`

Needs: `stack.json`

Saves to: `.devarchitect/drift.json`

---

## `devarchitect view <section>`

Prints the formatted contents of any saved `.devarchitect/` file directly in the terminal so you can inspect your project data or full drift report without opening the browser dashboard or triggering interactive prompts.

Available sections: `vision`, `analyse`, `stack`, `roadmap`, `decisions`, `progress`, `drift`

Needs: The corresponding `.json` file for that section

Example usage:

```bash
devarchitect view drift
devarchitect view stack
devarchitect view decisions
```

---

## `devarchitect install-hooks`

Installs a Git `pre-commit` hook inside `.git/hooks/pre-commit` that automatically runs `devarchitect drift` before every commit. It prints drift warnings right in your terminal when you commit changes, but always exits with `0` so it never blocks your commits. If a `pre-commit` hook already exists, it asks before overwriting.

Needs: A Git repository (`.git` folder)

---

## `devarchitect progress`

Same append behavior as decision — runs multiple times and builds up a history. Reads your phases from `roadmap.json` so you can select which phase you are currently in rather than typing it manually.

Needs: `vision.json`, `roadmap.json`

Asks:

- Current phase (pulled from roadmap.json)
- Which milestones are complete (checkboxes from the selected phase)
- Any blockers
- Overall completion percentage

Appends to: `.devarchitect/progress.json`

---

## `devarchitect status`

Quick check of what has been filled in and what is still missing. Good to run before sharing the project with someone.

Needs: nothing

Example output:

```text
Project: devarchitect
-----------------------------
✓ vision.json     - initialized
✓ analyse.json    - analyzed
✓ stack.json      - stack defined
✓ roadmap.json    - roadmap defined
✓ decisions.json  - decisions recorded
✓ progress.json   - progress recorded
✗ drift.json      - run devarchitect drift
```

---

## `devarchitect export`

Reads all the JSON files and generates a single markdown report. Sections that have not been filled in yet are marked as "Not yet defined" so the report is always complete even if you skipped some steps.

Needs: `vision.json`

Output: `devarchitect-report.md` in the project root

The report includes: Vision, Feasibility Analysis, Tech Stack, Roadmap, Decisions Log, Current Progress, and Drift Report.

---

## `devarchitect dashboard`

Starts a local server on port 3001 and opens the browser. The dashboard shows everything in one place with a sidebar for navigating between sections, including green status dots for completed steps and your latest Drift Report. The Export button in the dashboard downloads the same markdown report as the CLI export command.

Needs: `vision.json`

```text
http://localhost:3001
Ctrl+C to stop
```
