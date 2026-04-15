'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);
const CalendarPlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><line x1="12" x2="12" y1="14" y2="18" /><line x1="10" x2="14" y1="16" y2="16" /></svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

type CalendarDay = {
    key: string;
    day: string;
    isPrevMonth: boolean;
    isNextMonth: boolean;
    isEvent: boolean;
    eventName?: string;
};

const MONTH_NAMES = [
    'JANUARI',
    'FEBRUARI',
    'MARET',
    'APRIL',
    'MEI',
    'JUNI',
    'JULI',
    'AGUSTUS',
    'SEPTEMBER',
    'OKTOBER',
    'NOVEMBER',
    'DESEMBER',
];

const CALENDAR_EVENTS: Record<string, string> = {
    '2026-05-12': 'ANDI PRATAMA',
    '2026-05-15': 'SITI AMINAH',
    '2026-06-20': 'RINA APRILIA',
    '2026-07-05': 'DIMAS PUTRA',
};

function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function buildCalendarDays(cursor: Date): CalendarDay[] {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startOffset = firstDayOfMonth.getDay();
    const startDate = new Date(year, month, 1 - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + index);

        const isCurrentMonth =
            cellDate.getFullYear() === year && cellDate.getMonth() === month;

        const eventName = CALENDAR_EVENTS[formatDateKey(cellDate)];
        const isPrevMonth =
            cellDate.getFullYear() < year ||
            (cellDate.getFullYear() === year && cellDate.getMonth() < month);
        const isNextMonth =
            cellDate.getFullYear() > year ||
            (cellDate.getFullYear() === year && cellDate.getMonth() > month);

        return {
            key: formatDateKey(cellDate),
            day: String(cellDate.getDate()).padStart(2, '0'),
            isPrevMonth,
            isNextMonth,
            isEvent: Boolean(eventName) && isCurrentMonth,
            eventName,
        };
    });
}

