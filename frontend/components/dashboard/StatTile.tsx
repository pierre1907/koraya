import Link from "next/link";
import { ReactNode } from "react";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  /** Couleur categorielle (slot fixe) associee a cette metrique, ex: "#2a78d6". */
  color: string;
  /** Page admin correspondante, ex: "/admin/users". */
  href: string;
}

export default function StatTile({ label, value, icon, color, href }: StatTileProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-gray-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-koraya-navy/20 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}26`, color }}
        >
          {icon}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <span className="flex items-center gap-0.5 text-xs font-medium text-gray-400 transition group-hover:text-koraya-navy">
          Voir
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
