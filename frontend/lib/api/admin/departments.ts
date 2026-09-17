import apiClient from "@/lib/api/client";
import { SpringPage } from "@/lib/api/springPage";

export interface DepartmentAdmin {
  id: string;
  name: string;
  siteId: string | null;
  siteName: string | null;
  active: boolean;
}

export interface DepartmentPayload {
  name: string;
  siteId?: string | null;
}

export interface DepartmentUpdatePayload extends DepartmentPayload {
  active: boolean;
}

export async function fetchDepartments(size = 200): Promise<DepartmentAdmin[]> {
  const { data } = await apiClient.get<SpringPage<DepartmentAdmin>>("/api/admin/departments", { params: { size } });
  return data.content;
}

export async function createDepartment(payload: DepartmentPayload): Promise<DepartmentAdmin> {
  const { data } = await apiClient.post<DepartmentAdmin>("/api/admin/departments", payload);
  return data;
}

export async function updateDepartment(id: string, payload: DepartmentUpdatePayload): Promise<DepartmentAdmin> {
  const { data } = await apiClient.put<DepartmentAdmin>(`/api/admin/departments/${id}`, payload);
  return data;
}

export async function deactivateDepartment(id: string): Promise<void> {
  await apiClient.delete(`/api/admin/departments/${id}`);
}
