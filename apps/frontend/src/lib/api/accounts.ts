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
  platform_name: string;
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
