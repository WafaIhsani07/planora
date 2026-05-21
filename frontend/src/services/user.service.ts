import api from "@/lib/api";

export async function getUserProfile() {
  try {
    const response = await api.get("/users/profile");
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil profil pengguna:", error);
    return null;
  }
}

export async function updateUserProfile(payload: { name?: string; phone?: string; avatar?: string }) {
  try {
    const response = await api.put("/users/profile", payload);
    return response.data.data;
  } catch (error) {
    console.error("Gagal memperbarui profil pengguna:", error);
    throw error;
  }
}

export async function changePassword(payload: any) {
  const response = await api.put("/users/change-password", payload);
  return response.data.data;
}
