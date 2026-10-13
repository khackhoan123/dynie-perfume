'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface DynieBottleProps {
  scrollProgress?: number;
}

export default function DynieBottle({ scrollProgress = 0 }: DynieBottleProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const bottleGroupRef = useRef<THREE.Group>(null);
  const orbitRingRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const isMobile = viewport.width < 5.5;

  useFrame((state, delta) => {
    if (!rootGroupRef.current || !bottleGroupRef.current) return;

    // 1. Hero vs Scrolled State:
    // Khi scroll = 0 (ở Hero): chai nằm ở vị trí trang nhã (tâm hoặc hơi lệch phải nhẹ)
    // Khi scroll > 0: chai thu nhỏ lại (scale ~0.42), lùi sâu về hậu cảnh và dạt sang góc phải
    const heroFactor = Math.min(scrollProgress * 4.0, 1.0); // 0 (tại Hero) -> 1 (đã cuộn qua Hero)

    const baseScale = isMobile ? 0.52 : 0.68;
    const scrolledScale = isMobile ? 0.35 : 0.44;
    const targetScale = THREE.MathUtils.lerp(baseScale, scrolledScale, heroFactor);

    const targetPosX = isMobile 
      ? THREE.MathUtils.lerp(0, 1.2, heroFactor) 
      : THREE.MathUtils.lerp(0.8, 2.2, heroFactor);
    const targetPosY = THREE.MathUtils.lerp(0, -0.2, heroFactor) + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    const targetPosZ = THREE.MathUtils.lerp(0, -1.2, heroFactor);

    rootGroupRef.current.position.x = THREE.MathUtils.lerp(rootGroupRef.current.position.x, targetPosX, delta * 3.0);
    rootGroupRef.current.position.y = THREE.MathUtils.lerp(rootGroupRef.current.position.y, targetPosY, delta * 3.0);
    rootGroupRef.current.position.z = THREE.MathUtils.lerp(rootGroupRef.current.position.z, targetPosZ, delta * 3.0);

    const currentScale = rootGroupRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 3.0);
    rootGroupRef.current.scale.set(nextScale, nextScale, nextScale);

    // 2. Scroll-driven Y-axis rotation with continuous slow luxury spin
    const targetRotY = scrollProgress * Math.PI * 3.0 + state.clock.elapsedTime * 0.12;
    bottleGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      bottleGroupRef.current.rotation.y,
      targetRotY,
      delta * 3.0
    );

    // 3. Mouse Parallax Tilt
    const targetTiltX = -state.pointer.y * 0.18;
    const targetTiltZ = -state.pointer.x * 0.18;

    rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.x,
      targetTiltX,
      delta * 4.0
    );
    rootGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.z,
      targetTiltZ,
      delta * 4.0
    );

    // 4. Orbit ring counter-rotation
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z -= delta * 0.35;
    }

    // 5. Liquid subtle shimmer
    if (liquidRef.current) {
      liquidRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.04;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0.8, 0, 0]} scale={0.68}>
      <group ref={bottleGroupRef}>
        {/* ============================================================== */}
        {/* 1. THÂN CHAI: Thủy tinh hồng phấn pastel nhạt trong veo        */}
        {/* ============================================================== */}
        <RoundedBox
          args={[1.6, 2.15, 0.95]}
          radius={0.22}
          smoothness={8}
          position={[0, 0, 0]}
        >
          <meshPhysicalMaterial
            color="#FFE5EC"
            transmission={0.96}
            roughness={0.05}
            metalness={0.02}
            ior={1.5}
            thickness={1.2}
            transparent={true}
            opacity={0.98}
            attenuationColor="#FDA4AF"
            attenuationDistance={3.5}
            reflectivity={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
          />
        </RoundedBox>

        {/* ============================================================== */}
        {/* 2. DUNG DỊCH BÊN TRONG: Ánh đào nhẹ thanh khiết                 */}
        {/* ============================================================== */}
        <RoundedBox
          ref={liquidRef}
          args={[1.34, 1.7, 0.72]}
          radius={0.16}
          smoothness={6}
          position={[0, -0.12, 0]}
        >
          <meshPhysicalMaterial
            color="#FFF0F3"
            emissive="#FCA5A5"
            emissiveIntensity={0.16}
            roughness={0.1}
            transmission={0.7}
            transparent={true}
            opacity={0.82}
            attenuationColor="#F43F5E"
            attenuationDistance={1.8}
          />
        </RoundedBox>

        {/* Đáy chai pha lê dày dặn */}
        <mesh position={[0, -0.92, 0]}>
          <boxGeometry args={[1.38, 0.2, 0.78]} />
          <meshPhysicalMaterial
            color="#FFF5F7"
            transmission={0.95}
            roughness={0.06}
            ior={1.52}
            thickness={0.8}
            transparent={true}
          />
        </mesh>

        {/* ============================================================== */}
        {/* 3. CỔ CHAI & NẮP: Vàng Champagne sáng bóng tinh xảo            */}
        {/* ============================================================== */}
        {/* Vòng cổ chai (Collar) */}
        <mesh position={[0, 1.16, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 0.22, 32]} />
          <meshStandardMaterial
            color="#F4D58D"
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>

        {/* Nắp chai khối vát sang trọng */}
        <RoundedBox
          args={[0.62, 0.75, 0.48]}
          radius={0.08}
          smoothness={4}
          position={[0, 1.58, 0]}
        >
          <meshStandardMaterial
            color="#F2CE7B"
            metalness={0.93}
            roughness={0.16}
          />
        </RoundedBox>

        {/* Đỉnh nắp điểm nhấn */}
        <mesh position={[0, 1.98, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 24]} />
          <meshStandardMaterial
            color="#F9E0A2"
            metalness={0.96}
            roughness={0.12}
          />
        </mesh>

        {/* ============================================================== */}
        {/* 4. NƠ ĐEN SATIN THẮT CỔ CHAI (Logo Dynie)                      */}
        {/* ============================================================== */}
        <group position={[0, 1.15, 0.44]}>
          {/* Nút thắt trung tâm */}
          <mesh position={[0, 0, 0.03]}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshStandardMaterial
              color="#0F0F14"
              roughness={0.35}
              metalness={0.12}
            />
          </mesh>

          {/* Vòng nơ trái */}
          <mesh
            position={[-0.24, 0.04, 0]}
            rotation={[0.1, 0.2, 0.35]}
            scale={[1.1, 0.65, 0.4]}
          >
            <torusGeometry args={[0.17, 0.06, 16, 32]} />
            <meshStandardMaterial
              color="#0F0F14"
              roughness={0.32}
              metalness={0.15}
            />
          </mesh>

          {/* Vòng nơ phải */}
          <mesh
            position={[0.24, 0.04, 0]}
            rotation={[0.1, -0.2, -0.35]}
            scale={[1.1, 0.65, 0.4]}
          >
            <torusGeometry args={[0.17, 0.06, 16, 32]} />
            <meshStandardMaterial
              color="#0F0F14"
              roughness={0.32}
              metalness={0.15}
            />
          </mesh>

          {/* Dải ruy băng rủ trái */}
          <mesh
            position={[-0.13, -0.23, 0.02]}
            rotation={[0.08, 0.1, 0.22]}
          >
            <boxGeometry args={[0.1, 0.35, 0.025]} />
            <meshStandardMaterial
              color="#0F0F14"
              roughness={0.36}
              metalness={0.12}
            />
          </mesh>

          {/* Dải ruy băng rủ phải */}
          <mesh
            position={[0.13, -0.23, 0.02]}
            rotation={[0.08, -0.1, -0.22]}
          >
            <boxGeometry args={[0.1, 0.35, 0.025]} />
            <meshStandardMaterial
              color="#0F0F14"
              roughness={0.36}
              metalness={0.12}
            />
          </mesh>
        </group>

        {/* ============================================================== */}
        {/* 5. VÒNG QUỸ ĐẠO VÀNG NGHIÊNG 25 ĐỘ                            */}
        {/* ============================================================== */}
        <mesh
          ref={orbitRingRef}
          rotation={[Math.PI * 0.16, 0.12, Math.PI * 0.14]}
          position={[0, 0.04, 0]}
        >
          <torusGeometry args={[1.54, 0.022, 16, 64]} />
          <meshStandardMaterial
            color="#FFDE82"
            metalness={0.96}
            roughness={0.12}
            emissive="#E5B942"
            emissiveIntensity={0.18}
          />
        </mesh>

        {/* Ánh sao lấp lánh nhẹ nhàng quanh thân chai */}
        <Sparkles
          count={40}
          scale={3.8}
          size={2.4}
          speed={0.35}
          color="#FFF3C4"
          opacity={0.7}
        />
      </group>
    </group>
  );
}
