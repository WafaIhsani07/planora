import type { ReactNode } from 'react';

// Layout sidebar & auth guard sudah ditangani oleh parent vendor/layout.tsx
export default function VendorDashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

