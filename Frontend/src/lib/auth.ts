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
  // Use admin-login API specifically for the experts@chotabeta.com admin account
  const endpoint = email.toLowerCase() === 'experts@chotabeta.com' 
    ? '/api/auth/admin-login' 
    : '/api/auth/login';
    
  const response = await api.post(endpoint, { email, password });
  return response.data.data;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.post('/api/auth/forgot-password', { email });
}
