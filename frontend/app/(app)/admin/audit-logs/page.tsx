"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuditLogEntry, fetchAuditLogs } from "@/lib/api/admin/auditLogs";
import { UserAdmin, fetchUsers } from "@/lib/api/admin/users";
import { getErrorMessage } from "@/lib/api/errors";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SortableHeader from "@/components/admin/SortableHeader";
import Pagination from "@/components/admin/Pagination";
import { useSortableData } from "@/lib/hooks/useSortableData";
import { usePagination } from "@/lib/hooks/usePagination";
import { AuditIcon } from "@/components/layout/icons";
import { ActionTone, formatAuditAction, formatEntityType } from "@/lib/format/auditLog";

const AUTO_REFRESH_INTERVAL_MS = 15_000;

const TONE_CLASSES: Record<ActionTone, string> = {
  positive: "bg-emerald-50 text-emerald-700",
  negative: "bg-red-50 text-red-600",
  neutral: "bg-koraya-navy/10 text-koraya-navy",
};

type AuditSortKey = "createdAt" | "actor" | "action" | "entityType";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", { timeStyle: "medium" });
}

export default function AuditLogsAdminPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [usersById, setUsersById] = useState<Map<string, UserAdmin>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const usersByIdRef = useRef(usersById);
  usersByIdRef.current = usersById;

  const actorName = useCallback(
    (log: AuditLogEntry): string => {
      if (!log.actorUserId) return "Systeme";
      return usersById.get(log.actorUserId)?.fullName ?? "Utilisateur supprime";
    },
    [usersById],
  );

  useEffect(() => {
    void load(true);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = window.setInterval(() => {
      if (document.hidden) return;
      void load(false);
    }, AUTO_REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [autoRefresh]);

  async function load(showSpinner: boolean) {
    if (showSpinner) setLoading(true);
    setLoadError(null);
    try {
      const needsUsers = usersByIdRef.current.size === 0;
      const [logList, userList] = await Promise.all([
        fetchAuditLogs(),
        needsUsers ? fetchUsers() : Promise.resolve(null),
      ]);
      setLogs(logList);
      if (userList) {
        setUsersById(new Map(userList.map((user) => [user.id, user])));
      }
      setLastUpdated(new Date());
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de charger le journal d'audit."));
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  const actionOptions = useMemo(
    () => Array.from(new Set(logs.map((log) => log.action))).sort(),
    [logs],
  );
  const entityOptions = useMemo(
    () => Array.from(new Set(logs.map((log) => log.entityType))).sort(),
    [logs],
  );

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (actionFilter && log.action !== actionFilter) return false;
      if (entityFilter && log.entityType !== entityFilter) return false;
      if (!query) return true;
      return [
        formatAuditAction(log.action).label,
        formatEntityType(log.entityType),
        log.details ?? "",
        actorName(log),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [logs, search, actionFilter, entityFilter, actorName]);

  const { sorted: visibleLogs, sortKey, sortDir, toggleSort } = useSortableData<AuditLogEntry, AuditSortKey>(
    filteredLogs,
    {
      createdAt: (log) => log.createdAt,
      actor: (log) => actorName(log).toLowerCase(),
      action: (log) => log.action,
      entityType: (log) => log.entityType,
    },
    "createdAt",
    "desc",
  );

  const {
    paginated: paginatedLogs,
    page,
    setPage,
    pageSize,
    changePageSize,
    totalPages,
    totalItems,
  } = usePagination(visibleLogs);

  return (
    <div>
      <AdminPageHeader title="Journal d'audit" icon={AuditIcon} />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Recherche</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Action, entite, acteur, details..."
              className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            >
              <option value="">Toutes</option>
              {actionOptions.map((action) => (
                <option key={action} value={action}>
                  {formatAuditAction(action).label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Entite</label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            >
              <option value="">Toutes</option>
              {entityOptions.map((entity) => (
                <option key={entity} value={entity}>
                  {formatEntityType(entity)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          {lastUpdated && <span>Mis a jour a {formatTime(lastUpdated)}</span>}
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300 text-koraya-navy focus:ring-koraya-navy"
            />
            <span className="flex items-center gap-1">
              {autoRefresh && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />}
              Auto (15s)
            </span>
          </label>
          <button
            type="button"
            onClick={() => void load(true)}
            className="rounded-md border border-gray-200 px-3 py-1.5 font-medium text-gray-600 transition hover:border-koraya-navy/30 hover:bg-koraya-navy/5 hover:text-koraya-navy"
          >
            Rafraichir
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : visibleLogs.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Aucun evenement trouve.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <SortableHeader label="Date" sortKeyValue="createdAt" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Acteur" sortKeyValue="actor" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Action" sortKeyValue="action" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Entite" sortKeyValue="entityType" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLogs.map((log) => {
                const action = formatAuditAction(log.action);
                return (
                  <tr key={log.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="whitespace-nowrap px-6 py-3.5 text-gray-500">{formatDate(log.createdAt)}</td>
                    <td className="px-6 py-3.5 font-medium text-gray-900">{actorName(log)}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[action.tone]}`}
                      >
                        {action.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{formatEntityType(log.entityType)}</td>
                    <td className="px-6 py-3.5 text-gray-500">{log.details || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && !loadError && totalItems > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={changePageSize}
          />
        )}
      </div>
    </div>
  );
}
