import apiClient from "@/lib/api/client";
import { saveToken, saveCurrentUser } from "@/lib/auth/token";

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  fullName: string;
  role: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/api/auth/login", payload);
  saveToken(data.accessToken);
  saveCurrentUser({ fullName: data.fullName, role: data.role });
  return data;
}
