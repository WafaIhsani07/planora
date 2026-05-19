import api from "@/lib/api";

export async function getDashboardStats() {
  try {
    const response = await api.get("/admin/dashboard/stats");
    return response.data.data;
  } catch (error) {
    console.error("API Error (getDashboardStats):", error);
    return null;
  }
}

export async function getPendingVendors() {
  try {
    const response = await api.get("/admin/vendors/pending");
    return response.data.data || [];
  } catch (error) {
    console.error("API Error (getPendingVendors):", error);
    return [];
  }
}

export async function getMonitoringStats() {
  try {
    const response = await api.get("/admin/monitoring/stats");
    return response.data.data || null;
  } catch (error) {
    console.error("API Error (getMonitoringStats):", error);
    return null;
  }
}

export async function getAllPayments(params?: any) {
  try {
    const response = await api.get("/admin/payments", { params });
    return response.data.data || { payments: [] };
  } catch (error) {
    console.error("API Error (getAllPayments):", error);
    return { payments: [] };
  }
}

export async function getAllUsers(params?: any) {
  try {
    const response = await api.get("/admin/users", { params });
    return response.data.data || { users: [] };
  } catch (error) {
    console.error("API Error (getAllUsers):", error);
    return { users: [] };
  }
}

export async function getUserById(id: string) {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("API Error (getUserById):", error);
    return null;
  }
}

export async function updateUserStatus(id: string, isActive: boolean) {
  const { data } = await api.patch(`/admin/users/${id}/status`, { isActive });
  return data.data;
}

export async function getAllKategori() {
  try {
    const response = await api.get("/kategori");
    return response.data.data || [];
  } catch (error) {
    console.error("API Error (getAllKategori):", error);
    return [];
  }
}

export async function createKategori(payload: { name: string; description?: string }) {
  const { data } = await api.post("/kategori", payload);
  return data.data;
}

export async function updateKategori(id: string, payload: { name?: string; description?: string; slug?: string; icon?: string; isActive?: boolean }) {
  const { data } = await api.patch(`/kategori/${id}`, payload);
  return data.data;
}

export async function verifyVendor(id: string) {
  const { data } = await api.patch(`/admin/vendors/${id}/verify`);
  return data.data;
}

export async function rejectVendor(id: string, reason: string) {
  const { data } = await api.patch(`/admin/vendors/${id}/reject`, { reason });
  return data.data;
}
