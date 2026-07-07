# devarchitect

A CLI tool that helps developers plan, document, and track their projects — built as part of my MCA project work.

---

## Why I built this

I kept running into the same problem. I would start a project, make a bunch of decisions about the tech stack and architecture, write some code, then come back two weeks later and have no idea why I made those choices. Or I would share the project with someone and they would have to read through all the code just to understand what the project was even supposed to do.

Git tracks what changed in the code. But nobody tracks why. That gap is what devarchitect tries to fill.

The idea is simple — when you start a project you run a few CLI commands that ask you structured questions. Your answers get saved as JSON files in a `.devarchitect/` folder inside your project. Later you or anyone else can open the dashboard and immediately understand the project — what it is, what decisions were made, what the plan is, how far along it is.

---

## Installation

Clone the repo and link it globally:

```bash
git clone https://github.com/yourusername/devarchitect
cd devarchitect
npm install
npm link
```

After `npm link` you can run `devarchitect` from anywhere in your terminal.

---

## Basic usage

The commands are meant to be run in order when starting a new project:

```bash
devarchitect init        # set up the project vision
devarchitect analyse     # think through feasibility
devarchitect stack       # lock in your tech choices
devarchitect roadmap     # plan the phases
devarchitect decision    # record important decisions as you go
devarchitect progress    # update where things stand
devarchitect status      # quick health check
devarchitect export      # generate a markdown report
devarchitect dashboard   # open everything in the browser
```

You don't have to use every command. At minimum `init` and `export` give you something useful. The rest add more detail.

---

## What gets stored

Everything is saved as JSON files in `.devarchitect/` inside your project:

```
.devarchitect/
├── vision.json
├── analyse.json
├── stack.json
├── roadmap.json
├── decisions.json
├── progress.json
└── backup/
```

I chose JSON files instead of a database because it keeps things simple, human-readable, and portable. You can open any of these files in a text editor and understand them immediately. The backup folder holds timestamped copies before any file gets overwritten so you never lose old data.

---

## Dashboard

Run `devarchitect dashboard` and it opens a browser UI that shows all your project data in one place. Built with vanilla HTML, CSS, and JavaScript — no React, no build step, no extra dependencies.

```bash
devarchitect dashboard
# opens http://localhost:3001
# Ctrl+C to stop
```

---

## Project Structure

```
devarchitect/
├── src/
│   ├── index.js              — CLI entry point
│   ├── utils.js              — shared utility functions
│   ├── commands/             — one file per CLI command
│   │   ├── init.js
│   │   ├── analyse.js
│   │   ├── stack.js
│   │   ├── roadmap.js
│   │   ├── decision.js
│   │   ├── progress.js
│   │   ├── export.js
│   │   ├── status.js
│   │   └── dashboard.js
│   ├── server/
│   │   └── index.js          — local HTTP server
│   └── public/
│       ├── index.html
│       ├── style.css
│       └── app.js
├── docs/
│   ├── README.md
│   ├── COMMANDS.md
│   └── ARCHITECTURE.md
└── package.json
```

---

## Tech used

- Node.js for the CLI and the local server
- Commander.js for parsing commands
- Inquirer.js for the terminal prompts
- Chalk for coloring the terminal output
- Node's built-in `http` module for the server — no Express
- Vanilla HTML, CSS, and JS for the dashboard

---

## What's next

This is version 0.1. The plan for the final year project is to add AI integration so the tool can suggest architecture and stack choices instead of just storing what you manually enter. There is also a planned `devarchitect check` command that reads your actual codebase and compares it against your logged decisions to catch when reality has drifted from the original plan — kind of like a linter but for architecture decisions.

After college the goal is to rewrite the core in Go and release it as a standalone binary called `arc`.
