'use client';

type AdminPaginationProps = {
    pages: number[];
    currentPage: number;
    prevLabel?: string;
    nextLabel?: string;
};

const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

export default function AdminPagination({ pages, currentPage, prevLabel = 'SEBELUMNYA', nextLabel = 'SELANJUTNYA' }: AdminPaginationProps) {
    return (
        <div className="mt-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3 sm:px-6">
            <button type="button" className="flex h-10 w-fit items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 text-[9px] font-bold tracking-widest text-[#A8A8A8] uppercase transition-colors hover:bg-gray-50 hover:text-[#2A2A2A] justify-self-start">
                <ChevronLeftIcon className="w-3.5 h-3.5" />
                {prevLabel}
            </button>

            <div className="flex items-center justify-center gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-[10px] font-bold leading-none transition-colors ${page === currentPage
                                ? 'bg-[#2A2A2A] text-white shadow-md'
                                : 'bg-white border border-gray-100 text-[#A8A8A8] hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button type="button" className="flex h-10 w-fit items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 text-[9px] font-bold tracking-widest text-[#A8A8A8] uppercase transition-colors hover:bg-gray-50 hover:text-[#2A2A2A] justify-self-end">
                {nextLabel}
                <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
