import { create } from "zustand";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (user: User, token: string) => void;
  setToken: (token: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setSession: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),
  setToken: (token) => set({ token }),
  clearSession: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}));