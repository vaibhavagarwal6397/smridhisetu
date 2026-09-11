import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const nodes = [
  'Voice Intake',
  'Rules Match',
  'Financial Calc',
  'Routing',
  'Doc Fetch',
  'Sanction'
];

const curve = new THREE.CatmullRomCurve3(
  nodes.map((_, i) => new THREE.Vector3((i - 2.5) * 2, Math.sin(i) * 0.5, Math.cos(i) * 0.5))
);

export default function PipelineViz({ activeStep = 0 }) {
  const lineRef = useRef();
  const particleRef = useRef();

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * 0.5) % 1;
    if (particleRef.current) {
      const pos = curve.getPoint(t);
      particleRef.current.position.copy(pos);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Path */}
      <mesh ref={lineRef}>
        <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.1} wireframe />
      </mesh>

      {/* Moving Particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={3} />
      </mesh>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const pos = curve.getPoint(i / (nodes.length - 1));
        const status = i < activeStep ? 'completed' : i === activeStep ? 'active' : 'pending';
        const color = status === 'completed' ? '#10b981' : status === 'active' ? '#06b6d4' : '#4b5563';
        
        return (
          <Node key={i} position={pos} color={color} status={status} />
        );
      })}
    </group>
  );
}

function Node({ position, color, status }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.01;
      
      if (status === 'active') {
        const scale = 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.2;
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={status === 'active' ? 2 : status === 'completed' ? 1 : 0.2} 
          wireframe={status === 'pending'}
        />
      </mesh>
      {status === 'active' && (
        <Sparkles count={20} scale={1} size={1} color={color} />
      )}
    </group>
  );
}
