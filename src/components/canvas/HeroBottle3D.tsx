'use client';

import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function BottleModel({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const { scene } = useGLTF('/models/dynie_bottle.glb');
  const groupRef = useRef<THREE.Group>(null);
  const bottleRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Mesh>(null);

  // Enhance materials for luxury physical glass and metal finish
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 1.5;

          // Bottle body / panels: enhance glass translucent beauty
          if (mesh.name.includes('Body') || mesh.name.includes('Panel')) {
            mat.roughness = 0.08;
            mat.metalness = 0.05;
          }
          // Cap / Neck: enhance champagne gold metalness
          if (mesh.name.includes('Cap') || mesh.name.includes('Neck')) {
            mat.metalness = 0.92;
            mat.roughness = 0.18;
          }
          // Bow knot: satin black
          if (mesh.name.includes('Bow')) {
            mat.roughness = 0.35;
            mat.metalness = 0.15;
          }
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current || !bottleRef.current) return;

    // 1. Scroll-driven Y-axis rotation with slow continuous idle spin
    const baseRotationY = scrollProgress * Math.PI * 2.8;
    const idleRotationY = state.clock.elapsedTime * 0.14;
    const targetRotY = baseRotationY + idleRotationY;

    bottleRef.current.rotation.y = THREE.MathUtils.lerp(
      bottleRef.current.rotation.y,
      targetRotY,
      delta * 3.5
    );

    // 2. Mouse Parallax Tilt (Smooth Lerp)
    const targetTiltX = -state.pointer.y * 0.18;
    const targetTiltZ = -state.pointer.x * 0.18;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetTiltX,
      delta * 4.0
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetTiltZ,
      delta * 4.0
    );

    // 3. Floating Breathing Bobbing
    const floatingY = Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      floatingY,
      delta * 4.0
    );

    // 4. Orbit ring counter-rotation
    if (orbitRef.current) {
      orbitRef.current.rotation.z -= delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Bottle model centered at its midpoint (height ~ 2.18 -> offset y by -1.09) */}
      <group ref={bottleRef} position={[0, -0.05, 0]}>
        <primitive
          object={scene}
          position={[0, -1.09, 0]}
          scale={1.38}
        />

        {/* Golden Tilted Orbit Ring */}
        <mesh
          ref={orbitRef}
          rotation={[Math.PI * 0.18, 0.15, Math.PI * 0.14]}
          position={[0, -0.05, 0]}
        >
          <torusGeometry args={[1.35, 0.018, 16, 64]} />
          <meshStandardMaterial
            color="#FFDE82"
            metalness={0.96}
            roughness={0.14}
            emissive="#E5B942"
            emissiveIntensity={0.16}
          />
        </mesh>
      </group>

      {/* Subtle floating stardust sparkles around the bottle */}
      <Sparkles
        count={35}
        scale={3.6}
        size={2.4}
        speed={0.35}
        color="#FFF1BA"
        opacity={0.75}
      />
    </group>
  );
}

useGLTF.preload('/models/dynie_bottle.glb');

export default function HeroBottle3D() {
  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center select-none">
      {/* Ambient background glow behind 3D bottle */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-400/15 via-rose-400/10 to-transparent blur-3xl pointer-events-none" />

      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.6]} fov={42} />

        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.9} />
        
        {/* Key Light: Warm champagne white */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.2}
          color="#FFF8EC"
        />

        {/* Fill Light: Soft rose glow */}
        <directionalLight
          position={[-4, 2, 3]}
          intensity={1.2}
          color="#FCE7F3"
        />

        {/* Rim Light: Sharp outline from behind */}
        <spotLight
          position={[0, 6, -3.5]}
          intensity={2.5}
          color="#FFFFFF"
          angle={0.6}
          penumbra={0.8}
        />

        <Suspense fallback={null}>
          <BottleModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
