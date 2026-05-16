import api from "@/lib/api";

// ─── Profile ──────────────────────────────────────────────────────────────────
export async function getMyVendorProfile() {
  try {
    const response = await api.get("/vendors/me");
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil profil vendor:", error);
    return null;
  }
}

export async function createVendorProfile(payload: any) {
  try {
    const response = await api.post("/vendors/profile", payload);
    return response.data.data;
  } catch (error) {
    console.error("Gagal membuat profil vendor:", error);
    return null;
  }
}

export async function updateVendorProfile(payload: any) {
  try {
    const response = await api.put("/vendors/profile", payload);
    return response.data.data;
  } catch (error) {
    console.error("Gagal update profil vendor:", error);
    return null;
  }
}

// ─── Layanan (Produk) ─────────────────────────────────────────────────────────
export async function getMyLayanan() {
  try {
    const response = await api.get("/vendors/me/layanan");
    return response.data.data || [];
  } catch (error) {
    console.error("Gagal mengambil layanan vendor:", error);
    return [];
  }
}

export async function createLayanan(payload: any) {
  try {
    const response = await api.post("/vendors/me/layanan", payload);
    return response.data.data;
  } catch (error) {
    console.error("Gagal membuat layanan:", error);
    return null;
  }
}

export async function updateLayanan(id: string, payload: any) {
  try {
    const response = await api.put(`/vendors/me/layanan/${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Gagal update layanan:", error);
    return null;
  }
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
