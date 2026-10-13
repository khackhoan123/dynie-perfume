'use client';

import React from 'react';
import { MessageCircle, Send, ArrowUp } from 'lucide-react';

export default function Footer() {
  const shopZalo = process.env.NEXT_PUBLIC_SHOP_ZALO || '0900000000';
  const shopMessenger = process.env.NEXT_PUBLIC_SHOP_MESSENGER || 'dynieperfume';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#09060C]/90 backdrop-blur-2xl text-stone-300 py-20 px-6 mt-16">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Logo Dynie Perfume chính giữa */}
        <div className="space-y-1.5 flex flex-col items-center">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.28em] text-white uppercase drop-shadow">
            Dynie Perfume
          </span>
          <span className="text-[10px] tracking-[0.4em] text-amber-200/90 uppercase font-mono">
            Haute Parfumerie Boutique
          </span>
        </div>

        {/* 1 Câu Slogan Tinh Tế */}
        <p className="font-serif text-base sm:text-lg italic text-stone-200 max-w-lg leading-relaxed">
          &ldquo;Mùi hương là chữ ký vô hình của bạn.&rdquo;
        </p>

        {/* 2 Nút liên hệ trực tiếp thanh lịch dạng viên thuốc (Pill) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {/* Zalo Pill */}
          <a
            href={`https://zalo.me/${shopZalo}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-amber-300/50 text-stone-100 hover:text-white text-xs font-medium tracking-wider transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2.5 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Nhắn tin Zalo tư vấn</span>
          </a>

          {/* Messenger Pill */}
          <a
            href={`https://m.me/${shopMessenger}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-sky-300/50 text-stone-100 hover:text-white text-xs font-medium tracking-wider transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2.5 cursor-pointer"
          >
            <Send className="w-4 h-4 text-sky-300" />
            <span>Chat Messenger</span>
          </a>
        </div>

        {/* Back to top & Copyright */}
        <div className="pt-10 border-t border-white/5 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} DYNIE PERFUME. TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>VỀ ĐẦU TRANG</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
