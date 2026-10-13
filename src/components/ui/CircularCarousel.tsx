'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/sheets';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowUpRight, Droplet } from 'lucide-react';

export interface CarouselItem {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  product: Product;
}

interface CircularCarouselProps {
  items: CarouselItem[];
  preset?: 'cylinder' | 'circle' | 'flat';
  cardWidth?: number;
  aspectRatio?: number;
  gap?: number;
  captions?: boolean;
  draggable?: boolean;
  autoplay?: 'drift' | 'spin' | false;
  speed?: number;
  onItemClick?: (item: CarouselItem, index: number) => void;
  themeGlow?: string;
  themeBorder?: string;
}

export default function CircularCarousel({
  items,
  cardWidth = 220,
  aspectRatio = 0.75, // 3:4 ratio
  captions = true,
  draggable = true,
  autoplay = 'drift',
  speed = 10,
  onItemClick,
  themeGlow,
  themeBorder,
}: CircularCarouselProps) {
  const { addToCart } = useCart();
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [responsiveCardWidth, setResponsiveCardWidth] = useState(cardWidth);

  const containerRef = useRef<HTMLDivElement>(null);
  const isPointerDown = useRef(false);
  const isHorizontalSwipe = useRef(false);
  const dragStartX = useRef(0);
  const pointerStartY = useRef(0);
  const dragStartRotation = useRef(0);
  const dragDistance = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Responsive card width calculation (< 640px -> 165px, < 768px -> 190px, desktop -> 220px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setResponsiveCardWidth(165);
      } else if (window.innerWidth < 768) {
        setResponsiveCardWidth(190);
      } else {
        setResponsiveCardWidth(cardWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cardWidth]);

  // Ensure minimum cards for a full 3D cylinder ring (if count < 6, repeat items)
  const displayItems = useMemo(() => {
    if (items.length === 0) return [];
    if (items.length >= 6) {
      return items.map((item, idx) => ({
        ...item,
        displayKey: `${item.id}-${idx}`,
        originalIndex: idx,
      }));
    }

    // Duplicate until at least 6 items for circular cylinder
    const repeated: (CarouselItem & { displayKey: string; originalIndex: number })[] = [];
    const multiplier = Math.ceil(6 / items.length);
    for (let m = 0; m < multiplier; m++) {
      items.forEach((item, idx) => {
        repeated.push({
          ...item,
          displayKey: `${item.id}-${m}-${idx}`,
          originalIndex: idx,
        });
      });
    }
    return repeated.slice(0, 6);
  }, [items]);

  const count = displayItems.length;
  const angleStep = count > 0 ? 360 / count : 0;

  // Dynamic gap based on card count
  const effectiveGap = useMemo(() => {
    if (count >= 8) return 14;
    if (count >= 6) return 18;
    return 22;
  }, [count]);

  // Cylinder radius calculation based on cardWidth and count (regular polygon circumradius)
  const radius = useMemo(() => {
    if (count === 0) return 300;
    const sliceWidth = responsiveCardWidth + effectiveGap;
    // R = sliceWidth / (2 * sin(PI / count))
    const r = sliceWidth / (2 * Math.sin(Math.PI / count));
    return Math.max(r, responsiveCardWidth * 1.3);
  }, [count, responsiveCardWidth, effectiveGap]);

  // Active front item index (0-based) for display counter (e.g. "01 / 07")
  const activeIndex = useMemo(() => {
    if (count === 0 || angleStep === 0) return 0;
    const norm = Math.round(-rotation / angleStep);
    return ((norm % count) + count) % count;
  }, [rotation, angleStep, count]);

  // Autoplay drift loop: pauses when dragging, hovered, or single card
  useEffect(() => {
    if (!autoplay || isDragging || isHovered || count <= 1) return;

    let lastTime = performance.now();
    const driftSpeed = speed * 0.07; // smooth degrees per second

    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setRotation((prev) => prev - driftSpeed * delta);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoplay, isDragging, isHovered, speed, count]);

  // Touch & Pointer Drag Handlers with Non-blocking Vertical Scroll for Mobile
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    isPointerDown.current = true;
    isHorizontalSwipe.current = false;
    dragStartX.current = e.clientX;
    pointerStartY.current = e.clientY;
    dragStartRotation.current = rotation;
    dragDistance.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const deltaX = e.clientX - dragStartX.current;
    const deltaY = e.clientY - pointerStartY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Gesture disambiguation: only intercept when horizontal movement dominates
    if (!isHorizontalSwipe.current) {
      if (absX > 7 && absX > absY) {
        isHorizontalSwipe.current = true;
        setIsDragging(true);
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {}
      } else if (absY > 7) {
        // User intends vertical page scroll; release pointer lock
        isPointerDown.current = false;
        return;
      }
    }

    if (isHorizontalSwipe.current) {
      dragDistance.current = absX;
      const degDelta = (deltaX / (responsiveCardWidth + effectiveGap)) * angleStep * 0.95;
      setRotation(dragStartRotation.current + degDelta);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPointerDown.current) {
      isPointerDown.current = false;
      if (isHorizontalSwipe.current) {
        setIsDragging(false);
        isHorizontalSwipe.current = false;
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {}
      }
    }
  };

  const handlePrev = useCallback(() => {
    setRotation((prev) => Math.round((prev + angleStep) / angleStep) * angleStep);
  }, [angleStep]);

  const handleNext = useCallback(() => {
    setRotation((prev) => Math.round((prev - angleStep) / angleStep) * angleStep);
  }, [angleStep]);

  if (items.length === 0) {
    return (
      <div className="h-[280px] sm:h-[340px] flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 text-stone-300 text-sm italic font-serif">
        Đang cập nhật các tuyệt phẩm cho bộ sưu tập này...
      </div>
    );
  }

  // Card Height based on 3:4 ratio + captions block
  const cardImageHeight = responsiveCardWidth / aspectRatio;
  const cardCaptionHeight = captions ? 76 : 0;
  const totalCardHeight = cardImageHeight + cardCaptionHeight;

  return (
    <div
      className="relative w-full py-1 overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Cylinder Stage - strictly constrained heights (380px mobile / 450px desktop) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[380px] sm:h-[430px] lg:h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: 1200,
          perspectiveOrigin: '50% 50%',
          touchAction: 'pan-y', // enables native vertical page scroll on mobile
        }}
      >
        {/* Soft Spotlight ambient beam */}
        <div
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: themeGlow || '#D4AF37' }}
        />

        {/* Rotating Cylinder Assembly with GPU acceleration */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            willChange: 'transform',
          }}
        >
          {displayItems.map((item, idx) => {
            const itemAngle = idx * angleStep;

            // Calculate card face orientation relative to viewer
            const effectiveAngle = ((rotation + itemAngle) % 360 + 360) % 360;
            const isFront = effectiveAngle < 90 || effectiveAngle > 270;
            const frontCloseness = Math.cos((effectiveAngle * Math.PI) / 180); // 1.0 (exact front) to -1.0 (back)

            return (
              <div
                key={item.displayKey}
                onClick={() => {
                  if (dragDistance.current > 8) return; // ignore click if dragged
                  onItemClick?.(item, item.originalIndex);
                }}
                className="absolute rounded-2xl overflow-hidden border border-white/15 bg-[#0A070F]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 group flex flex-col justify-between"
                style={{
                  width: `${responsiveCardWidth}px`,
                  height: `${totalCardHeight}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform',
                  opacity: isFront ? Math.max(frontCloseness * 0.95 + 0.05, 0.4) : 0.15,
                  boxShadow:
                    isFront && frontCloseness > 0.8 && themeGlow
                      ? `0 14px 36px -8px ${themeGlow}`
                      : 'none',
                  borderColor:
                    isFront && frontCloseness > 0.8 && themeBorder
                      ? themeBorder
                      : 'rgba(255, 255, 255, 0.15)',
                }}
              >
                {/* Image Container with Luxury Gradient Overlay */}
                <div
                  className="relative w-full overflow-hidden bg-black/60 shrink-0"
                  style={{ height: `${cardImageHeight}px` }}
                >
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 165px, (max-width: 768px) 190px, 220px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Droplet className="w-8 h-8" />
                    </div>
                  )}

                  {/* Gradient Overlay for Strong Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                  {/* Product Badge */}
                  {item.product.badge && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/60 text-[#F5E6BE] border border-[#F5E6BE]/30 backdrop-blur-md shadow-sm">
                      {item.product.badge}
                    </div>
                  )}

                  {/* Hover Actions: Khám Phá & Thêm Nhanh */}
                  <div className="absolute inset-0 bg-black/65 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick?.(item, item.originalIndex);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[10px] font-medium tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Khám Phá Chi Tiết</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item.product, 'decant_10ml', 1);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[#1A1A1A] text-[10px] font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#1A1A1A]" />
                      <span>Thêm Vào Giỏ</span>
                    </button>
                  </div>
                </div>

                {/* High Contrast Captions Block */}
                {captions && (
                  <div className="p-2.5 flex-1 flex flex-col justify-between bg-[#0A070F] border-t border-white/10">
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-white truncate group-hover:text-[#F5E6BE] transition-colors drop-shadow-sm">
                        {item.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-stone-200 truncate font-sans">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-[#F5E6BE] font-mono">
                      <span>Chiết 10ml</span>
                      <span className="font-bold text-white">
                        {item.product.price_decant.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sleek Navigation Controls with "01 / 07" Champagne Gold Indicator */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <button
          onClick={handlePrev}
          aria-label="Chai trước"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-[#F5E6BE] flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-[#F5E6BE]" />
        </button>

        <div className="px-3.5 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-widest text-[#F5E6BE]">
            {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-stone-400 font-sans hidden sm:inline uppercase tracking-wider">
            • Vuốt 360&deg;
          </span>
        </div>

        <button
          onClick={handleNext}
          aria-label="Chai kế tiếp"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-[#F5E6BE] flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 text-[#F5E6BE]" />
        </button>
      </div>
    </div>
  );
}
