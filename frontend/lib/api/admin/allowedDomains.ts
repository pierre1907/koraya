import apiClient from "@/lib/api/client";
import { SpringPage } from "@/lib/api/springPage";

export interface AllowedDomainAdmin {
  id: string;
  domain: string;
  active: boolean;
  createdAt: string;
}

export interface AllowedDomainPayload {
  domain: string;
}

export async function fetchAllowedDomains(size = 200): Promise<AllowedDomainAdmin[]> {
  const { data } = await apiClient.get<SpringPage<AllowedDomainAdmin>>("/api/admin/allowed-domains", {
    params: { size },
  });
  return data.content;
}

export async function createAllowedDomain(payload: AllowedDomainPayload): Promise<AllowedDomainAdmin> {
  const { data } = await apiClient.post<AllowedDomainAdmin>("/api/admin/allowed-domains", payload);
  return data;
}

export async function setAllowedDomainStatus(id: string, active: boolean): Promise<AllowedDomainAdmin> {
  const { data } = await apiClient.patch<AllowedDomainAdmin>(`/api/admin/allowed-domains/${id}/status`, { active });
  return data;
}
