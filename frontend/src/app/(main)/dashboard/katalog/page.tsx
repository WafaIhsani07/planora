const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
);
const FilterIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="6" y2="6" /><line x1="14" x2="14" y1="4" y2="8" /><line x1="4" x2="20" y1="18" y2="18" /><line x1="8" x2="8" y1="16" y2="20" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="17" x2="17" y1="10" y2="14" /></svg>
);

export default function VendorCatalogPage() {
    return (
        <div className="mx-auto flex h-full w-full max-w-[1360px] flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-2 block">
                        PUSAT PRODUK VENDOR
                    </span>
                    <h1 className="text-3xl md:text-[2.25rem] leading-[1] font-black italic tracking-tighter text-[#2A2A2A]">
                        KATALOG <br /> LAYANAN JASA.
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 text-[#2A2A2A] text-[9px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors bg-white">
                        <FilterIcon className="w-3.5 h-3.5" />
                        FILTER KATEGORI
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#2A2A2A] text-white text-[9px] font-bold tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors shadow-lg shadow-[#2A2A2A]/20">
                        <PlusIcon className="w-3.5 h-3.5" />
                        TAMBAH JASA BARU
                    </button>
                </div>
            </div>

            <div className="grid flex-1 min-h-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                <div className="bg-white rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                    <div className="w-full aspect-[16/9] bg-[#F4F4F5] relative overflow-hidden flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full text-gray-200" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" />
                        </svg>
                        <div className="absolute top-4 right-4 bg-[#EAF5EF] text-emerald-600 px-3 py-1.5 rounded-full text-[8px] font-extrabold tracking-widest uppercase shadow-sm">
                            AKTIF
                        </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-sm font-extrabold italic text-[#2A2A2A] tracking-tight mb-1">
                            WEDDING PHOTOGRAPHY PRO
                        </h3>
                        <span className="text-[8px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-3">
                            KATEGORI: FOTOGRAFI
                        </span>

                        <div className="bg-[#FAFAFC] rounded-2xl p-4 mb-3 flex flex-col justify-center">
                            <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-1">
                                HARGA MULAI DARI
                            </span>
                            <span className="text-xl font-black text-[#2A2A2A] tracking-tighter">
                                Rp 5.500.000
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mt-auto">
                            <button className="flex-1 py-2.5 bg-[#2A2A2A] text-white rounded-xl text-[8px] font-bold tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors">
                                EDIT DATA
                            </button>
                            <button className="flex-1 py-2.5 bg-white border border-gray-200 text-[#A8A8A8] hover:text-[#2A2A2A] hover:border-gray-300 rounded-xl text-[8px] font-bold tracking-widest uppercase transition-colors">
                                NONAKTIF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                    <div className="w-full aspect-[16/9] bg-[#F4F4F5] relative overflow-hidden flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full text-gray-200" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" />
                        </svg>
                        <div className="absolute top-4 right-4 bg-[#EAF5EF] text-emerald-600 px-3 py-1.5 rounded-full text-[8px] font-extrabold tracking-widest uppercase shadow-sm">
                            AKTIF
                        </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-sm font-extrabold italic text-[#2A2A2A] tracking-tight mb-1">
                            CINEMATIC HIGHLIGHT 4K
                        </h3>
                        <span className="text-[8px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-3">
                            KATEGORI: VIDEOGRAFI
                        </span>

                        <div className="bg-[#FAFAFC] rounded-2xl p-4 mb-3 flex flex-col justify-center">
                            <span className="text-[9px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-1">
                                HARGA MULAI DARI
                            </span>
                            <span className="text-xl font-black text-[#2A2A2A] tracking-tighter">
                                Rp 3.500.000
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mt-auto">
                            <button className="flex-1 py-2.5 bg-[#2A2A2A] text-white rounded-xl text-[8px] font-bold tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors">
                                EDIT DATA
                            </button>
                            <button className="flex-1 py-2.5 bg-white border border-gray-200 text-[#A8A8A8] hover:text-[#2A2A2A] hover:border-gray-300 rounded-xl text-[8px] font-bold tracking-widest uppercase transition-colors">
                                NONAKTIF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="rounded-[1.5rem] border-2 border-dashed border-gray-300 bg-transparent flex flex-col items-center justify-center text-center p-6 transition-colors hover:bg-white cursor-pointer group min-h-[280px]">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <PlusIcon className="w-6 h-6 text-[#2A2A2A]" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#2A2A2A] tracking-tight mb-1">
                        TAMBAH PAKET
                    </h3>
                    <span className="text-[8px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase">
                        PERLUAS LAYANAN BISNIS
                    </span>
                </div>
            </div>
        </div>
    );
}
