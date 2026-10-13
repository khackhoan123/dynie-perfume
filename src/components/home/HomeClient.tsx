'use client';

import React from 'react';
import { Product } from '@/lib/sheets';
import { CartProvider } from '@/context/CartContext';
import SceneWrapper from '@/components/canvas/SceneWrapper';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import ThemeSection from '@/components/catalog/ThemeSection';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ScentDetailModal from '@/components/modals/ScentDetailModal';
import { ThemeKey } from '@/config/themes';

interface HomeClientProps {
  products: Product[];
}

interface ScentChapter {
  key: ThemeKey;
  roman: string;
}

const CHAPTERS: ScentChapter[] = [
  { key: 'fresh_water', roman: 'I' },
  { key: 'warm_amber', roman: 'II' },
  { key: 'green_nature', roman: 'III' },
  { key: 'sweet_rose', roman: 'IV' },
  { key: 'dark_mystery', roman: 'V' },
];

export default function HomeClient({ products }: HomeClientProps) {
  // Nhóm sản phẩm theo 5 theme
  const getProductsByTheme = (themeKey: ThemeKey) => {
    return products.filter(
      (p) => (p.theme_id || '').toString().trim().toLowerCase() === themeKey.trim().toLowerCase()
    );
  };

  return (
    <CartProvider>
      {/* 3D WebGL Fixed Canvas Background with Liquid Silk & Procedural Perfume Bottle */}
      <SceneWrapper />

      {/* Main Luxury Boutique Layout */}
      <div className="relative min-h-screen text-zinc-100 flex flex-col justify-between selection:bg-rose-500/30 selection:text-rose-200">
        {/* Navigation Header */}
        <Header />

        {/* Hero Section (100vh) */}
        <HeroSection />

        {/* 5 Scent Collection Sections (Editorial Catalog) */}
        <main className="max-w-7xl mx-auto px-6 w-full space-y-12 pb-24">
          {CHAPTERS.map((chapter) => (
            <ThemeSection
              key={chapter.key}
              themeKey={chapter.key}
              indexRoman={chapter.roman}
              products={getProductsByTheme(chapter.key)}
            />
          ))}
        </main>

        {/* Boutique Footer */}
        <Footer />

        {/* Interactive Modals & Slide-out Drawers */}
        <CartDrawer />
        <ScentDetailModal />
      </div>
    </CartProvider>
  );
}
