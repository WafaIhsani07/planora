const BagCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="m9 13 2 2 4-4" /></svg>
);
const ChartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 16v-4" /><path d="M12 16v-8" /><path d="M17 16V8" /></svg>
);
const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const FileImageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="10" cy="12" r="2" /><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" /></svg>
);
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

export default function VendorDashboardPage() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-2 block">
            HALO, WAHIDAH WAFA!
          </span>
          <h1 className="text-3xl md:text-[2.25rem] leading-[1] font-black italic tracking-tighter text-[#2A2A2A]">
            PUSAT KENDALI <br /> OPERASIONAL.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 rounded-full border border-gray-200 text-[#2A2A2A] text-[9px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors bg-white">
            EXPORT LAPORAN
          </button>
          <button className="px-5 py-3 rounded-full bg-[#2A2A2A] text-white text-[9px] font-bold tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors shadow-lg shadow-[#2A2A2A]/20">
            + TAMBAH LAYANAN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FCE6E3] text-[#2A2A2A] flex items-center justify-center">
              <BagCheckIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 tracking-wider">+12%</span>
          </div>
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase block mb-1">
              TOTAL PESANAN
            </span>
            <span className="text-[2rem] leading-none font-black text-[#2A2A2A] tracking-tight">1,284</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2A2A2A] text-white flex items-center justify-center">
              <ChartIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 tracking-wider">+8.4%</span>
          </div>
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase block mb-1">
              OMZET (IDR)
            </span>
            <span className="text-[2rem] leading-none font-black text-[#2A2A2A] tracking-tight">42.8M</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FCE6E3] text-[#2A2A2A] flex items-center justify-center">
              <StarIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">STABIL</span>
          </div>
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase block mb-1">
              RATING JASA
            </span>
            <span className="text-[2rem] leading-none font-black text-[#2A2A2A] tracking-tight">4.9/5</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2A2A2A] text-white flex items-center justify-center">
              <UsersIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 tracking-wider">+24</span>
          </div>
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase block mb-1">
              KLIEN BARU
            </span>
            <span className="text-[2rem] leading-none font-black text-[#2A2A2A] tracking-tight">156</span>
          </div>
        </div>
      </div>

      <div className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 min-h-0 bg-white p-5 rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-50">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-1">
                PESANAN TERBARU
              </h3>
              <span className="text-[9px] font-bold tracking-[0.15em] text-[#A8A8A8] uppercase">
                STATUS INTEGRASI JADWAL REAL-TIME
              </span>
            </div>
            <button className="text-[9px] font-bold tracking-[0.2em] text-[#2A2A2A] uppercase hover:underline flex items-center gap-1 mt-1">
              LIHAT SEMUA <ChevronRightIcon className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col w-full">
            <div className="flex pb-3 border-b border-gray-100">
              <div className="w-[35%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">ID & PELANGGAN</div>
              <div className="w-[30%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">JASA</div>
              <div className="w-[20%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">JADWAL</div>
              <div className="w-[15%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase text-right">STATUS</div>
            </div>

            <div className="flex items-center py-3 border-b border-dashed border-gray-100">
              <div className="w-[35%] flex flex-col">
                <span className="text-xs font-extrabold text-[#2A2A2A] mb-0.5">ANDI PRATAMA</span>
                <span className="text-[9px] font-bold text-gray-400">PLN-29302</span>
              </div>
              <div className="w-[30%] flex flex-col">
                <span className="text-[11px] font-bold text-[#2A2A2A]">DOKUMENTASI</span>
                <span className="text-[10px] font-medium text-gray-400">WEDDING</span>
              </div>
              <div className="w-[20%] flex flex-col">
                <span className="text-[11px] font-bold text-[#2A2A2A]">12 MEI</span>
                <span className="text-[10px] font-medium text-gray-400">2026</span>
              </div>
              <div className="w-[15%] flex justify-end">
                <span className="px-3 py-1.5 bg-[#EAF5EF] text-emerald-700 text-[8px] font-bold tracking-widest uppercase rounded-full">
                  SINKRON
                </span>
              </div>
            </div>

            <div className="flex items-center py-3">
              <div className="w-[35%] flex flex-col">
                <span className="text-xs font-extrabold text-[#2A2A2A] mb-0.5">SALSABILA MAULIDIA</span>
                <span className="text-[9px] font-bold text-gray-400">PLN-29322</span>
              </div>
              <div className="w-[30%] flex flex-col">
                <span className="text-[11px] font-bold text-[#2A2A2A]">VIDEO</span>
                <span className="text-[10px] font-medium text-gray-400">CINEMATIC</span>
              </div>
              <div className="w-[20%] flex flex-col">
                <span className="text-[11px] font-bold text-[#2A2A2A]">20 JUNI</span>
                <span className="text-[10px] font-medium text-gray-400">2026</span>
              </div>
              <div className="w-[15%] flex justify-end">
                <span className="px-3 py-1.5 bg-[#FFF4E5] text-orange-600 text-[8px] font-bold tracking-widest uppercase rounded-full">
                  MENUNGGU
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 min-h-0 bg-white p-5 rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col items-center justify-between text-center">
          <div className="flex flex-col items-center mt-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 shadow-inner border border-gray-100">
              <FileImageIcon className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-1">
              VERIFIKASI BAYAR
            </h3>
            <span className="text-[9px] font-bold tracking-[0.15em] text-[#A8A8A8] uppercase">
              ANTREAN BUKTI TRANSFER
            </span>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="w-full bg-[#FAFAFC] border border-gray-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <FileImageIcon className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-[#2A2A2A] uppercase">
                  BUKTI_TF_1.JPG
                </span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </div>

            <button className="w-full py-3 rounded-2xl bg-[#2A2A2A] text-white text-[9px] font-bold tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors shadow-lg shadow-[#2A2A2A]/20">
              LIHAT HISTORI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
