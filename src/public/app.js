const BASE_URL = "http://localhost:3001";
async function fetchData(section) {
  try {
    const res = await fetch(`${BASE_URL}/api/${section}`);
    const json = await res.json();
    return json;
  } catch (err) {
    return null;
  }
}

function showLoading() {
  const elem = document.getElementById("data-panel");
  elem.innerHTML = "Loading...";
}
function showExport() {
  const elem = document.getElementById("data-panel");
  elem.innerHTML = "Devarchitect Report Downloaded";
}

function showEmpty(section) {
  const elem = document.getElementById("data-panel");
  const commandObj = {
    vision: "init",
    analyse: "analyse",
    stack: "stack",
    roadmap: "roadmap",
    decisions: "decisions",
    progress: "progress",
    // export: "export",
  };
  elem.innerHTML = `<p>No data found</p><br/><code>run devarchitect ${commandObj[section]}</code>`;
}

function renderVision(data) {
  const elem = document.getElementById("data-panel");
  document.getElementById("project-name").textContent = data.projectname;
  elem.innerHTML = `
  <div class="field"><span class="label">Project Name</span><span>${data.projectname}</span></div>
  <div class="field"><span class="label">Problem</span><span>${data.problem}</span></div>
  <div class="field"><span class="label">Target</span><span>${data.target}</span></div>
  <div class="field"><span class="label">Platform</span><span>${data.platform}</span></div>
  <div class="field"><span class="label">Team Size</span><span>${data.teamsize}</span></div>
  <div class="field"><span class="label">Created At</span><span>${new Date(data.createdat).toLocaleString()}</span></div>
`;
  renderAIPanel();
}

function renderAnalyse(data) {
  const elem = document.getElementById("data-panel");
  elem.innerHTML = `
  <div class="field"><span class="label">Tech Risk</span><span>${data.techrisk}</span></div>
  <div class="field"><span class="label">Timeline</span><span>${data.timeline}</span></div>
  <div class="field"><span class="label">Scale</span><span>${data.scale}</span></div>
  <div class="field"><span class="label">Budget</span><span>${data.budget}</span></div>
  <div class="field"><span class="label">Created At</span><span>${new Date(data.createdat).toLocaleString()}</span></div>
`;
  renderAIPanel();
}
function renderStack(data) {
  const elem = document.getElementById("data-panel");
  elem.innerHTML = `
  <div class="field"><span class="label">Frontend</span><span>${data.frontend}</span></div>
  <div class="field"><span class="label">Backend</span><span>${data.backend}</span></div>
  <div class="field"><span class="label">Database</span><span>${data.database}</span></div>
  <div class="field"><span class="label">Deployment</span><span>${data.deployment}</span></div>
  <div class="field"><span class="label">Tools</span><span>${data.tools}</span></div>
  <div class="field"><span class="label">Created At</span><span>${new Date(data.createdAt).toLocaleString()}</span></div>
`;
  renderAIPanel();
}

function renderRoadmap(data) {
  const elem = document.getElementById("data-panel");
  elem.innerHTML =
    data.phaseArray
      .map(
        (phase) => `
<div class="field">
<span class ="label">Phase ${phase.phase}</span>
<span>${phase.name}</span>
</div>
<div class="field">
<span class="label">Milestones</span>
<span>${phase.milestones.join(", ")}</span>
</div>
`,
      )
      .join("") +
    `
  <div class="field"><span class="label">Created At</span><span>${new Date(data.createdAt).toLocaleString()}</span></div>
`;
  renderAIPanel();
}

function renderDecisions(data) {
  const elem = document.getElementById("data-panel");
  const revedData = data.slice().reverse();
  elem.innerHTML = revedData
    .map(
      (decision) => `

  <div class="field"><span class="label">What</span><span>${decision.what}</span></div>
  <div class="field"><span class="label">Why</span><span>${decision.why}</span></div>
  <div class="field"><span class="label">Alternatives</span><span>${decision.alternatives}</span></div>
  <div class="field"><span class="label">Decided At</span><span>${new Date(decision.decidedAt).toLocaleString()}</span></div>
`,
    )
    .join("");
  renderAIPanel();
}

function renderProgress(data) {
  const elem = document.getElementById("data-panel");
  elem.innerHTML = `

  <div class="field"><span class="label">Current Phase</span><span>${data[data.length - 1].currentPhase}</span></div>
  <div class="field"><span class="label">Completed Milestones</span><span>${data[data.length - 1].completedMilestones.join(", ")}</span></div>
  <div class="field"><span class="label">Blockers</span><span>${data[data.length - 1].blockers}</span></div>
  <div class="field"><span class="label">Completion</span><span>${data[data.length - 1].completion}</span></div>
  <div class="field"><span class="label">Recorded At</span><span>${new Date(data[data.length - 1].recordedAt).toLocaleString()}</span></div>
`;
  renderAIPanel();
}

function renderAIPanel() {
  const elem = document.getElementById("ai-panel");
  elem.innerHTML = `
    <h3>AI Suggestions</h3>
    <p>AI integration available in the next version</p>
    <button disabled title="Coming in devarchitect v2.0">Ask AI</button>
  `;
}

async function loadSection(section) {
  if (section === "export") {
    window.location.href = BASE_URL + "/api/export";
    showExport();
    return;
  }
  showLoading();
  const result = await fetchData(section);

  const commandObj = {
    vision: renderVision,
    analyse: renderAnalyse,
    stack: renderStack,
    roadmap: renderRoadmap,
    decisions: renderDecisions,
    progress: renderProgress,
    // export: renderExport,
  };
  if (result.success) {
    return commandObj[section](result.data);
  } else {
    showEmpty(section);
  }
}

const asideElem = document.querySelector("aside");
asideElem.addEventListener("click", (event) => {
  const clickedButton = event.target.closest("button");

  if (!clickedButton) {
    return;
  }

  const allButtons = asideElem.querySelectorAll("button");
  allButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
  clickedButton.classList.add("active");

  const targetSection = clickedButton.dataset.section;
  loadSection(targetSection);
});

async function updateStatusDots() {
  // 1. Call fetchData with the string "status" and await the result
  const result = await fetchData("status");

  // 2. Early return if result is null, or if success is missing/false
  if (!result || !result.success) {
    return;
  }
  const allButtons = document.querySelectorAll("aside button");

  allButtons.forEach((button) => {
    // Get the data-section value from the button
    const sectionName = button.dataset.section;

    // Find the dot span child inside this specific button
    const dotSpan = button.querySelector(".dot");

    // Safety check: ensure the button actually has a dot span and a section value
    if (dotSpan && sectionName) {
      fileExists = false;
      if (sectionName == "export") {
        fileExists = "vision.json" in result.data;
      } else {
        fileExists = `${sectionName}.json` in result.data;
      }
      // Check if the section key exists in the result.data object

      if (fileExists) {
        // If file exists, ensure it has the success class
        dotSpan.classList.add("success");
      } else {
        // If file doesn't exist, strip the success class
        dotSpan.classList.remove("success");
      }
    }
  });
}

updateStatusDots();
loadSection("vision");
