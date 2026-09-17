"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS, NavRole } from "./navConfig";

interface AppSidebarProps {
  collapsed: boolean;
  role: NavRole | null;
}

export default function AppSidebar({ collapsed, role }: AppSidebarProps) {
  const pathname = usePathname();

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.roles || (role && item.roles.includes(role))),
  })).filter((group) => group.items.length > 0);

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col bg-koraya-navy transition-all duration-200 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-koraya-gold text-koraya-navy">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 1.5 13 8l-11 6.5v-13Z" />
          </svg>
        </span>
        {!collapsed && (
          <span className="text-lg font-bold tracking-wide text-white">KORAYA</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {visibleGroups.map((group, groupIndex) => (
          <div key={group.label ?? `group-${groupIndex}`} className={groupIndex > 0 ? "mt-6" : ""}>
            {group.label && !collapsed && (
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = item.href ? pathname === item.href : false;

                if (!item.href) {
                  return (
                    <li key={item.label}>
                      <span
                        title={collapsed ? `${item.label} (bientot)` : undefined}
                        className={`flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-500 ${
                          collapsed ? "justify-center" : "justify-between"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon}
                          {!collapsed && item.label}
                        </span>
                        {!collapsed && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                            Bientot
                          </span>
                        )}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                        collapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-koraya-gold text-koraya-navy"
                          : "text-slate-200 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {!collapsed && item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
