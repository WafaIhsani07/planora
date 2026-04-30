'use client';

import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';

interface Review {
  id: string;
  clientName: string;
  clientImage: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
  eventType: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    clientName: 'Siti Nurhaliza',
    clientImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Dokumentasi pernikahan kami sangat sempurna! Tim profesional dan responsif terhadap setiap kebutuhan. Hasil foto sangat memuaskan dan melebihi ekspektasi kami.',
    date: 'Maret 2024',
    helpful: 24,
    eventType: 'Pernikahan',
  },
  {
    id: '2',
    clientName: 'PT. Teknologi Indonesia',
    clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Layanan dekorasi corporate event kami luar biasa! Detail sempurna, tim yang ramah, dan timeline tepat waktu. Rekomendasi untuk semua event perusahaan!',
    date: 'Februari 2024',
    helpful: 18,
    eventType: 'Corporate Event',
  },
  {
    id: '3',
    clientName: 'Budi Hartono',
    clientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
    rating: 4,
    text: 'Layanan catering untuk acara keluarga sangat baik. Menu variatif dan rasa enak. Hanya saja ada sedikit keterlambatan pengiriman, namun overall sangat puas.',
    date: 'Januari 2024',
    helpful: 12,
    eventType: 'Gathering Keluarga',
  },
];

export default function UlasanPage() {
  const [reviews] = useState<Review[]>(mockReviews);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0';

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <DashboardLayout>
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#2A2A2A]">Ulasan & Rating</h1>
        <p className="mt-1 text-sm text-gray-500">Lihat feedback dari klien yang telah menggunakan layanan Anda</p>
      </div>

      {/* Rating Summary */}
      <div className="rounded-[2rem] border border-gray-100 bg-gradient-to-br from-[#FFFDFD] to-[#FDF8F7] p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-3 text-5xl font-extrabold text-[#FF9A9E]">{averageRating}</div>
            <div className="mb-2 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i <= Math.round(parseFloat(averageRating))
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">Berdasarkan {reviews.length} ulasan</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingCounts.map(({ rating, count }) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition ${
                  filterRating === rating
                    ? 'bg-[#FCE6E3]'
                    : 'hover:bg-white/50'
                }`}
              >
                <span className="text-xs font-bold text-gray-600">{rating} Bintang</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${(count / reviews.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-600 w-8 text-right">{count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-gray-200 py-12 text-center">
            <MessageCircle className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-600">Belum Ada Ulasan</h3>
            <p className="mt-1 text-sm text-gray-500">Ulasan dari klien akan muncul di sini</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Review Header */}
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <img
                    src={review.clientImage}
                    alt={review.clientName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-[#2A2A2A]">{review.clientName}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                        {review.eventType}
                      </span>
                      <span className="text-[10px] text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="mb-4 leading-relaxed text-gray-700">{review.text}</p>

              {/* Review Footer */}
              <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                <button className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-100">
                  <ThumbsUp className="h-4 w-4" />
                  Membantu ({review.helpful})
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}
