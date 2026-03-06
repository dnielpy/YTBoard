import { apiClient } from "./client";

export type RegisterRequest = {
  email: string;
  password: string;
};

export type UserResponse = {
  id: number;
  email: string;
  created_at: string;
};

export async function register(data: RegisterRequest): Promise<UserResponse> {
  return apiClient<UserResponse>("/api/v1/users/create", {
    method: "POST",
    body: data,
  });
}
