'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('sharespace_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sharespace_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sharespace_theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-white/70 border border-[#E7E1D3] animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to warm light mode' : 'Switch to cozy dark mode'}
      className="relative p-2 rounded-full bg-white dark:bg-[#1A201C] hover:bg-[#EFE9DD] dark:hover:bg-[#252D27] border border-[#E7E1D3] dark:border-[#273029] text-[#20231F] dark:text-[#FFD24D] transition-all shadow-xs active:scale-95 flex items-center justify-center cursor-pointer group"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#FFD24D] transition-transform group-hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#4169E1] transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}
