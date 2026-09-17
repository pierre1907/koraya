import { SortDir } from "@/lib/hooks/useSortableData";

interface SortableHeaderProps<K extends string> {
  label: string;
  sortKeyValue: K;
  activeKey: K;
  dir: SortDir;
  onSort: (key: K) => void;
  align?: "left" | "right";
}

export default function SortableHeader<K extends string>({
  label,
  sortKeyValue,
  activeKey,
  dir,
  onSort,
  align = "left",
}: SortableHeaderProps<K>) {
  const active = activeKey === sortKeyValue;

  return (
    <th className="px-6 py-3 font-medium">
      <button
        type="button"
        onClick={() => onSort(sortKeyValue)}
        className={`flex items-center gap-1 transition hover:text-koraya-navy ${active ? "text-koraya-navy" : ""} ${
          align === "right" ? "ml-auto" : ""
        }`}
      >
        {label}
        <span className="text-[10px]">{active ? (dir === "asc" ? "▲" : "▼") : ""}</span>
      </button>
    </th>
  );
}
