"use client";

import { useState } from 'react';
import { Bell, Menu } from 'lucide-react';

type AdminHeaderProps = {
  searchPlaceholder?: string;
  onToggleSidebar?: () => void;
  hideSearch?: boolean;
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function AdminHeader({
  searchPlaceholder = 'Cari sesuatu...',
  onToggleSidebar,
  hideSearch = false,
}: AdminHeaderProps) {
  const [notifCount] = useState(3);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#F4D7D4] bg-[#FDF1F0] px-4 shadow-[0_1px_0_rgba(15,23,42,0.03)] md:px-8">
      <div className="flex items-center gap-4 md:gap-6">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-[#A8A8A8] transition-colors hover:bg-white/60 hover:text-[#2A2A2A]"
            aria-label="Buka sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {!hideSearch && (
          <div className="relative w-[clamp(12rem,36vw,18rem)]">
            <SearchIcon className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-[#D8A7A0]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-full rounded-xl border border-[#F4D7D4] bg-white/80 py-2 pl-10 pr-3 text-sm font-semibold text-[#2A2A2A] placeholder-[#D8A7A0] transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/15"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button type="button" className="relative cursor-pointer text-[#A8A8A8] transition-colors hover:text-[#FF9A9E]">
          <Bell className="w-5 h-5" />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#FDF1F0] bg-[#FF9A9E] text-[8px] font-bold text-white">
              {notifCount}
            </span>
          )}
        </button>

        <div className="flex cursor-pointer items-center gap-3 border-l border-[#F4D7D4] pl-3 md:pl-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF8E92] text-xs font-bold text-white">
            A
          </div>
          <div className="hidden flex-col text-left sm:flex">
            <p className="text-xs font-extrabold leading-none text-[#2A2A2A]">Admin Planora</p>
            <p className="mt-1 text-[9px] font-bold text-[#A8A8A8]">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}