export default function PesananJadwalVendorPage() {
    const router = useRouter();
    const [calendarCursor, setCalendarCursor] = useState(() => new Date(2026, 4, 1));

    const calendarDays = useMemo(
        () => buildCalendarDays(calendarCursor),
        [calendarCursor],
    );

    const calendarTitle = `${MONTH_NAMES[calendarCursor.getMonth()]} ${calendarCursor.getFullYear()}`;

    const goToPrevMonth = () => {
        setCalendarCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCalendarCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    return (
        <div className="mx-auto flex h-full w-full max-w-[1320px] flex-col">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-end">
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-2 block">
                        LOGISTIK & PENJADWALAN
                    </span>
                    <h1 className="text-[1.7rem] md:text-[1.9rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
                        PESANAN & JADWAL EVENT.
                    </h1>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 items-center rounded-full border border-gray-100 bg-white px-3.5 py-1.5 shadow-sm">
                        <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-3.5">
                            <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">AKTIF</span>
                            <span className="mt-1 text-[11px] font-black leading-none text-[#2A2A2A]">12</span>
                        </div>
                        <div className="flex flex-col items-center justify-center pl-3.5">
                            <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">PENDING</span>
                            <span className="mt-1 text-[11px] font-black leading-none text-emerald-500">03</span>
                        </div>
                    </div>

                    <button className="flex h-9 items-center gap-2 rounded-full bg-[#2A2A2A] px-3.5 text-[8px] font-bold tracking-widest text-white uppercase transition-colors shadow-lg shadow-[#2A2A2A]/20 hover:bg-[#1a1a1a]">
                        <CalendarPlusIcon className="w-4 h-4" />
                        ATUR LIBUR
                    </button>
                </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-3">
                <div className="lg:col-span-2 min-h-0 bg-white rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-4 flex flex-col">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-black italic tracking-tighter text-[#2A2A2A] uppercase">
                            {calendarTitle}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="Bulan sebelumnya"
                                title="Bulan sebelumnya"
                                onClick={goToPrevMonth}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Bulan berikutnya"
                                title="Bulan berikutnya"
                                onClick={goToNextMonth}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="w-full min-h-0 flex-1 flex flex-col overflow-hidden rounded-2xl border-l border-t border-gray-100">
                        <div className="grid grid-cols-7 bg-[#FAFAFC] border-b border-gray-100">
                            {['MING', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map((day) => (
                                <div key={day} className="border-r border-gray-100 py-2 text-center text-[8px] font-bold tracking-[0.18em] text-[#A8A8A8] uppercase last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 auto-rows-fr flex-1 bg-white">
                            {calendarDays.map((date) => (
                                <div
                                    key={date.key}
                                    className={`relative flex min-h-[52px] flex-col justify-between border-b border-r border-gray-100 p-2 transition-colors last:border-r-0 ${date.isEvent
                                        ? 'z-10 -m-[1px] border-2 border-[#2A2A2A] bg-[#F6D5CF]'
                                        : date.isPrevMonth || date.isNextMonth
                                            ? 'bg-[#FAFAFC]'
                                            : 'bg-white'
                                        }`}
                                >
                                    <span className={`text-[10px] font-bold ${date.isPrevMonth || date.isNextMonth ? 'text-gray-300' : date.isEvent ? 'text-[#2A2A2A]' : 'text-gray-600'
                                        }`}>
                                        {date.day}
                                    </span>

                                    {date.isEvent ? (
                                        <div className="mt-auto inline-flex max-w-full flex-col">
                                            <span className="truncate text-[7px] font-extrabold leading-none tracking-[0.06em] text-[#2A2A2A] uppercase">
                                                {date.eventName}
                                            </span>
                                            <span className="mt-1 h-[2px] w-5 rounded-full bg-[#2A2A2A]" />
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 min-h-0 flex flex-col gap-3">
                    <div className="bg-white rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-4 flex flex-col">
                        <h3 className="mb-3 text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase">
                            AKSI HARI INI
                        </h3>

                        <div className="flex flex-col gap-2.5">
                            <div className="bg-[#EAF5EF] rounded-2xl p-2.5 flex items-center justify-between cursor-pointer border border-transparent hover:border-emerald-200 transition-colors group">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                                        <CheckCircleIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="mb-0.5 text-[10px] font-bold tracking-wider text-[#2A2A2A] uppercase">
                                            KONFIRMASI BAYAR
                                        </span>
                                        <span className="text-[8px] font-bold text-emerald-600 tracking-wider uppercase">
                                            BUKTI TRANSFER MASUK
                                        </span>
                                    </div>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                            </div>

                            <div className="bg-[#F4F4F5] rounded-2xl p-2.5 flex items-center justify-between cursor-pointer border border-transparent hover:border-gray-200 transition-colors group">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                                        <ClockIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="mb-0.5 text-[10px] font-bold tracking-wider text-[#2A2A2A] uppercase">
                                            REMINDER JADWAL
                                        </span>
                                        <span className="text-[8px] font-bold text-gray-400 tracking-wider uppercase">
                                            H-1 WEDDING ANDI
                                        </span>
                                    </div>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-4 flex flex-col flex-1 min-h-0">
                        <h3 className="mb-3 text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase">
                            PESANAN TERDEKAT
                        </h3>

                        <div className="flex flex-col gap-4 overflow-hidden">
                            <div className="flex flex-col border-b border-gray-100 pb-4">
                                <div className="mb-1.5 flex items-start justify-between gap-3">
                                    <h4 className="text-sm font-black italic tracking-tight text-[#2A2A2A] uppercase">
                                        ANDI PRATAMA
                                    </h4>
                                    <span className="shrink-0 rounded-full bg-[#EAF5EF] px-2 py-1 text-[7px] font-black tracking-[0.12em] text-emerald-600 uppercase">
                                        LUNAS
                                    </span>
                                </div>
                                <span className="mb-1 text-[9px] font-bold tracking-[0.16em] text-[#A8A8A8] uppercase">
                                    12 MEI 2026 • 09:00 WIB
                                </span>
                                <span className="mb-3 text-[10px] font-bold tracking-wide text-gray-500 uppercase">
                                    WEDDING PHOTO PRO • PADANG
                                </span>
                                <div className="flex items-center gap-2.5 mt-auto">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/dashboard/pesanan/PLN-29302')}
                                        className="inline-flex h-7 min-w-[78px] items-center justify-center rounded-lg bg-[#2A2A2A] px-3 text-[10px] font-black tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#1a1a1a]"
                                    >
                                        DETAIL
                                    </button>
                                    <button className="h-7 rounded-lg border border-gray-200 bg-white px-3 text-[8px] font-bold tracking-widest text-[#2A2A2A] uppercase transition-colors hover:bg-gray-50">
                                        CHAT KLIEN
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="mb-1.5 flex items-start justify-between gap-3">
                                    <h4 className="text-sm font-black italic tracking-tight text-[#2A2A2A] uppercase">
                                        SITI AMINAH
                                    </h4>
                                    <span className="shrink-0 rounded-full bg-[#FFF4E5] px-2 py-1 text-[7px] font-black tracking-[0.12em] text-[#F97316] uppercase">
                                        BOOKING
                                    </span>
                                </div>
                                <span className="mb-1 text-[9px] font-bold tracking-[0.16em] text-[#A8A8A8] uppercase">
                                    15 MEI 2026 • 13:00 WIB
                                </span>
                                <span className="mb-3 text-[10px] font-bold tracking-wide text-gray-500 uppercase">
                                    GRADUATION VIDEO • UNP PADANG
                                </span>
                                <div className="flex items-center gap-2.5 mt-auto">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/dashboard/pesanan/PLN-29322')}
                                        className="inline-flex h-7 min-w-[78px] items-center justify-center rounded-lg bg-[#2A2A2A] px-3 text-[10px] font-black tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#1a1a1a]"
                                    >
                                        DETAIL
                                    </button>
                                    <button className="h-7 rounded-lg border border-gray-200 bg-white px-3 text-[8px] font-bold tracking-widest text-[#2A2A2A] uppercase transition-colors hover:bg-gray-50">
                                        CHAT KLIEN
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
