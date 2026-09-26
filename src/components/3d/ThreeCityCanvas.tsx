"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}

function Building({ position, size, color = "#1E293B" }: BuildingProps) {
  return (
    <mesh position={[position[0], size[1] / 2, position[2]]}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.2}
      />
    </mesh>
  );
}

function PilotNode({ position, label }: { position: [number, number, number]; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#60A5FA" : "#2563EB"}
          emissive="#2563EB"
          emissiveIntensity={hovered ? 2.0 : 1.2}
          roughness={0.1}
        />
      </mesh>
      {/* Light ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <ringGeometry args={[0.4, 0.6, 32]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={hovered ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function CityModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0008;
    }
  });

  // Procedural city building grid
  const buildings: BuildingProps[] = [
    // City Hall / Government Center
    { position: [0, 0, 0], size: [2.5, 3.5, 2.5], color: "#0F172A" },
    // Commercial & Infrastructure Blocks
    { position: [-3, 0, -2], size: [1.8, 4.2, 1.8], color: "#1E293B" },
    { position: [3, 0, -2], size: [1.6, 3.0, 1.6], color: "#1E293B" },
    { position: [-2.5, 0, 2.5], size: [1.5, 2.4, 1.5], color: "#1E293B" },
    { position: [2.8, 0, 2.2], size: [2.0, 2.8, 2.0], color: "#1E293B" },
    { position: [-4.5, 0, 0.5], size: [1.4, 2.0, 1.4], color: "#334155" },
    { position: [4.5, 0, 0], size: [1.2, 2.2, 1.4], color: "#334155" },
    { position: [0, 0, 3.8], size: [2.2, 1.8, 1.6], color: "#334155" },
    { position: [0, 0, -3.8], size: [2.0, 2.5, 1.5], color: "#334155" },
  ];

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0B132B" roughness={0.8} />
      </mesh>

      {/* Buildings */}
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}

      {/* Active Innovation Pilot Nodes */}
      <PilotNode position={[2.8, 3.2, 2.2]} label="Air Quality Node #14" />
      <PilotNode position={[-2.5, 2.8, 2.5]} label="Air Quality Node #18" />
      <PilotNode position={[0, 4.0, 0]} label="Central Municipal Node" />
    </group>
  );
}

export function ThreeCityCanvas() {
  return (
    <Canvas
      camera={{ position: [9, 8, 11], fov: 42 }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-10, 5, -10]} intensity={0.4} color="#38BDF8" />

      <CityModel />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
