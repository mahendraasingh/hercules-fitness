import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const RealisticEarth = () => {
  const earthRef = useRef();
  const cloudsRef = useRef();

  // Load high-resolution realistic earth textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.05;
    }
    if (cloudsRef.current) {
      // Clouds rotate slightly faster for a dynamic effect
      cloudsRef.current.rotation.y = t * 0.06;
    }
  });

  return (
    <group>
      {/* Realistic Earth Body */}
      <Sphere ref={earthRef} args={[2.5, 64, 64]}>
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={specularMap}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>

      {/* Cloud Layer */}
      <Sphere ref={cloudsRef} args={[2.53, 64, 64]}>
        <meshStandardMaterial 
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Subtle Atmosphere Glow */}
      <Sphere args={[2.65, 64, 64]}>
        <meshLambertMaterial 
          color="#4b92db"
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

export const EarthAnimation = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        {/* Realistic Lighting for Earth */}
        <ambientLight intensity={0.1} />
        {/* Main Sun Light */}
        <directionalLight position={[10, 5, 5]} intensity={2.5} color="#ffffff" castShadow />
        {/* Soft backlight for aesthetic space rim lighting */}
        <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#4ade80" />
        
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Suspense fallback={null}>
          <RealisticEarth />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
