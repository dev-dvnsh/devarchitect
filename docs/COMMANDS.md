# Commands

- `devarchitect init` — Initializes devarchitect in the current project,
  asks structured questions about vision and problem, saves to `.devarchitect/vision.json`

- `devarchitect analyze` — Analyzes project requirements and produces a
  feasibility report, saved to `.devarchitect/analysis.json`

- `devarchitect stack` — Suggests a technology stack based on your project
  vision and constraints, saved to `.devarchitect/techstack.json`

- `devarchitect roadmap` — Generates a step-by-step execution plan with
  milestones, saved to `.devarchitect/roadmap.json`

- `devarchitect decision` — Records an important architecture or design
  decision with reasoning, appended to `.devarchitect/decisions.json`

- `devarchitect progress` — Updates current project state and tracks
  milestone completion, saved to `.devarchitect/progress.json`

- `devarchitect export` — Reads all `.devarchitect/` JSON files and
  generates a single human-readable markdown report for onboarding or sharing
