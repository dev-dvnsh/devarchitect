# Commands

The commands are designed to be run in a specific order. Each one builds on the previous. You can't run `roadmap` before `analyse` — devarchitect will stop you and tell you what to run first. This is intentional. The workflow exists to make sure you actually think through each step before moving on.

---

## Order

```
init → analyse → stack → roadmap → decision → progress
```

`decision`, `progress`, and `status` can be run at any point after init.

---

## `devarchitect init`

The starting point. Run this at the beginning of any project.

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

Needs: `vision.json`

Asks:

- What was the decision
- Why was it made
- What alternatives were considered

Appends to: `.devarchitect/decisions.json`

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

```
Project: devarchitect
-----------------------------
✓ vision.json      — initialized
✓ analyse.json     — analyzed
✓ stack.json       — stack defined
✗ roadmap.json     — run devarchitect roadmap
✗ decisions.json   — run devarchitect decision
✗ progress.json    — run devarchitect progress
```

---

## `devarchitect export`

Reads all the JSON files and generates a single markdown report. Sections that have not been filled in yet are marked as "Not yet defined" so the report is always complete even if you skipped some steps.

Needs: `vision.json`

Output: `devarchitect-report.md` in the project root

The report includes: Vision, Feasibility Analysis, Tech Stack, Roadmap, Decisions Log, Current Progress.

---

## `devarchitect dashboard`

Starts a local server on port 3001 and opens the browser. The dashboard shows everything in one place with a sidebar for navigating between sections. The Export button in the dashboard downloads the same markdown report as the CLI export command.

Needs: `vision.json`

```
http://localhost:3001
Ctrl+C to stop
```
