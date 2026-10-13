'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Product } from '@/lib/sheets';
import { ThemeKey, PERFUME_THEMES } from '@/config/themes';
import { useCart } from '@/context/CartContext';
import CircularCarousel, { CarouselItem } from '@/components/ui/CircularCarousel';

interface ThemeSectionProps {
  themeKey: ThemeKey;
  indexRoman: string;
  products: Product[];
}

export default function ThemeSection({
  themeKey,
  indexRoman,
  products,
}: ThemeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { setActiveTheme, setSelectedProduct } = useCart();
  const theme = PERFUME_THEMES[themeKey] || PERFUME_THEMES.sweet_rose;

  // IntersectionObserver kích hoạt đổi Theme 3D tự động khi cuộn đến section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTheme(themeKey);
          }
        });
      },
      {
        rootMargin: '-25% 0px -40% 0px',
        threshold: 0.1,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [themeKey, setActiveTheme]);

  // Map danh sách nước hoa vào items của CircularCarousel
  const carouselItems: CarouselItem[] = useMemo(() => {
    return products.map((product) => ({
      id: product.id,
      src: product.thumb_url,
      title: product.name,
      subtitle: `${product.brand} • Từ ${product.price_decant.toLocaleString('vi-VN')}đ`,
      product,
    }));
  }, [products]);

  return (
    <section
      id={themeKey}
      ref={sectionRef}
      className="scroll-mt-24 py-6 sm:py-8 border-t border-white/10 space-y-3 sm:space-y-4"
    >
      {/* Section Editorial Header bọc trong Glassmorphism Card sang trọng, không bị che lấp */}
      <div className="max-w-4xl bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2.5">
          <span 
            className="text-[10px] sm:text-xs font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full border"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.primary,
              backgroundColor: `${theme.colors.surface}cc`,
            }}
          >
            CHAPTER {indexRoman}
          </span>
          <span className="w-8 sm:w-12 h-px bg-white/20" />
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-300 font-mono">
            {theme.name}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-white">
          {theme.subtitle}
        </h3>

        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-3xl font-sans line-clamp-2">
          {theme.description}
        </p>
      </div>

      {/* Sân khấu 3D Circular Carousel (ReactBits Preset Cylinder) */}
      <CircularCarousel
        items={carouselItems}
        cardWidth={220}
        aspectRatio={0.75}
        captions={true}
        draggable={true}
        autoplay="drift"
        speed={10}
        themeGlow={theme.colors.glow}
        themeBorder={theme.colors.border}
        onItemClick={(item) => setSelectedProduct(item.product)}
      />
    </section>
  );
}
