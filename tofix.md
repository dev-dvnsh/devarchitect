# DevArchitect — Code Review & Fixes

> Generated: 2026-05-31
> Fix these before building `extract` and `serve`. Everything downstream depends on clean data.

---

## 1. progress.js

### Bug 1 — Missing parentheses on toISOString (CRITICAL)

You are saving the function reference, not the result. Every timestamp in progress.json is currently `undefined`.

```js
// ❌ Wrong
createdAt: new Date().toISOString,

// ✅ Fix
createdAt: new Date().toISOString(),
```

---

### Bug 2 — Overwrites instead of appending (CRITICAL)

`decision.js` does this right — reads existing array, pushes, writes back.
`progress.js` overwrites the whole file every run. You lose all history.

Replace the write block with this:

```js
const existing = fs.existsSync(progressPath)
  ? JSON.parse(fs.readFileSync(progressPath, "utf-8"))
  : [];

const progressArray = Array.isArray(existing) ? existing : [];
progressArray.push({
  ...answers,
  recordedAt: new Date().toISOString(),
});

fs.writeFileSync(progressPath, JSON.stringify(progressArray, null, 2), "utf-8");
```

Now every `progress` run appends an entry. Full history over time.

---

### Improvement — Milestone checkbox instead of free text input

Split the single `inquirer.prompt()` into two calls.
You need the `currentPhase` answer before you can build milestone choices.

**Call 1 — ask phase:**

```js
const { currentPhase } = await inquirer.prompt([
  {
    type: "list",
    name: "currentPhase",
    message: "Which phase are you currently in?",
    choices: phaseChoices,
  },
]);
```

**Call 2 — use phase to build milestone choices:**

```js
const selectedPhase = roadmapData.phaseArray.find(
  (p) => p.name === currentPhase,
);

const rest = await inquirer.prompt([
  {
    type: "checkbox",
    name: "completedMilestones",
    message: "Which milestones are complete?",
    choices: selectedPhase?.milestones ?? [],
  },
  {
    type: "input",
    name: "blockers",
    message: "Any blockers?",
  },
  {
    type: "list",
    name: "completion",
    message: "Overall completion percentage",
    choices: ["0%", "25%", "50%", "75%", "100%"],
  },
]);
```

Then combine before saving:

```js
const entry = {
  currentPhase,
  ...rest,
  recordedAt: new Date().toISOString(),
};
```

---

## 2. decision.js

### Improvement — Split alternatives string into array

Right now `alternatives` is saved as `"SQLite, MongoDB"` — a raw string.
Split it before saving so `extract` can format each alternative cleanly.

```js
decisionsArray.push({
  ...promptAns,
  alternatives: promptAns.alternatives.split(",").map((a) => a.trim()),
  decidedAt: new Date().toISOString(),
});
```

---

## 3. roadmap.js (fix before anything else)

### Milestones should be an array, not a string

Currently saved as:

```json
{
  "phase": "1",
  "name": "Cli",
  "milestones": "some"
}
```

Should be:

```json
{
  "phase": "1",
  "name": "Cli",
  "milestones": [
    "init",
    "stack",
    "roadmap",
    "decision",
    "progress",
    "extract",
    "serve"
  ]
}
```

In `roadmap.js`, change the milestones prompt to ask comma separated and split before saving:

```js
// prompt
{
  type: "input",
  name: "milestones",
  message: "Enter milestones for this phase (comma separated)",
}

// before pushing to phaseArray
milestones: answer.milestones.split(',').map(m => m.trim())
```

This is required for the `progress` checkbox to work. Fix this first.

---

## 4. What the fixed progress.json should look like

```json
[
  {
    "currentPhase": "Cli",
    "completedMilestones": ["init", "stack", "roadmap", "decision", "progress"],
    "blockers": "none",
    "completion": "25%",
    "recordedAt": "2026-05-31T10:00:00.000Z"
  },
  {
    "currentPhase": "Cli",
    "completedMilestones": [
      "init",
      "stack",
      "roadmap",
      "decision",
      "progress",
      "extract"
    ],
    "blockers": "serve command pending",
    "completion": "50%",
    "recordedAt": "2026-06-05T10:00:00.000Z"
  }
]
```

Array of entries. Every run appends. Full timeline of your own progress.

---

## Order of fixes

1. Fix `roadmap.js` milestones → array (everything depends on this)
2. Fix `progress.js` toISOString bug
3. Fix `progress.js` overwrite → append
4. Fix `progress.js` milestone prompt → two calls + checkbox
5. Fix `decision.js` alternatives → array

Do these before building `extract` or `serve`.
`extract` reads all these files and formats them — if the data shape is wrong, the report will be wrong.
