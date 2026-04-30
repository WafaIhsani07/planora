import api from "@/lib/api";

type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function register(payload: { name: string; email: string; password: string }) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}