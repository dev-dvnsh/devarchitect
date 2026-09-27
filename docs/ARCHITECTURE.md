# Architecture

This document explains how `devarchitect` is structured internally, how data flows between commands, and how the core analysis modules work under the hood.

---

## Design Philosophy

1. **Local-first, human-readable storage:** Everything lives inside `.devarchitect/` in the project root as plain JSON files. There is no external database or cloud account required. Because the data is just JSON, it can be committed to Git alongside the code so the project's architectural context travels with the repository.
2. **Minimal dependencies:** The CLI uses `commander`, `inquirer`, and `chalk` for terminal interaction, while the dashboard server, frontend UI, stack detector, and similarity algorithms are written from scratch using Node.js built-ins (`fs`, `path`, `http`, `child_process`) and vanilla JavaScript.
3. **Non-destructive updates:** Whenever a command overwrites an existing state file (like `stack.json` or `decisions.json`), the tool creates a timestamped `.bak` copy inside `.devarchitect/backup/` first so previous work is never lost.

---

## High-Level Structure

The codebase is split into four layers inside `src/`:

```text
src/
├── index.js          — CLI entry point & Commander registration
├── utils.js          — Prerequisite checks (checkPrereq) & backup helpers
├── commands/         — User-facing CLI commands (1 file per command)
├── lib/              — Pure logic modules & static knowledge maps
├── server/           — Local Node.js HTTP server (port 3001)
└── public/           — Vanilla HTML, CSS, and JS dashboard frontend
```

- **`src/commands/`** handles user interaction: reading terminal arguments, running `inquirer` prompts, reading/writing JSON files, and printing formatted `chalk` output.
- **`src/lib/`** contains the core logic and data dictionaries separated from terminal I/O so each piece stays modular and testable.
- **`src/server/` & `src/public/`** power the browser dashboard without requiring a frontend build step or Express.

---

## Data Storage Layer (`.devarchitect/`)

Running `devarchitect` commands generates and reads seven JSON files inside the target project's `.devarchitect/` folder:

| File             | Created By | Structure             | Purpose                                                                                                                |
| :--------------- | :--------- | :-------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `vision.json`    | `init`     | Single Object         | Stores project name, problem, target audience, platform, team size, and creation timestamp.                            |
| `analyse.json`   | `analyse`  | Single Object         | Stores technical risks, timeline, expected scale, and budget.                                                          |
| `stack.json`     | `stack`    | Single Object         | Stores declared technology choices across categories (`frontend`, `backend`, `database`, `deployment`, `tools`).       |
| `roadmap.json`   | `roadmap`  | Object (`phaseArray`) | Stores ordered project phases and their milestone arrays.                                                              |
| `decisions.json` | `decision` | Array of Objects      | Append-only log of architectural decisions (`what`, `why`, `alternatives`, `category`, `decidedAt`).                   |
| `progress.json`  | `progress` | Array of Objects      | Append-only log of progress snapshots (`currentPhase`, `completedMilestones`, `blockers`, `completion`, `recordedAt`). |
| `drift.json`     | `drift`    | Single Object         | Stores the latest drift comparison (`matched`, `missing`, `undeclared`, `issues`, `checkedAt`).                        |

### Prerequisite Enforcement

Commands that depend on earlier planning steps call `checkPrereq(filename, commandName)` from `src/utils.js`. For example, `analyse` checks for `vision.json`, and `roadmap` checks for `vision.json`, `analyse.json`, and `stack.json`. If a required file is missing, the CLI stops early and tells the developer which command to run first.

---

## Core Engine (`src/lib/`)

### 1. Knowledge Maps (`packageCategoryMap.json` & `ecosystemManifestMap.json`)

To compare what a developer planned against what is actually in their codebase, `devarchitect` uses two static JSON dictionaries:

- **`ecosystemManifestMap.json`** maps project manifest files (such as `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`) to their respective language ecosystems.
- **`packageCategoryMap.json`** maps real-world package names across ecosystems (Node, Python, Go, Rust) to normalized architectural categories (`backend-framework`, `frontend-framework`, `database`, `orm`, `testing`, `authentication`, `deployment`, etc.).

### 2. Stack Detection & Drift Analysis (`detectStack.js` & `compareStack.js`)

When `devarchitect drift` runs, it executes a three-step pipeline:

