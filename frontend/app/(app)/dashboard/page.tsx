"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import StatTile from "@/components/dashboard/StatTile";
import { DepartmentIcon, DomainIcon, JobTitleIcon, SiteIcon, UsersIcon } from "@/components/layout/icons";
import { getCurrentUser } from "@/lib/auth/token";
import { UserAdmin, fetchUsers } from "@/lib/api/admin/users";
import { fetchSites } from "@/lib/api/admin/sites";
import { fetchDepartments } from "@/lib/api/admin/departments";
import { fetchJobTitles } from "@/lib/api/admin/jobTitles";
import { fetchAllowedDomains } from "@/lib/api/admin/allowedDomains";
import { AuditLogEntry, fetchAuditLogs } from "@/lib/api/admin/auditLogs";
import { ActionTone, formatAuditAction, formatEntityType } from "@/lib/format/auditLog";
import { getErrorMessage } from "@/lib/api/errors";

const TONE_CLASSES: Record<ActionTone, string> = {
  positive: "bg-emerald-50 text-emerald-700",
  negative: "bg-red-50 text-red-600",
  neutral: "bg-koraya-navy/10 text-koraya-navy",
};

// Slots categoriels valides (blue/orange/aqua) pour les 3 premieres tuiles,
// puis repli sur les couleurs de marque pour les suivantes (au-dela de 3
// couleurs simultanees le jeu categoriel ne se distingue plus de maniere fiable).
const STAT_COLORS = {
  users: "#2a78d6",
  sites: "#eb6834",
  departments: "#1baf7a",
  jobTitles: "#1F3A5F",
  domains: "#B8860B",
};

interface OverviewStats {
  activeUsers: number;
  totalUsers: number;
  activeSites: number;
  activeDepartments: number;
  activeJobTitles: number;
  activeDomains: number;
}

function formatRelativeDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLogEntry[]>([]);
  const [usersById, setUsersById] = useState<Map<string, UserAdmin>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const admin = getCurrentUser()?.role === "ADMIN";
    setIsAdmin(admin);
    if (!admin) {
      setLoading(false);
      return;
    }
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const [userList, siteList, departmentList, jobTitleList, domainList, logList] = await Promise.all([
        fetchUsers(),
        fetchSites(),
        fetchDepartments(),
        fetchJobTitles(),
        fetchAllowedDomains(),
        fetchAuditLogs(),
      ]);

      setStats({
        activeUsers: userList.filter((u) => u.active).length,
        totalUsers: userList.length,
        activeSites: siteList.filter((s) => s.active).length,
        activeDepartments: departmentList.filter((d) => d.active).length,
        activeJobTitles: jobTitleList.filter((j) => j.active).length,
        activeDomains: domainList.filter((d) => d.active).length,
      });
      setUsersById(new Map(userList.map((user) => [user.id, user])));
      setRecentLogs([...logList].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5));
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de charger le tableau de bord."));
    } finally {
      setLoading(false);
    }
  }

  function actorName(log: AuditLogEntry): string {
    if (!log.actorUserId) return "Systeme";
    return usersById.get(log.actorUserId)?.fullName ?? "Utilisateur supprime";
  }

  return (
    <div>
      <Breadcrumb items={[]} />
      <h1 className="mt-2 text-2xl font-semibold text-gray-900">Tableau de bord</h1>

      {!isAdmin ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">Module Gestion du Parc Informatique — a venir.</p>
        </div>
      ) : loading ? (
        <p className="mt-8 text-sm text-gray-500">Chargement...</p>
      ) : loadError ? (
        <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{loadError}</p>
      ) : (
        stats && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatTile
                label="Utilisateurs actifs"
                value={`${stats.activeUsers} / ${stats.totalUsers}`}
                icon={UsersIcon}
                color={STAT_COLORS.users}
                href="/admin/users"
              />
              <StatTile
                label="Sites actifs"
                value={stats.activeSites}
                icon={SiteIcon}
                color={STAT_COLORS.sites}
                href="/admin/sites"
              />
              <StatTile
                label="Departements actifs"
                value={stats.activeDepartments}
                icon={DepartmentIcon}
                color={STAT_COLORS.departments}
                href="/admin/departments"
              />
              <StatTile
                label="Postes actifs"
                value={stats.activeJobTitles}
                icon={JobTitleIcon}
                color={STAT_COLORS.jobTitles}
                href="/admin/job-titles"
              />
              <StatTile
                label="Domaines autorises"
                value={stats.activeDomains}
                icon={DomainIcon}
                color={STAT_COLORS.domains}
                href="/admin/allowed-domains"
              />
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-sm font-semibold text-gray-900">Activite recente</h2>
                <Link href="/admin/audit-logs" className="text-xs font-medium text-koraya-navy hover:underline">
                  Voir tout le journal
                </Link>
              </div>

              {recentLogs.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-gray-500">Aucune activite recente.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentLogs.map((log) => {
                    const action = formatAuditAction(log.action);
                    return (
                      <li key={log.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[action.tone]}`}
                          >
                            {action.label}
                          </span>
                          <span className="text-gray-500">
                            {actorName(log)} &middot; {formatEntityType(log.entityType)}
                          </span>
                        </div>
                        <span className="whitespace-nowrap text-xs text-gray-400">{formatRelativeDate(log.createdAt)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}
