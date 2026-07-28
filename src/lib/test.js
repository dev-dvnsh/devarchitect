import { reportGenerator } from "./reportGenerator.js";

const comparison = {
  matched: {
    "backend-framework": ["express"],
    database: ["mongodb"],
  },
  missing: {
    testing: ["jest"],
  },
  undeclared: {
    testing: ["vitest"],
    logging: ["pino"],
  },
};

console.log(reportGenerator(comparison));
