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
  if (req.url == "/api/status" || req.url == "/api/status/") {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;

      const isVision = fs.existsSync(readJson("vision.json").filePath);
      const isAnalyse = fs.existsSync(readJson("analyse.json").filePath);
      const isStack = fs.existsSync(readJson("stack.json").filePath);
      const isRoadmap = fs.existsSync(readJson("roadmap.json").filePath);
      const isDecisions = fs.existsSync(readJson("decisions.json").filePath);
      const isProgress = fs.existsSync(readJson("progress.json").filePath);

      const toSend = {
        "visioin.json": isVision,
        "analyse.json": isAnalyse,
        "stack.json": isStack,
        "roadmap.json": isRoadmap,
        "decisions.json": isDecisions,
        "progress.json": isProgress,
      };
      res.end(JSON.stringify(toSend));
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/vision" || req.url == "/api/vision/") {
    try {
      sendJson(res, 200, {
        success: true,
        data: readJson("vision.json").parsedFileData,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/analyse" || req.url == "/api/analyse/") {
    try {
      sendJson(res, 200, {
        success: true,
        data: readJson("analyse.json").parsedFileData,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/stack" || req.url == "/api/stack/") {
    try {
      sendJson(res, 200, {
        success: true,
        data: readJson("stack.json").parsedFileData,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/roadmap" || req.url == "/api/roadmap/") {
    try {
      sendJson(res, 200, {
        success: true,
        data: readJson("roadmap.json").parsedFileData,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/decisions" || req.url == "/api/decisions/") {
    try {
      sendJson(res, 200, {
        success: true,
        data: readJson("decisions.json").parsedFileData,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/progress" || req.url == "/api/progress/") {
    try {
      sendJson(res, 200, {
        success: true,
        data: readJson("progress.json").parsedFileData,
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

server.listen(8000, () => {
  const { address, port } = server.address();
  console.log(`Server is listening on http://${address}:${port}`);
});
