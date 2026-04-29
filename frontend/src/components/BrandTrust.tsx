import React from "react";

export default function BrandTrust() {
    const brands = ["bridestory", "zap", "ASVIDA", "imagenic", "the F thing", "DERAI", "haidee"];

    return (
        <section data-reveal className="border-b border-gray-100 bg-white py-8 md:py-10">
            <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
                <p className="mb-10 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                    Dipercaya oleh vendor profesional terbaik
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 opacity-30 grayscale transition duration-500 hover:grayscale-0 md:gap-12 lg:gap-16">
                    {brands.map((brand) => (
                        <span key={brand} className="text-lg font-bold capitalize tracking-tight text-gray-900 md:text-xl">
                            {brand}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}