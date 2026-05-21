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
  getMyPortfolio,
  createPortfolio,
  deletePortfolio,
  uploadImage,
  getVendorReviews,
  replyToReview,
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

  // ─── Portofolio ──────────────────────────────────────────────────────────────
  describe('getMyPortfolio', () => {
    it('[POSITIF] harus memanggil GET /vendors/me/portfolio dan mengembalikan list', async () => {
      const mockList = [{ id: 'p1', title: 'Wedding A' }];
      (api.get as any).mockResolvedValueOnce({ data: { data: mockList } });

      const result = await getMyPortfolio();

      expect(api.get).toHaveBeenCalledWith('/vendors/me/portfolio');
      expect(result.length).toBe(1);
    });

    it('[NEGATIF] harus mengembalikan list kosong jika terjadi error', async () => {
      (api.get as any).mockRejectedValueOnce(new Error('Server Error'));
      const result = await getMyPortfolio();
      expect(result).toEqual([]);
    });
  });

  describe('createPortfolio', () => {
    it('[POSITIF] harus memanggil POST /vendors/me/portfolio dengan payload yang benar', async () => {
      const payload = { title: 'Project X', imageUrl: 'http://foo' };
      (api.post as any).mockResolvedValueOnce({ data: { data: { id: 'p1', ...payload } } });

      const result = await createPortfolio(payload);

      expect(api.post).toHaveBeenCalledWith('/vendors/me/portfolio', payload);
      expect(result.title).toBe('Project X');
    });

    it('[NEGATIF] harus mengembalikan null jika terjadi error', async () => {
      (api.post as any).mockRejectedValueOnce(new Error('Bad Request'));
      const result = await createPortfolio({});
      expect(result).toBeNull();
    });
  });

  describe('deletePortfolio', () => {
    it('[POSITIF] harus memanggil DELETE /vendors/me/portfolio/:id', async () => {
      (api.delete as any).mockResolvedValueOnce({ data: { data: { success: true } } });

      const result = await deletePortfolio('p1');

      expect(api.delete).toHaveBeenCalledWith('/vendors/me/portfolio/p1');
      expect(result.success).toBe(true);
    });
  });

  // ─── Upload Image ────────────────────────────────────────────────────────────
  describe('uploadImage', () => {
    it('[POSITIF] harus memanggil POST /uploads dengan FormData dan mengembalikan URL', async () => {
      const mockFile = new File(['foo'], 'image.jpg', { type: 'image/jpeg' });
      (api.post as any).mockResolvedValueOnce({ data: { data: { imageUrl: 'http://localhost:3000/uploads/image.jpg' } } });

      const result = await uploadImage(mockFile);

      expect(api.post).toHaveBeenCalledWith('/uploads', expect.any(FormData));
      expect(result).toBe('http://localhost:3000/uploads/image.jpg');
    });

    it('[NEGATIF] harus mengembalikan null jika unggah gambar gagal', async () => {
      const mockFile = new File(['foo'], 'image.jpg', { type: 'image/jpeg' });
      (api.post as any).mockRejectedValueOnce(new Error('Network Error'));

      const result = await uploadImage(mockFile);
      expect(result).toBeNull();
    });
  });

  // ─── Get Vendor Reviews ──────────────────────────────────────────────────────
  describe('getVendorReviews', () => {
    it('[POSITIF] harus memanggil GET /reviews/vendor/:id dan mengembalikan list ulasan', async () => {
      const mockReviews = [{ id: 'r1', rating: 5, comment: 'Bagus sekali!' }];
      (api.get as any).mockResolvedValueOnce({ data: { data: mockReviews } });

      const result = await getVendorReviews('v123');

      expect(api.get).toHaveBeenCalledWith('/reviews/vendor/v123');
      expect(result).toEqual(mockReviews);
    });

    it('[NEGATIF] harus mengembalikan list kosong jika terjadi error', async () => {
      (api.get as any).mockRejectedValueOnce(new Error('Fetch Error'));

      const result = await getVendorReviews('v123');
      expect(result).toEqual([]);
    });
  });

  // ─── Reply to Review ────────────────────────────────────────────────────────
  describe('replyToReview', () => {
    it('[POSITIF] harus memanggil PUT /reviews/:id/reply dan mengembalikan data balasan', async () => {
      const mockResult = { id: 'r1', reply: 'Makasih!' };
      (api.put as any).mockResolvedValueOnce({ data: { data: mockResult } });

      const result = await replyToReview('r1', 'Makasih!');

      expect(api.put).toHaveBeenCalledWith('/reviews/r1/reply', { reply: 'Makasih!' });
      expect(result).toEqual(mockResult);
    });

    it('[NEGATIF] harus mengembalikan null jika terjadi error', async () => {
      (api.put as any).mockRejectedValueOnce(new Error('Update Error'));

      const result = await replyToReview('r1', 'Makasih!');
      expect(result).toBeNull();
    });
  });
});
