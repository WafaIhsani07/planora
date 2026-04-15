"use client";

import Navbar from "@/components/layout/Navbar";
import PageWrapper from "@/components/layout/PageWrapper";
import { useSelectedLayoutSegment } from "next/navigation";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const segment = useSelectedLayoutSegment();

  if (segment === "dashboard") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <PageWrapper>{children}</PageWrapper>
    </div>
  );
}