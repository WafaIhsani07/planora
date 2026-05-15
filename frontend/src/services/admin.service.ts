import api from "@/lib/api";

export async function getDashboardStats() {
  const { data } = await api.get("/admin/stats");
  return data.data; // Response formatter backend returns { success, data, message }
}

export async function getPendingVendors() {
  const { data } = await api.get("/admin/vendors/pending");
  return data.data;
}

export async function getAllBookings(params?: any) {
  const { data } = await api.get("/admin/bookings", { params });
  return data.data;
}

export async function getAllPayments(params?: any) {
  const { data } = await api.get("/admin/payments", { params });
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
