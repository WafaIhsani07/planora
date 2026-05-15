'use client';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminStatCard from '@/components/admin/AdminStatCard';
import StatusBadge from '@/components/admin/StatusBadge';

const HandCoinsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 11h.01" /><path d="M14 16h1" /><path d="M8 18h.01" /><path d="M12 2v4" /><path d="M6 6l-2 2" /><path d="M18 6l2 2" /><path d="M12 22v-4" /><path d="M3 12h18" /><path d="M12 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /></svg>
);
const WalletIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 7V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" /><path d="M16 12h5" /><circle cx="18" cy="12" r="1" /></svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
);

const withdrawals = [
  { vendor: 'Wafa Media Studio', bank: 'BCA • 1234567890', amount: 'Rp 8.250.000', status: 'menunggu', date: '14 APR 2026' },
  { vendor: 'Catering Jaya Raya', bank: 'Mandiri • 0987654321', amount: 'Rp 12.500.000', status: 'diproses', date: '13 APR 2026' },
  { vendor: 'Dekor Elegan', bank: 'BNI • 1122334455', amount: 'Rp 6.000.000', status: 'selesai', date: '12 APR 2026' },
];

const statusMap: Record<string, 'blue' | 'emerald' | 'red'> = {
  menunggu: 'blue',
  diproses: 'red',
  selesai: 'emerald',
};

export default function AdminPencairanDanaPage() {
  return (
    <>
      <AdminHeader searchPlaceholder="CARI NAMA VENDOR ATAU NOMINAL PENCAIRAN..." />

      <div className="p-8 pb-16">
        <div className="max-w-[1300px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#2A2A2A]/40 uppercase mb-2 block">
                ALUR PENYALURAN DANA MITRA
              </span>
              <h1 className="text-4xl md:text-[2.75rem] leading-[1.05] font-black italic tracking-tighter text-[#2A2A2A]">
                PENCAIRAN <br /> DANA.
              </h1>
            </div>

            <div className="flex items-center bg-white rounded-full px-8 py-2 border border-gray-100 shadow-sm h-14">
              <div className="flex flex-col items-center justify-center pr-8 border-r border-gray-100">
                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">PENDING</span>
                <span className="text-base font-black text-[#FF9A9E] leading-none mt-1">08</span>
              </div>
              <div className="flex flex-col items-center justify-center pl-8">
                <span className="text-[8px] font-bold tracking-widest text-[#A8A8A8] uppercase">TOTAL CAIR HARI INI</span>
                <span className="text-base font-black text-emerald-500 leading-none mt-1">Rp 42.5M</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AdminStatCard icon={<WalletIcon className="w-4 h-4" />} label="Saldo Escrow" value="Rp 840.2M" />
            <AdminStatCard icon={<ClockIcon className="w-4 h-4" />} label="Menunggu Proses" value="8 Request" valueClassName="text-[#FF9A9E]" iconWrapClassName="bg-[#FDF1F0] text-[#FF9A9E]" cardBorderClassName="border-[#FCE6E3]" />
            <AdminStatCard icon={<CheckCircleIcon className="w-4 h-4" />} label="Selesai Hari Ini" value="Rp 42.5M" valueClassName="text-emerald-500" iconWrapClassName="bg-emerald-50 text-emerald-500" cardBorderClassName="border-emerald-100/50" />
          </div>

          <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black italic tracking-tighter text-[#2A2A2A] uppercase mb-1">Daftar Request Pencairan</h2>
                <p className="text-[10px] font-bold tracking-[0.15em] text-[#A8A8A8] uppercase">Validasi rekening dan status payout vendor</p>
              </div>
              <StatusBadge text="08 MENUNGGU" variant="blue" rounded="md" />
            </div>

            <div className="flex flex-col w-full mb-8">
              <div className="flex items-center pb-5 border-b border-gray-100">
                <div className="w-[28%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Vendor</div>
                <div className="w-[22%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Rekening</div>
                <div className="w-[18%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Nominal</div>
                <div className="w-[16%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">Tanggal</div>
                <div className="w-[16%] text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase text-right pr-2">Aksi</div>
              </div>

              {withdrawals.map((item, index, arr) => (
                <div key={`${item.vendor}-${item.date}`} className={`flex items-center py-5 ${index < arr.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-[#FDF1F0]/30 transition-colors rounded-xl px-2`}>
                  <div className="w-[28%] flex flex-col">
                    <span className="text-[11px] font-extrabold text-[#2A2A2A] mb-0.5 tracking-tight">{item.vendor}</span>
                    <span className="text-[8px] font-medium text-[#2A2A2A]/30 uppercase tracking-wider">Diajukan vendor</span>
                  </div>
                  <div className="w-[22%] flex flex-col">
                    <span className="text-[10px] font-bold text-[#2A2A2A]/60 uppercase tracking-wider">{item.bank}</span>
                  </div>
                  <div className="w-[18%]">
                    <span className="text-[11px] font-bold text-[#2A2A2A] tracking-wider">{item.amount}</span>
                  </div>
                  <div className="w-[16%]">
                    <span className="text-[10px] font-bold text-[#2A2A2A]/60 uppercase tracking-wider">{item.date}</span>
                  </div>
                  <div className="w-[16%] flex justify-end gap-2">
                    <StatusBadge text={item.status === 'menunggu' ? 'MENUNGGU' : item.status === 'diproses' ? 'DIPROSES' : 'SELESAI'} variant={statusMap[item.status]} rounded="md" />
                  </div>
                </div>
              ))}
            </div>

            <AdminPagination pages={[1, 2]} currentPage={1} />
          </div>
        </div>
      </div>
    </>
  );
}