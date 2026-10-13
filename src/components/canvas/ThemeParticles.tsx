'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PERFUME_THEMES, ThemeKey } from '@/config/themes';

interface ThemeParticlesProps {
  currentThemeKey: ThemeKey;
  nextThemeKey: ThemeKey;
  transitionProgress: number;
}

const PARTICLE_COUNT = 160;

/**
 * Tạo texture hình tròn phát quang mềm (radial glow disc) để hạt không bị vuông
 */
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function ThemeParticles({
  currentThemeKey,
  nextThemeKey,
  transitionProgress,
}: ThemeParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const texture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createParticleTexture();
  }, []);

  // Khởi tạo vị trí, tốc độ, pha dao động cho các hạt
  const { positions, velocities, phases, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT);
    const phs = new Float32Array(PARTICLE_COUNT);
    const szs = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 8.5; // X: -4.25 -> 4.25
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9.0; // Y: -4.5 -> 4.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.0; // Z: -2.0 -> 2.0

      vel[i] = 0.6 + Math.random() * 0.9;
      phs[i] = Math.random() * Math.PI * 2;
      szs[i] = 0.12 + Math.random() * 0.22;
    }

    return { positions: pos, velocities: vel, phases: phs, sizes: szs };
  }, []);

  const currentColor = useRef(new THREE.Color());
  const targetColor = useRef(new THREE.Color());

  useEffect(() => {
    const currCfg = PERFUME_THEMES[currentThemeKey]?.particles || PERFUME_THEMES.sweet_rose.particles;
    const nextCfg = PERFUME_THEMES[nextThemeKey]?.particles || PERFUME_THEMES.sweet_rose.particles;

    const c1 = new THREE.Color(currCfg.color);
    const c2 = new THREE.Color(nextCfg.color);
    c1.lerp(c2, THREE.MathUtils.clamp(transitionProgress, 0, 1));
    targetColor.current.copy(c1);
  }, [currentThemeKey, nextThemeKey, transitionProgress]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const currentPositions = posAttr.array as Float32Array;

    const currentTheme = PERFUME_THEMES[currentThemeKey] || PERFUME_THEMES.sweet_rose;
    const pType = currentTheme.particles.type;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const v = velocities[i];
      const ph = phases[i];

      if (pType === 'amber_sparks') {
        // 1. Tàn đóm lửa vàng kim bay lên (rising up with slight turbulence)
        currentPositions[idx + 1] += v * delta * 1.8;
        currentPositions[idx + 0] += Math.sin(time * 2.5 + ph) * 0.008;

        if (currentPositions[idx + 1] > 4.5) {
          currentPositions[idx + 1] = -4.5;
          currentPositions[idx + 0] = (Math.random() - 0.5) * 8.0;
        }
      } else if (pType === 'snow') {
        // 2. Bụi tuyết rơi nhẹ lấp lánh (falling down with gentle sway)
        currentPositions[idx + 1] -= v * delta * 1.4;
        currentPositions[idx + 0] += Math.sin(time * 1.2 + ph) * 0.005;

        if (currentPositions[idx + 1] < -4.5) {
          currentPositions[idx + 1] = 4.5;
          currentPositions[idx + 0] = (Math.random() - 0.5) * 8.0;
        }
      } else if (pType === 'leaves') {
        // 3. Mảnh lá xanh rơi nhẹ chao đảo (falling & wider fluttering sway)
        currentPositions[idx + 1] -= v * delta * 1.2;
        currentPositions[idx + 0] += Math.sin(time * 1.6 + ph) * 0.014;

        if (currentPositions[idx + 1] < -4.5) {
          currentPositions[idx + 1] = 4.5;
          currentPositions[idx + 0] = (Math.random() - 0.5) * 8.0;
        }
      } else if (pType === 'rose_petals') {
        // 4. Cánh hoa hồng phấn bồng bềnh (drifting gracefully)
        currentPositions[idx + 1] -= v * delta * 1.0;
        currentPositions[idx + 0] += Math.cos(time * 1.1 + ph) * 0.01;

        if (currentPositions[idx + 1] < -4.5) {
          currentPositions[idx + 1] = 4.5;
          currentPositions[idx + 0] = (Math.random() - 0.5) * 8.0;
        }
      } else {
        // 5. Stardust (dark_mystery): Bụi sao tím lơ lửng, chuyển động vi mô
        currentPositions[idx + 0] += Math.cos(time * 0.8 + ph) * 0.004;
        currentPositions[idx + 1] += Math.sin(time * 0.8 + ph) * 0.004;

        // Wrap around bounds
        if (currentPositions[idx + 1] > 4.5) currentPositions[idx + 1] = -4.5;
        if (currentPositions[idx + 1] < -4.5) currentPositions[idx + 1] = 4.5;
      }
    }

    posAttr.needsUpdate = true;

    // Smooth color & opacity interpolation
    if (materialRef.current) {
      currentColor.current.lerp(targetColor.current, delta * 3.0);
      materialRef.current.color.copy(currentColor.current);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.22}
        map={texture || undefined}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}
