import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import KeuanganPage from './page';
import * as vendorService from '@/services/vendor.service';

// Mock vendor service
vi.mock('@/services/vendor.service', () => ({
  getVendorBookings: vi.fn(),
  getMyVendorProfile: vi.fn(),
}));

describe('KeuanganPage Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (vendorService.getVendorBookings as any).mockResolvedValue([]);
    (vendorService.getMyVendorProfile as any).mockResolvedValue(null);

    render(<KeuanganPage />);

    expect(screen.getByTestId('loading-spinner')).toBeDefined();
    expect(screen.getByText(/Memuat data keuangan/i)).toBeDefined();
  });

  it('renders financial calculations and bank account correctly after loading', async () => {
    const mockBookings = [
      {
        id: 'b1',
        totalPrice: '10000000', // 10 Million COMPLETED
        status: 'COMPLETED',
        eventDate: '2026-05-12T10:00:00.000Z',
        layanan: { name: 'Paket Wedding Rose' },
        customer: { name: 'Andini' },
      },
      {
        id: 'b2',
        totalPrice: '4000000', // 4 Million CONFIRMED (Held in escrow)
        status: 'CONFIRMED',
        eventDate: '2026-05-20T10:00:00.000Z',
        layanan: { name: 'Engagement Gold' },
        customer: { name: 'Sarah' },
      },
      {
        id: 'b3',
        totalPrice: '2000000', // Excluded (PENDING)
        status: 'PENDING',
        eventDate: '2026-05-25T10:00:00.000Z',
        layanan: { name: 'Photobooth Basic' },
        customer: { name: 'Raka' },
      },
      {
        id: 'b4',
        totalPrice: '1000000', // Excluded (CANCELLED)
        status: 'CANCELLED',
        eventDate: '2026-05-28T10:00:00.000Z',
        layanan: { name: 'Prewedding Video' },
        customer: { name: 'Dimas' },
      },
    ];

    const mockProfile = {
      id: 'v1',
      businessName: 'Wafa Decoration',
      bankName: 'BANK MANDIRI',
      bankAccount: '123-456-789-0',
      bankHolder: 'Wafa Deco Group',
    };

    (vendorService.getVendorBookings as any).mockResolvedValue(mockBookings);
    (vendorService.getMyVendorProfile as any).mockResolvedValue(mockProfile);

    render(<KeuanganPage />);

    // Wait for the loader to clear and the dynamic content to render
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    // 1. Verify Bank Account details
    expect(screen.getByText('BANK MANDIRI')).toBeDefined();
    expect(screen.getByText('123-456-789-0')).toBeDefined();
    expect(screen.getByText(/a.n. Wafa Deco Group/i)).toBeDefined();

    // 2. Verify financial statistics calculation
    // Total income = 10,000,000 + 4,000,000 = 14,000,000
    // Total held = 4,000,000 * 0.95 = 3,800,000
    // Total completed = 10,000,000 * 0.95 = 9,500,000
    expect(screen.getByText(/14\.000\.000/)).toBeDefined();
    expect(screen.getByText(/3\.800\.000/)).toBeDefined();
    expect(screen.getByText(/9\.500\.000/)).toBeDefined();

    // 3. Verify transactions list rendering
    expect(screen.getByText(/Paket Wedding Rose \(Andini\)/i)).toBeDefined();
    expect(screen.getByText(/Engagement Gold \(Sarah\)/i)).toBeDefined();

    // Verify invoice short ID formatting
    expect(screen.getByText(/#PLR-B1/i)).toBeDefined();
    expect(screen.getByText(/#PLR-B2/i)).toBeDefined();
  });
});
