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
  preset = 'cylinder',
  cardWidth = 240,
  aspectRatio = 0.75, // 3:4 ratio
  gap = 20,
  captions = true,
  draggable = true,
  autoplay = 'drift',
  speed = 12,
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
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const dragDistance = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Responsive card width calculation (< 768px -> 190px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setResponsiveCardWidth(185);
      } else if (window.innerWidth < 768) {
        setResponsiveCardWidth(205);
      } else {
        setResponsiveCardWidth(cardWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cardWidth]);

  // Ensure minimum cards for a full cylinder ring (repeat items if count < 6)
  const displayItems = useMemo(() => {
    if (items.length === 0) return [];
    if (items.length >= 6) return items.map((item, idx) => ({ ...item, displayKey: `${item.id}-${idx}`, originalIndex: idx }));

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
    return repeated.slice(0, 6); // exactly 6 slots for a harmonious hexagonal cylinder
  }, [items]);

  const count = displayItems.length;
  const angleStep = count > 0 ? 360 / count : 0;

  // Cylinder radius calculation based on cardWidth and gap
  const radius = useMemo(() => {
    if (count === 0) return 300;
    const sliceWidth = responsiveCardWidth + gap;
    // R = sliceWidth / (2 * tan(PI / count))
    const r = sliceWidth / (2 * Math.tan(Math.PI / count));
    return Math.max(r, 260);
  }, [count, responsiveCardWidth, gap]);

  // Autoplay drift loop
  useEffect(() => {
    if (!autoplay || isDragging || isHovered || count <= 1) return;

    let lastTime = performance.now();
    const driftSpeed = speed * 0.08; // degrees per second

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

  // Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRotation.current = rotation;
    dragDistance.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    dragDistance.current = Math.abs(deltaX);
    // Sensitivity factor
    const degDelta = (deltaX / (responsiveCardWidth + gap)) * angleStep * 0.9;
    setRotation(dragStartRotation.current + degDelta);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const handlePrev = useCallback(() => {
    setRotation((prev) => Math.round((prev + angleStep) / angleStep) * angleStep);
  }, [angleStep]);

  const handleNext = useCallback(() => {
    setRotation((prev) => Math.round((prev - angleStep) / angleStep) * angleStep);
  }, [angleStep]);

  if (items.length === 0) {
    return (
      <div className="h-[380px] flex items-center justify-center rounded-3xl bg-black/40 border border-white/10 text-stone-300 text-sm italic font-serif">
        Đang cập nhật các tuyệt phẩm cho bộ sưu tập này...
      </div>
    );
  }

  // Card Height based on 3:4 ratio + captions
  const cardHeight = responsiveCardWidth / aspectRatio;

  return (
    <div 
      className="relative w-full py-4 overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Cylinder Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[520px] sm:h-[580px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: 1300,
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Soft Spotlight ambient beam */}
        <div 
          className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: themeGlow || '#D4AF37' }}
        />

        {/* Rotating Cylinder Assembly */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
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
                onClick={(e) => {
                  if (dragDistance.current > 8) return; // ignore click if dragging
                  onItemClick?.(item, item.originalIndex);
                }}
                className="absolute rounded-2xl overflow-hidden border border-white/15 bg-[#0D0913]/90 backdrop-blur-xl shadow-2xl transition-shadow duration-300 group flex flex-col justify-between"
                style={{
                  width: `${responsiveCardWidth}px`,
                  height: `${cardHeight + (captions ? 88 : 0)}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  opacity: isFront ? Math.max(frontCloseness * 0.95 + 0.05, 0.35) : 0.15,
                  boxShadow: isFront && frontCloseness > 0.8 && themeGlow ? `0 15px 40px -10px ${themeGlow}` : 'none',
                  borderColor: isFront && frontCloseness > 0.8 && themeBorder ? themeBorder : 'rgba(255, 255, 255, 0.15)',
                }}
              >
                {/* Image Container (3:4 Ratio) */}
                <div 
                  className="relative w-full overflow-hidden bg-black/60 shrink-0"
                  style={{ height: `${cardHeight}px` }}
                >
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="260px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Droplet className="w-10 h-10" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                  {/* Badge */}
                  {item.product.badge && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-md border border-white/25 shadow-sm">
                      {item.product.badge}
                    </div>
                  )}

                  {/* Hover Overlay with 2 Luxury Actions */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-4 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick?.(item, item.originalIndex);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[11px] font-medium tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Khám Phá Mùi Hương</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item.product, 'decant_10ml', 1);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[#1A1A1A] text-[11px] font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#1A1A1A]" />
                      <span>Thêm Nhanh Vào Giỏ</span>
                    </button>
                  </div>
                </div>

                {/* Captions Block */}
                {captions && (
                  <div className="p-3 flex-1 flex flex-col justify-between bg-[#0C0812] border-t border-white/10">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-serif font-bold text-white truncate group-hover:text-amber-200 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-300 truncate font-sans">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-amber-200/90 font-mono">
                      <span>Chiết 10ml</span>
                      <span className="font-bold text-white">{item.product.price_decant.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows [ < ] and [ > ] */}
      <div className="flex items-center justify-center gap-6 pt-3">
        <button
          onClick={handlePrev}
          aria-label="Chai trước"
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-stone-200" />
        </button>

        <span className="text-[11px] text-stone-400 font-mono tracking-widest uppercase">
          Vuốt hoặc kéo xoay 360&deg;
        </span>

        <button
          onClick={handleNext}
          aria-label="Chai kế tiếp"
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 text-stone-200" />
        </button>
      </div>
    </div>
  );
}
