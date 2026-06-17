"use client";

import React from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TestimonialSection() {
    const { t } = useLanguage();

    const testimonials = [
        {
            name: "Amanda & Dimas",
            role: t('testimonials.role1'),
            text: t('testimonials.text1'),
            avatar: "https://i.pravatar.cc/100?u=u1",
            dark: false,
        },
        {
            name: "Raka Pratama",
            role: t('testimonials.role2'),
            text: t('testimonials.text2'),
            avatar: "https://i.pravatar.cc/100?u=u2",
            dark: true,
        },
        {
            name: "Sarah Wijaya",
            role: t('testimonials.role3'),
            text: t('testimonials.text3'),
            avatar: "https://i.pravatar.cc/100?u=u3",
            dark: false,
        },
    ];

    return (
        <section data-reveal className="bg-white px-6 py-16 md:py-20 md:px-12">
            <div className="mx-auto max-w-7xl">
                <h2 className="mb-12 text-3xl font-bold text-[#2A2A2A] md:text-4xl">{t('testimonials.title')}</h2>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <article key={testimonial.name} className={`flex flex-col rounded-[2.5rem] p-10 shadow-sm ${testimonial.dark ? "bg-black text-white shadow-2xl" : "border border-gray-100 bg-white"}`}>
                            <div className="mb-6 flex gap-1 text-[#F59E0B]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="h-4 w-4 fill-current" />
                                ))}
                            </div>

                            <p className={`mb-10 text-sm leading-relaxed italic ${testimonial.dark ? "text-gray-300" : "text-gray-500"}`}>
                                &quot;{testimonial.text}&quot;
                            </p>

                            <div className="mt-auto flex items-center gap-4">
                                <img src={testimonial.avatar} alt={testimonial.name} className={`h-12 w-12 rounded-full object-cover ${testimonial.dark ? "border-2 border-white/10" : "border-2 border-pink-50"}`} />
                                <div>
                                    <p className="text-sm font-bold">{testimonial.name}</p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${testimonial.dark ? "text-gray-500" : "text-gray-400"}`}>{testimonial.role}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12 flex justify-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-gray-200"></span>
                    <span className="h-2 w-8 rounded-full bg-[#FF9A9E]"></span>
                    <span className="h-2 w-2 rounded-full bg-gray-200"></span>
                </div>
            </div>
        </section>
    );
}