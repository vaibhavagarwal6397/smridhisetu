import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const colors = {
  idle: '#06b6d4',      // Cyan
  listening: '#10b981', // Emerald
  processing: '#f59e0b',// Amber
  speaking: '#a855f7'   // Purple
};

const VoiceOrb = forwardRef(({ state = 'idle', volume = 0 }, ref) => {
  const orbRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  
  const targetColor = new THREE.Color(colors[state] || colors.idle);

  useImperativeHandle(ref, () => ({
    // allow imperative control if needed
  }));

  useFrame((ctx, delta) => {
    const t = ctx.clock.getElapsedTime();
    
    // Orb animation
    if (orbRef.current) {
      orbRef.current.material.color.lerp(targetColor, 0.1);
      orbRef.current.material.emissive.lerp(targetColor, 0.1);
      
      const targetScale = 1 + volume * 0.5 + Math.sin(t * 2) * 0.05;
      orbRef.current.scale.setScalar(THREE.MathUtils.lerp(orbRef.current.scale.x, targetScale, 0.1));
      
      // Distort speed based on state
      orbRef.current.material.speed = state === 'listening' ? 5 + volume * 10 : (state === 'processing' ? 8 : 2);
    }

    // Rings animation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.5;
      ring1Ref.current.rotation.y = t * 0.3;
      ring1Ref.current.material.color.lerp(targetColor, 0.1);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.3;
      ring2Ref.current.rotation.z = t * 0.4;
      ring2Ref.current.material.color.lerp(targetColor, 0.1);
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.4;
      ring3Ref.current.rotation.z = t * 0.2;
      ring3Ref.current.material.color.lerp(targetColor, 0.1);
    }
  });

  return (
    <group>
      <mesh ref={orbRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color={colors.idle}
          emissive={colors.idle}
          emissiveIntensity={1}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshStandardMaterial color={colors.idle} emissive={colors.idle} emissiveIntensity={2} />
      </mesh>

      {/* Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshStandardMaterial color={colors.idle} emissive={colors.idle} emissiveIntensity={1.5} />
      </mesh>

      {/* Ring 3 */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshStandardMaterial color={colors.idle} emissive={colors.idle} emissiveIntensity={1} />
      </mesh>

      {/* Sparkles when active */}
      {state !== 'idle' && (
        <Sparkles
          count={100}
          scale={5}
          size={2}
          speed={0.4}
          opacity={0.5}
          color={colors[state]}
        />
      )}
    </group>
  );
});

export default VoiceOrb;
