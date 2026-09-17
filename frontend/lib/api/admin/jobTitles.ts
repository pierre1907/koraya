import apiClient from "@/lib/api/client";

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

export async function fetchJobTitles(): Promise<JobTitleAdmin[]> {
  const { data } = await apiClient.get<JobTitleAdmin[]>("/api/admin/job-titles");
  return data;
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
