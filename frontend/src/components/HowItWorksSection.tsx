"use client";

import React from "react";
import { CalendarCheck, Search, CheckCircle2 } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Temukan Vendor Terbaik",
        desc: "Jelajahi ribuan vendor profesional sesuai kebutuhan acara Anda.",
    },
    {
        icon: CalendarCheck,
        title: "Booking & Bayar DP",
        desc: "Pilih paket yang sesuai, lakukan booking, dan bayar DP 50%.",
    },
    {
        icon: CheckCircle2,
        title: "Acara Selesai",
        desc: "Setelah acara selesai dan Anda konfirmasi, dana dicairkan ke vendor.",
    },
];

export default function HowItWorksSection() {
    return (
        <section id="cara-kerja" data-reveal className="bg-white px-6 py-14 md:py-16 md:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0D0D0D] px-6 py-12 md:px-12 md:py-16 lg:px-20">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,154,158,0.08),_transparent_45%)]"></div>

                    <div className="relative z-10 mb-12 text-center md:mb-16">
                        <h2 className="text-3xl font-extrabold leading-tight text-white md:text-5xl">
                            Cara Mudah Merencanakan <br /> <span className="text-pink-gradient italic">Acara Impianmu</span>
                        </h2>
                        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
                            Planora hadir untuk membuat setiap langkah perencanaan acara menjadi lebih mudah, aman, dan terpercaya.
                        </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
                        <div className="hidden md:block absolute left-[10%] right-[10%] top-10 h-px border-t-2 border-dashed border-white/10"></div>
                        {steps.map((step) => {
                            const StepIcon = step.icon;

                            return (
                                <div key={step.title} className="relative text-center">
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#FF9A9E]/30 bg-black step-glow">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white">
                                                <StepIcon className="h-8 w-8" />
                                            </div>
                                        </div>
                                        <h4 className="mb-3 text-lg font-bold text-white">{step.title}</h4>
                                        <p className="mx-auto max-w-[240px] text-xs leading-relaxed text-gray-500">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
