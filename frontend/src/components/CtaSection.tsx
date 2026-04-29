"use client";

import React from "react";

export default function CtaSection() {
    return (
        <section data-reveal className="bg-white px-6 py-16 md:py-20 md:px-12">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-black px-6 py-12 text-center md:px-12 md:py-16">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,154,158,0.12),_transparent_45%)]"></div>

                <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 text-left md:flex-row">
                    <div>
                        <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                            Siap Wujudkan Momen <br /> Spesial Bersama <span className="text-pink-gradient">Planora?</span>
                        </h2>
                        <p className="text-sm text-gray-400">Bergabung sekarang dan temukan vendor terbaik untuk acara tak terlupakan.</p>
                    </div>

                    <div className="flex flex-col gap-5 sm:flex-row">
                        <button className="rounded-2xl bg-pink-gradient px-10 py-4 font-extrabold text-black transition transform hover:scale-105 hover:opacity-90">
                            Mulai Rencanakan
                        </button>
                        <button className="rounded-2xl border border-white/20 bg-white/5 px-10 py-4 font-extrabold text-white transition transform hover:scale-105 hover:bg-white/10">
                            Hubungi Kami
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
