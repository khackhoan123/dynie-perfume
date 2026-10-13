'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PERFUME_THEMES, ThemeKey } from '@/config/themes';

interface BackgroundShaderProps {
  currentThemeKey: ThemeKey;
  nextThemeKey: ThemeKey;
  transitionProgress: number; // 0.0 to 1.0
  scrollProgress: number;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.x, position.y, 0.9999, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uScroll;

  uniform vec3 uCurrentShadow;
  uniform vec3 uCurrentWave1;
  uniform vec3 uCurrentWave2;
  uniform vec3 uCurrentCrest;

  uniform vec3 uNextShadow;
  uniform vec3 uNextWave1;
  uniform vec3 uNextWave2;
  uniform vec3 uNextCrest;

  uniform float uTransition;

  void main() {
    // 1. Theme Color Interpolation
    vec3 shadow = mix(uCurrentShadow, uNextShadow, uTransition);
    vec3 wave1  = mix(uCurrentWave1, uNextWave1, uTransition);
    vec3 wave2  = mix(uCurrentWave2, uNextWave2, uTransition);
    vec3 crest  = mix(uCurrentCrest, uNextCrest, uTransition);

    // 2. Normalized Screen Coordinates & Aspect Ratio
    vec2 p = vUv * 2.0 - 1.0;
    if (uResolution.y > 0.0) {
      p.x *= (uResolution.x / uResolution.y);
    }

    // Interactive mouse influence & subtle scroll flow
    vec2 mouseOffset = (uMouse - 0.5) * 0.22;
    p += mouseOffset;
    p.y += uScroll * 0.6;

    float t = uTime * 0.28;

    // 3. Organic Liquid Silk Wave Displacement (Domain Warping)
    vec2 q = vec2(0.0);
    q.x = sin(p.x * 1.8 + t * 0.7) + cos(p.y * 1.4 - t * 0.5);
    q.y = cos(p.x * 1.3 - t * 0.4) + sin(p.y * 1.7 + t * 0.6);

    vec2 r = vec2(0.0);
    r.x = sin(p.x * 2.2 + 1.3 * q.x + t * 0.4) + cos(p.y * 2.5 + 0.9 * q.y + t * 0.3);
    r.y = cos(p.x * 1.7 + 0.8 * q.y - t * 0.3) + sin(p.y * 2.0 + 1.2 * q.x + t * 0.5);

    // 4. Silk Ribbon Folds & Caustics
    float fold = 0.5 + 0.5 * sin(p.x * 1.6 + p.y * 1.2 + 2.2 * r.x + 1.5 * r.y + t);
    float silkWave = pow(fold, 2.4);

    // Dynamic crest specular sheen (silky glow)
    float crestAngle = p.x * 3.2 - p.y * 2.4 + 2.5 * r.y + t * 1.1;
    float silkSheen = pow(max(0.0, sin(crestAngle)), 7.0);
    float secondarySheen = pow(max(0.0, cos(p.x * 2.0 + p.y * 3.0 + 1.8 * r.x - t * 0.8)), 5.0) * 0.4;

    // 5. Harmonious Multi-Layer Color Blending
    vec3 col = mix(shadow, wave1, clamp(fold * 1.15, 0.0, 1.0));
    col = mix(col, wave2, clamp(silkWave * 0.88, 0.0, 1.0));
    col += crest * (silkSheen + secondarySheen) * 0.75;

    // 6. Deep Vignette for Editorial Elegance
    float dist = length(vUv - 0.5);
    float vignette = smoothstep(0.9, 0.2, dist);
    col *= mix(0.55, 1.0, vignette);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function BackgroundShader({
  currentThemeKey,
  nextThemeKey,
  transitionProgress,
  scrollProgress,
}: BackgroundShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, pointer } = useThree();

  const currentTheme = PERFUME_THEMES[currentThemeKey] || PERFUME_THEMES.sweet_rose;
  const nextTheme = PERFUME_THEMES[nextThemeKey] || PERFUME_THEMES.sweet_rose;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },

      uCurrentShadow: { value: new THREE.Vector3(...currentTheme.shader.shadow) },
      uCurrentWave1: { value: new THREE.Vector3(...currentTheme.shader.wave1) },
      uCurrentWave2: { value: new THREE.Vector3(...currentTheme.shader.wave2) },
      uCurrentCrest: { value: new THREE.Vector3(...currentTheme.shader.crest) },

      uNextShadow: { value: new THREE.Vector3(...nextTheme.shader.shadow) },
      uNextWave1: { value: new THREE.Vector3(...nextTheme.shader.wave1) },
      uNextWave2: { value: new THREE.Vector3(...nextTheme.shader.wave2) },
      uNextCrest: { value: new THREE.Vector3(...nextTheme.shader.crest) },

      uTransition: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    if (!material.uniforms) return;

    // Update time & screen dimensions
    material.uniforms.uTime.value += delta;
    material.uniforms.uResolution.value.set(state.size.width, state.size.height);

    // Smooth mouse lerp
    const targetMouseX = (pointer.x + 1) * 0.5;
    const targetMouseY = (pointer.y + 1) * 0.5;
    material.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      material.uniforms.uMouse.value.x,
      targetMouseX,
      0.05
    );
    material.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      material.uniforms.uMouse.value.y,
      targetMouseY,
      0.05
    );

    // Smooth scroll interpolation
    material.uniforms.uScroll.value = THREE.MathUtils.lerp(
      material.uniforms.uScroll.value,
      scrollProgress,
      0.08
    );

    // Update current & next theme shader color vectors
    material.uniforms.uCurrentShadow.value.set(...currentTheme.shader.shadow);
    material.uniforms.uCurrentWave1.value.set(...currentTheme.shader.wave1);
    material.uniforms.uCurrentWave2.value.set(...currentTheme.shader.wave2);
    material.uniforms.uCurrentCrest.value.set(...currentTheme.shader.crest);

    material.uniforms.uNextShadow.value.set(...nextTheme.shader.shadow);
    material.uniforms.uNextWave1.value.set(...nextTheme.shader.wave1);
    material.uniforms.uNextWave2.value.set(...nextTheme.shader.wave2);
    material.uniforms.uNextCrest.value.set(...nextTheme.shader.crest);

    material.uniforms.uTransition.value = THREE.MathUtils.clamp(transitionProgress, 0, 1);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} frustumCulled={false}>
      {/* Full-screen plane covering clip space */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
