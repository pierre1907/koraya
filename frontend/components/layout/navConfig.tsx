import { ReactNode } from "react";

export type NavRole = "ADMIN" | "MANAGER" | "AGENT" | "USER";

export interface NavItem {
  label: string;
  href?: string;
  icon: ReactNode;
  /** Roles autorises a voir cet item. Omis = visible par tous les roles authentifies. */
  roles?: NavRole[];
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

function Icon(paths: ReactNode) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        label: "Tableau de bord",
        href: "/dashboard",
        icon: Icon(
          <>
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
          </>,
        ),
      },
    ],
  },
  {
    label: "Parc informatique",
    items: [
      {
        label: "Actifs",
        icon: Icon(
          <>
            <path d="M21 8 12 3 3 8l9 5 9-5Z" />
            <path d="M3 8v8l9 5 9-5V8" />
            <path d="M12 13v8" />
          </>,
        ),
      },
      {
        label: "Categories",
        icon: Icon(
          <>
            <path d="M20.5 12.5 12.5 20.5a2 2 0 0 1-2.83 0l-6.17-6.17a2 2 0 0 1 0-2.83L11.5 3.5H20.5v9Z" />
            <circle cx="16" cy="8" r="1.5" />
          </>,
        ),
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Utilisateurs",
        href: "/admin/users",
        roles: ["ADMIN"],
        icon: Icon(
          <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
            <path d="M16.5 5a3.5 3.5 0 0 1 0 7" />
            <path d="M20 20a6 6 0 0 0-4.2-7.6" />
          </>,
        ),
      },
      {
        label: "Sites",
        href: "/admin/sites",
        roles: ["ADMIN"],
        icon: Icon(
          <>
            <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z" />
            <circle cx="12" cy="9" r="2.5" />
          </>,
        ),
      },
      {
        label: "Departements",
        href: "/admin/departments",
        roles: ["ADMIN"],
        icon: Icon(
          <>
            <path d="M4 21V7l8-4 8 4v14" />
            <path d="M9 21v-6h6v6" />
            <path d="M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
          </>,
        ),
      },
      {
        label: "Postes",
        href: "/admin/job-titles",
        roles: ["ADMIN"],
        icon: Icon(
          <>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </>,
        ),
      },
      {
        label: "Domaines autorises",
        href: "/admin/allowed-domains",
        roles: ["ADMIN"],
        icon: Icon(
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 3.8 5.9 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.9-3.8-9S9.5 5.6 12 3Z" />
          </>,
        ),
      },
      {
        label: "Journal d'audit",
        href: "/admin/audit-logs",
        roles: ["ADMIN"],
        icon: Icon(
          <>
            <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
            <path d="M14 3v5h5" />
            <path d="M8 13h8M8 17h5" />
          </>,
        ),
      },
    ],
  },
];
