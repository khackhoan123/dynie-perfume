'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function DynieEmblemShowcase() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D mouse parallax tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-16deg', '16deg']);
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative flex items-center justify-center py-6 select-none"
      style={{ perspective: 1200 }}
    >
      {/* Outer ambient starlight glow */}
      <div className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-tr from-amber-400/20 via-rose-400/15 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Floating 3D Medallion */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 5,
            ease: 'easeInOut',
          },
        }}
        className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-92 md:h-92 rounded-full cursor-pointer flex items-center justify-center p-2.5"
      >
        {/* Outer Brushed Champagne Gold Metallic Ring */}
        <div 
          className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-b from-[#F5E6BE] via-[#C5A880] to-[#8C6D46] shadow-[0_15px_45px_rgba(0,0,0,0.7),0_0_35px_rgba(212,175,55,0.25)]"
          style={{ transform: 'translateZ(10px)' }}
        >
          <div className="w-full h-full rounded-full bg-[#0D0911]/90 backdrop-blur-2xl border border-white/10" />
        </div>

        {/* Specular Glare Layer reacting to mouse */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-30 pointer-events-none mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.8), transparent 70%)`,
            transform: 'translateZ(20px)',
          }}
        />

        {/* Inner Frosted Glass Disc with Concentric Rims */}
        <div 
          className="relative w-[90%] h-[90%] rounded-full bg-gradient-to-b from-white/[0.08] to-black/60 border border-white/20 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-6 shadow-inner"
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Subtle Inner Ring */}
          <div className="absolute inset-3 rounded-full border border-amber-300/20 border-dashed pointer-events-none" />

          {/* Perfume Bottle Silhouette & Logo Emblem */}
          <div className="space-y-3 flex flex-col items-center" style={{ transform: 'translateZ(25px)' }}>
            {/* Luxury Seal Icon: Bottle with Black Satin Bow silhouette */}
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center">
              {/* Bottle Cap */}
              <div className="absolute top-0 w-6 h-4 sm:w-7 sm:h-5 rounded-t-sm bg-gradient-to-r from-[#F5E6BE] via-[#D4AF37] to-[#997A35] shadow-md border border-amber-200/40" />
              {/* Collar */}
              <div className="absolute top-3 sm:top-4 w-4 h-2 bg-gradient-to-r from-[#D4AF37] to-[#8C6D46]" />
              
              {/* Black Satin Ribbon Bow */}
              <div className="absolute top-4 sm:top-5 z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F0F14] border border-stone-800 shadow" />
                <div className="absolute -left-3.5 w-4 h-2.5 rounded-full bg-[#0F0F14] -rotate-12 border border-stone-800" />
                <div className="absolute -right-3.5 w-4 h-2.5 rounded-full bg-[#0F0F14] rotate-12 border border-stone-800" />
                <div className="absolute -bottom-2 -left-1.5 w-1.5 h-3 bg-[#0F0F14] rotate-12" />
                <div className="absolute -bottom-2 -right-1.5 w-1.5 h-3 bg-[#0F0F14] -rotate-12" />
              </div>

              {/* Glass Flacon Body */}
              <div className="absolute bottom-0 w-12 h-14 sm:w-16 sm:h-17 rounded-xl bg-gradient-to-b from-rose-200/20 via-pink-300/10 to-amber-200/20 border border-white/40 backdrop-blur-md shadow-[0_8px_25px_rgba(255,200,210,0.2)] flex items-center justify-center">
                <div className="w-8 h-9 sm:w-10 sm:h-11 rounded-lg bg-gradient-to-b from-rose-400/25 to-pink-500/30 flex items-center justify-center">
                  <span className="font-serif text-xs sm:text-sm font-bold text-amber-100 tracking-wider">
                    DP
                  </span>
                </div>
              </div>
            </div>

            {/* Typography Seal */}
            <div className="space-y-1">
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-[0.25em] text-white uppercase drop-shadow">
                Dynie
              </h3>
              <p className="text-[9px] sm:text-[10px] tracking-[0.35em] text-amber-200/90 uppercase font-mono">
                Haute Parfumerie
              </p>
            </div>

            {/* Micro Badge */}
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] text-stone-200 font-mono tracking-wider">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>EST. 2024 &bull; NICHE SELECTION</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
