'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import dynamic from 'next/dynamic';
import { ThemeKey } from '@/config/themes';
import { CartContext } from '@/context/CartContext';

const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#120712] to-[#080309]" />
  ),
});

export default function SceneWrapper() {
  const cartContext = useContext(CartContext);
  const activeTheme = cartContext?.activeTheme || 'sweet_rose';
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('sweet_rose');
  const [nextTheme, setNextTheme] = useState<ThemeKey>('sweet_rose');
  const [transitionProgress, setTransitionProgress] = useState(1);

  const animFrameRef = useRef<number | null>(null);
  const prevThemeRef = useRef<ThemeKey>('sweet_rose');

  // Khi activeTheme từ CartContext (kích hoạt bởi scroll) thay đổi -> chuyển màu shader mượt mà
  useEffect(() => {
    if (activeTheme === prevThemeRef.current) return;

    setNextTheme(activeTheme);
    setTransitionProgress(0);

    const startTime = performance.now();
    const duration = 1400; // 1.4s chuyển màu êm ái

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      // Smooth cubic ease-in-out
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      setTransitionProgress(eased);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentTheme(activeTheme);
        prevThemeRef.current = activeTheme;
        setTransitionProgress(1);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeTheme]);

  return (
    <Scene3D
      currentThemeKey={currentTheme}
      nextThemeKey={nextTheme}
      transitionProgress={transitionProgress}
    />
  );
}
