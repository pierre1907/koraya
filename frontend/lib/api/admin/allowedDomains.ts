import apiClient from "@/lib/api/client";

export interface AllowedDomainAdmin {
  id: string;
  domain: string;
  active: boolean;
  createdAt: string;
}

export interface AllowedDomainPayload {
  domain: string;
}

export async function fetchAllowedDomains(): Promise<AllowedDomainAdmin[]> {
  const { data } = await apiClient.get<AllowedDomainAdmin[]>("/api/admin/allowed-domains");
  return data;
}

export async function createAllowedDomain(payload: AllowedDomainPayload): Promise<AllowedDomainAdmin> {
  const { data } = await apiClient.post<AllowedDomainAdmin>("/api/admin/allowed-domains", payload);
  return data;
}

export async function setAllowedDomainStatus(id: string, active: boolean): Promise<AllowedDomainAdmin> {
  const { data } = await apiClient.patch<AllowedDomainAdmin>(`/api/admin/allowed-domains/${id}/status`, { active });
  return data;
}
