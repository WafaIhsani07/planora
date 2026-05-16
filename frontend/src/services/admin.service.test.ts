import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDashboardStats, getPendingVendors, verifyVendor, rejectVendor } from './admin.service';
import api from '@/lib/api';

// Mock modul api (axios instance)
vi.mock('@/lib/api', () => {
  return {
    default: {
      get: vi.fn(),
      patch: vi.fn(),
      post: vi.fn(),
    }
  };
});

describe('Admin Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('harus memanggil GET /admin/stats dan mengembalikan data', async () => {
      // Setup mock response
      const mockResponse = {
        data: {
          success: true,
          data: {
            totalRevenue: 5000000,
            totalBookings: 10,
            totalUsers: 20,
            pendingVendors: 2
          }
        }
      };
      (api.get as any).mockResolvedValueOnce(mockResponse);

      // Eksekusi fungsi
      const result = await getDashboardStats();

      // Verifikasi
      expect(api.get).toHaveBeenCalledWith('/admin/dashboard/stats');
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(result.totalRevenue).toBe(5000000);
    });

    it('harus melempar error jika request gagal', async () => {
      const result = await getDashboardStats();
      expect(result).toBeNull();
    });
  });

  describe('getPendingVendors', () => {
    it('harus memanggil GET /admin/vendors/pending', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { id: '1', businessName: 'Vendor A', status: 'PENDING' }
          ]
        }
      };
      (api.get as any).mockResolvedValueOnce(mockResponse);

      const result = await getPendingVendors();

      expect(api.get).toHaveBeenCalledWith('/admin/vendors/pending');
      expect(result.length).toBe(1);
      expect(result[0].businessName).toBe('Vendor A');
    });
  });

  describe('verifyVendor', () => {
    it('harus memanggil PATCH /admin/vendors/:id/verify', async () => {
      const mockResponse = { data: { success: true, data: { status: 'VERIFIED' } } };
      (api.patch as any).mockResolvedValueOnce(mockResponse);

      const result = await verifyVendor('vendor-123');

      expect(api.patch).toHaveBeenCalledWith('/admin/vendors/vendor-123/verify');
      expect(result.status).toBe('VERIFIED');
    });
  });

  describe('rejectVendor', () => {
    it('harus memanggil PATCH /admin/vendors/:id/reject dengan alasan penolakan', async () => {
      const mockResponse = { data: { success: true, data: { status: 'REJECTED' } } };
      (api.patch as any).mockResolvedValueOnce(mockResponse);

      const result = await rejectVendor('vendor-123', 'Dokumen tidak lengkap');

      expect(api.patch).toHaveBeenCalledWith('/admin/vendors/vendor-123/reject', { reason: 'Dokumen tidak lengkap' });
      expect(result.status).toBe('REJECTED');
    });
  });
});
