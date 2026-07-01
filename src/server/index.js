import path from "path";
import fs from "fs";
import http from "http";

function pathMaker(filename) {
  const projectRoot = process.cwd();
  const devarchitectDir = path.join(projectRoot, ".devarchitect");
  const filePath = path.join(devarchitectDir, `${filename}`);
  return filePath;
}

function readJson(filename) {
  const projectRoot = process.cwd();
  const devarchitectDir = path.join(projectRoot, ".devarchitect");
  const filePath = path.join(devarchitectDir, `${filename}`);
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath);
    const parsedFileData = JSON.parse(fileData);
    return parsedFileData;
  } else {
    return null;
  }
}

const server = http.createServer((req, res) => {
  console.log(req.url);

  if (req.url == "/api/status" || req.url == "/api/status/") {
    try {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;

      const isVision = fs.existsSync(pathMaker("vision.json"));
      const isAnalyse = fs.existsSync(pathMaker("analyse.json"));
      const isStack = fs.existsSync(pathMaker("stack.json"));
      const isRoadmap = fs.existsSync(pathMaker("roadmap.json"));
      const isDecisions = fs.existsSync(pathMaker("decisions.json"));
      const isProgress = fs.existsSync(pathMaker("progress.json"));

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
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;

      const data = readJson("vision.json");

      res.end(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/analyse" || req.url == "/api/analyse/") {
    try {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;

      const data = readJson("analyse.json");

      res.end(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/stack" || req.url == "/api/stack/") {
    try {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;

      const data = readJson("stack.json");

      res.end(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/roadmap" || req.url == "/api/roadmap/") {
    try {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;

      const data = readJson("roadmap.json");

      res.end(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/decisions" || req.url == "/api/decisions/") {
    try {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;

      const data = readJson("decisions.json");

      res.end(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  } else if (req.url == "/api/progress" || req.url == "/api/progress/") {
    try {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;

      const data = readJson("progress.json");

      res.end(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(8000, () => {
  const { address, port } = server.address();
  console.log(`Server is listening on http://${address}:${port}`);
});
