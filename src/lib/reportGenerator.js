function hasItems(section) {
  return Object.keys(section).length > 0;
}
function hasMiscItems(misc) {
  return misc && misc.length > 0;
}
export function reportGenerator(result) {
  const matchedCategories = Object.keys(result.matched || {}).length;

  const matchedPackages = Object.values(result.matched || {}).flat().length;

  const missingCategories = Object.keys(result.missing || {}).length;

  const missingPackages = Object.values(result.missing || {}).flat().length;

  const undeclaredCategories = Object.keys(result.undeclared || {}).length;

  const undeclaredPackages = Object.values(result.undeclared || {}).flat()
    .length;

  const miscPackages = (result.misc || []).length;
  let report = "";
  let status = "NO DRIFT";

  if (missingPackages > 0 || undeclaredPackages > 0) {
    status = "DRIFT DETECTED";
  } else if (miscPackages > 0) {
    status = "UNKNOWN PACKAGES FOUND";
  }
  report += "============================================================\n";
  report += "                     DEVARCHITECT REPORT\n";
  report += "============================================================\n\n";

  if (hasItems(result.matched)) {
    report += "MATCHED\n";
    report +=
      "------------------------------------------------------------\n\n";

    for (const category in result.matched) {
      report += `${category}\n`;

      for (const packageName of result.matched[category]) {
        report += `  - ${packageName}\n`;
      }
      function hasMiscItems(misc) {
        function hasMiscItems(misc) {
          return misc && misc.length > 0;
        }
        return misc && misc.length > 0;
      }
      let status = "NO DRIFT";

      if (missingPackages > 0 || undeclaredPackages > 0) {
        status = "DRIFT DETECTED";
      } else if (miscPackages > 0) {
        status = "UNKNOWN PACKAGES FOUND";
      }
      report += "\n";
    }
  }

  report += "------------------------------------------------------------\n\n";

  if (hasItems(result.missing)) {
    report += "MISSING\n";
    report +=
      "------------------------------------------------------------\n\n";

    for (const category in result.missing) {
      report += `${category}\n`;

      for (const packageName of result.missing[category]) {
        report += `  - ${packageName}\n`;
      }

      report += "\n";
    }
  }
  report += "------------------------------------------------------------\n\n";

  if (hasItems(result.undeclared)) {
    report += "UNDECLARED\n";
    report +=
      "------------------------------------------------------------\n\n";

    for (const category in result.undeclared) {
      report += `${category}\n`;

      for (const packageName of result.undeclared[category]) {
        report += `  - ${packageName}\n`;
      }

      report += "\n";
    }
  }
  if (hasMiscItems(result.misc)) {
    report += "MISC\n";
    report +=
      "------------------------------------------------------------\n\n";

    for (const packageName of result.misc) {
      report += `  - ${packageName}\n`;
    }

    report += "\n";
  }
  report += "------------------------------------------------------------\n\n";

  report += "SUMMARY\n";
  report += "------------------------------------------------------------\n\n";

  report += `Matched Categories      : ${matchedCategories}\n`;
  report += `Matched Packages        : ${matchedPackages}\n\n`;

  report += `Missing Categories      : ${missingCategories}\n`;
  report += `Missing Packages        : ${missingPackages}\n\n`;

  report += `Undeclared Categories   : ${undeclaredCategories}\n`;
  report += `Undeclared Packages     : ${undeclaredPackages}\n\n`;

  report += `Misc Packages          : ${miscPackages}\n\n`;

  report += `Overall Status          : ${status}\n\n`;

  report += "============================================================\n";

  return report;
}
