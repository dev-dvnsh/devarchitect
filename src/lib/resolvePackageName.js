import { normalizeStackValue } from "./normalizeStackValue.js";

export function resolvePackageName(value, category, categoryMap) {
  const normalizedValue = normalizeStackValue(value);

  for (const ecosystem in categoryMap) {
    const packages = categoryMap[ecosystem];

    for (const packageName in packages) {
      const packageCategory = packages[packageName];

      if (packageCategory !== category) {
        continue;
      }

      const normalizedPackage = normalizeStackValue(packageName);

      if (
        normalizedValue === normalizedPackage ||
        normalizedValue === `${normalizedPackage}.js`
      ) {
        return normalizedPackage;
      }
    }
  }

  return normalizedValue;
}
