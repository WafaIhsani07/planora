"use client";

import { useEffect } from "react";

export default function ScrollObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]')) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => {
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
