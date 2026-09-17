import { useState } from "react";

export type SortDir = "asc" | "desc";

export function useSortableData<T, K extends string>(
  items: T[],
  accessors: Record<K, (item: T) => string | number>,
  defaultKey: K,
  defaultDir: SortDir = "asc",
) {
  const [sortKey, setSortKey] = useState<K>(defaultKey);
  const [sortDir, setSortDir] = useState<SortDir>(defaultDir);

  const accessor = accessors[sortKey];
  const sorted = [...items].sort((a, b) => {
    const va = accessor(a);
    const vb = accessor(b);
    const comparison =
      typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
    return sortDir === "asc" ? comparison : -comparison;
  });

  function toggleSort(key: K) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return { sorted, sortKey, sortDir, toggleSort };
}
