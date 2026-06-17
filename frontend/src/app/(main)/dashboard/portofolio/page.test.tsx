import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PortfolioPage from './page';
import * as vendorService from '@/services/vendor.service';

// Mock LanguageContext
vi.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({ t: (key: string) => key, language: 'id', setLanguage: vi.fn() }),
}));

// Mock DashboardLayout
vi.mock('../DashboardLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/portofolio',
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock vendor service
vi.mock('@/services/vendor.service', () => ({
  getMyPortfolio: vi.fn(),
  createPortfolio: vi.fn(),
  deletePortfolio: vi.fn(),
}));

// Mock orders lib
vi.mock('@/lib/orders', () => ({
  getPendingOrderCount: vi.fn(() => Promise.resolve(0)),
}));

describe('PortfolioPage (TDD Integration)', () => {
  const mockPortfolioList = [
    {
      id: 'port-123',
      title: 'Royal Wedding of Dian & Rian',
      description: 'Pernikahan mewah outdoor bernuansa garden rustic',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
      eventDate: '2026-03-12T00:00:00.000Z',
    },
    {
      id: 'port-456',
      title: 'Sweet 17 Glamour Gathering',
      description: 'Dekorasi panggung mewah dengan balutan lighting emas',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
      eventDate: '2026-04-18T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock response
    (vendorService.getMyPortfolio as any).mockResolvedValue(mockPortfolioList);
    (vendorService.createPortfolio as any).mockResolvedValue({
      id: 'port-789',
      title: 'New Event Decor',
      description: 'New decor details',
      imageUrl: 'https://images.unsplash.com/photo-foo',
      eventDate: '2026-05-18T00:00:00.000Z',
    });
    (vendorService.deletePortfolio as any).mockResolvedValue({ success: true });
    
    // Stub alert and confirm
    vi.stubGlobal('alert', vi.fn());
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('renders loading state initially', async () => {
    // Return a pending promise to keep loading state visible
    (vendorService.getMyPortfolio as any).mockReturnValue(new Promise(() => {}));
    
    render(<PortfolioPage />);
    
    expect(screen.getByTestId('loading-spinner')).toBeDefined();
  });

  it('renders portfolio list from database service', async () => {
    render(<PortfolioPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    expect(screen.getByText('Royal Wedding of Dian & Rian')).toBeDefined();
    expect(screen.getByText('Sweet 17 Glamour Gathering')).toBeDefined();
    // With the t() mock returning the key, the total count is embedded in the subtitle text
    // Check that both portfolio items are rendered (2 articles)
    expect(screen.getAllByRole('article').length).toBe(2);
  });

  it('supports creating a new portfolio item and submits correctly', async () => {
    render(<PortfolioPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    // Click on "add" button (rendered as i18n key with t() mock)
    // The button contains the i18n key text 'dashboard.portofolio.list.btnAdd'
    const addButton = screen.getByRole('button', { name: /dashboard\.portofolio\.list\.btnAdd/i });
    fireEvent.click(addButton);

    // Form inputs should be visible
    const titleInput = screen.getByTestId('portfolio-title');
    const descTextarea = screen.getByTestId('portfolio-desc');
    const dateInput = screen.getByTestId('portfolio-date');
    
    // Fill the inputs
    fireEvent.change(titleInput, { target: { value: 'New Event Decor' } });
    fireEvent.change(descTextarea, { target: { value: 'New decor details' } });
    fireEvent.change(dateInput, { target: { value: '2026-05-18' } });

    // Submit the form
    const saveButton = screen.getByTestId('submit-btn');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vendorService.createPortfolio).toHaveBeenCalledWith({
        title: 'New Event Decor',
        description: 'New decor details',
        imageUrl: expect.any(String), // We auto-assign a default high-quality image URL if none uploaded
        eventDate: '2026-05-18',
      });
    });
  });

  it('supports deleting an existing portfolio item', async () => {
    render(<PortfolioPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    const deleteButton = screen.getByTestId('delete-btn-port-123');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(vendorService.deletePortfolio).toHaveBeenCalledWith('port-123');
    });
  });
});
