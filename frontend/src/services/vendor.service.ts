import api from "@/lib/api";

// ─── Profile ──────────────────────────────────────────────────────────────────
export async function getMyVendorProfile() {
  const { data } = await api.get("/vendors/me");
  return data.data;
}

export async function createVendorProfile(payload: {
  businessName: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
}) {
  const { data } = await api.post("/vendors/profile", payload);
  return data.data;
}

export async function updateVendorProfile(payload: {
  businessName?: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
}) {
  const { data } = await api.put("/vendors/profile", payload);
  return data.data;
}

// ─── Layanan (Produk) ─────────────────────────────────────────────────────────
export async function getMyLayanan() {
  const { data } = await api.get("/vendors/me/layanan");
  return data.data;
}

export async function createLayanan(payload: {
  kategoriId: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
}) {
  const { data } = await api.post("/vendors/me/layanan", payload);
  return data.data;
}

export async function updateLayanan(id: string, payload: {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
}) {
  const { data } = await api.put(`/vendors/me/layanan/${id}`, payload);
  return data.data;
}

export async function deleteLayanan(id: string) {
  const { data } = await api.delete(`/vendors/me/layanan/${id}`);
  return data.data;
}

// ─── Pesanan Masuk (Vendor melihat booking yg masuk) ─────────────────────────
export async function getVendorBookings(params?: { status?: string }) {
  const { data } = await api.get("/bookings", { params });
  return data.data;
}

export async function updateBookingStatus(id: string, status: string) {
  const { data } = await api.patch(`/bookings/${id}/status`, { status });
  return data.data;
}
