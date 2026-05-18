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
    
    expect(screen.getByText(/Jakarta/i)).toBeDefined();
    // Badge antrean muncul dua kali (ANTREAN & TINJAU HARI INI) - gunakan getAllByText
    const antreanEl = screen.getAllByText(/01/);
    expect(antreanEl.length).toBeGreaterThan(0);
  });

  it('calls verifyVendor when SETUJUI is clicked', async () => {
    const mockVendors = [
      { id: 'v1', businessName: 'Vendor A', createdAt: '2026-05-14T10:00:00.000Z' }
    ];
    (adminService.getPendingVendors as any).mockResolvedValue(mockVendors);
    (adminService.verifyVendor as any).mockResolvedValue({ status: 'VERIFIED' });

    render(<AdminVerifikasiVendorPage />);

    await waitFor(() => {
      expect(screen.getByText('SETUJUI')).toBeDefined();
    });

    fireEvent.click(screen.getByText('SETUJUI'));

    await waitFor(() => {
      expect(adminService.verifyVendor).toHaveBeenCalledWith('v1');
    });
  });

  it('calls rejectVendor when Tolak (Trash icon) is clicked', async () => {
    const mockVendors = [
      { id: 'v1', businessName: 'Vendor A', createdAt: '2026-05-14T10:00:00.000Z' }
    ];
    (adminService.getPendingVendors as any).mockResolvedValue(mockVendors);
    (adminService.rejectVendor as any).mockResolvedValue({ status: 'REJECTED' });

    render(<AdminVerifikasiVendorPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Tolak vendor/i })).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: /Tolak vendor/i }));

    // In this implementation, we might prompt for a reason, but let's assume it sends 'Ditolak Admin' directly for simplicity.
    await waitFor(() => {
      expect(adminService.rejectVendor).toHaveBeenCalledWith('v1', 'Ditolak oleh admin');
    });
  });
});
