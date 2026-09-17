import { ReactNode } from "react";
import {
  AssetIcon,
  AuditIcon,
  CategoryIcon,
  DashboardIcon,
  DepartmentIcon,
  DomainIcon,
  JobTitleIcon,
  SiteIcon,
  UsersIcon,
} from "./icons";

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

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        label: "Tableau de bord",
        href: "/dashboard",
        icon: DashboardIcon,
      },
    ],
  },
  {
    label: "Parc informatique",
    items: [
      {
        label: "Actifs",
        icon: AssetIcon,
      },
      {
        label: "Categories",
        icon: CategoryIcon,
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
        icon: UsersIcon,
      },
      {
        label: "Sites",
        href: "/admin/sites",
        roles: ["ADMIN"],
        icon: SiteIcon,
      },
      {
        label: "Departements",
        href: "/admin/departments",
        roles: ["ADMIN"],
        icon: DepartmentIcon,
      },
      {
        label: "Postes",
        href: "/admin/job-titles",
        roles: ["ADMIN"],
        icon: JobTitleIcon,
      },
      {
        label: "Domaines autorises",
        href: "/admin/allowed-domains",
        roles: ["ADMIN"],
        icon: DomainIcon,
      },
      {
        label: "Journal d'audit",
        href: "/admin/audit-logs",
        roles: ["ADMIN"],
        icon: AuditIcon,
      },
    ],
  },
];
