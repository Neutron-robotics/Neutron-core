export function hasDuplicates<T>(array: T[], key: keyof T): boolean {
  const valueSet = new Set<T[keyof T]>();

  for (const item of array) {
    const value = item[key];
    if (valueSet.has(value)) {
      return true;
    }
    valueSet.add(value);
  }

  return false;
}
