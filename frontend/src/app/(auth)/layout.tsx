"use client";

import { useSelectedLayoutSegment } from "next/navigation";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const segment = useSelectedLayoutSegment();

  if (segment === "register") {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {children}
      </section>
    </main>
  );
}