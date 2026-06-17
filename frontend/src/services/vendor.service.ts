import api from "@/lib/api";
import toast from "react-hot-toast";

const handleApiError = (error: any, defaultMsg: string) => {
  console.error(defaultMsg, error);
  const serverMsg = error?.response?.data?.message;
  if (serverMsg) {
    toast.error(serverMsg);
  } else {
    toast.error(defaultMsg);
  }
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export async function getMyVendorProfile() {
  try {
    const response = await api.get("/vendors/me");
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // Wajar jika profil belum dibuat
    }
    handleApiError(error, "Gagal mengambil profil vendor");
    return null;
  }
}

export async function createVendorProfile(payload: any) {
  try {
    const response = await api.post("/vendors/profile", payload);
    return response.data.data;
  } catch (error) {
    handleApiError(error, "Gagal membuat profil vendor");
    return null;
  }
}

export async function updateVendorProfile(payload: any) {
  try {
    const response = await api.put("/vendors/profile", payload);
    return response.data.data;
  } catch (error) {
    handleApiError(error, "Gagal update profil vendor");
    return null;
  }
}

// ─── Layanan (Produk) ─────────────────────────────────────────────────────────
export async function getMyLayanan() {
  try {
    const response = await api.get("/vendors/me/layanan");
    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return []; // Wajar jika profil belum dibuat
    }
    handleApiError(error, "Gagal mengambil layanan vendor");
    return [];
  }
}

export async function createLayanan(payload: any) {
  try {
    const response = await api.post("/vendors/me/layanan", payload);
    return response.data.data;
  } catch (error) {
    handleApiError(error, "Gagal membuat layanan");
    return null;
  }
}

export async function updateLayanan(id: string, payload: any) {
  try {
    const response = await api.put(`/vendors/me/layanan/${id}`, payload);
    return response.data.data;
  } catch (error) {
    handleApiError(error, "Gagal update layanan");
    return null;
  }
}

export async function deleteLayanan(id: string) {
  const { data } = await api.delete(`/vendors/me/layanan/${id}`);
  return data.data;
}

// ─── Pesanan Masuk (Vendor melihat booking yg masuk) ─────────────────────────
export async function getVendorBookings(params?: { status?: string; page?: number; limit?: number }) {
  try {
    const { data } = await api.get("/bookings", { params });
    // Karena backend sekarang mereturn { data, meta } di dalam data.data
    return data.data; // { data: [...], meta: {...} }
  } catch (error: any) {
    // Jika 404 (profil belum ada), return data kosong secara diam-diam
    if (error.response?.status === 404) {
      return { data: [], meta: { total: 0 } };
    }
    handleApiError(error, "Gagal mengambil pesanan vendor");
    return { data: [] };
  }
}

export async function updateBookingStatus(id: string, status: string) {
  const { data } = await api.patch(`/bookings/${id}/status`, { status });
  return data.data;
}

// ─── Portofolio (Galeri Karya Vendor) ─────────────────────────────────────────
export async function getMyPortfolio() {
  try {
    const response = await api.get("/vendors/me/portfolio");
    return response.data.data || [];
  } catch (error) {
    handleApiError(error, "Gagal mengambil portofolio");
    return [];
  }
}

export async function createPortfolio(payload: any) {
  try {
    const response = await api.post("/vendors/me/portfolio", payload);
    return response.data.data;
  } catch (error) {
    handleApiError(error, "Gagal menambahkan portofolio");
    return null;
  }
}

export async function deletePortfolio(id: string) {
  const { data } = await api.delete(`/vendors/me/portfolio/${id}`);
  return data.data;
}

// ─── Upload File Gambar ───────────────────────────────────────────────────────
export async function uploadImage(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.imageUrl;
  } catch (error) {
    handleApiError(error, "Gagal mengunggah gambar");
    return null;
  }
}

// ─── Ulasan / Reviews ────────────────────────────────────────────────────────
export async function getVendorReviews(vendorId: string) {
  try {
    const response = await api.get(`/reviews/vendor/${vendorId}`);
    return response.data.data || [];
  } catch (error) {
    handleApiError(error, "Gagal mengambil ulasan vendor");
    return [];
  }
}

export async function replyToReview(reviewId: string, reply: string) {
  try {
    const response = await api.put(`/reviews/${reviewId}/reply`, { reply });
    return response.data.data;
  } catch (error) {
    handleApiError(error, "Gagal membalas ulasan");
    return null;
  }
}

// ─── Keuangan / Penarikan ───────────────────────────────────────────────────
export async function getMyWithdrawals() {
  try {
    const response = await api.get("/withdrawals");
    return response.data.data.withdrawals || [];
  } catch (error) {
    handleApiError(error, "Gagal mengambil riwayat penarikan");
    return [];
  }
}

export async function requestWithdrawal(amount: number) {
  try {
    const response = await api.post("/withdrawals", { amount });
    toast.success("Pengajuan penarikan dana berhasil");
    return response.data.data;
  } catch (error) {
    handleApiError(error, "Gagal mengajukan penarikan dana");
    return null;
  }
}
