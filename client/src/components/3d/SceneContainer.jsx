import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';

export default function SceneContainer({ children }) {
  return (
    <div className="absolute inset-0 z-0 bg-[#0a0a1a]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#06b6d4" intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={1} />
        
        {children}

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
        
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.6} 
            mipmapBlur 
            intensity={0.5} 
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
