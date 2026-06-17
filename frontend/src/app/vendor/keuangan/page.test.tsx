import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import KeuanganPage from './page';
import * as vendorService from '@/services/vendor.service';

// Mock vendor service - include ALL functions used by KeuanganPage
vi.mock('@/services/vendor.service', () => ({
  getVendorBookings: vi.fn(),
  getMyVendorProfile: vi.fn(),
  getMyWithdrawals: vi.fn(),
  requestWithdrawal: vi.fn(),
}));

// Mock react-hot-toast which is used in the component
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('KeuanganPage Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Return never-resolving promises to keep loading state
    (vendorService.getVendorBookings as any).mockReturnValue(new Promise(() => {}));
    (vendorService.getMyVendorProfile as any).mockReturnValue(new Promise(() => {}));
    (vendorService.getMyWithdrawals as any).mockReturnValue(new Promise(() => {}));

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
      balance: 0,
    };

    (vendorService.getVendorBookings as any).mockResolvedValue(mockBookings);
    (vendorService.getMyVendorProfile as any).mockResolvedValue(mockProfile);
    (vendorService.getMyWithdrawals as any).mockResolvedValue([]);

    render(<KeuanganPage />);

    // Wait for the loader to clear and the dynamic content to render
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    // 1. Verify Bank Account details (shown in the "Rekening Tujuan" card)
    // bankName is shown as text in the dark card: profile.bankName
    expect(screen.getAllByText('BANK MANDIRI').length).toBeGreaterThan(0);
    expect(screen.getAllByText('123-456-789-0').length).toBeGreaterThan(0);
    expect(screen.getByText(/a\.n\. Wafa Deco Group/i)).toBeDefined();

    // 2. Verify financial statistics:
    // totalIncome = COMPLETED only: b1 netBalance = 10,000,000 * 0.95 = 9,500,000
    // totalHeld = CONFIRMED only: b2 netBalance = 4,000,000 * 0.95 = 3,800,000
    // These amounts appear in both stat cards AND transaction table rows
    expect(screen.getAllByText(/9\.500\.000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/3\.800\.000/).length).toBeGreaterThan(0);

    // 3. Verify transactions list rendering
    expect(screen.getByText(/Paket Wedding Rose \(Andini\)/i)).toBeDefined();
    expect(screen.getByText(/Engagement Gold \(Sarah\)/i)).toBeDefined();

    // Verify invoice short ID formatting (last 6 chars of id, uppercased)
    expect(screen.getByText(/#PLR-B1/i)).toBeDefined();
    expect(screen.getByText(/#PLR-B2/i)).toBeDefined();
  });
});
