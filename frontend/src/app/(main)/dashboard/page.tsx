'use client';

import React from 'react';
import DashboardClient from './dashboard-client';
import DashboardLayout from './DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardClient />
    </DashboardLayout>
  );
}
