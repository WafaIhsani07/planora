import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdminManajemenBookingPage from './page';
import * as adminService from '@/services/admin.service';

vi.mock('@/services/admin.service', () => ({
  getAllBookings: vi.fn(),
}));

vi.mock('@/components/admin/AdminHeader', () => ({
  default: () => <div data-testid="admin-header">Header Mock</div>
}));

vi.mock('@/components/admin/FilterTabs', () => ({
  default: () => <div data-testid="filter-tabs">Filter Tabs Mock</div>
}));

vi.mock('@/components/admin/AdminPagination', () => ({
  default: () => <div data-testid="pagination">Pagination Mock</div>
}));

describe('AdminManajemenBookingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (adminService.getAllBookings as any).mockResolvedValue({ bookings: [], total: 0 });
    render(<AdminManajemenBookingPage />);
    expect(screen.getByTestId('loading-spinner')).toBeDefined();
  });

  it('renders booking data correctly', async () => {
    const mockData = {
      bookings: [
        {
          id: 'BK-001',
          customer: { name: 'Andi Pratama', email: 'andi@test.com', phone: '08123' },
          vendor: { businessName: 'Vendor A' },
          layanan: { name: 'Foto', kategori: { name: 'Fotografi' } },
          eventDate: '2026-05-20T08:00:00.000Z',
          totalPrice: 5000000,
          status: 'DIKONFIRMASI',
          createdAt: '2026-05-10T00:00:00.000Z',
          payment: null
        }
      ],
      total: 1,
      stats: {
        total: 1,
        pending: 0,
        completed: 0
      }
    };
    (adminService.getAllBookings as any).mockResolvedValue(mockData);

    render(<AdminManajemenBookingPage />);

    await waitFor(() => {
      expect(screen.getByText('BK-001')).toBeDefined();
    });

    // Check if stats are rendered
    expect(screen.getByText('TOTAL BOOKING')).toBeDefined();
    expect(screen.getByText('01')).toBeDefined(); // Padded total
  });
});