1. **Extract & Detect (`extractPackages.js`, `detectStack.js`):** Scans `process.cwd()` for recognized manifest files, extracts declared dependencies (e.g., `dependencies` and `devDependencies` from `package.json` or lines from `requirements.txt`), and maps each package to its category using `packageCategoryMap.json`.
2. **Compare (`compareStack.js`, `normalizeStackValue.js`, `resolvePackageName.js`):** Compares the developer's declared stack in `stack.json` against the detected packages in the codebase and groups findings into three buckets:
   - **`matched`**: Declared technologies that are present in the project's dependencies.
   - **`missing`**: Technologies declared in `stack.json` that were not found in the manifest files.
   - **`undeclared`**: Packages installed in the project that were not declared in `stack.json`.
3. **Persist & Report (`drift.js`):** Prints a color-coded terminal breakdown and saves the structured output to `.devarchitect/drift.json` so `status`, `export`, and `dashboard` can read it.

### 3. Silent Category Inference (`inferCategory.js`)

When a developer records a new decision using `devarchitect decision`, the tool does not ask them to manually pick a category. Instead, `inferCategory.js` scans the combined text of their answers (`what`, `why`, `alternatives`) against known package names and category keywords in `packageCategoryMap.json`.

- If a match is found (e.g., mentioning `mongodb` or `postgres`), `"category": "database"` is automatically attached to the decision object.
- If no match is found, the `category` key is omitted cleanly.
- `devarchitect why <keyword>` then searches across both the raw text fields and this inferred `category` field to filter decisions.

### 4. Conceptual Similarity via TF-IDF (`similarity.js`)

`devarchitect similar-decisions` finds decisions that are conceptually related even when they do not share exact keywords, using an information retrieval pipeline built from scratch:

1. **Tokenization (`tokenize`):** Converts each decision's combined text (`what` + `why` + `alternatives`) to lowercase, strips punctuation, removes single-character tokens, and filters out common English stopwords.
2. **Vocabulary Construction (`buildVocabulary`):** Collects all unique tokens across every recorded decision into a sorted master vocabulary array.
3. **TF-IDF Vectorization (`computeTFIDF`):** Converts each decision into a numerical vector matching the vocabulary length:
   - **Term Frequency (TF):** How frequently a word appears in a single decision divided by the total words in that decision.
   - **Inverse Document Frequency (IDF):** $\log(\text{Total Decisions} / \text{Decisions Containing the Word})$, which penalizes generic words that appear in almost every decision and boosts distinctive words.
4. **Cosine Similarity (`cosineSimilarity`):** Computes the dot product of every pair of decision vectors divided by the product of their magnitudes. Pairs scoring above the `0.15` similarity threshold are printed as a percentage match.

---

## Git Pre-Commit Hook (`install-hooks.js`)

Running `devarchitect install-hooks` checks for a `.git/` directory in the current project and writes a shell script to `.git/hooks/pre-commit` with executable permissions (`0o755`).

```sh
#!/bin/sh
# Automatically generated by devarchitect
echo "Running devarchitect drift check..."
devarchitect drift
exit 0
```

The script intentionally ends with `exit 0` so that architectural drift is surfaced right before a commit happens without blocking the developer from committing their work.

---

## Local Server & Dashboard (`src/server/` & `src/public/`)

Running `devarchitect dashboard` launches a lightweight HTTP server (`src/server/index.js`) on `http://localhost:3001` and opens the browser using the `open` package.

### API Endpoints

The server reads directly from `process.cwd() + '/.devarchitect/'` on each request so the UI always reflects the latest files:

- `GET /` and static assets (`.css`, `.js`) — Serves `index.html`, `style.css`, and `app.js` from `src/public/`.
- `GET /api/status` — Returns a boolean map of which `.json` files currently exist in `.devarchitect/`, used by `app.js` to light up the green status dots in the sidebar.
- `GET /api/vision`, `/api/analyse`, `/api/stack`, `/api/roadmap`, `/api/decisions`, `/api/progress`, `/api/drift` — Reads and returns the corresponding JSON file (or `success: false` if the command hasn't been run yet).
- `GET /api/export` — Compiles all existing JSON files into `devarchitect-report.md` on the fly and triggers a browser file download using the `Content-Disposition: attachment` header.
