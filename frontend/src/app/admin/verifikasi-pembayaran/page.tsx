'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { getAllPayments, verifyPayment } from '@/services/admin.service';
import { useLanguage } from '@/contexts/LanguageContext';

type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
type FilterTab = 'all' | PaymentStatus;

type PaymentItem = {
	id: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	vendorName: string;
	vendorCategory: string;
	vendorInit: string;
	transferDate: string;
	transferTime: string;
	amount: string;
	type: string;
	packageName: string;
	totalOrder: string;
	paymentMethod: string;
	bankName: string;
	targetAccount: string;
	accountName: string;
	actualTransferTime: string;
	reviewedAt?: string | null;
	status: PaymentStatus;
	note: string;
    proofUrl: string;
    rawMode: string;
    rawDpStatus: string | null;
    rawPelunasanStatus: string | null;
};

const statusBadgeClasses: Record<PaymentStatus, string> = {
	PENDING: 'bg-orange-50 text-orange-600 border border-orange-100',
	PAID: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
	FAILED: 'bg-rose-50 text-rose-600 border border-rose-100',
    REFUNDED: 'bg-slate-50 text-slate-600 border border-slate-200'
};

function ClockIcon({ className }: { className?: string }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);
}

function CheckCircleIcon({ className }: { className?: string }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<path d="m9 11 3 3L22 4" />
		</svg>
	);
}

function XCircleIcon({ className }: { className?: string }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
			<circle cx="12" cy="12" r="10" />
			<path d="m15 9-6 6" />
			<path d="m9 9 6 6" />
		</svg>
	);
}

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
			<circle cx="11" cy="11" r="7" />
			<path d="m20 20-3.5-3.5" />
		</svg>
	);
}

function CalendarIcon({ className }: { className?: string }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<path d="M16 2v4M8 2v4M3 10h18" />
		</svg>
	);
}

function ChevronDownIcon({ className }: { className?: string }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);
}

function FunnelIcon({ className }: { className?: string }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
			<path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
		</svg>
	);
}

