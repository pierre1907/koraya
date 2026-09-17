"use client";

import { useEffect, useMemo, useState } from "react";
import { AuditLogEntry, fetchAuditLogs } from "@/lib/api/admin/auditLogs";
import { UserAdmin, fetchUsers } from "@/lib/api/admin/users";
import { getErrorMessage } from "@/lib/api/errors";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AuditLogsAdminPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [usersById, setUsersById] = useState<Map<string, UserAdmin>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const [logList, userList] = await Promise.all([fetchAuditLogs(), fetchUsers()]);
      setLogs([...logList].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setUsersById(new Map(userList.map((user) => [user.id, user])));
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de charger le journal d'audit."));
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;
    return logs.filter((log) => {
      const actorName = log.actorUserId ? usersById.get(log.actorUserId)?.fullName ?? "" : "";
      return [log.action, log.entityType, log.details ?? "", actorName]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [logs, search, usersById]);

  return (
    <div>
      <AdminPageHeader title="Journal d'audit" />

      <div className="mt-6 max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une action, une entite, un acteur..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Chargement...</p>
        ) : loadError ? (
          <p className="px-6 py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : filteredLogs.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">Aucun evenement trouve.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Acteur</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Entite</th>
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => {
                const actor = log.actorUserId ? usersById.get(log.actorUserId) : undefined;
                return (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-500">{formatDate(log.createdAt)}</td>
                    <td className="px-6 py-3 text-gray-900">
                      {actor ? actor.fullName : log.actorUserId ? "Utilisateur supprime" : "Systeme"}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center rounded-full bg-koraya-navy/10 px-2.5 py-0.5 text-xs font-medium text-koraya-navy">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{log.entityType}</td>
                    <td className="px-6 py-3 text-gray-500">{log.details || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
