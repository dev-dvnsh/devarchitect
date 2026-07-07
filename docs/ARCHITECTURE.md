# Architecture

Notes on how devarchitect is built internally. Mostly written so I remember why I made certain decisions, and so anyone reading the code has some context before diving in.

---

## The basic idea

There are three separate pieces:

```
CLI → writes JSON files → Server reads them → Dashboard displays them
```

They are independent. The CLI works without the server. The server works without the dashboard being open. The dashboard is just a visual layer on top of what the CLI already does.

---

## CLI

**Entry point: `src/index.js`**

Uses Commander.js to register commands and map them to handler functions in `src/commands/`. The shebang line at the top (`#!/usr/bin/env node`) is what makes it run as a terminal command. The `bin` field in `package.json` tells npm what name to use when linking it globally.

**Commands: `src/commands/`**

One file per command. They all follow the same pattern:

1. Check prerequisites — exit if required files are missing
2. Ask questions — Inquirer.js prompts
3. Build the data object — spread the answers and add a timestamp
4. Write to JSON — fs.writeFileSync
5. Print confirmation — chalk colored output

**Shared utilities: `src/utils.js`**

Two functions used by multiple commands:

`checkPrereq(filename, commandName)` — checks if a file exists before the command runs. If not, prints an error and exits. Avoids repeating this logic in every command file.

`backupIfExists(filePath, command)` — before any file gets overwritten, this copies it to `.devarchitect/backup/[command]/` with a timestamp in the filename. Simple versioning — nothing fancy but it means you can never accidentally destroy data.

**Why JSON files and not a database**

I considered SQLite but it felt like overkill for what this tool needs to do. JSON files are human-readable, require no setup, work everywhere, and can be opened in any text editor. The tradeoff is that they are not great for concurrent writes — but devarchitect is a single-user CLI tool so that is not a real concern here.

`decisions.json` and `progress.json` are arrays that grow over time. Every other file is an object that gets replaced on each run (with a backup made first).

---

## Server

**File: `src/server/index.js`**

I used Node's built-in `http` module instead of Express. For eight endpoints that just read JSON files and send them back, Express felt unnecessary. It also means zero extra dependencies for the server.

Two helper functions do most of the work:

`readJson(filename)` — builds the path to `.devarchitect/filename`, checks if it exists, reads it, parses it, and returns the parsed data. Returns null if the file does not exist. Every data endpoint calls this.

`sendJson(res, statusCode, data)` — sets the Content-Type and CORS headers and sends the response. All endpoints use this instead of writing headers manually each time.

Every response follows the same shape:

```json
{ "success": true, "data": { ... } }
{ "success": false, "data": null }
```

This makes the dashboard JS simple — it always checks `result.success` before trying to use `result.data`.

The server also serves static files (HTML, CSS, JS) from `src/public/` so the dashboard does not need a separate dev server.

**Routes:**

```
GET /              — serves index.html
GET *.css / *.js   — serves static files from src/public/
GET /api/status    — returns which JSON files exist
GET /api/vision    — vision.json
GET /api/analyse   — analyse.json
GET /api/stack     — stack.json
GET /api/roadmap   — roadmap.json
GET /api/decisions — decisions.json
GET /api/progress  — progress.json
GET /api/export    — builds and downloads the markdown report
```

---

## Dashboard

**Files: `src/public/`**

Vanilla HTML, CSS, and JavaScript. No React, no build step, no Vite, no npm install. The whole dashboard is three files that load directly in the browser.

I chose vanilla JS because the dashboard is simple enough that a framework would add more complexity than it removes. There are six sections, each with a fetch call and a render function. That does not need React.

**Layout**

CSS Grid with a fixed 240px sidebar on the left and a content area on the right. The content area has two panels stacked vertically — one for project data, one reserved for AI suggestions in the next version.

**How the JS works**

On page load:

- Fetches `/api/status` and updates the colored dots next to each sidebar button
- Loads the Vision section automatically so the dashboard is never empty

When a button is clicked:

- Event delegation on the aside element handles all button clicks with one listener
- `loadSection(section)` fetches the data and calls the right render function
- Each render function builds an HTML string and sets it as innerHTML of `#data-panel`

The AI panel is currently a placeholder with a disabled Ask AI button. The space is reserved for v0.2.0.

---

## Decisions I made and why

**No Express** — the http module is enough for this use case and keeps the dependency list short.

**No React** — the dashboard is simple enough for vanilla JS. Adding React would mean adding a build step, which means more complexity for something that does not need it.

**JSON files instead of a database** — simpler, portable, human-readable. Works on any machine with no setup.

**Append instead of overwrite for decisions and progress** — these are logs, not settings. Overwriting them would destroy history which defeats the purpose of tracking them.

**Backup before overwrite for everything else** — data loss is annoying. A simple timestamped backup costs almost nothing and prevents a lot of frustration.

---

## Planned for v0.2.0

**AI integration**

After saving data, each command will optionally call an AI API to generate suggestions. The Ask AI button in the dashboard will send the current section data to the API and display the response. Users will provide their own API key via `devarchitect config --apikey` so there is no central server or cost involved.

**devarchitect check**

The most interesting planned feature. It will read `.devarchitect/decisions.json` and compare it against the actual codebase — package.json dependencies, import statements, folder structure, git history — and flag contradictions. For example if you logged a decision saying "no database, JSON files only" but your package.json has a postgres dependency, it will catch that. Nothing like this exists for local codebases right now.

**arc**

After the college submission the CLI core will be rewritten in Go and distributed as a single binary called `arc`. No Node.js required, faster startup, easier to install. Same concept, different runtime.
