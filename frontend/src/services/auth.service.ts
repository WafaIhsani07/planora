import api from "@/lib/api";

export type LoginPayload = {
  email: string;
  password: string;
  role?: 'CUSTOMER' | 'VENDOR';
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: 'CUSTOMER' | 'VENDOR';
  businessName?: string;
  category?: string;
  city?: string;
  address?: string;
  phone?: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}