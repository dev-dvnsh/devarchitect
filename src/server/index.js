import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import http from "http";
import { generateReport } from "../lib/reportGenerator.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
      const htmlPath = path.join(__dirname, "..", "public", "index.html");
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
    const filePath = path.join(__dirname, "..", "public", req.url);
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
        "drift.json": fs.existsSync(path.join(devarchitectDir, "drift.json")),
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
  } else if (req.url == "/api/drift" || req.url == "/api/drift/") {
    try {
      const result = readJson("drift.json");
      sendJson(res, 200, {
        success: result != null,
        data: result ? result.parsedFileData : null,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/export" || req.url == "/api/export/") {
    const mdString = generateReport(process.cwd());
    if (!mdString) {
      sendJson(res, 400, {
        success: false,
        message: "Run devarchitect init first",
      });
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/markdown",
      "Content-Disposition": 'attachment;filename="devarchitect-report.md"',
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

server.listen(3001);
