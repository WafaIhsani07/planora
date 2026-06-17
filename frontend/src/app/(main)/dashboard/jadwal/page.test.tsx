import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PesananPage from './page';
import * as vendorService from '@/services/vendor.service';

vi.mock('@/services/vendor.service', () => ({
  getVendorBookings: vi.fn(),
  updateBookingStatus: vi.fn(),
}));

vi.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({ t: (key: string) => key, language: 'id', setLanguage: vi.fn() }),
}));

vi.mock('../DashboardLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

vi.mock('@/lib/orders', () => ({
  getPendingOrderCount: vi.fn(() => Promise.resolve(0)),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => 'list'),
  }),
  usePathname: () => '/dashboard/jadwal',
}));

describe('PesananPage (Jadwal Vendor)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with loaded bookings', async () => {
    const mockBookings = [
      {
        id: 'BK-123',
        eventDate: '2026-05-12T08:00:00.000Z',
        eventAddress: 'Gedung Graha Saba',
        notes: 'Pernikahan A & D',
        totalPrice: 8500000,
        status: 'PENDING',
        customer: { name: 'Andini Putri', phone: '081234567890' },
        layanan: { name: 'Paket Dekorasi Premium', price: 8500000 },
      },
    ];

    (vendorService.getVendorBookings as any).mockResolvedValue(mockBookings);

    render(<PesananPage />);

    await waitFor(() => {
      expect(screen.getByText('BK-123')).toBeDefined();
    });

    expect(screen.getByText('Pernikahan A & D')).toBeDefined();
    expect(screen.getByText('Andini Putri')).toBeDefined();
    expect(screen.getByText('Rp 8.500.000')).toBeDefined();
  });
});