export default function AdminPaymentVerificationPage() {
    const { t } = useLanguage();
	const [payments, setPayments] = useState<PaymentItem[]>([]);
	const [activeTab, setActiveTab] = useState<FilterTab>('all');
	const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [methodFilter, setMethodFilter] = useState('all');
	const [dateFrom, setDateFrom] = useState('');
	const [dateTo, setDateTo] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [successModal, setSuccessModal] = useState<{show: boolean, message: string}>({ show: false, message: '' });

    const loadPayments = async () => {
        setIsLoading(true);
        const data = await getAllPayments();
        const mapped: PaymentItem[] = (data.payments || []).map((p: any) => {
                    const date = new Date(p.createdAt);
                    
                    let currentAmount = p.amount;
                    let currentStatus = p.status;
                    let currentProof = p.proofUrl;
                    let currentMethod = p.method;
                    let currentType = 'LUNAS (100%)';

                    if (p.mode === 'DP') {
                        if (p.dpStatus !== 'PAID') {
                            currentAmount = p.dpAmount;
                            currentStatus = p.dpStatus || 'PENDING';
                            currentProof = p.dpProofUrl;
                            currentMethod = p.dpMethod;
                            currentType = 'DP (30%)';
                        } else {
                            currentAmount = p.pelunasanAmount;
                            currentStatus = p.pelunasanStatus || 'PENDING';
                            currentProof = p.pelunasanProofUrl;
                            currentMethod = p.pelunasanMethod;
                            currentType = 'PELUNASAN (70%)';
                        }
                    }

                    return {
                        id: p.id,
                        customerName: p.booking?.customer?.name || '-',
                        customerEmail: p.booking?.customer?.email || '-',
                        customerPhone: p.booking?.customer?.phone || '-',
                        vendorName: p.booking?.vendor?.businessName || '-',
                        vendorCategory: '-',
                        vendorInit: p.booking?.vendor?.businessName?.charAt(0) || 'V',
                        transferDate: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
                        transferTime: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                        amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(currentAmount || p.amount),
                        type: currentType,
                        packageName: p.booking?.layanan?.name || '-',
                        totalOrder: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.amount),
                        paymentMethod: currentMethod === 'BANK_TRANSFER' ? 'Transfer Bank' : currentMethod || '-',
                        bankName: '-',
                        targetAccount: '-',
                        accountName: '-',
                        actualTransferTime: date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID'),
                        reviewedAt: p.verifiedAt,
                        status: currentStatus,
                        note: p.note || '',
                        proofUrl: currentProof || '',
                        rawMode: p.mode || 'FULL',
                        rawDpStatus: p.dpStatus || null,
                        rawPelunasanStatus: p.pelunasanStatus || null
                    };
        });
        setPayments(mapped);
        setIsLoading(false);
    };

    useEffect(() => {
        loadPayments();
    }, []);

	const counts = useMemo(() => ({
		PENDING: payments.filter(p => p.status === 'PENDING').length,
		PAID: payments.filter(p => p.status === 'PAID').length,
		FAILED: payments.filter(p => p.status === 'FAILED').length,
	}), [payments]);

	const filteredPayments = useMemo(() => {
		return payments.filter(payment => {
            if (activeTab !== 'all' && payment.status !== activeTab) return false;
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!payment.id.toLowerCase().includes(query) && 
                    !payment.customerName.toLowerCase().includes(query) && 
                    !payment.vendorName.toLowerCase().includes(query)) {
                    return false;
                }
            }
            return true;
        });
	}, [payments, activeTab, searchQuery]);

	const selectedPayment = payments.find(p => p.id === selectedInvoice) ?? null;
	const formatOrderNumber = (id: string) => `INV-${id.split('/').pop() ?? id}`;
	const isSameDay = (left: Date, right: Date) =>
		left.getFullYear() === right.getFullYear() &&
		left.getMonth() === right.getMonth() &&
		left.getDate() === right.getDate();
	const pendingCount = counts.PENDING;
	const receivedTodayCount = payments.filter(payment => payment.reviewedAt && isSameDay(new Date(payment.reviewedAt), new Date()) && payment.status !== 'FAILED').length;
	const tabFilters = [
		{ key: 'all', label: t('admin_pages.pembayaran.tabs.all'), value: payments.length },
		{ key: 'PENDING', label: t('admin_pages.pembayaran.tabs.pending'), value: counts.PENDING },
		{ key: 'PAID', label: t('admin_pages.pembayaran.tabs.verified'), value: counts.PAID },
		{ key: 'FAILED', label: t('admin_pages.pembayaran.tabs.rejected'), value: counts.FAILED },
	] as const;

	const handleSelect = (invoice: string) => setSelectedInvoice(invoice);
	const handleClose = () => setSelectedInvoice(null);

	const handleUpdateStatus = async (invoice: string, status: 'PAID' | 'FAILED' | 'PENDING') => {
        let note = '';
        if (status === 'FAILED') {
            const reason = window.prompt("Masukkan alasan penolakan:");
            if (reason === null) return;
            note = reason;
        }

        // Optimistic UI Update: Langsung ubah status di state agar UI merespon seketika
        setPayments(prev => prev.map(p => p.id === invoice ? { ...p, status, note } : p));
        
        // Langsung tampilkan modal sukses
        setSuccessModal({ 
            show: true, 
            message: `Pembayaran ${formatOrderNumber(invoice)} berhasil ${status === 'PAID' ? 'diverifikasi' : 'ditolak'}.` 
        });

        // Pindah ke invoice PENDING berikutnya jika ada
        const next = payments.find(p => p.id !== invoice && p.status === 'PENDING');
        setSelectedInvoice(next ? next.id : null);

        try {
            // Determine type based on mode and dpStatus
            const paymentObj = payments.find(p => p.id === invoice);
            let paymentType = 'FULL';
            if (paymentObj && paymentObj.rawMode === 'DP') {
                if (paymentObj.rawDpStatus !== 'PAID') {
                    paymentType = 'DP';
                } else {
                    paymentType = 'PELUNASAN';
                }
            }

            // Lakukan request ke backend di background
            await verifyPayment(invoice, { status, note, type: paymentType });
            
            // (Opsional) Refresh data asli di background agar selalu sinkron tanpa memblokir UI
            getAllPayments().then(data => {
                const mapped: PaymentItem[] = (data.payments || []).map((p: any) => {
                    const date = new Date(p.createdAt);
                    
                    let currentAmount = p.amount;
                    let currentStatus = p.status;
                    let currentProof = p.proofUrl;
                    let currentMethod = p.method;
                    let currentType = 'LUNAS (100%)';

                    if (p.mode === 'DP') {
                        if (p.dpStatus !== 'PAID') {
                            currentAmount = p.dpAmount;
                            currentStatus = p.dpStatus || 'PENDING';
                            currentProof = p.dpProofUrl;
                            currentMethod = p.dpMethod;
                            currentType = 'DP (30%)';
                        } else {
                            currentAmount = p.pelunasanAmount;
                            currentStatus = p.pelunasanStatus || 'PENDING';
                            currentProof = p.pelunasanProofUrl;
                            currentMethod = p.pelunasanMethod;
                            currentType = 'PELUNASAN (70%)';
                        }
                    }

                    return {
                        id: p.id,
                        customerName: p.booking?.customer?.name || '-',
                        customerEmail: p.booking?.customer?.email || '-',
                        customerPhone: p.booking?.customer?.phone || '-',
                        vendorName: p.booking?.vendor?.businessName || '-',
                        vendorCategory: '-',
                        vendorInit: p.booking?.vendor?.businessName?.charAt(0) || 'V',
                        transferDate: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
                        transferTime: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                        amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(currentAmount || p.amount),
                        type: currentType,
                        packageName: p.booking?.layanan?.name || '-',
                        totalOrder: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.amount),
                        paymentMethod: currentMethod === 'BANK_TRANSFER' ? 'Transfer Bank' : currentMethod || '-',
                        bankName: '-',
                        targetAccount: '-',
                        accountName: '-',
                        actualTransferTime: date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID'),
                        reviewedAt: p.verifiedAt,
                        status: currentStatus,
                        note: p.note || '',
                        proofUrl: currentProof || '',
                        rawMode: p.mode || 'FULL',
                        rawDpStatus: p.dpStatus || null,
                        rawPelunasanStatus: p.pelunasanStatus || null
                    };
                });
                setPayments(mapped);
            });
        } catch (error) {
            console.error(error);
            alert("Gagal memverifikasi pembayaran. Mengembalikan data sebelumnya...");
            // Rollback jika gagal
            loadPayments();
        }
	};

	return (
		<>
			<AdminHeader hideSearch />

			<div className="min-h-screen bg-[#FDF1F0] px-8 py-5 text-[#2A2A2A]">
				<div className="mx-auto flex max-w-[1300px] flex-col gap-6">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
						<div>
								<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A2A2A]/40">{t('admin_pages.pembayaran.subtitle')}</span>
								<h1 className="text-2xl xl:text-3xl font-black tracking-tight text-[#2A2A2A]">{t('admin_pages.pembayaran.title')}</h1>
							</div>

						<div className="flex h-14 items-center rounded-full border border-[#F4D7D4] bg-white px-4 shadow-sm sm:px-5">
							<div className="flex min-w-[108px] flex-col items-center justify-center border-r border-[#F4D7D4] pr-3 sm:min-w-[120px] sm:pr-5">
								<span className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#A8A8A8]">MENUNGGU</span>
								<span className="mt-0.5 text-base font-black leading-none text-[#FF5B7A]">{pendingCount.toString().padStart(2, '0')}</span>
							</div>
							<div className="flex min-w-[108px] flex-col items-center justify-center pl-3 sm:min-w-[120px] sm:pl-5">
								<span className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#A8A8A8]">DITERIMA HARI INI</span>
								<span className="mt-0.5 text-base font-black leading-none text-emerald-500">{receivedTodayCount.toString().padStart(2, '0')}</span>
							</div>
						</div>
					</div>

					<div className="space-y-5">
						<div className="flex flex-wrap items-center gap-4 lg:gap-5 rounded-[2rem] bg-[#FDF1F0] p-0">
							{tabFilters.map((tab) => {
								const active = activeTab === tab.key;
								return (
									<button
										key={tab.key}
										onClick={() => {
											setActiveTab(tab.key);
											setSelectedInvoice(null);
										}}
										className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${active ? 'bg-[#FF9A9E] text-white shadow-[0_8px_24px_-6px_rgba(255,94,126,0.24)]' : 'bg-white text-[#A8A8A8] border border-[#F4D7D4]'}`}
									>
										<span>{tab.label}</span>
										<span className={`${active ? 'bg-white text-[#FF5E7E]' : 'bg-[#F4F4F6] text-[#A8A8A8]'} w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold`}>{tab.value}</span>
									</button>
								);
							})}
						</div>

						<div className="mt-2 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.6fr_0.9fr]">
							<div className="flex h-12 items-center gap-3 rounded-xl border border-[#F4D7D4] bg-white px-4 shadow-sm">
								<SearchIcon className="h-4 w-4 shrink-0 text-[#A8A8A8]" />
								<input
									type="text"
									value={searchQuery}
									onChange={(event) => setSearchQuery(event.target.value)}
									placeholder={t('admin_pages.pembayaran.search')}
									className="w-full bg-transparent text-sm font-semibold text-[#2A2A2A] placeholder:text-[#A8A8A8] focus:outline-none"
								/>
							</div>

							<div className="relative flex h-12 items-center rounded-xl border border-[#F4D7D4] bg-white px-4 shadow-sm">
								<select
									value={methodFilter}
									onChange={(event) => setMethodFilter(event.target.value)}
									className="w-full appearance-none bg-transparent pr-8 text-sm font-semibold text-[#2A2A2A] focus:outline-none"
								>
									<option value="all">{t('admin_pages.pembayaran.all_status')}</option>
									<option value="transfer">Transfer</option>
									<option value="va">Virtual Account</option>
								</select>
								<ChevronDownIcon className="pointer-events-none absolute right-3 h-4 w-4 text-[#A8A8A8]" />
							</div>
                            
						</div>

						<div className="grid items-start gap-6 lg:grid-cols-12">
							<div id="table-panel" className={`self-start overflow-hidden rounded-2xl border border-[#F4D7D4] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] ${selectedPayment ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
								<table className="w-full table-fixed border-collapse text-left" style={{ willChange: 'transform', borderSpacing: 0 }}>
										<thead>
											<tr className="border-b border-[#F4D7D4]/60 bg-[#FAFAFC] text-[10px] font-black uppercase tracking-widest text-[#A8A8A8]">
											<th className="px-6 py-5">{t('admin_pages.pembayaran.table.transaction')}</th>
											<th className="px-6 py-5">{t('admin_pages.pembayaran.table.client')}</th>
											<th className="px-6 py-5">Vendor</th>
											<th className="px-6 py-5">{t('admin_pages.pembayaran.table.date')}</th>
											<th className="px-6 py-5">{t('admin_pages.pembayaran.table.amount')}</th>
											<th className="px-6 py-5">Metode</th>
											<th className="px-6 py-5">{t('admin_pages.pembayaran.table.status')}</th>
											<th className="px-6 py-5 text-center align-middle">{t('common.action')}</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-[#F4D7D4]/40">
											{filteredPayments.length === 0 ? (
												<tr>
													<td colSpan={8} className="px-6 py-20 text-center text-xs font-bold uppercase tracking-widest text-slate-300">
														Tidak ada antrean pembayaran dalam kategori ini
													</td>
												</tr>
											) : filteredPayments.map((payment) => {
												const isSelected = selectedInvoice === payment.id;
												return (
													<tr
														key={payment.id}
														className={`cursor-pointer bg-white hover:bg-[#FAFAFC] transition-none ${isSelected ? 'bg-[#FFF5F6]' : ''}`}
														onClick={() => handleSelect(payment.id)}
													>
                                                        
														<td className="px-4 py-3 align-middle">
															<div className="break-words text-xs font-black leading-tight tracking-widest uppercase text-[#2A2A2A]" title={payment.id}>{formatOrderNumber(payment.id)}</div>
															<div className="mt-1 text-[8px] font-medium uppercase tracking-wider text-[#2A2A2A]/30">{payment.type}</div>
														</td>
														<td className="px-4 py-3 align-middle">
															<div className="flex items-center gap-2">
																<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF8E92]/20 text-[10px] font-extrabold text-[#FF5E7E]">{payment.customerName.charAt(0)}</div>
																<div className="overflow-hidden">
																	<div className="break-words text-xs font-black leading-tight text-[#2A2A2A]">{payment.customerName}</div>
																</div>
															</div>
														</td>
														<td className="px-4 py-3 align-middle">
															<div className="flex items-center gap-2">
																<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0A0A0A] text-[10px] font-extrabold text-white">{payment.vendorInit}</div>
																<div className="overflow-hidden">
																	<div className="break-words text-xs font-black leading-tight text-[#2A2A2A]">{payment.vendorName}</div>
																	<div className="mt-0.5 break-words text-[9px] font-bold leading-tight text-slate-400">{payment.vendorCategory}</div>
																</div>
															</div>
														</td>
														<td className="px-4 py-3 align-middle">
															<div className="text-xs font-black leading-tight text-[#2A2A2A]">{payment.transferDate}</div>
															<div className="mt-0.5 text-[10px] font-bold leading-tight text-slate-400">{payment.transferTime}</div>
														</td>
														<td className="px-4 py-3 align-middle">
															<div className="whitespace-nowrap text-sm font-black text-[#2A2A2A]">{payment.amount}</div>
														</td>
														<td className="px-4 py-3 align-middle">
															<div className="text-[10px] font-bold uppercase tracking-wider text-[#2A2A2A]/60">{payment.paymentMethod}</div>
														</td>
														<td className="w-[96px] px-2 py-3 align-middle">
															<span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${statusBadgeClasses[payment.status]}`}>{payment.status === 'PENDING' ? t('admin_pages.verifikasi.status_pending') : payment.status === 'PAID' ? t('admin_pages.verifikasi.status_verified') : payment.status === 'FAILED' ? t('admin_pages.verifikasi.status_rejected') : 'Refund'}</span>
														</td>
														<td className="w-[120px] px-2 py-3 text-left align-middle" onClick={(e) => e.stopPropagation()}>
															{payment.status === 'PENDING' ? (
																<div className="flex justify-start">
																	<button
																		type="button"
																		onClick={() => handleSelect(payment.id)}
																		className="rounded-full border border-[#FF9A9E]/30 bg-white px-3 py-1.5 text-[11px] font-bold text-[#FF5E7E] transition-colors hover:bg-[#FFF5F6]"
																		aria-label={`Verifikasi ${payment.id}`}
																	>
																		{t('admin_pages.pembayaran.btn_verify')}
																	</button>
																</div>
															) : payment.status === 'PAID' ? (
																<div className="flex items-center gap-2">
																	<span className="text-[10px] font-black text-emerald-600">{t('admin_pages.verifikasi.status_verified')}</span>
																	<button type="button" onClick={() => handleSelect(payment.id)} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">{t('common.view_detail')}</button>
																</div>
															) : (
																<div className="flex items-center gap-2">
																	<button type="button" onClick={() => handleSelect(payment.id)} className="rounded-full border border-[#F4D7D4] bg-white px-3 py-1 text-xs font-bold text-[#FF5E7E]">{t('common.view_detail')}</button>
																</div>
															)}
														</td>
													</tr>
												);
											})}
										</tbody>
										</table>

								<div className="flex flex-col items-center justify-between gap-4 border-t border-[#F4D7D4] bg-white p-6 sm:flex-row">
									<span className="text-xs font-bold text-slate-400">{t('common.showing_data').replace('{start}', '1').replace('{end}', filteredPayments.length.toString()).replace('{total}', filteredPayments.length.toString())}</span>
									<div className="flex items-center gap-1.5">
										<button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:bg-slate-50">‹</button>
										<button className="h-8 w-8 rounded-lg bg-[#FF9A9E] text-xs font-black text-white">1</button>
										<button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-black text-slate-400 transition-all hover:bg-slate-50">2</button>
										<button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-black text-slate-400 transition-all hover:bg-slate-50">3</button>
										<button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:bg-slate-50">›</button>
									</div>
									<div className="relative">
										<select className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-10 text-xs font-semibold text-slate-500 focus:outline-none">
											<option>{t('common.per_page').replace('{count}', '10')}</option>
										</select>
										<div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</div>
									</div>
								</div>
							</div>

							<div id="detail-panel" className={`self-start overflow-hidden rounded-2xl border border-[#F4D7D4] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] ${selectedPayment ? 'block lg:col-span-4' : 'hidden'}`}>
								{selectedPayment ? (
									<>
										<div className="flex items-center justify-between border-b border-[#F4D7D4] p-6">
											<h4 className="text-sm font-black uppercase tracking-wider text-[#2A2A2A]">{t('admin_pages.pembayaran.detail')}</h4>
											<button onClick={handleClose} className="text-slate-300 transition-colors hover:text-slate-600" aria-label="Tutup detail">
												<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
											</button>
										</div>

										<div className="space-y-6 p-6">
											<div>
												<h4 className="mb-1 text-base font-black leading-tight text-[#2A2A2A]">{formatOrderNumber(selectedPayment.id)}</h4>
												<p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{selectedPayment.transferDate} • {selectedPayment.transferTime}</p>
												<div className="mt-3">
													<span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${statusBadgeClasses[selectedPayment.status]}`}>
														{selectedPayment.status === 'PENDING' ? t('admin_pages.verifikasi.status_pending') : selectedPayment.status === 'PAID' ? t('admin_pages.verifikasi.status_verified') : selectedPayment.status === 'FAILED' ? t('admin_pages.verifikasi.status_rejected') : 'Refunded'}
													</span>
												</div>
											</div>

											<div className="space-y-4 border-t border-[#F4D7D4] pt-6">
												<h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Informasi Pesanan</h5>
												<div className="space-y-3">
													<div className="grid grid-cols-[120px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">Customer</span><span className="text-left font-black text-[#2A2A2A]">{selectedPayment.customerName}</span></div>
													<div className="grid grid-cols-[120px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">Vendor</span><span className="text-left font-black text-[#2A2A2A]">{selectedPayment.vendorName}</span></div>
													<div className="grid grid-cols-[120px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">Paket</span><span className="text-left font-black text-[#2A2A2A]">{selectedPayment.packageName}</span></div>
													<div className="grid grid-cols-[120px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">Total Pesanan</span><span className="text-left font-black text-[#2A2A2A]">{selectedPayment.totalOrder}</span></div>
													<div className="grid grid-cols-[120px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">DP (50%)</span><span className="text-left font-black text-[#FF9A9E]">{selectedPayment.amount}</span></div>
												</div>
											</div>

											<div className="space-y-4 border-t border-[#F4D7D4] pt-6">
												<h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Informasi Pembayaran</h5>
												<div className="space-y-3">
													<div className="grid grid-cols-[140px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">Metode Pembayaran</span><span className="text-left font-black text-[#2A2A2A]">{selectedPayment.paymentMethod}</span></div>
													<div className="grid grid-cols-[140px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">Nama Bank</span><span className="text-left font-black text-[#2A2A2A]">{selectedPayment.bankName}</span></div>
													<div className="grid grid-cols-[140px_1fr] gap-4 text-xs"><span className="shrink-0 font-bold text-slate-400">No. Rekening Tujuan</span><span className="text-left font-black text-[#2A2A2A]">{selectedPayment.targetAccount}</span></div>
													<div className="grid grid-cols-[140px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">Atas Nama</span><span className="text-left font-black text-[#2A2A2A]">{selectedPayment.accountName}</span></div>
													<div className="grid grid-cols-[140px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">Total Transfer</span><span className="text-left font-black text-emerald-500">{selectedPayment.amount}</span></div>
													<div className="grid grid-cols-[140px_1fr] gap-4 text-xs"><span className="font-bold text-slate-400">Waktu Transfer</span><span className="text-left text-[11px] font-black text-[#2A2A2A]">{selectedPayment.actualTransferTime}</span></div>
												</div>
											</div>

											<div className="space-y-3 border-t border-[#F4D7D4] pt-6">
												<h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Bukti Pembayaran</h5>
												<div className="flex flex-col items-center rounded-2xl border border-[#F4D7D4] bg-[#FDF1F0] p-3">
													<img src={selectedPayment.proofUrl || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=200"} className="mb-3 h-28 object-contain opacity-70" alt="Struk Pembayaran" />
													<a href={selectedPayment.proofUrl || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200"} target="_blank" className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#F4D7D4] bg-white py-2.5 text-[10px] font-black uppercase tracking-widest text-[#2A2A2A] shadow-sm transition-all hover:bg-[#FDF1F0]">
														Lihat Gambar Penuh
													</a>
												</div>
											</div>

											<div className="space-y-2 border-t border-[#F4D7D4] pt-6">
												<h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Catatan Customer</h5>
												<textarea className="h-20 w-full resize-none rounded-xl border border-[#F4D7D4] bg-[#F8FAFC] p-3 text-xs font-semibold text-slate-600 focus:outline-none" value={selectedPayment.note} readOnly />
											</div>

											<div className="flex gap-4 border-t border-[#F4D7D4] pt-6">
												{selectedPayment.status === 'PENDING' && (
													<>
														<button onClick={() => handleUpdateStatus(selectedPayment.id, 'FAILED')} className="flex-1 rounded-2xl border border-red-200 py-3.5 text-xs font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-50">{t('admin_pages.pembayaran.btn_reject')}</button>
														<button onClick={() => handleUpdateStatus(selectedPayment.id, 'PAID')} className="flex-1 rounded-2xl bg-[#10B981] py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-md shadow-emerald-100 transition-all hover:bg-[#059669]">{t('admin_pages.pembayaran.btn_verify')}</button>
													</>
												)}
												{selectedPayment.status === 'PAID' && (
													<button onClick={() => handleUpdateStatus(selectedPayment.id, 'PENDING')} className="flex-1 rounded-2xl border border-[#F4D7D4] py-3.5 text-xs font-black uppercase tracking-widest text-slate-600">Batalkan Verifikasi</button>
												)}
												{selectedPayment.status === 'FAILED' && (
													<button onClick={() => handleUpdateStatus(selectedPayment.id, 'PAID')} className="flex-1 rounded-2xl bg-[#10B981] py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-md shadow-emerald-100 transition-all hover:bg-[#059669]">{t('admin_pages.pembayaran.btn_verify')}</button>
												)}
											</div>
										</div>
									</>
								) : null}
							</div>
						</div>
					</div>
				</div>
            </div>

            {successModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                            <svg className="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="mb-2 text-xl font-black text-[#2A2A2A]">Berhasil!</h3>
                        <p className="mb-6 text-sm font-semibold text-slate-500">{successModal.message}</p>
                        <button onClick={() => setSuccessModal({ show: false, message: '' })} className="w-full rounded-2xl bg-[#FF9A9E] py-3 text-sm font-black uppercase tracking-widest text-white shadow-md shadow-pink-100 transition-colors hover:bg-[#FF5E7E]">Tutup</button>
                    </div>
                </div>
            )}
		</>
	);
}
