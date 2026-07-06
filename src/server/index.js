import path from "path";
import fs from "fs";
import http from "http";
import chalk from "chalk";

function readJson(filename) {
  const projectRoot = process.cwd();
  const devarchitectDir = path.join(projectRoot, ".devarchitect");
  const filePath = path.join(devarchitectDir, `${filename}`);
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const parsedFileData = JSON.parse(fileData);
    return { filePath, parsedFileData };
  } else {
    return null;
  }
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.url == "/" || req.url == "") {
    try {
      res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      });
      const htmlPath = path.join(process.cwd(), "src", "public", "index.html");
      if (fs.existsSync(htmlPath)) {
        const htmlFileData = fs.readFileSync(htmlPath);
        res.end(htmlFileData);
      } else {
        res.end(JSON.stringify({ success: false, message: "html not found" }));
      }
    } catch (err) {
      console.log(err);
    }
  } else if (req.url.endsWith(".css") || req.url.endsWith(".js")) {
    const filePath = path.join(process.cwd(), "src", "public", req.url);
    if (fs.existsSync(filePath)) {
      const ext = req.url.endsWith(".css")
        ? "text/css"
        : "application/javascript";
      res.writeHead(200, { "Content-Type": ext });
      res.end(fs.readFileSync(filePath));
    } else {
      sendJson(res, 404, { success: false, message: "File not found" });
    }
  } else if (req.url == "/api/status" || req.url == "/api/status/") {
    try {
      const devarchitectDir = path.join(process.cwd(), ".devarchitect");

      const status = {
        "vision.json": fs.existsSync(path.join(devarchitectDir, "vision.json")),
        "analyse.json": fs.existsSync(
          path.join(devarchitectDir, "analyse.json"),
        ),
        "stack.json": fs.existsSync(path.join(devarchitectDir, "stack.json")),
        "roadmap.json": fs.existsSync(
          path.join(devarchitectDir, "roadmap.json"),
        ),
        "decisions.json": fs.existsSync(
          path.join(devarchitectDir, "decisions.json"),
        ),
        "progress.json": fs.existsSync(
          path.join(devarchitectDir, "progress.json"),
        ),
      };

      sendJson(res, 200, { success: true, data: status });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/vision" || req.url == "/api/vision/") {
    try {
      const result = readJson("vision.json");
      sendJson(res, 200, {
        success: result != null,
        data: result ? result.parsedFileData : null,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/analyse" || req.url == "/api/analyse/") {
    try {
      const result = readJson("analyse.json");
      sendJson(res, 200, {
        success: result != null,
        data: result ? result.parsedFileData : null,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/stack" || req.url == "/api/stack/") {
    try {
      const result = readJson("stack.json");
      sendJson(res, 200, {
        success: result != null,
        data: result ? result.parsedFileData : null,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/roadmap" || req.url == "/api/roadmap/") {
    try {
      const result = readJson("roadmap.json");
      sendJson(res, 200, {
        success: result != null,
        data: result ? result.parsedFileData : null,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/decisions" || req.url == "/api/decisions/") {
    try {
      const result = readJson("decisions.json");
      sendJson(res, 200, {
        success: result != null,
        data: result ? result.parsedFileData : null,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/progress" || req.url == "/api/progress/") {
    try {
      const result = readJson("progress.json");
      sendJson(res, 200, {
        success: result != null,
        data: result ? result.parsedFileData : null,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/export" || req.url == "/api/export/") {
    const visionResult = readJson("vision.json");
    if (!visionResult) {
      sendJson(res, 400, {
        success: false,
        message: "Run devarchitect init first",
      });
      return;
    }

    const dataVision = readJson("vision.json").parsedFileData;

    const dataAnalysis = readJson("analyse.json").parsedFileData;

    const dataStack = readJson("stack.json").parsedFileData;

    const dataRoadmap = readJson("roadmap.json").parsedFileData;
    const dataDecisions = readJson("decisions.json").parsedFileData;

    const dataProgress = readJson("progress.json").parsedFileData;

    let decisionCount = 0;

    // ${!==null?``:`Not yet defined`}

    const mdString = `# Project Report - ${dataVision.projectname}

Generated on ${new Date().toLocaleDateString()}

---

## Vision

- Problem: ${dataVision.problem}
- Target: ${dataVision.target}
- Platform: ${dataVision.platform}
- Team Size: ${dataVision.teamsize}

---

## Feasibility Analysis

${
  dataAnalysis !== null
    ? `- Technical Risks: ${dataAnalysis.techrisk}
- Project Timeline: ${dataAnalysis.timeline}
- Project Scale: ${dataAnalysis.scale}
- Project Budget: ${dataAnalysis.budget}`
    : `- Not yet defined`
}

---

## Tech Stack

${
  dataStack !== null
    ? `- Frontend: ${dataStack.frontend}
- Backend: ${dataStack.backend}
- Database: ${dataStack.database}
- Deployment: ${dataStack.deployment}
- Other Tools: ${dataStack.tools}`
    : `- Not yet defined`
}

---

## Roadmap

${
  dataRoadmap !== null
    ? `${dataRoadmap.phaseArray
        .map(
          ({ phase, name, milestones }) => `
### Phase: ${phase}
- Name: ${name}
- Milestones: [ ${milestones} ]
`,
        )
        .join("")}`
    : `- Not yet defined\n`
}
---

## Decisions Log

 ${
   dataDecisions !== null
     ? `${dataDecisions
         .map(
           ({ what, why, decidedAt }) => `
### Decision ${++decisionCount}
- Decision: ${what}
- Reason: ${why}
- Decided on: ${new Date(decidedAt).toLocaleString()}
`,
         )
         .join("")}`
     : `- Not yet defined\n`
 }
---

## Current Progress

${
  dataProgress !== null
    ? `- Current Phase: ${dataProgress[dataProgress.length - 1].currentPhase}
- All Phases: ${dataProgress[dataProgress.length - 1].allPhases}
- Completed Milestones: ${dataProgress[dataProgress.length - 1].completedMilestones}
- Blockers: ${dataProgress[dataProgress.length - 1].blockers}
- Completion: ${dataProgress[dataProgress.length - 1].completion} 
- Recorded At: ${new Date(dataProgress[dataProgress.length - 1].recordedAt).toLocaleString()}`
    : `- Not yet defined`
}

---

Generated by devarchitect `;

    res.writeHead(200, {
      "Content-Type": "text/markdown",
      "Content-Disposition": 'attachment;filename= "devarchitect-report.md"',
      "Access-Control-Allow-Origin": "*",
    });
    res.end(mdString);
  } else {
    sendJson(res, 404, {
      success: false,
      message: "Route not found",
    });
  }
});

server.listen(3001, () => {
  console.log(chalk.yellow(`Server is listening on http://localhost:3001`));
});
