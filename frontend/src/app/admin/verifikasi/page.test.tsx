import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminVerifikasiVendorPage from './page';
import * as adminService from '@/services/admin.service';

// Mock services
vi.mock('@/services/admin.service', () => ({
  getPendingVendors: vi.fn(),
  verifyVendor: vi.fn(),
  rejectVendor: vi.fn(),
}));

// Mock AdminHeader since it might use Next.js hooks
vi.mock('@/components/admin/AdminHeader', () => ({
  default: () => <div data-testid="admin-header">Header Mock</div>
}));

describe('AdminVerifikasiVendorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (adminService.getPendingVendors as any).mockResolvedValue([]);
    render(<AdminVerifikasiVendorPage />);
    expect(screen.getByTestId('loading-spinner')).toBeDefined();
  });

  it('renders pending vendors list successfully', async () => {
    const mockVendors = [
      {
        id: 'v1',
        businessName: 'Vendor A',
        city: 'Jakarta',
        createdAt: '2026-05-14T10:00:00.000Z',
        user: { name: 'User A' }
      }
    ];
    (adminService.getPendingVendors as any).mockResolvedValue(mockVendors);

    render(<AdminVerifikasiVendorPage />);

    // Wait for the vendor to appear
    await waitFor(() => {
      expect(screen.getByText(/Vendor A/i)).toBeDefined();
    });
    
    // Check if the business name is rendered
    expect(screen.getByText(/Vendor A/i)).toBeDefined();
    // Check if User A is rendered
    expect(screen.getByText(/User A/i)).toBeDefined();
  });

  it('calls verifyVendor when Verifikasi is clicked', async () => {
    const mockVendors = [
      { id: 'v1', businessName: 'Vendor A', createdAt: '2026-05-14T10:00:00.000Z' }
    ];
    (adminService.getPendingVendors as any).mockResolvedValue(mockVendors);
    (adminService.verifyVendor as any).mockResolvedValue({ status: 'VERIFIED' });

    render(<AdminVerifikasiVendorPage />);

    // Must click "Lihat detail" first to open the panel
    await waitFor(() => {
      expect(screen.getByText('Lihat detail')).toBeDefined();
    });
    fireEvent.click(screen.getByText('Lihat detail'));

    await waitFor(() => {
      expect(screen.getByText('Verifikasi')).toBeDefined();
    });

    fireEvent.click(screen.getByText('Verifikasi'));

    await waitFor(() => {
      expect(adminService.verifyVendor).toHaveBeenCalledWith('v1');
    });
  });

  it('calls rejectVendor when Tolak is clicked', async () => {
    const mockVendors = [
      { id: 'v1', businessName: 'Vendor A', createdAt: '2026-05-14T10:00:00.000Z' }
    ];
    (adminService.getPendingVendors as any).mockResolvedValue(mockVendors);
    (adminService.rejectVendor as any).mockResolvedValue({ status: 'REJECTED' });

    render(<AdminVerifikasiVendorPage />);

    // Must click "Lihat detail" first to open the panel
    await waitFor(() => {
      expect(screen.getByText('Lihat detail')).toBeDefined();
    });
    fireEvent.click(screen.getByText('Lihat detail'));

    await waitFor(() => {
      const tolakButtons = screen.getAllByRole('button', { name: /Tolak/i });
      expect(tolakButtons.length).toBeGreaterThan(0);
    });

    // Click the last "Tolak" button (the one in the detail panel)
    const tolakButtons = screen.getAllByRole('button', { name: /Tolak/i });
    fireEvent.click(tolakButtons[tolakButtons.length - 1]);

    await waitFor(() => {
      expect(adminService.rejectVendor).toHaveBeenCalledWith('v1', 'Ditolak oleh admin');
    });
  });
});
