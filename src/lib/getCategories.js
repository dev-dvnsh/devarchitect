export function getCategories(packageCategoryMap) {
  const categories = new Set();

  for (const ecosystem in packageCategoryMap) {
    const packages = packageCategoryMap[ecosystem];

    for (const packageName in packages) {
      categories.add(packages[packageName]);
    }
  }

  return [...categories].sort((a, b) => a.localeCompare(b));
}
