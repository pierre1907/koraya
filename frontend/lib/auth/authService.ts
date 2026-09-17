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

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  emailAlias: string;
  emailDomainId: string;
  password: string;
  siteId: string;
}

export interface SiteOption {
  id: string;
  name: string;
}

export interface DomainOption {
  id: string;
  domain: string;
}

export async function register(payload: RegisterPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/api/auth/register", payload);
  saveToken(data.accessToken);
  saveCurrentUser({ fullName: data.fullName, role: data.role });
  return data;
}

export async function fetchRegistrableSites(): Promise<SiteOption[]> {
  const { data } = await apiClient.get<SiteOption[]>("/api/auth/register/sites");
  return data;
}

export async function fetchRegistrableDomains(): Promise<DomainOption[]> {
  const { data } = await apiClient.get<DomainOption[]>("/api/auth/register/domains");
  return data;
}
