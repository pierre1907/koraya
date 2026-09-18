import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, getRefreshToken, saveToken, saveRefreshToken, clearToken } from "@/lib/auth/token";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Injecte le token JWT sur chaque requete sortante
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Mutualise les refresh concurrents : un seul appel /api/auth/refresh en vol
// meme si plusieurs requetes echouent en 401 en meme temps.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("Pas de refresh token disponible");
  }
  const { data } = await axios.post<RefreshResponse>(`${BASE_URL}/api/auth/refresh`, { refreshToken });
  saveToken(data.accessToken);
  saveRefreshToken(data.refreshToken);
  return data.accessToken;
}

function redirectToLogin() {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login?reason=session_expired";
  }
}

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Tente un refresh du token sur un 401, puis rejoue la requete d'origine.
// Deconnexion automatique si le refresh echoue ou est indisponible.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const isAuthEndpoint = originalRequest?.url?.includes("/api/auth/");

    if (error.response?.status !== 401 || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (!originalRequest || originalRequest._retry || !getRefreshToken()) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise =
        refreshPromise ??
        refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
