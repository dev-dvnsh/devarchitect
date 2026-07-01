import path from "path";
import fs from "fs";
import http from "http";

function readJson(filename) {
  const projectRoot = process.cwd();
  const devarchitectDir = path.join(projectRoot, ".devarchitect");
  const filePath = path.join(devarchitectDir, `${filename}`);
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath);
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
        res.end({ success: false, message: "html not found" });
      }
    } catch (err) {
      console.log(err);
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
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(
      JSON.stringify({
        success: false,
        message: "Route not found",
      }),
    );
  }
});

server.listen(3001, () => {
  const { address, port } = server.address();
  console.log(`Server is listening on http://${address}:${port}`);
});
