import apiClient from "@/lib/api/client";

export interface SiteAdmin {
  id: string;
  name: string;
  address: string | null;
  active: boolean;
}

export interface SitePayload {
  name: string;
  address?: string;
}

export interface SiteUpdatePayload extends SitePayload {
  active: boolean;
}

export async function fetchSites(): Promise<SiteAdmin[]> {
  const { data } = await apiClient.get<SiteAdmin[]>("/api/admin/sites");
  return data;
}

export async function createSite(payload: SitePayload): Promise<SiteAdmin> {
  const { data } = await apiClient.post<SiteAdmin>("/api/admin/sites", payload);
  return data;
}

export async function updateSite(id: string, payload: SiteUpdatePayload): Promise<SiteAdmin> {
  const { data } = await apiClient.put<SiteAdmin>(`/api/admin/sites/${id}`, payload);
  return data;
}

export async function deactivateSite(id: string): Promise<void> {
  await apiClient.delete(`/api/admin/sites/${id}`);
}
