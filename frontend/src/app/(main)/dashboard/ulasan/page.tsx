'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '../DashboardLayout';
import { Star, MessageSquare, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface Review {
  id: number;
  customerName: string;
  packageName: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
  reply?: string;
  replied: boolean;
}

const mockReviews: Review[] = [
  {
    id: 1,
    customerName: 'Andini Putri',
    packageName: 'Paket Intimate Dream',
    date: '12 Mei 2024',
    rating: 5,
    text: '"Sangat puas dengan dekorasinya! Tim Wafa Decoration sangat profesional dan kooperatif. Bunga-bunganya segar semua dan sesuai dengan tema rose gold yang saya minta. Sukses terus ya!"',
    avatar: 'https://i.pravatar.cc/150?u=andini',
    reply: 'Terima kasih banyak Kak Andini! Kami senang sekali bisa menjadi bagian dari hari bahagia Kakak. Semoga samawa ya!',
    replied: true,
  },
  {
    id: 2,
    customerName: 'Raka Pratama',
    packageName: 'Rustic Engagement',
    date: '08 Mei 2024',
    rating: 4,
    text: '"Secara keseluruhan bagus, pengerjaan cepat. Hanya saja backdrop agak sedikit miring saat awal dipasang, tapi tim langsung sigap benerin pas saya komplain. Terima kasih."',
    avatar: 'https://i.pravatar.cc/150?u=raka',
    replied: false,
  },
  {
    id: 3,
    customerName: 'Siti Nurhaliza',
    packageName: 'Paket Premium Wedding',
    date: '02 Mei 2024',
    rating: 5,
    text: '"Luar biasa! Dekorasi very beautiful, pelayanan excellent, dan tim sangat responsif. Hari pernikahan saya jadi sempurna karena bantuan Wafa Decoration. Highly recommended!"',
    avatar: 'https://i.pravatar.cc/150?u=siti',
    reply: 'Terimakasih atas kepercayaannya Kak Siti! Senang bisa membantu mewujudkan hari istimewa Kakak. Wish you happiness! 💕',
    replied: true,
  },
  {
    id: 4,
    customerName: 'Budi Santoso',
    packageName: 'Paket Dekorasi Basic',
    date: '28 April 2024',
    rating: 5,
    text: '"Harganya terjangkau tapi kualitas premium. Team work-nya solid dan hasil dekorasinya memuaskan. Akan rekomendasi ke teman-teman saya."',
    avatar: 'https://i.pravatar.cc/150?u=budi',
    replied: false,
  },
];

const REVIEWS_PER_PAGE = 2;

export default function UlasanPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('terbaru');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReply, setEditingReply] = useState<number | null>(null);
  const [editReplyText, setEditReplyText] = useState('');

  // Calculate stats
  const avgRating = (
    mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
  ).toFixed(1);

  const ratingDistribution = useMemo(() => {
    return {
      5: mockReviews.filter(r => r.rating === 5).length,
      4: mockReviews.filter(r => r.rating === 4).length,
      3: mockReviews.filter(r => r.rating === 3).length,
      2: mockReviews.filter(r => r.rating === 2).length,
      1: mockReviews.filter(r => r.rating === 1).length,
    };
  }, []);

  const maxCount = Math.max(...Object.values(ratingDistribution));

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...mockReviews];
    if (sortBy === 'tertinggi') {
      return sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'terendah') {
      return sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'belumdibalas') {
      return sorted.filter(r => !r.replied);
    }
    return sorted.reverse(); // terbaru
  }, [sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const startIdx = (currentPage - 1) * REVIEWS_PER_PAGE;
  const paginatedReviews = sortedReviews.slice(startIdx, startIdx + REVIEWS_PER_PAGE);

  const handleReply = (reviewId: number) => {
    if (replyText.trim()) {
      // Here you would typically make an API call to save the reply
      console.log(`Reply to review ${reviewId}: ${replyText}`);
      setReplyingTo(null);
      setReplyText('');
    }
  };

  const handleEditReply = (reviewId: number, currentReply: string) => {
    setEditingReply(reviewId);
    setEditReplyText(currentReply);
  };

  const handleSaveEdit = (reviewId: number) => {
    if (editReplyText.trim()) {
      // Here you would typically make an API call to update the reply
      console.log(`Edit reply for review ${reviewId}: ${editReplyText}`);
      setEditingReply(null);
      setEditReplyText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingReply(null);
    setEditReplyText('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
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
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A2A2A]/20 pointer-events-none rotate-90" />
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
              Berdasarkan {mockReviews.length} ulasan pelanggan
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#2A2A2A]/5 p-8 shadow-sm">
            <h4 className="text-[10px] font-black text-[#2A2A2A]/20 uppercase tracking-[0.3em] mb-6">
              DISTRIBUSI RATING
            </h4>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars as keyof typeof ratingDistribution];
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

          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-[#2A2A2A]/5 p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.customerName}
                    className="w-14 h-14 rounded-[16px] object-cover border-3 border-[#FDF1F0]"
                  />
                  <div>
                    <h5 className="text-base font-bold text-[#2A2A2A]">{review.customerName}</h5>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {review.packageName} • {review.date}
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
                {review.text}
              </p>

              {/* Reply Section */}
              <div className="pt-6 border-t border-[#2A2A2A]/5">
                {review.replied && review.reply ? (
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
                        onClick={() => handleReply(review.id)}
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
          ))}
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
    </DashboardLayout>
  );
}
