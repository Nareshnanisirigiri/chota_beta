import { api } from './api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  access_panel: string;
  status: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data.data;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.post('/api/auth/forgot-password', { email });
}
