export function withoutNulls<T>(arr: (T | null)[]): T[] {
  return arr.filter((item): item is T => item != null);
}
