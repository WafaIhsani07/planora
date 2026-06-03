import api from "@/lib/api";

export async function getBookings() {
  const { data } = await api.get("/bookings");
  return data;
}

export async function getBookingById(id: string) {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
}

export async function updateBookingStatus(id: string, status: string, cancelReason?: string) {
  const { data } = await api.patch(`/bookings/${id}/status`, { status, cancelReason });
  return data;
}

export async function getPaymentByBookingId(bookingId: string) {
  try {
    const { data } = await api.get(`/payments/booking/${bookingId}`);
    return data;
  } catch (error) {
    return null;
  }
}

export async function submitPaymentProof(bookingId: string, method: string, proofUrl: string) {
  const { data } = await api.post("/payments", { bookingId, method, proofUrl });
  return data;
}