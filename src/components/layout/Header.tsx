'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Sparkles, Menu, X } from 'lucide-react';
import { ThemeKey } from '@/config/themes';

interface NavItem {
  id: ThemeKey;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'fresh_water', label: 'Mát Lạnh' },
  { id: 'warm_amber', label: 'Ấm Áp' },
  { id: 'green_nature', label: 'Thiên Nhiên' },
  { id: 'sweet_rose', label: 'Ngọt Ngào' },
  { id: 'dark_mystery', label: 'Bí Ẩn' },
];

export default function Header() {
  const { totalCount, setIsDrawerOpen, activeTheme } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/75 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl'
          : 'bg-black/35 backdrop-blur-md border-b border-white/5 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 text-zinc-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo in Classic Luxury Serif with Wide Tracking */}
        <a
          href="#"
          className="flex flex-col items-center group cursor-pointer"
        >
          <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.24em] text-white group-hover:text-rose-200 transition-colors uppercase">
            Dynie Perfume
          </span>
          <span className="text-[9px] tracking-[0.35em] text-zinc-400 uppercase font-mono mt-0.5">
            Haute Parfumerie
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTheme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative text-xs tracking-wider uppercase font-medium transition-colors py-1 cursor-pointer ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full animate-in fade-in" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Cart Drawer Trigger Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all shadow-lg hover:scale-105 flex items-center gap-2 cursor-pointer"
            title="Mở giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4 text-rose-300" />
            <span className="hidden sm:inline text-xs font-medium font-sans">Giỏ Hàng</span>
            {totalCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md font-mono animate-in zoom-in-75">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 px-6 py-4 space-y-3 animate-in slide-in-from-top-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block w-full text-left py-2 text-sm text-zinc-300 hover:text-white uppercase tracking-wider font-serif"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
