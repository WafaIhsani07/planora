const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
);
const MessageCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
);
const MapPinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12" /></svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default function DetailPesananByIdPage() {
    return (
        <div className="mx-auto w-full max-w-[1200px]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-8">
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-2 block">
                        RINCIAN OPERASIONAL ACARA
                    </span>
                    <h1 className="text-3xl md:text-[2.25rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
                        ANDI PRATAMA <br /> WEDDING PHOTO.
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 h-10 rounded-full border border-emerald-200 text-emerald-600 bg-[#EAF5EF] hover:bg-emerald-50 text-[9px] font-bold tracking-widest uppercase transition-colors shadow-sm">
                        <CheckCircleIcon className="w-4 h-4" />
                        PESANAN SELESAI
                    </button>
                    <button className="flex items-center gap-2 px-5 h-10 rounded-full bg-[#2A2A2A] text-white text-[9px] font-bold tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors shadow-lg shadow-[#2A2A2A]/20">
                        <MessageCircleIcon className="w-4 h-4" />
                        CHAT PELANGGAN
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-8">
                <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
                    <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row gap-10 md:gap-20">
                        <div className="flex-1 flex flex-col gap-6">
                            <h3 className="text-sm font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-2">
                                INFORMASI KLIEN
                            </h3>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">NAMA PEMESAN</span>
                                <span className="text-sm font-bold text-[#2A2A2A]">ANDI PRATAMA SAPUTRA</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">KONTAK WHATSAPP</span>
                                <span className="text-sm font-bold text-[#2A2A2A]">0812-7722-XXXX</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">EMAIL PELANGGAN</span>
                                <span className="text-sm font-bold text-[#2A2A2A]">andi.pratama@gmail.com</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-6">
                            <h3 className="text-sm font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-2">
                                JADWAL & WAKTU
                            </h3>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">TANGGAL ACARA</span>
                                <span className="text-sm font-bold text-[#2A2A2A]">12 MEI 2026</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">WAKTU PELAKSANAAN</span>
                                <span className="text-sm font-bold text-[#2A2A2A]">08:00 - 14:00 WIB</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">DURASI LAYANAN</span>
                                <span className="text-sm font-bold text-[#2A2A2A] uppercase">6 JAM DOKUMENTASI</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10 flex flex-col">
                        <h3 className="text-sm font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-6">
                            PAKET YANG DIPILIH
                        </h3>

                        <div className="bg-[#FAFAFC] rounded-[1.5rem] p-6 md:p-8 flex flex-col border border-gray-50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-200 pb-6">
                                <div className="flex flex-col">
                                    <span className="text-base md:text-lg font-black italic tracking-tight text-[#2A2A2A] uppercase mb-1">
                                        WEDDING DOCUMENTATION PRO
                                    </span>
                                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
                                        ID PAKET: CAT-PRO-01
                                    </span>
                                </div>
                                <div className="text-xl md:text-2xl font-black text-[#2A2A2A] tracking-tighter">
                                    Rp 5.500.000
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#EAF5EF] text-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase mt-0.5">2 PHOTOGRAPHER PROFESSIONAL</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#EAF5EF] text-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase mt-0.5">ALBUM PREMIUM 10R</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#EAF5EF] text-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase mt-0.5">UNLIMITED PHOTOSHOOT</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#EAF5EF] text-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-widest text-[#2A2A2A] uppercase mt-0.5">SOFTCOPY FLASHDISK 32GB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
                    <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col">
                        <h3 className="text-sm font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-6">
                            LOKASI ACARA
                        </h3>

                        <div className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 bg-[#FAFAFC] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all mb-6">
                            <MapPinIcon className="w-6 h-6 text-[#A8A8A8] mb-3" />
                            <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">BUKA GOOGLE MAPS</span>
                        </div>

                        <p className="text-[11px] font-bold text-[#2A2A2A] leading-relaxed uppercase">
                            GEDUNG SERBAGUNA UNP, JL. PROF. DR. HAMKA, PADANG UTARA.
                        </p>
                    </div>

                    <div className="bg-[#2A2A2A] rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(42,42,42,0.3)] p-8 flex flex-col text-white">
                        <h3 className="text-sm font-black italic tracking-tighter text-white uppercase mb-6">
                            CATATAN KHUSUS
                        </h3>
                        <p className="text-sm text-gray-300 italic leading-relaxed mb-8">
                            "Mohon tim fotografer stand-by dari jam 07.30 untuk sesi make-up. Utamakan banyak foto candid keluarga inti pengantin."
                        </p>

                        <div className="bg-white/10 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-[9px] font-bold tracking-[0.2em] text-gray-300 uppercase mt-0.5">
                                UPDATE 2 HARI YANG LALU
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col">
                        <h3 className="text-sm font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-6">
                            PEMBAYARAN
                        </h3>

                        <div className="flex flex-col gap-4 mb-6 border-b border-gray-100 pb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">UANG MUKA (DP)</span>
                                <span className="text-[10px] font-bold text-[#2A2A2A]">RP 1.500.000</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">PELUNASAN</span>
                                <span className="text-[10px] font-bold text-[#2A2A2A]">RP 4.000.000</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-6">
                            <span className="text-[11px] font-bold tracking-[0.2em] text-[#2A2A2A] uppercase">TOTAL AKHIR</span>
                            <span className="text-lg font-black tracking-tighter text-[#2A2A2A]">Rp 5.500.000</span>
                        </div>

                        <div className="w-full bg-[#EAF5EF] text-emerald-600 rounded-xl py-3 flex items-center justify-center border border-emerald-100">
                            <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase mt-0.5">STATUS: TERBAYAR LUNAS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
