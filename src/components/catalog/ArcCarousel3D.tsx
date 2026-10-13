'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/sheets';
import { PERFUME_THEMES, ThemeKey } from '@/config/themes';
import { useCart } from '@/context/CartContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Sparkles, 
  Droplet, 
  ArrowUpRight 
} from 'lucide-react';

interface ArcCarousel3DProps {
  products: Product[];
  themeKey: ThemeKey;
}

export default function ArcCarousel3D({ products, themeKey }: ArcCarousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { setSelectedProduct, addToCart } = useCart();
  const theme = PERFUME_THEMES[themeKey] || PERFUME_THEMES.sweet_rose;

  const count = products.length;

  const handleNext = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const handlePrev = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Touch and Mouse Drag Support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
    touchEndX.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchEndX.current = clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // 40px drag threshold

    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (count === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center rounded-3xl bg-black/40 border border-white/10 text-stone-300 text-sm italic font-serif">
        Đang cập nhật các tuyệt phẩm cho bộ sưu tập này...
      </div>
    );
  }

  return (
    <div className="relative w-full py-8 overflow-hidden select-none">
      {/* 3D Arc Spotlight Stage Container */}
      <div
        className="relative w-full h-[580px] sm:h-[640px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: 1400,
          perspectiveOrigin: '50% 50%',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
      >
        {/* Soft Ambient Theme Spotlight Beam behind Active Card */}
        <div 
          className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: theme.colors.primary }}
        />

        {/* 3D Arc Cards Assembly */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {products.map((product, i) => {
            // Tính khoảng cách offset tương đối so với activeIndex
            let diff = i - activeIndex;
            // Xử lý xoay vòng tròn khi count > 2
            if (count > 2) {
              if (diff > count / 2) diff -= count;
              if (diff < -count / 2) diff += count;
            }

            const isActive = diff === 0;
            const absDiff = Math.abs(diff);

            // Tọa độ và góc xoay 3D tạo vòng cung Spotlight
            // Mobile: bước nhảy hẹp hơn để vừa màn hình
            const angleStep = 22; // độ nghiêng vào tâm
            const angleY = -diff * angleStep;
            const translateX = diff * 290; // khoảng cách ngang (px)
            const translateZ = -absDiff * 110; // lùi về sau tạo độ sâu
            const scale = isActive ? 1.0 : absDiff === 1 ? 0.88 : 0.76;
            const opacity = isActive ? 1.0 : absDiff === 1 ? 0.75 : 0.35;
            const zIndex = 40 - absDiff * 10;

            return (
              <div
                key={product.id}
                onClick={() => {
                  if (!isActive) setActiveIndex(i);
                }}
                className={`absolute w-[275px] sm:w-[320px] md:w-[350px] rounded-3xl transition-all duration-500 ease-out flex flex-col justify-between overflow-hidden ${
                  isActive
                    ? 'cursor-default ring-1 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                    : 'cursor-pointer hover:opacity-90'
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${angleY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: 'preserve-3d',
                  backgroundColor: 'rgba(12, 8, 16, 0.75)',
                  backdropFilter: 'blur(20px)',
                  borderColor: isActive ? theme.colors.border : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isActive ? `0 15px 45px 0 ${theme.colors.glow}` : 'none',
                }}
              >
                {/* 3:4 Image Container */}
                <div 
                  className="relative aspect-[3/4] w-full overflow-hidden bg-black/60 cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                >
                  {product.thumb_url ? (
                    <Image
                      src={product.thumb_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 275px, 350px"
                      className="object-cover transition-transform duration-700 group-hover:scale-106"
                      priority={isActive}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Droplet className="w-12 h-12" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                    {product.badge ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/20 shadow-md">
                        {product.badge}
                      </span>
                    ) : <span />}

                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-md border"
                      style={{
                        backgroundColor: `${theme.colors.surface}dd`,
                        color: theme.colors.accent,
                        borderColor: theme.colors.border,
                      }}
                    >
                      {theme.name}
                    </span>
                  </div>

                  {/* Quick Expand Icon on Hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Card Editorial Information */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#0E0A12]/80">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-300">
                      <span className="font-mono tracking-widest uppercase font-semibold text-[10px]">
                        {product.brand}
                      </span>
                      <span className="text-[10px] text-stone-300 font-serif italic">{product.gender}</span>
                    </div>

                    <h4 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="text-base sm:text-lg font-serif font-bold text-white hover:text-amber-200 transition-colors cursor-pointer truncate"
                    >
                      {product.name}
                    </h4>

                    <p className="text-xs text-stone-200 line-clamp-1 italic font-serif">
                      {product.tone}
                    </p>

                    <p className="text-[11px] text-stone-300 line-clamp-1 pt-0.5">
                      <span className="text-stone-400 font-medium">Hương chính:</span> {product.top_notes}
                    </p>
                  </div>

                  {/* Pricing & Double Actions */}
                  <div className="pt-3 border-t border-white/10 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-stone-300 uppercase tracking-wider font-mono">Chiết 10ml từ:</span>
                      <span className="text-base font-bold font-serif text-amber-200">
                        {product.price_decant.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="py-2 px-2.5 rounded-xl border border-white/15 hover:border-white/35 bg-white/5 hover:bg-white/10 text-[11px] font-medium text-stone-200 hover:text-white transition-all text-center cursor-pointer"
                      >
                        Khám Phá
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 'decant_10ml', 1);
                        }}
                        className="py-2 px-2.5 rounded-xl bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[#1A1A1A] text-[11px] font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.02] cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#1A1A1A]" />
                        <span>Chọn Mua</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D Arc Navigation Controls (Mũi tên tròn thanh lịch & Chỉ số) */}
      <div className="flex items-center justify-center gap-6 pt-4">
        <button
          onClick={handlePrev}
          disabled={count <= 1}
          aria-label="Chai trước"
          className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-stone-200" />
        </button>

        {/* Indicator dots */}
        <div className="flex items-center gap-2">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Chuyển đến sản phẩm ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === activeIndex
                  ? 'w-6 h-2 bg-amber-200 shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                  : 'w-2 h-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={count <= 1}
          aria-label="Chai kế tiếp"
          className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-stone-200" />
        </button>
      </div>
    </div>
  );
}
