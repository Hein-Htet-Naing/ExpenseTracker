export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
export interface LoginFormData {
  email: string;
  password: string;
}
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: string;
  user: User;
  status?: number;
}
