'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart, PerfumeSize } from '@/context/CartContext';
import { PERFUME_THEMES, ThemeKey } from '@/config/themes';
import { 
  X, 
  Sparkles, 
  Clock, 
  Wind, 
  ShoppingBag, 
  Droplet 
} from 'lucide-react';

export default function ScentDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>('decant_10ml');
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize('decant_10ml');
      setActiveImage(selectedProduct.thumb_url);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const theme = PERFUME_THEMES[selectedProduct.theme_id as ThemeKey] || PERFUME_THEMES.sweet_rose;

  const currentPrice =
    selectedSize === 'fullbox' && selectedProduct.price_full
      ? selectedProduct.price_full
      : selectedProduct.price_decant;

  const galleryImages = selectedProduct.gallery_urls
    ? selectedProduct.gallery_urls
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean)
    : [];

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, 1);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal Dialog (Desktop: Centered Modal / Mobile: Bottom Sheet max 85vh) */}
      <div 
        className="relative w-full sm:max-w-4xl rounded-t-3xl sm:rounded-3xl border border-white/15 bg-[#0F0A14]/95 backdrop-blur-2xl shadow-2xl overflow-hidden text-zinc-100 z-10 flex flex-col max-h-[85vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-6 sm:fade-in sm:zoom-in-95 duration-200"
        style={{
          boxShadow: `0 20px 60px 0 ${theme.colors.glow}`,
        }}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Ambient Gradient Glow */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: theme.colors.primary }}
        />

        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          aria-label="Đóng chi tiết"
          className="absolute top-4 right-4 z-20 p-2 sm:p-2.5 rounded-full bg-black/40 border border-white/10 text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto">
          {/* MOBILE COMPACT HEADER (< 640px) */}
          <div className="sm:hidden p-5 border-b border-white/10 flex gap-4 items-center bg-black/40">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-black/60 border border-white/15 shrink-0 shadow-md">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={selectedProduct.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <Droplet className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold font-mono truncate block">
                {selectedProduct.brand}
              </span>
              <h3 className="text-lg font-serif font-bold text-white truncate">
                {selectedProduct.name}
              </h3>
              <p className="text-xs text-amber-200/90 font-serif italic truncate">
                {selectedProduct.tone}
              </p>
              <div className="pt-1">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-medium border inline-block"
                  style={{
                    backgroundColor: `${theme.colors.surface}cc`,
                    color: theme.colors.accent,
                    borderColor: theme.colors.border,
                  }}
                >
                  {theme.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* DESKTOP 2-COLUMN GRID (>= 640px) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* CỘT TRÁI (Desktop only): Ảnh lớn 3:4 & Gallery */}
            <div className="hidden sm:flex md:col-span-5 p-6 sm:p-8 bg-black/40 flex-col justify-between border-r border-white/10">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-inner group">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={selectedProduct.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <Droplet className="w-12 h-12" />
                  </div>
                )}

                {selectedProduct.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/25 shadow-md">
                    {selectedProduct.badge}
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-14 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImage === imgUrl ? 'border-amber-300 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Gallery ${idx}`}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: Thông tin chi tiết */}
            <div className="md:col-span-7 p-5 sm:p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Brand & Theme Pill (Desktop) */}
                <div className="hidden sm:flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold font-mono">
                    {selectedProduct.brand}
                  </span>
                  <span 
                    className="px-3 py-0.5 rounded-full text-[11px] font-medium border"
                    style={{
                      backgroundColor: `${theme.colors.surface}cc`,
                      color: theme.colors.accent,
                      borderColor: theme.colors.border,
                    }}
                  >
                    {theme.subtitle}
                  </span>
                </div>

                {/* Perfume Name (Desktop) */}
                <h3 className="hidden sm:block text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  {selectedProduct.name}
                </h3>

                {/* Tone & Occasion (Desktop) */}
                <p className="hidden sm:block text-sm text-stone-200 italic font-serif">
                  &ldquo;{selectedProduct.tone}&rdquo;
                </p>
                {selectedProduct.occasion && (
                  <p className="text-xs text-stone-300">
                    <span className="text-stone-400 font-medium">Phù hợp:</span> {selectedProduct.occasion} &bull; {selectedProduct.gender}
                  </p>
                )}

                {/* Kim tự tháp 3 tầng hương (Scent Pyramid Pills) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Kim Tự Tháp Mùi Hương</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-stone-300 text-[10px] uppercase font-mono shrink-0">
                        Top
                      </span>
                      <span className="text-stone-200">{selectedProduct.top_notes}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-stone-300 text-[10px] uppercase font-mono shrink-0">
                        Heart
                      </span>
                      <span className="text-stone-200">{selectedProduct.mid_notes}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-stone-300 text-[10px] uppercase font-mono shrink-0">
                        Base
                      </span>
                      <span className="text-stone-200">{selectedProduct.base_notes}</span>
                    </div>
                  </div>
                </div>

                {/* Thước đo độ lưu hương & tỏa hương */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-stone-400 text-[10px] sm:text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Độ lưu hương</span>
                    </div>
                    <div className="font-semibold text-white text-xs sm:text-sm">{selectedProduct.longevity}</div>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-stone-400 text-[10px] sm:text-[11px]">
                      <Wind className="w-3.5 h-3.5 text-stone-400" />
                      <span>Độ tỏa hương</span>
                    </div>
                    <div className="font-semibold text-white text-xs sm:text-sm truncate">{selectedProduct.sillage}</div>
                  </div>
                </div>

                {/* Lời tự sự của Shop */}
                {selectedProduct.short_review && (
                  <blockquote className="p-3 rounded-xl bg-amber-300/5 border-l-2 border-amber-300 text-xs text-stone-200 italic leading-relaxed">
                    &ldquo;{selectedProduct.short_review}&rdquo;
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR (Ghim cố định ở đáy cả trên mobile & desktop) */}
        <div className="sticky bottom-0 bg-[#0C0812]/95 backdrop-blur-xl p-4 sm:p-6 border-t border-white/15 space-y-3 shrink-0">
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Chọn dung tích:</span>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <button
                onClick={() => setSelectedSize('decant_10ml')}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedSize === 'decant_10ml'
                    ? 'bg-amber-300/15 border-amber-300 text-white shadow-md'
                    : 'bg-black/40 border-white/10 text-stone-300 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="text-[10px] sm:text-[11px] font-medium">Chiết 10ml</div>
                <div className="text-xs sm:text-sm font-bold text-amber-200">
                  {selectedProduct.price_decant.toLocaleString('vi-VN')} đ
                </div>
              </button>

              {selectedProduct.price_full ? (
                <button
                  onClick={() => setSelectedSize('fullbox')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSize === 'fullbox'
                      ? 'bg-amber-300/15 border-amber-300 text-white shadow-md'
                      : 'bg-black/40 border-white/10 text-stone-300 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="text-[10px] sm:text-[11px] font-medium">Chai Fullbox 100ml</div>
                  <div className="text-xs sm:text-sm font-bold text-stone-100">
                    {selectedProduct.price_full.toLocaleString('vi-VN')} đ
                  </div>
                </button>
              ) : (
                <div className="p-2.5 sm:p-3 rounded-xl bg-black/20 border border-white/5 text-stone-500 text-left">
                  <div className="text-[10px] sm:text-[11px]">Chai Fullbox</div>
                  <div className="text-xs italic">Liên hệ đặt trước</div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Thêm vào giỏ */}
          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl font-sans text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[#1A1A1A] shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#1A1A1A]" />
            <span>Thêm Vào Giỏ Hàng &bull; {currentPrice.toLocaleString('vi-VN')} đ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
