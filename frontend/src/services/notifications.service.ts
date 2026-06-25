import api from "@/lib/api";

export async function getUnreadCount() {
  const { data } = await api.get("/notifications/unread-count");
  return data.data; // assuming API returns { data: count } or similar
}

export async function getMyNotifications(page = 1, limit = 20) {
  const { data } = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return data.data; // { notifications, pagination }
}

export async function markAsRead(id: string) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
}

export async function markAllAsRead() {
  const { data } = await api.patch("/notifications/read-all");
  return data;
}
