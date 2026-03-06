import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  isFormData?: boolean;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, isFormData = false } = options;

  const session = await getSession();
  const token = session?.accessToken ?? null;

  const defaultHeaders: Record<string, string> = {};

  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (body) {
    config.body = isFormData ? (body as BodyInit) : JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.detail || "An error occurred",
    );
  }

  return response.json();
}
