"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

type Category = {
    titleKey: string;
    countPrefix: string;
    image: string;
};

export default function CategorySection() {
    const { t } = useLanguage();

    const categories: Category[] = [
        { titleKey: "catPhotography", countPrefix: "1,200+", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80" },
        { titleKey: "catCatering", countPrefix: "980+", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80" },
        { titleKey: "catDecoration", countPrefix: "750+", image: "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?auto=format&fit=crop&q=80" },
        { titleKey: "catWO", countPrefix: "520+", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80" },
        { titleKey: "catEntertainment", countPrefix: "430+", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80" },
    ];

    return (
        <section id="kategori" data-reveal className="bg-white px-6 py-14 md:py-16 md:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex items-end justify-between gap-6">
                    <h2 className="text-3xl font-bold text-[#2A2A2A] md:text-4xl">{t('categorySection.title')}</h2>
                    <a href="#" className="hidden items-center gap-1 text-sm font-bold uppercase tracking-tight text-[#FF9A9E] transition-all hover:gap-2 md:flex">
                        {t('categorySection.viewAll')}
                        <span aria-hidden="true">›</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {categories.map((category) => (
                        <div key={category.titleKey} className="group relative h-56 overflow-hidden rounded-[2rem] cursor-pointer">
                            <div className="absolute inset-0">
                                <Image src={category.image} alt={t(`categorySection.${category.titleKey}`)} fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 20vw" className="object-cover transition duration-500 group-hover:scale-110" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h4 className="font-bold">{t(`categorySection.${category.titleKey}`)}</h4>
                                <p className="text-[10px] opacity-70">{category.countPrefix} {t('categorySection.vendorCount')}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <a href="#" className="mt-6 flex items-center gap-1 text-sm font-bold uppercase tracking-tight text-[#FF9A9E] md:hidden">
                    {t('categorySection.viewAll')}
                    <span aria-hidden="true">›</span>
                </a>
            </div>
        </section>
    );
}