'use client';

import React from 'react';

export default function CtaSection() {
    return (
        <section className="w-full bg-white px-6 py-20 sm:px-10 md:py-24 lg:px-12">
            <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[3rem] bg-[#2A2A2A] px-6 py-20 text-center shadow-2xl md:py-28">
                <div className="pointer-events-none absolute left-[-10%] top-[-50%] h-[300px] w-[300px] rounded-full bg-[#FCE6E3]/10 blur-[100px]"></div>
                <div className="pointer-events-none absolute bottom-[-50%] right-[-10%] h-[300px] w-[300px] rounded-full bg-[#FCE6E3]/10 blur-[100px]"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <h2 className="mb-6 text-4xl font-black italic leading-[1.05] tracking-tighter text-white md:text-5xl lg:text-[4rem]">
                        SIAP MENGATUR <br />
                        <span className="text-[#FCE6E3]">MOMEN HEBAT?</span>
                    </h2>

                    <p className="mx-auto mb-12 max-w-lg text-sm leading-relaxed text-[#A8A8A8] md:text-base">
                        Jadilah bagian dari revolusi industri event di Indonesia bersama Planora. Cepat, Terintegrasi, dan Estetik.
                    </p>

                    <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
                        <button className="w-full rounded-full bg-[#FCE6E3] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A2A2A] transition-all hover:scale-105 hover:bg-[#F8D8D3] active:scale-95 sm:w-auto md:text-xs">
                            DOWNLOAD SEKARANG
                        </button>
                        <button className="w-full rounded-full border border-[#555] bg-transparent px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-105 hover:border-white hover:bg-white/5 active:scale-95 sm:w-auto md:text-xs">
                            HUBUNGI KAMI
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
