'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { getMyVendorProfile, getVendorReviews, replyToReview } from '@/services/vendor.service';

const REVIEWS_PER_PAGE = 2;

export default function UlasanPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('terbaru');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const vendorProfile = await getMyVendorProfile();
        setProfile(vendorProfile);
        if (vendorProfile?.id) {
          const fetchedReviews = await getVendorReviews(vendorProfile.id);
          setReviews(fetchedReviews);
        }
      } catch (error) {
        console.error("Gagal memuat ulasan:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculate stats
  const totalReviewsCount = reviews.length;
  const avgRating = totalReviewsCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '0.0';

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rating = r.rating as keyof typeof dist;
      if (dist[rating] !== undefined) {
        dist[rating]++;
      }
    });
    return dist;
  }, [reviews]);

  const maxCount = Math.max(...Object.values(ratingDistribution), 1);

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortBy === 'tertinggi') {
      return sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'terendah') {
      return sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'belumdibalas') {
      return sorted.filter(r => !r.reply);
    }
    // terbaru
    return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reviews, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const startIdx = (currentPage - 1) * REVIEWS_PER_PAGE;
  const paginatedReviews = sortedReviews.slice(startIdx, startIdx + REVIEWS_PER_PAGE);

  const handleReplySubmit = async (reviewId: string) => {
    if (replyText.trim()) {
      const result = await replyToReview(reviewId, replyText);
      if (result) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply: replyText } : r));
        setReplyingTo(null);
        setReplyText('');
      }
    }
  };

  const handleEditReply = (reviewId: string, currentReply: string) => {
    setEditingReply(reviewId);
    setEditReplyText(currentReply);
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (editReplyText.trim()) {
      const result = await replyToReview(reviewId, editReplyText);
      if (result) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply: editReplyText } : r));
        setEditingReply(null);
        setEditReplyText('');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingReply(null);
    setEditReplyText('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-10 h-10 text-[#FF9A9E] animate-spin" />
        <p className="text-xs font-bold text-[#2A2A2A]/50 tracking-wider uppercase">Memuat Ulasan Anda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-[2rem] font-extrabold tracking-tight leading-tight text-[#2A2A2A]">
            Ulasan Pelanggan
          </h1>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A2A2A]/35">
            PANTAU FEEDBACK DAN REPUTASI BISNIS ANDA.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#2A2A2A]/5 pl-6 pr-12 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-[#2A2A2A]/60 appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 shadow-sm cursor-pointer transition-all"
            >
              <option value="terbaru">Terbaru</option>
              <option value="tertinggi">Rating Tertinggi</option>
              <option value="terendah">Rating Terendah</option>
              <option value="belumdibalas">Belum Dibalas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats & Distribution */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Rating Summary */}
        <div className="lg:col-span-4 bg-[#2A2A2A] rounded-[32px] p-8 text-white shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
          <p className="text-[9px] font-black text-[#FF9A9E] uppercase tracking-[0.25em] mb-3 relative z-10">
            RATA-RATA RATING
          </p>
          <h2 className="text-6xl font-black mb-3 relative z-10">{avgRating}</h2>
          <div className="flex gap-1 mb-4 relative z-10">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-[10px] font-medium text-white/40 relative z-10">
            Berdasarkan {totalReviewsCount} ulasan pelanggan
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#2A2A2A]/5 p-8 shadow-sm">
          <h4 className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-[0.3em] mb-6">
            DISTRIBUSI RATING
          </h4>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars as keyof typeof ratingDistribution] || 0;
              const percentage = (count / maxCount) * 100 || 0;
              return (
                <div key={stars} className={stars <= 3 ? 'opacity-50' : ''}>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 w-3">{stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-[#2A2A2A] w-6 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-black text-[#2A2A2A]/40 uppercase tracking-[0.3em] ml-1">
          SEMUA ULASAN
        </h4>

        {paginatedReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#2A2A2A]/5 p-12 text-center text-slate-400 font-medium space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-bold uppercase tracking-wider text-[#2A2A2A]/50">Belum Ada Ulasan</p>
            <p className="text-xs text-slate-400">Ulasan dari pelanggan Anda akan muncul secara real-time di sini.</p>
          </div>
        ) : (
          paginatedReviews.map((review) => {
            const customerName = review.customer?.name || 'Pelanggan';
            const packageName = review.booking?.layanan?.name || 'Paket Layanan';
            const avatarUrl = review.customer?.avatar || `https://i.pravatar.cc/150?u=${review.customer?.id || 'user'}`;
            const formattedDate = new Date(review.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const hasReply = !!review.reply;

            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-[#2A2A2A]/5 p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={avatarUrl}
                      alt={customerName}
                      className="w-14 h-14 rounded-[16px] object-cover border-3 border-[#FDF1F0]"
                    />
                    <div>
                      <h5 className="text-base font-bold text-[#2A2A2A]">{customerName}</h5>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {packageName} • {formattedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 bg-[#FDF1F0] px-3 py-2 rounded-xl w-fit">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                  "{review.comment || 'Tidak ada komentar tertulis.'}"
                </p>

                {/* Reply Section */}
                <div className="pt-6 border-t border-[#2A2A2A]/5">
                  {hasReply && review.reply ? (
                    <div className="bg-[#FDF1F0]/50 p-5 rounded-2xl border border-[#FF9A9E]/10 space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#FF9A9E]" />
                        <span className="text-[9px] font-black text-[#FF9A9E] uppercase tracking-widest">
                          Balasan Anda
                        </span>
                      </div>
                      {editingReply === review.id ? (
                        <div className="space-y-4">
                          <textarea
                            value={editReplyText}
                            onChange={(e) => setEditReplyText(e.target.value)}
                            className="w-full bg-white border border-[#FF9A9E]/20 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 resize-none"
                            rows={3}
                          />
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={handleCancelEdit}
                              className="px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#2A2A2A] transition-colors"
                            >
                              Batalkan
                            </button>
                            <button
                              onClick={() => handleSaveEdit(review.id)}
                              className="bg-[#2A2A2A] text-white px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#FF527B] transition-all active:scale-95"
                            >
                              Simpan Perubahan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-[#2A2A2A] leading-relaxed">{review.reply}</p>
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleEditReply(review.id, review.reply || '')}
                              className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#FF9A9E] transition-colors"
                            >
                              Edit Balasan
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : replyingTo === review.id ? (
                    <div className="bg-[#FDF1F0]/50 p-5 rounded-2xl border border-[#FF9A9E]/10 space-y-4">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Tulis balasan Anda..."
                        className="w-full bg-white border border-[#FF9A9E]/20 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 resize-none"
                        rows={3}
                      />
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#2A2A2A] transition-colors"
                        >
                          Batalkan
                        </button>
                        <button
                          onClick={() => handleReplySubmit(review.id)}
                          className="bg-[#2A2A2A] text-white px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#FF527B] transition-all active:scale-95"
                        >
                          Kirim Balasan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Belum dibalas</span>
                      </div>
                      <button
                        onClick={() => setReplyingTo(review.id)}
                        className="bg-[#2A2A2A] text-white px-6 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#FF527B] transition-all active:scale-95"
                      >
                        BALAS ULASAN
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 rounded-lg bg-white border border-[#2A2A2A]/5 flex items-center justify-center text-slate-400 hover:text-[#2A2A2A] hover:bg-[#FDF1F0] disabled:opacity-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-lg font-bold text-[11px] transition-all ${
                currentPage === i + 1
                  ? 'bg-[#FF9A9E] text-white shadow-lg shadow-[#FF9A9E]/20'
                  : 'bg-white border border-[#2A2A2A]/5 text-slate-400 hover:bg-[#FDF1F0]'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="w-10 h-10 rounded-lg bg-white border border-[#2A2A2A]/5 flex items-center justify-center text-slate-400 hover:text-[#2A2A2A] hover:bg-[#FDF1F0] disabled:opacity-50 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
