'use client';

import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Sparkles, PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Move3D } from 'lucide-react';

function BottleModel() {
  const { scene } = useGLTF('/models/dynie_bottle.glb');
  const orbitRef = useRef<THREE.Mesh>(null);

  // Nâng cấp vật liệu sang Thủy tinh pha lê cao cấp và Kim loại Champagne bóng loáng
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const name = mesh.name;

        // Thân chai & Các tấm panel: Thủy tinh sang trọng (MeshPhysicalMaterial)
        if (name.includes('Body') || name.includes('Panel') || name.includes('Bottle')) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#FFF2F5'),
            roughness: 0.05,
            transmission: 0.95,
            ior: 1.5,
            reflectivity: 0.9,
            thickness: 1.2,
            transparent: true,
            opacity: 0.98,
            clearcoat: 1.0,
            clearcoatRoughness: 0.06,
            attenuationColor: new THREE.Color('#FDA4AF'),
            attenuationDistance: 2.8,
            envMapIntensity: 1.8,
          });
        } 
        // Nắp, cổ chai & chi tiết vàng: Kim loại champagne gold bóng loáng
        else if (name.includes('Cap') || name.includes('Neck') || name.includes('LabelBorder')) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#F3CE72'),
            metalness: 0.95,
            roughness: 0.15,
            envMapIntensity: 2.2,
          });
        }
        // Nơ thắt cổ chai: Satin đen mịn màng
        else if (name.includes('Bow')) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#0E0B12'),
            roughness: 0.35,
            metalness: 0.15,
            envMapIntensity: 1.2,
          });
        }
      }
    });
  }, [scene]);

  return (
    <group position={[0, -0.05, 0]}>
      {/* Model centered at midpoint (height ~ 2.18 -> offset Y by -1.09) */}
      <primitive
        object={scene}
        position={[0, -1.09, 0]}
        scale={1.38}
      />

      {/* Vòng tròn kim loại vàng nghiêng bao quanh chai */}
      <mesh
        ref={orbitRef}
        rotation={[Math.PI * 0.18, 0.15, Math.PI * 0.14]}
        position={[0, -0.05, 0]}
      >
        <torusGeometry args={[1.35, 0.018, 16, 64]} />
        <meshStandardMaterial
          color="#FFDE82"
          metalness={0.96}
          roughness={0.12}
          emissive="#E5B942"
          emissiveIntensity={0.18}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Các hạt sao lấp lánh xung quanh chai */}
      <Sparkles
        count={35}
        scale={3.6}
        size={2.4}
        speed={0.35}
        color="#FFF1BA"
        opacity={0.8}
      />
    </group>
  );
}

useGLTF.preload('/models/dynie_bottle.glb');

export default function HeroBottle3D() {
  return (
    <div className="relative w-full h-[400px] sm:h-[480px] md:h-[520px] flex flex-col items-center justify-center select-none">
      {/* Vầng sáng ambient phía sau chai */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-400/15 via-rose-400/10 to-transparent blur-3xl pointer-events-none" />

      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="cursor-grab active:cursor-grabbing w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.6]} fov={42} />

        {/* Nguồn sáng môi trường tạo phản chiếu sắc nét cho thủy tinh và kim loại */}
        <Environment preset="city" />

        {/* Hệ thống đèn Studio cao cấp */}
        <ambientLight intensity={0.7} />
        
        {/* Key Light: Ánh sáng chính trắng ấm */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.2}
          color="#FFF8EC"
        />

        {/* Fill Light: Ánh sáng phụ dịu nhẹ */}
        <directionalLight
          position={[-4, 2, 3]}
          intensity={1.2}
          color="#FCE7F3"
        />

        {/* Rim Light: Đèn rọi viền từ phía sau */}
        <spotLight
          position={[0, 6, -3.5]}
          intensity={2.8}
          color="#FFFFFF"
          angle={0.6}
          penumbra={0.8}
        />

        <Suspense fallback={null}>
          <BottleModel />
        </Suspense>

        {/* OrbitControls: Cho phép tự do xoay 360 độ, có quán tính damping, khóa zoom, tự quay khi rảnh */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
          autoRotate={true}
          autoRotateSpeed={1.5}
        />
      </Canvas>

      {/* Gợi ý tương tác vuốt/kéo 360 độ thanh lịch */}
      <div className="absolute bottom-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] text-stone-300 backdrop-blur-md pointer-events-none animate-in fade-in">
        <Move3D className="w-3.5 h-3.5 text-amber-300" />
        <span>Kéo chuột hoặc vuốt để xoay 360&deg;</span>
      </div>
    </div>
  );
}
