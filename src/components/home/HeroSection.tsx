'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ArrowDown, Sparkles } from 'lucide-react';

const HeroBottle3D = dynamic(() => import('@/components/canvas/HeroBottle3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border border-amber-300/20 bg-white/5 animate-pulse" />
    </div>
  ),
});

export default function HeroSection() {
  const scrollToCatalog = () => {
    const el = document.getElementById('fresh_water');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-6">
      {/* Hero Content Grid: Cột trái văn bản Glassmorphic & Cột phải Chai Nước Hoa 3D GLB Thật */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex items-center py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
          {/* CỘT TRÁI: Toàn bộ văn bản bọc trong Glassmorphism Card sang trọng */}
          <div className="lg:col-span-7">
            <div className="bg-black/50 backdrop-blur-xl border border-white/15 rounded-3xl p-7 sm:p-10 shadow-2xl space-y-6 max-w-2xl">
              {/* Subtle Tagline Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-amber-300/30 text-amber-100 text-xs font-medium backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="tracking-[0.18em] uppercase font-mono text-[11px]">
                  Haute Parfumerie &bull; Niche Selection
                </span>
              </div>

              {/* Majestic Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.15] drop-shadow-lg">
                Elegance in <br />
                <span className="italic font-serif bg-gradient-to-r from-stone-100 via-amber-100 to-amber-200 bg-clip-text text-transparent">
                  Every Scent Note.
                </span>
              </h1>

              {/* High Contrast Poetic Subtitle */}
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans">
                Từng giọt hương là một nốt nhạc vô hình khơi gợi miền ký ức và tôn vinh nét quyến rũ độc bản. 
                Đắm chìm trong 5 không gian cảm xúc được tinh tuyển công phu từ những thánh địa mùi hương thế giới.
              </p>

              {/* Actions: Nút Trắng Kem #FDFBF7 sang trọng, chữ đen than #1A1A1A in hoa tracking rộng */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={scrollToCatalog}
                  className="py-3.5 px-8 rounded-full font-sans text-xs font-bold tracking-[0.15em] uppercase bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[#1A1A1A] shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 flex items-center gap-3 cursor-pointer"
                >
                  <span>Khám Phá Mùi Hương</span>
                  <ArrowDown className="w-4 h-4 text-[#1A1A1A]" />
                </button>

                <div className="flex items-center gap-2 text-xs text-stone-300 font-sans pl-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Chính hãng 100% &bull; Chiết chuẩn giọt</span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Khung Trưng Bày Chai Nước Hoa 3D Thật (dynie_bottle.glb) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroBottle3D />
          </div>
        </div>
      </div>

      {/* Scroll Down Cue */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-stone-300 font-mono pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span>01 / 05 CHAPTERS</span>
        </div>

        <button
          onClick={scrollToCatalog}
          className="flex items-center gap-2 text-stone-200 hover:text-white transition-colors cursor-pointer"
        >
          <span className="tracking-widest">CUỘN ĐỂ KHÁM PHÁ</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
