import apiClient from "@/lib/api/client";
import { SpringPage } from "@/lib/api/springPage";

export type UserRole = "ADMIN" | "MANAGER" | "AGENT" | "USER";

export interface UserAdmin {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  siteId: string | null;
  siteName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  jobTitleId: string | null;
  jobTitleName: string | null;
  phoneNumber: string | null;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface UserCreatePayload {
  fullName: string;
  emailAlias: string;
  emailDomainId: string;
  password: string;
  role: UserRole;
  siteId: string;
  departmentId?: string | null;
  jobTitleId?: string | null;
  phoneNumber?: string;
}

export interface UserUpdatePayload {
  fullName: string;
  role: UserRole;
  siteId: string;
  departmentId?: string | null;
  jobTitleId?: string | null;
  phoneNumber?: string;
  active: boolean;
}

export async function fetchUsers(size = 200): Promise<UserAdmin[]> {
  const { data } = await apiClient.get<SpringPage<UserAdmin>>("/api/admin/users", { params: { size } });
  return data.content;
}

export async function createUser(payload: UserCreatePayload): Promise<UserAdmin> {
  const { data } = await apiClient.post<UserAdmin>("/api/admin/users", payload);
  return data;
}

export async function updateUser(id: string, payload: UserUpdatePayload): Promise<UserAdmin> {
  const { data } = await apiClient.put<UserAdmin>(`/api/admin/users/${id}`, payload);
  return data;
}

export async function deactivateUser(id: string): Promise<void> {
  await apiClient.delete(`/api/admin/users/${id}`);
}

export async function hardDeleteUser(id: string): Promise<void> {
  await apiClient.delete(`/api/admin/users/${id}/hard`);
}
