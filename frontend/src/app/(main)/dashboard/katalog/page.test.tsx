import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import KatalogPage from './page';
import * as vendorService from '@/services/vendor.service';
import * as adminService from '@/services/admin.service';


// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/katalog',
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock vendor service
vi.mock('@/services/vendor.service', () => ({
  getMyLayanan: vi.fn(),
  createLayanan: vi.fn(),
  updateLayanan: vi.fn(),
  deleteLayanan: vi.fn(),
}));

// Mock admin service to get Kategori
vi.mock('@/services/admin.service', () => ({
  getAllKategori: vi.fn(),
}));

describe('KatalogPage (TDD Integration)', () => {
  const mockCategories = [
    { id: 'cat-1', name: 'Dekorasi Pernikahan', slug: 'dekorasi-pernikahan' },
    { id: 'cat-2', name: 'Dekorasi Lamaran', slug: 'dekorasi-lamaran' },
  ];

  const mockLayananList = [
    {
      id: 'lay-123',
      name: 'Paket Elegant Rose',
      description: 'Layanan dekorasi lengkap dengan bunga segar',
      price: '5000000',
      isActive: true,
      kategoriId: 'cat-1',
      images: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400'],
      kategori: { id: 'cat-1', name: 'Dekorasi Pernikahan' },
      bookings: [{}, {}, {}], // Mocks 3 orders
    },
    {
      id: 'lay-456',
      name: 'Paket Intimate Engagement',
      description: 'Dekorasi pertunangan minimalis modern',
      price: '3000000',
      isActive: true,
      kategoriId: 'cat-2',
      images: [],
      kategori: { id: 'cat-2', name: 'Dekorasi Lamaran' },
      bookings: [], // Mocks 0 orders
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminService.getAllKategori).mockResolvedValue(mockCategories);
    vi.mocked(vendorService.getMyLayanan).mockResolvedValue(mockLayananList);
  });

  it('renders loading state initially', async () => {
    render(<KatalogPage />);
    expect(screen.getByTestId('loading-spinner')).toBeDefined();
  });

  it('loads and renders list of service packages from backend successfully', async () => {
    render(<KatalogPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    expect(screen.getByText('Paket Elegant Rose')).toBeDefined();
    expect(screen.getByText('Paket Intimate Engagement')).toBeDefined();
    expect(screen.getByText('Dekorasi Pernikahan')).toBeDefined();
    expect(screen.getByText('Dekorasi Lamaran')).toBeDefined();

    // Verify stats cards are calculated dynamically
    expect(screen.getByText('2 Paket')).toBeDefined(); // Total packages
  });

  it('calls createLayanan API when submitting a new service package form', async () => {
    vi.mocked(vendorService.createLayanan).mockResolvedValue({
      id: 'lay-789',
      name: 'Paket Ulang Tahun Super',
      price: 2500000,
      kategoriId: 'cat-1',
      kategori: { name: 'Dekorasi Pernikahan' },
      bookings: [],
    });

    render(<KatalogPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    // Open add package form
    const addButton = screen.getByText('TAMBAH PAKET BARU');
    fireEvent.click(addButton);

    // Form inputs should be visible
    const nameInput = screen.getByTestId('name-input');
    const priceInput = screen.getByTestId('price-input');
    const descInput = screen.getByTestId('description-input');

    fireEvent.change(nameInput, { target: { value: 'Paket Ulang Tahun Super' } });
    fireEvent.change(priceInput, { target: { value: '2500000' } });
    fireEvent.change(descInput, { target: { value: 'Deskripsi lengkap' } });

    // Submit form
    const saveButton = screen.getByText('Simpan Paket');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vendorService.createLayanan).toHaveBeenCalledWith({
        name: 'Paket Ulang Tahun Super',
        kategoriId: 'cat-1', // Default category id from list
        price: '2500000',
        description: '\n\nDeskripsi lengkap',
        images: [],
      });
    });
  });

  it('calls deleteLayanan API when deleting a service package', async () => {
    vi.mocked(vendorService.deleteLayanan).mockResolvedValue({ success: true });

    render(<KatalogPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    // Find and click the delete button
    const deleteButton = screen.getByTestId('delete-btn-lay-123');
    fireEvent.click(deleteButton);

    // Confirm delete modal should be shown
    expect(screen.getByText('Hapus paket layanan?')).toBeDefined();
    
    const confirmButton = screen.getByText('Ya, Hapus');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(vendorService.deleteLayanan).toHaveBeenCalledWith('lay-123');
    });
  });
});
