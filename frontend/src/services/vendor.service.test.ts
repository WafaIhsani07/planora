import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getMyVendorProfile,
  createVendorProfile,
  updateVendorProfile,
  getMyLayanan,
  createLayanan,
  updateLayanan,
  deleteLayanan,
  getVendorBookings,
  updateBookingStatus,
} from './vendor.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Vendor Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Profile ──────────────────────────────────────────────────────────────
  describe('getMyVendorProfile', () => {
    it('[POSITIF] harus memanggil GET /vendors/me dan mengembalikan profil', async () => {
      const mockProfile = { id: 'v1', businessName: 'Toko A', status: 'VERIFIED' };
      (api.get as any).mockResolvedValueOnce({ data: { data: mockProfile } });

      const result = await getMyVendorProfile();

      expect(api.get).toHaveBeenCalledWith('/vendors/me');
      expect(result.businessName).toBe('Toko A');
    });

    it('[NEGATIF] harus mengembalikan null jika server mengembalikan 401', async () => {
      (api.get as any).mockRejectedValueOnce(new Error('Unauthorized'));
      const result = await getMyVendorProfile();
      expect(result).toBeNull();
    });
  });

  describe('createVendorProfile', () => {
    it('[POSITIF] harus memanggil POST /vendors/profile dengan payload yang benar', async () => {
      const payload = { businessName: 'Katering Baru', city: 'Padang' };
      (api.post as any).mockResolvedValueOnce({ data: { data: { id: 'v2', ...payload } } });

      const result = await createVendorProfile(payload);

      expect(api.post).toHaveBeenCalledWith('/vendors/profile', payload);
      expect(result.businessName).toBe('Katering Baru');
    });
  });

  describe('updateVendorProfile', () => {
    it('[POSITIF] harus memanggil PUT /vendors/profile untuk update', async () => {
      const payload = { city: 'Bukittinggi' };
      (api.put as any).mockResolvedValueOnce({ data: { data: { city: 'Bukittinggi' } } });

      const result = await updateVendorProfile(payload);

      expect(api.put).toHaveBeenCalledWith('/vendors/profile', payload);
      expect(result.city).toBe('Bukittinggi');
    });
  });

  // ─── Layanan ───────────────────────────────────────────────────────────────
  describe('getMyLayanan', () => {
    it('[POSITIF] harus memanggil GET /vendors/me/layanan dan mengembalikan list', async () => {
      const mockLayanan = [{ id: 'l1', name: 'Paket Foto', price: 3000000 }];
      (api.get as any).mockResolvedValueOnce({ data: { data: mockLayanan } });

      const result = await getMyLayanan();

      expect(api.get).toHaveBeenCalledWith('/vendors/me/layanan');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Paket Foto');
    });

    it('[NEGATIF] harus mengembalikan list kosong jika network bermasalah', async () => {
      (api.get as any).mockRejectedValueOnce(new Error('Network Error'));
      const result = await getMyLayanan();
      expect(result).toEqual([]);
    });
  });

  describe('createLayanan', () => {
    it('[POSITIF] harus memanggil POST /vendors/me/layanan dengan payload yang tepat', async () => {
      const payload = { kategoriId: 'k1', name: 'Paket Premium', price: 5000000 };
      (api.post as any).mockResolvedValueOnce({ data: { data: { id: 'l2', ...payload } } });

      const result = await createLayanan(payload);

      expect(api.post).toHaveBeenCalledWith('/vendors/me/layanan', payload);
      expect(result.name).toBe('Paket Premium');
    });
  });

  describe('updateLayanan', () => {
    it('[POSITIF] harus memanggil PUT /vendors/me/layanan/:id', async () => {
      const payload = { price: 6000000 };
      (api.put as any).mockResolvedValueOnce({ data: { data: { id: 'l1', price: 6000000 } } });

      const result = await updateLayanan('l1', payload);

      expect(api.put).toHaveBeenCalledWith('/vendors/me/layanan/l1', payload);
      expect(result.price).toBe(6000000);
    });
  });

  describe('deleteLayanan', () => {
    it('[POSITIF] harus memanggil DELETE /vendors/me/layanan/:id', async () => {
      (api.delete as any).mockResolvedValueOnce({ data: { data: { message: 'Deleted' } } });

      await deleteLayanan('l1');

      expect(api.delete).toHaveBeenCalledWith('/vendors/me/layanan/l1');
    });
  });

  // ─── Pesanan ───────────────────────────────────────────────────────────────
  describe('getVendorBookings', () => {
    it('[POSITIF] harus memanggil GET /bookings dengan params filter', async () => {
      const mockBookings = [{ id: 'b1', status: 'PENDING' }];
      (api.get as any).mockResolvedValueOnce({ data: { data: mockBookings } });

      const result = await getVendorBookings({ status: 'PENDING' });

      expect(api.get).toHaveBeenCalledWith('/bookings', { params: { status: 'PENDING' } });
      expect(result.length).toBe(1);
    });

    it('[NEGATIF] harus melempar error jika token tidak valid', async () => {
      (api.get as any).mockRejectedValueOnce(new Error('Unauthorized'));
      await expect(getVendorBookings()).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateBookingStatus', () => {
    it('[POSITIF] harus memanggil PATCH /bookings/:id/status untuk konfirmasi', async () => {
      (api.patch as any).mockResolvedValueOnce({ data: { data: { status: 'CONFIRMED' } } });

      const result = await updateBookingStatus('b1', 'CONFIRMED');

      expect(api.patch).toHaveBeenCalledWith('/bookings/b1/status', { status: 'CONFIRMED' });
      expect(result.status).toBe('CONFIRMED');
    });

    it('[NEGATIF] harus melempar error jika booking tidak ditemukan', async () => {
      (api.patch as any).mockRejectedValueOnce(new Error('Not Found'));
      await expect(updateBookingStatus('invalid-id', 'CONFIRMED')).rejects.toThrow('Not Found');
    });
  });
});
