'use client';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import BackgroundShader from './BackgroundShader';
import ThemeParticles from './ThemeParticles';
import { ThemeKey } from '@/config/themes';

interface Scene3DProps {
  currentThemeKey?: ThemeKey;
  nextThemeKey?: ThemeKey;
  transitionProgress?: number;
}

export default function Scene3D({
  currentThemeKey = 'sweet_rose',
  nextThemeKey = 'sweet_rose',
  transitionProgress = 0,
}: Scene3DProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Theo dõi tiến trình cuộn trang
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
          setScrollProgress(Math.min(Math.max(current, 0), 1));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 w-full h-full overflow-hidden select-none">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={45} />

        {/* 1. LIQUID SILK BACKGROUND SHADER: Nền sóng hương thơm hữu cơ */}
        <BackgroundShader
          currentThemeKey={currentThemeKey}
          nextThemeKey={nextThemeKey}
          transitionProgress={transitionProgress}
          scrollProgress={scrollProgress}
        />

        {/* 2. DYNAMIC THEME PARTICLES: Hạt tuyết / đóm lửa / lá / hoa */}
        <ThemeParticles
          currentThemeKey={currentThemeKey}
          nextThemeKey={nextThemeKey}
          transitionProgress={transitionProgress}
        />
      </Canvas>
    </div>
  );
}
