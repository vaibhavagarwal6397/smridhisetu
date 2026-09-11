import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

const cities = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
];

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
}

const Marker = ({ city, radius }) => {
  const markerRef = useRef();
  const [hovered, setHovered] = React.useState(false);
  const position = useMemo(() => latLngToVector3(city.lat, city.lng, radius), [city, radius]);

  useFrame((state) => {
    if (markerRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 5 + city.lat) * 0.3;
      markerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={markerRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} />
      </mesh>
      {hovered && (
        <Html distanceFactor={10} center>
          <div className="bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded text-cyan-400 text-xs border border-cyan-500/30 whitespace-nowrap">
            {city.name}
          </div>
        </Html>
      )}
    </group>
  );
};

export default function FloatingGlobe() {
  const globeRef = useRef();
  const radius = 2.5;

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={globeRef} rotation={[0.3, 0, 0]}>
        {/* Wireframe sphere */}
        <mesh>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.5}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Core sphere for better visibility */}
        <mesh scale={0.98}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial color="#0a0a1a" />
        </mesh>

        {cities.map((city, i) => (
          <Marker key={i} city={city} radius={radius + 0.02} />
        ))}
      </group>
    </Float>
  );
}
