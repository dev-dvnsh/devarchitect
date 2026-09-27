# devarchitect

A CLI tool that helps developers plan, document, and track their projects — built as part of my MCA project work.

---

## Why I built this

I kept running into the same problem. I would start a project, make a bunch of decisions about the tech stack and architecture, write some code, then come back two weeks later and have no idea why I made those choices. Or I would share the project with someone and they would have to read through all the code just to understand what the project was even supposed to do.

Git tracks what changed in the code. But nobody tracks why. And even when you do write down a plan at the start, the actual code usually drifts away from that plan as you install new packages and change your mind. That gap is what devarchitect tries to fill.

The idea is simple — when you start a project you run a few CLI commands that ask you structured questions. Your answers get saved as JSON files in a `.devarchitect/` folder inside your project. As you build, the tool checks your actual project files against what you planned, helps you search through past decisions, and gives you a local browser dashboard so you or anyone else can immediately understand the project.

---

## Installation

You can install it globally straight from npm:

```bash
npm install -g devarchitect
```

Or if you want to run it from source, clone the repo and link it locally:

```bash
git clone [https://github.com/dev-dvnsh/devarchitect](https://github.com/dev-dvnsh/devarchitect)
cd devarchitect
npm install
npm link
```

After installing or linking, you can run `devarchitect` from anywhere in your terminal.

---

## Basic usage

The core commands are meant to be run when starting and building a project:

```bash
devarchitect init                # set up the project vision (use --from-git for existing repos)
devarchitect analyse             # think through feasibility
devarchitect stack               # lock in your tech choices
devarchitect roadmap             # plan the phases
devarchitect decision            # record important decisions as you go
devarchitect progress            # update where things stand
devarchitect status              # quick health check of your documentation
devarchitect export              # generate a markdown report (devarchitect-report.md)
devarchitect dashboard           # open everything in the browser
```

Once your project is underway, you can use the analysis and search commands:

```bash
devarchitect drift               # compare your actual codebase against stack.json
devarchitect view <section>      # view saved data (vision, stack, drift, decisions, etc.)
devarchitect why <keyword>       # search past decisions by keyword or auto-inferred category
devarchitect similar-decisions   # find conceptually related decisions using TF-IDF
devarchitect install-hooks       # add a git pre-commit hook to check for drift automatically
```

You don't have to use every command. At minimum `init`, `stack`, and `drift` give you something useful right away. The rest add more detail as the project grows.

---

## Key features

### Architectural Drift Detection

When you run `devarchitect drift`, the tool scans your project's actual manifest files (like `package.json` or `requirements.txt`), detects the packages you are using, and compares them against what you originally declared in `stack.json`. It flags what matches, what is missing, and what was installed without being declared.

If you run `devarchitect install-hooks`, it sets up a `.git/hooks/pre-commit` script that runs this drift check automatically before every commit (without blocking the commit) so you get a warning the exact moment you commit new dependencies.

### Decision Search & Similarity

When you log a decision with `devarchitect decision`, the tool silently scans your text against a built-in package and technology map to infer the category (like `database`, `testing`, or `authentication`) without asking you an extra question.

- **`devarchitect why <keyword>`** lets you filter your decision history by keyword or category so you don't have to read `decisions.json` manually.
- **`devarchitect similar-decisions`** uses TF-IDF (Term Frequency–Inverse Document Frequency) and cosine similarity — implemented from scratch in plain JavaScript — to find pairs of decisions that are conceptually related even if they don't share the exact same keywords.

---

## What gets stored

Everything is saved as JSON files in `.devarchitect/` inside your project:

```text
.devarchitect/
├── vision.json
├── analyse.json
├── stack.json
├── roadmap.json
├── decisions.json
├── progress.json
├── drift.json
└── backup/
```

I chose JSON files instead of a database because it keeps things simple, human-readable, and portable. You can commit the `.devarchitect` folder to Git, open any of these files in a text editor, and understand them immediately. The `backup/` folder holds timestamped copies before any file gets overwritten so you never lose old data.

---

## Dashboard

Run `devarchitect dashboard` and it opens a local browser UI that shows all your project data, status indicators, and drift reports in one place. You can also download the full markdown export directly from the UI. Built with vanilla HTML, CSS, and JavaScript — no React, no build step, no extra dependencies.

```bash
devarchitect dashboard
# opens http://localhost:3001
# Ctrl+C to stop
```

---

## Project Structure

```text
devarchitect/
├── src/
│   ├── index.js                      — CLI entry point
│   ├── utils.js                      — shared utility functions
│   ├── commands/                     — one file per CLI command
│   │   ├── init.js
│   │   ├── analyse.js
│   │   ├── stack.js
│   │   ├── roadmap.js
│   │   ├── decision.js
│   │   ├── why.js
│   │   ├── similar-decisions.js
│   │   ├── drift.js
│   │   ├── install-hooks.js
│   │   ├── progress.js
│   │   ├── export.js
│   │   ├── status.js
│   │   ├── view.js
│   │   └── dashboard.js
│   ├── lib/                          — core logic for detection, comparison, and math
│   │   ├── detectStack.js
│   │   ├── compareStack.js
│   │   ├── extractPackages.js
│   │   ├── inferCategory.js
│   │   ├── similarity.js
│   │   ├── packageCategoryMap.json
│   │   └── ecosystemManifestMap.json
│   ├── server/
│   │   └── index.js                  — local HTTP server
│   └── public/
│       ├── index.html
│       ├── style.css
│       └── app.js
├── docs/
│   ├── COMMANDS.md
│   └── ARCHITECTURE.md
└── package.json
```

---

## Tech used

- **Node.js** for the CLI, file system operations, and local server
- **Commander.js** for parsing CLI commands and flags
- **Inquirer.js** for interactive terminal prompts
- **Chalk** for color-coded terminal output
- **Node's built-in `http` module** for the dashboard server — no Express
- **Vanilla HTML, CSS, and JS** for the dashboard frontend
- **Custom TF-IDF & Cosine Similarity** written in plain JS — no external NLP libraries

---

## What's next

The next major step for v2.0 is wiring up the **AI Suggestions** panel in the dashboard so `devarchitect` can actively critique your architecture, suggest stack alternatives, and point out risks based on your logged vision and feasibility analysis.
