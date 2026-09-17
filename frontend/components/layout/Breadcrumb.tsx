import Link from "next/link";
import { ReactNode } from "react";
import { HomeIcon } from "./icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const trail: BreadcrumbItem[] = [{ label: "Tableau de bord", href: "/dashboard", icon: HomeIcon }, ...items];

  return (
    <nav aria-label="Fil d'ariane" className="flex flex-wrap items-center gap-1.5 text-sm">
      {trail.map((item, index) => {
        const isLast = index === trail.length - 1;
        const content = (
          <span className={`flex items-center gap-1.5 ${isLast ? "font-medium text-gray-700" : "text-gray-400"}`}>
            {item.icon && <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{item.icon}</span>}
            {item.label}
          </span>
        );

        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <Chevron />}
            {item.href && !isLast ? (
              <Link href={item.href} className="transition hover:text-koraya-navy">
                {content}
              </Link>
            ) : (
              content
            )}
          </span>
        );
      })}
    </nav>
  );
}
