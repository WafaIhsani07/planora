import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardClient from './dashboard-client';
import * as vendorService from '@/services/vendor.service';

vi.mock('@/services/vendor.service', () => ({
  getMyVendorProfile: vi.fn(),
  getVendorBookings: vi.fn(),
}));

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'id',
    setLanguage: vi.fn(),
    t: (key: string) => {
      const translations: Record<string, string> = {
        'dashboard.loading': 'Memuat dashboard...',
        'dashboard.welcome': 'Selamat Datang,',
      };
      return translations[key] || key;
    }
  }),
}));

const mockBookings = [
  {
    id: 'ord-1',
    totalPrice: 10000000,
    status: 'COMPLETED',
    createdAt: '2026-05-10T10:00:00Z',
    eventDate: '2026-05-15T10:00:00Z',
    customer: { name: 'Customer A' },
    layanan: { name: 'Paket A' }
  },
  {
    id: 'ord-2',
    totalPrice: 5000000,
    status: 'CONFIRMED',
    createdAt: '2026-05-12T10:00:00Z',
    eventDate: '2026-06-01T08:00:00Z',
    customer: { name: 'Customer B' },
    layanan: { name: 'Paket B' }
  },
  {
    id: 'ord-3',
    totalPrice: 2000000,
    status: 'CANCELLED',
    createdAt: '2026-05-11T10:00:00Z',
    eventDate: '2026-05-20T10:00:00Z',
    customer: { name: 'Customer C' },
    layanan: { name: 'Paket C' }
  },
  {
    id: 'ord-4',
    totalPrice: 3000000,
    status: 'IN_PROGRESS',
    createdAt: '2026-05-13T10:00:00Z',
    eventDate: '2026-05-25T08:00:00Z',
    customer: { name: 'Customer D' },
    layanan: { name: 'Paket D' }
  }
];

describe('DashboardClient Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (vendorService.getMyVendorProfile as any).mockReturnValue(new Promise(() => {}));
    (vendorService.getVendorBookings as any).mockReturnValue(new Promise(() => {}));

    render(<DashboardClient />);

    expect(screen.getByTestId('loading-spinner')).toBeDefined();
    expect(screen.getByText(/Memuat dashboard/i)).toBeDefined();
  });

  it('calculates KPIs correctly based on real bookings', async () => {
    (vendorService.getMyVendorProfile as any).mockResolvedValue({ businessName: 'Wafa Studio' });
    (vendorService.getVendorBookings as any).mockResolvedValue(mockBookings);

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    // Verifikasi Vendor Name
    expect(screen.getByText(/Wafa Studio/i)).toBeDefined();

    // Verifikasi KPI
    // Total Pesanan Valid: ord-1, ord-2, ord-4 = 3
    expect(screen.getByText('3')).toBeDefined();

    // Pesanan Aktif: CONFIRMED (ord-2), IN_PROGRESS (ord-4) = 2
    expect(screen.getByText('2')).toBeDefined();

    // Pesanan Selesai: COMPLETED (ord-1) = 1
    expect(screen.getByText('1')).toBeDefined();

    // Total Pendapatan: 10M + 5M + 3M = 18M
    // (ord-3 is CANCELLED so it's ignored)
    expect(screen.getAllByText('Rp 18.000.000').length).toBeGreaterThan(0);
  });

  it('identifies upcoming schedule properly', async () => {
    (vendorService.getMyVendorProfile as any).mockResolvedValue({ businessName: 'Wafa Studio' });
    (vendorService.getVendorBookings as any).mockResolvedValue(mockBookings);

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    // Upcoming event harusnya 'ord-4' (25 Mei) karena 'ord-1' sudah COMPLETED dan 'ord-3' CANCELLED
    // Active events are ord-2 (1 Juni) and ord-4 (25 Mei). Earliest is 25 Mei (ord-4).
    expect(screen.getAllByText(/Paket D/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Customer D/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('25').length).toBeGreaterThan(0); // Tanggal event ord-4
  });
});
