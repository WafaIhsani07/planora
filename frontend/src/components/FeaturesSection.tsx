"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, TrendingUp, Zap } from "lucide-react";

export default function FeaturesSection() {
    const ref = useRef<HTMLElement | null>(null);
    const [satisfaction, setSatisfaction] = useState(0);
    const [vendors, setVendors] = useState(0);
    const [users, setUsers] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;

                const start = performance.now();
                const duration = 900;

                const animate = (now: number) => {
                    const progress = Math.min(1, (now - start) / duration);
                    setSatisfaction(Math.floor(99 * progress));
                    setVendors(Math.floor(500 * progress));
                    setUsers(Math.floor(10000 * progress));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                requestAnimationFrame(animate);
                observer.disconnect();
            },
            { threshold: 0.35 },
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            icon: Zap,
            title: "Kecepatan Integrasi",
            desc: "Pesan vendor dalam hitungan menit tanpa chat manual.",
        },
        {
            icon: CheckCircle2,
            title: "Keamanan Transaksi",
            desc: "Pembayaran aman dalam sistem hingga layanan selesai.",
        },
        {
            icon: TrendingUp,
            title: "Analitik Performa",
            desc: "Pantau pertumbuhan bisnis melalui dashboard intuitif.",
        },
    ];

    return (
        <section id="features" data-reveal ref={ref} className="bg-white px-6 py-16 md:py-20 md:px-12">
            <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
                <div className="space-y-12">
                    <h2 className="text-[44px] font-black uppercase leading-tight tracking-tight text-[#2A2A2A]">
                        Kenapa Memilih <br /> <span className="text-gray-300">Planora?</span>
                    </h2>

                    <div className="space-y-10">
                        {features.map((feature) => {
                            const FeatureIcon = feature.icon;

                            return (
                                <div key={feature.title} className="flex gap-6">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FF9A9E]/20 shadow-sm">
                                        <FeatureIcon className="h-6 w-6 text-gray-900" />
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-lg font-extrabold uppercase text-gray-800">{feature.title}</h4>
                                        <p className="max-w-sm text-sm leading-relaxed text-gray-400">{feature.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex aspect-square flex-col justify-center rounded-[3rem] bg-[#FFE5E6] p-10 shadow-sm">
                        <h5 className="mb-2 text-5xl font-black text-gray-900">{satisfaction}%</h5>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Success Rate</p>
                    </div>

                    <div className="aspect-square overflow-hidden rounded-[3rem] shadow-xl">
                        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" alt="Decoration" className="h-full w-full object-cover grayscale" />
                    </div>

                    <div className="aspect-square overflow-hidden rounded-[3rem] shadow-xl">
                        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80" alt="Entertainment" className="h-full w-full object-cover" />
                    </div>

                    <div className="flex aspect-square flex-col justify-center rounded-[3rem] bg-[#F6F6F6] p-10 shadow-sm">
                        <h5 className="mb-2 text-5xl font-black text-gray-900">{vendors}+</h5>
                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Mitra Vendor</p>
                        <p className="mt-2 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">{users.toLocaleString("id-ID")}+ Pengguna</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
