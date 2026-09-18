import apiClient from "@/lib/api/client";
import { SpringPage } from "@/lib/api/springPage";

export interface JobTitleAdmin {
  id: string;
  title: string;
  active: boolean;
  createdAt: string;
}

export interface JobTitlePayload {
  title: string;
}

export interface JobTitleUpdatePayload extends JobTitlePayload {
  active: boolean;
}

export async function fetchJobTitles(size = 200): Promise<JobTitleAdmin[]> {
  const { data } = await apiClient.get<SpringPage<JobTitleAdmin>>("/api/admin/job-titles", { params: { size } });
  return data.content;
}

export async function createJobTitle(payload: JobTitlePayload): Promise<JobTitleAdmin> {
  const { data } = await apiClient.post<JobTitleAdmin>("/api/admin/job-titles", payload);
  return data;
}

export async function updateJobTitle(id: string, payload: JobTitleUpdatePayload): Promise<JobTitleAdmin> {
  const { data } = await apiClient.put<JobTitleAdmin>(`/api/admin/job-titles/${id}`, payload);
  return data;
}

export async function deactivateJobTitle(id: string): Promise<void> {
  await apiClient.delete(`/api/admin/job-titles/${id}`);
}

export async function hardDeleteJobTitle(id: string): Promise<void> {
  await apiClient.delete(`/api/admin/job-titles/${id}/hard`);
}
