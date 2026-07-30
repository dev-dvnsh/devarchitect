export function getCategoryChoices(packageCategoryMap, categoryName) {
  const packages = new Set();

  for (const ecosystem in packageCategoryMap) {
    const ecosystemPackages = packageCategoryMap[ecosystem];

    for (const packageName in ecosystemPackages) {
      if (ecosystemPackages[packageName] === categoryName) {
        packages.add(packageName);
      }
    }
  }

  const sortedPackages = [...packages].sort((a, b) => a.localeCompare(b));

  return [
    {
      name: "Not decided yet",
      value: "__NOT_DECIDED__",
    },
    {
      name: "Enter manually",
      value: "__MANUAL__",
    },
    ...sortedPackages.map((packageName) => ({
      name: packageName,
      value: packageName,
    })),
  ];
}
export function hasCategory(packageCategoryMap, category) {
  for (const ecosystem in packageCategoryMap) {
    for (const packageName in packageCategoryMap[ecosystem]) {
      if (packageCategoryMap[ecosystem][packageName] === category) {
        return true;
      }
    }
  }

  return false;
}
