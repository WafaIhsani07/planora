'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  ArrowLeft,
  Upload,
  CalendarDays,
} from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { getMyPortfolio, createPortfolio, deletePortfolio } from '@/services/vendor.service';
import { useLanguage } from '@/context/LanguageContext';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  eventDate?: string | Date | null;
}

export default function PortfolioPage() {
  const { t } = useLanguage();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    imageUrl: '',
  });

  const fetchPortfolio = async () => {
    setLoading(true);
    const data = await getMyPortfolio();
    setPortfolio(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const formatDateForDisplay = (value: string | Date | null | undefined) => {
    if (!value) return '';
    try {
      const dateObj = typeof value === 'string' ? new Date(value) : value;
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(dateObj);
    } catch {
      return String(value);
    }
  };

  const handleAddNew = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
    });
    setView('form');
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert(t('dashboard.portofolio.messages.titleRequired'));
      return;
    }

    // Default premium event image if none uploaded
    const payload = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
      eventDate: formData.date || new Date().toISOString().split('T')[0],
    };

    setLoading(true);
    const result = await createPortfolio(payload);
    if (result) {
      await fetchPortfolio();
      setView('list');
    } else {
      alert(t('dashboard.portofolio.messages.addFailed'));
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('dashboard.portofolio.messages.deleteConfirm'))) {
      setLoading(true);
      try {
        await deletePortfolio(id);
        await fetchPortfolio();
      } catch (error) {
        alert(t('dashboard.portofolio.messages.deleteFailed'));
        setLoading(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40" data-testid="loading-spinner">
            <div className="w-12 h-12 border-4 border-[#FF9A9E] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#2A2A2A]/40">{t('dashboard.portofolio.loading')}</p>
          </div>
        ) : (
          <>
            {view === 'list' ? (
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">{t('dashboard.portofolio.list.title')}</h1>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">
                    {t('dashboard.portofolio.list.subtitle').replace('{count}', String(portfolio.length))}
                  </p>
                </div>
                <button
                  onClick={handleAddNew}
                  className="bg-[#2A2A2A] text-white px-5 py-3 rounded-[16px] font-bold flex items-center gap-2.5 hover:bg-[#FF527B] transition-all shadow-sm active:scale-95 w-fit text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" /> {t('dashboard.portofolio.list.btnAdd')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView('list')}
                  className="w-12 h-12 bg-white border border-[#2A2A2A]/5 rounded-2xl flex items-center justify-center text-[#2A2A2A]/30 hover:bg-[#FF9A9E] hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">{t('dashboard.portofolio.form.title')}</h1>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">{t('dashboard.portofolio.form.subtitle')}</p>
                </div>
              </div>
            )}

            {view === 'list' && (
              <>
                {portfolio.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-[#FF9A9E]/20 py-24 text-center bg-white/70">
                    <ImageIcon className="mb-4 h-12 w-12 text-[#FF9A9E]/40" />
                    <h3 className="text-lg font-bold text-gray-600">{t('dashboard.portofolio.list.emptyTitle')}</h3>
                    <p className="mt-1 text-sm text-gray-500">{t('dashboard.portofolio.list.emptyDesc')}</p>
                    <button
                      onClick={handleAddNew}
                      className="mt-6 rounded-2xl bg-[#FF9A9E] px-6 py-3 text-xs font-black text-white uppercase tracking-widest transition hover:bg-[#FF7F97] active:scale-95 cursor-pointer shadow-lg shadow-[#FF9A9E]/20"
                    >
                      {t('dashboard.portofolio.list.btnEmptyAdd')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {portfolio.map((item) => (
                      <article
                        key={item.id}
                        className="bg-white rounded-3xl border border-[#2A2A2A]/5 overflow-hidden hover:shadow-xl hover:shadow-[#FF9A9E]/5 transition-all group flex flex-col min-h-[380px]"
                      >
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img
                            src={item.imageUrl}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={item.title}
                          />
                          <div className="absolute inset-0 bg-black/0 opacity-0 group-hover:opacity-100 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <button
                              onClick={() => handleDelete(item.id)}
                              data-testid={`delete-btn-${item.id}`}
                              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2A2A2A] hover:bg-red-500 hover:text-white transition-all shadow-lg cursor-pointer"
                              title={t('dashboard.portofolio.list.btnDeleteWork')}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h4 className="text-lg font-black text-[#2A2A2A] leading-tight group-hover:text-[#FF527B] transition-colors">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-xs leading-relaxed text-slate-500">{item.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 pt-4 border-t border-slate-50 text-slate-400">
                            <CalendarDays className="w-4 h-4 text-[#FF9A9E]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {formatDateForDisplay(item.eventDate)}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}

                    <div
                      onClick={handleAddNew}
                      className="bg-[#FDF1F0]/50 rounded-3xl border-2 border-dashed border-[#FF9A9E]/20 flex flex-col items-center justify-center p-10 hover:bg-[#FDF1F0] transition-all cursor-pointer group min-h-[380px]"
                    >
                      <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8 text-[#FF9A9E]" />
                      </div>
                      <p className="text-[10px] font-black text-[#FF9A9E] uppercase tracking-[0.2em] text-center leading-relaxed whitespace-pre-line">
                        {t('dashboard.portofolio.list.uploadMore')}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {view === 'form' && (
              <div className="grid lg:grid-cols-12 gap-8 pb-20 animate-in slide-in-from-right-6 duration-500">
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-8 rounded-xl border border-[#2A2A2A]/5 shadow-sm space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#2A2A2A]/25">{t('dashboard.portofolio.form.mediaTitle')}</h4>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        {t('dashboard.portofolio.form.mediaDesc')}
                      </p>
                    </div>

                    <div className="aspect-square bg-[#FFF7F8] rounded-[32px] border-2 border-dashed border-[#FF9A9E]/25 flex flex-col items-center justify-center px-6 py-8 group hover:border-[#FF9A9E] transition-all cursor-pointer">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#FF9A9E] shadow-sm group-hover:scale-110 transition-all mb-6">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="text-[11px] font-black text-[#2A2A2A]/60 text-center leading-relaxed">
                        {t('dashboard.portofolio.form.mediaPinned')}
                      </p>
                      <p className="mt-4 text-[9px] font-bold text-[#FF9A9E]/45 uppercase tracking-[0.18em]">
                        {t('dashboard.portofolio.form.mediaQuality')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="bg-white p-6 md:p-8 rounded-xl border border-[#2A2A2A]/5 shadow-sm space-y-8">
                    <section className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                          {t('dashboard.portofolio.form.fieldTitle')}
                        </label>
                        <input
                          type="text"
                          data-testid="portfolio-title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder={t('dashboard.portofolio.form.fieldTitlePlaceholder')}
                          className="w-full bg-[#FDF1F0]/50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-[#FF9A9E] transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                          {t('dashboard.portofolio.form.fieldDate')}
                        </label>
                        <input
                          type="date"
                          data-testid="portfolio-date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full appearance-none bg-[#FDF1F0]/50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-[#2A2A2A] focus:ring-2 focus:ring-[#FF9A9E] transition-all [color-scheme:light]"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-widest ml-1">
                          {t('dashboard.portofolio.form.fieldDesc')}
                        </label>
                        <textarea
                          rows={6}
                          data-testid="portfolio-desc"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder={t('dashboard.portofolio.form.fieldDescPlaceholder')}
                          className="w-full bg-[#FDF1F0]/50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-[#FF9A9E] resize-none transition-all"
                        />
                      </div>
                    </section>

                    <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-end gap-4">
                      <button
                        onClick={() => setView('list')}
                        className="px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#2A2A2A] transition-all cursor-pointer"
                      >
                        {t('dashboard.portofolio.form.btnCancel')}
                      </button>
                      <button
                        onClick={handleSave}
                        data-testid="submit-btn"
                        className="bg-[#FF9A9E] text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#FF9A9E]/20 hover:bg-[#FF7F97] transition-all transform active:scale-95 cursor-pointer"
                      >
                        {t('dashboard.portofolio.form.btnSave')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
