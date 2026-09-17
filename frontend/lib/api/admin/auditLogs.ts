import apiClient from "@/lib/api/client";
import { SpringPage } from "@/lib/api/springPage";

export interface AuditLogEntry {
  id: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
}

/**
 * Le backend renvoie une Page Spring paginee ({content, totalElements, ...}),
 * pas un tableau brut. `size` fixe la fenetre recuperee pour le tri/filtre
 * cote client (pas de pagination UI pour l'instant).
 */
export async function fetchAuditLogs(size = 200): Promise<AuditLogEntry[]> {
  const { data } = await apiClient.get<SpringPage<AuditLogEntry>>("/api/admin/audit-logs", {
    params: { size, sort: "createdAt,desc" },
  });
  return data.content;
}
