import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PesananDetailPage from './page';
import * as vendorService from '@/services/vendor.service';

vi.mock('@/services/vendor.service', () => ({
  getVendorBookings: vi.fn(),
  updateBookingStatus: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({
    id: 'BK-123',
  }),
  useSearchParams: () => ({
    get: vi.fn(() => 'list'),
  }),
  usePathname: () => '/dashboard/jadwal/BK-123',
}));

describe('PesananDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with loaded booking details', async () => {
    const mockBookings = [
      {
        id: 'BK-123',
        eventDate: '2026-05-12T08:00:00.000Z',
        eventAddress: 'Hotel Grand Hyatt Ballroom',
        notes: 'Wedding Anniversary Andini',
        totalPrice: 10000000,
        status: 'CONFIRMED',
        customer: { name: 'Andini Putri', phone: '081234567890' },
        layanan: { name: 'Paket Dekorasi Premium', price: 10000000 },
      },
    ];

    (vendorService.getVendorBookings as any).mockResolvedValue(mockBookings);

    render(<PesananDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('BK-123')).toBeDefined();
    });

    expect(screen.getByText('Wedding Anniversary Andini')).toBeDefined();
    expect(screen.getByText('Andini Putri')).toBeDefined();
    expect(screen.getByText('Hotel Grand Hyatt Ballroom')).toBeDefined();
    expect(screen.getByText('Rp 10.000.000')).toBeDefined();
  });
});
