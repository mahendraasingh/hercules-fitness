import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleStorm({ count = 8000 }) {
  const pointsRef = useRef();
  const { mouse, viewport, camera } = useThree();

  // Generate initial particle layouts
  const [positions, originalPositions, colors, scales] = useMemo(() => {
    const coords = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    // Deep red/gold palette for iron sparks
    const coreColor = new THREE.Color('#ff2200');
    const sparkColor = new THREE.Color('#ffaa00');

    for (let i = 0; i < count; i++) {
      // Cylindrical or spherical distribution? Let's do a massive tunnel/cloud along Z-axis
      const radius = 5 + Math.random() * 20; // 5 to 25 spread
      const theta = Math.random() * 2 * Math.PI;
      const z = (Math.random() - 0.5) * 100; // Deep z-bounds: -50 to 50

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta) + (Math.random() - 0.5) * 10; // add some noise

      orig[i * 3 + 0] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      coords[i * 3 + 0] = x;
      coords[i * 3 + 1] = y;
      coords[i * 3 + 2] = z;

      // Mix colors
      const mixedColor = coreColor.clone().lerp(sparkColor, Math.random());
      cols[i * 3 + 0] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;

      scales[i] = Math.random() * 1.5;
    }
    return [coords, orig, cols, scales];
  }, [count]);

  const mouse3D = new THREE.Vector3();

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Map 2D mouse to 3D space strictly at a fixed Z roughly where camera is looking
    // We'll calculate a target Z relative to the camera to ensure interactions happen near the user
    // The camera will move along Z later driven by GSAP, so we track it dynamically.
    const cameraZ = camera.position.z;
    const interactionZ = cameraZ - 10; 
    
    // Unproject to get true 3D coordinate of mouse cursor at interactionZ depth
    mouse3D.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, interactionZ);

    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array;
    const originalPos = originalPositions;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      let pX = positions[ix];
      let pY = positions[iy];
      let pZ = positions[iz];

      const oX = originalPos[ix];
      const oY = originalPos[iy];
      const oZ = originalPos[iz];

      // Distance from mouse to particle
      const dx = mouse3D.x - pX;
      const dy = mouse3D.y - pY;
      const dz = mouse3D.z - pZ;
      const distSq = dx * dx + dy * dy + dz * dz;

      // Simple physics: Aggressive repulsion coupled with vortex swirl if close to pointer
      if (distSq < 150) {
        const force = 150 / (distSq + 1);
        // Swirl angularly
        pX += (dy * 0.05 + dx * 0.02) * force * 0.1;
        pY += (-dx * 0.05 + dy * 0.02) * force * 0.1;
        pZ += (Math.sin(time + i) * 2) * force * 0.05;
      } else {
        // Slowly float back to original position with organic wave noise
        pX += (oX - pX) * 0.02 + Math.sin(time + oY * 0.1) * 0.01;
        pY += (oY - pY) * 0.02 + Math.cos(time + oX * 0.1) * 0.01;
        pZ += (oZ - pZ) * 0.02 + Math.sin(time + oZ * 0.1) * 0.02;
      }

      positions[ix] = pX;
      positions[iy] = pY;
      positions[iz] = pZ;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slowly rotate the entire system
    pointsRef.current.rotation.z = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={count} 
          array={colors} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-size" 
          count={count} 
          array={scales} 
          itemSize={1} 
        />
      </bufferGeometry>
      {/* Additive blending makes particles glow like fire when overlapping */}
      <pointsMaterial 
        vertexColors 
        size={0.15} 
        sizeAttenuation 
        transparent 
        depthWrite={false} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
