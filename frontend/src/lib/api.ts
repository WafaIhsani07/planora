import axios from "axios";
import { getSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

// Gunakan proxy Next.js (/api/v1) agar permintaan diteruskan ke backend dengan benar
const api = axios.create({
  baseURL: "/api/v1",
});

api.interceptors.request.use(
  async (config) => {
    // Coba ambil token dari Zustand store terlebih dahulu
    let token = useAuthStore.getState().token;

    // Jika store kosong (setelah page refresh), ambil dari NextAuth session
    if (!token && typeof window !== "undefined") {
      const session = await getSession();
      const sessionToken = (session as { accessToken?: string } | null)?.accessToken;
      if (sessionToken) {
        token = sessionToken;
        // Simpan ke store agar tidak perlu fetch ulang berikutnya
        useAuthStore.getState().setToken?.(token);
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor response: kalau 401, arahkan ke halaman login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Hapus session lama lalu redirect ke login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;