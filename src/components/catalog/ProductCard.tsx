'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/sheets';
import { PERFUME_THEMES, ThemeKey } from '@/config/themes';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Sparkles, Droplet, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { setSelectedProduct, addToCart } = useCart();
  const theme = PERFUME_THEMES[product.theme_id as ThemeKey] || PERFUME_THEMES.sweet_rose;

  return (
    <div className="group rounded-3xl border border-white/10 bg-black/45 backdrop-blur-xl hover:bg-black/65 overflow-hidden transition-all duration-500 flex flex-col justify-between hover:border-white/30 hover:shadow-2xl hover:shadow-rose-950/20 hover:-translate-y-1">
      {/* 3:4 Aspect Ratio Image Showcase */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden bg-black/60 cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        {product.thumb_url ? (
          <Image
            src={product.thumb_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <Droplet className="w-12 h-12" />
          </div>
        )}

        {/* Gradient Overlay for Editorial Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2">
          {product.badge ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/20 shadow-md">
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

        {/* Hover Quick Explore Icon */}
        <div className="absolute bottom-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono tracking-widest uppercase font-semibold text-[11px]">
              {product.brand}
            </span>
            <span className="text-[11px] text-zinc-400 font-serif italic">{product.gender}</span>
          </div>

          <h3 
            className="text-lg font-serif font-bold text-white group-hover:text-rose-300 transition-colors cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-300 line-clamp-1 italic font-serif">
            {product.tone}
          </p>

          <p className="text-[11px] text-zinc-400 line-clamp-1 pt-0.5">
            <span className="text-zinc-500 font-medium">Hương:</span> {product.top_notes}
          </p>
        </div>

        {/* Pricing & Double Actions */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-stone-300 uppercase tracking-wider font-mono">Chiết 10ml từ:</span>
            <span className="text-base font-bold font-serif text-amber-200">
              {product.price_decant.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedProduct(product)}
              className="py-2.5 px-3 rounded-xl border border-white/15 hover:border-white/35 bg-white/5 hover:bg-white/10 text-[11px] font-medium text-stone-200 hover:text-white transition-all text-center cursor-pointer"
            >
              Khám Phá
            </button>

            <button
              onClick={() => addToCart(product, 'decant_10ml', 1)}
              className="py-2.5 px-3 rounded-xl bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[#1A1A1A] text-[11px] font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.02] cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Chọn Mua</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
