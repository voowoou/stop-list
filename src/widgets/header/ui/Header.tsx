"use client";

import { useEffect, useState } from "react";

const COMPACT_SCROLL_OFFSET = 16;

export function Header() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsCompact(window.scrollY > COMPACT_SCROLL_OFFSET);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b-2 border-black/10 bg-background/95 backdrop-blur-sm transition-[height] duration-200 motion-reduce:transition-none ${
        isCompact ? "h-10" : "h-12.5"
      }`}
    >
      <div className="flex h-full w-full items-center gap-3 px-8">
        <h1
          className={`font-display font-bold leading-none transition-[font-size] duration-200 motion-reduce:transition-none ${
            isCompact ? "text-base" : "text-xl"
          }`}
        >
          Меню-смены
        </h1>
        <span
          className={`font-sans font-medium leading-none text-accent transition-[font-size] duration-200 motion-reduce:transition-none ${
            isCompact ? "text-sm" : "text-base"
          }`}
        >
          стоп-лист
        </span>
      </div>
    </header>
  );
}
