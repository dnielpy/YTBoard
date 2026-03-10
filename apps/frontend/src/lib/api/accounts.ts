import { apiClient } from "./client";

export type GoogleAuthUrlResponse = {
  auth_url: string;
};

export type GoogleConnectRequest = {
  code: string;
  redirect_uri: string;
};

export type GoogleConnectResponse = {
  account_id: number;
  channel_id: string;
  channel_handle: string;
  channel_title: string;
  thumbnail_url: string | null;
};

export type ConnectedAccount = {
  account_id: number;
  channel_id: string;
  channel_handle: string;
  avatar_url: string | null;
  platform_name: string;
};

export type VideoResponse = {
  id: number;
  account_id: number;
  video_id: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  duration: string | null;
  privacy: string | null;
};

export async function getGoogleAuthUrl(
  redirectUri?: string,
): Promise<GoogleAuthUrlResponse> {
  const params = redirectUri
    ? `?redirect_uri=${encodeURIComponent(redirectUri)}`
    : "";
  return apiClient<GoogleAuthUrlResponse>(
    `/api/v1/accounts/google/auth-url${params}`,
  );
}

export async function connectGoogleAccount(
  data: GoogleConnectRequest,
): Promise<GoogleConnectResponse> {
  return apiClient<GoogleConnectResponse>("/api/v1/accounts/google/connect", {
    method: "POST",
    body: data,
  });
}

export async function getConnectedAccount(): Promise<ConnectedAccount> {
  return apiClient<ConnectedAccount>("/api/v1/accounts/me");
}

export async function disconnectGoogleAccount(): Promise<{ detail: string }> {
  return apiClient<{ detail: string }>("/api/v1/accounts/google/disconnect", {
    method: "DELETE",
  });
}

export async function syncAccount(): Promise<{ detail: string }> {
  return apiClient<{ detail: string }>("/api/v1/accounts/sync");
}

export async function getVideos(): Promise<VideoResponse[]> {
  return apiClient<VideoResponse[]>("/api/v1/accounts/videos");
}
