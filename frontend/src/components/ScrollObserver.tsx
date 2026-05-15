"use client";

import { useEffect } from "react";

export default function ScrollObserver() {
  useEffect(() => {
    const observeElements = (els: HTMLElement[], io: IntersectionObserver) => {
      els.forEach((el) => io.observe(el));
    };

    const revealIfVisible = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
      if (isVisible) {
        el.classList.add('reveal-visible');
      }
    };

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

    const scan = () => {
      const els = Array.from(document.querySelectorAll('[data-reveal]')) as HTMLElement[];
      observeElements(els, io);
      els.forEach(revealIfVisible);
    };

    scan();

    const mo = new MutationObserver(() => {
      scan();
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
