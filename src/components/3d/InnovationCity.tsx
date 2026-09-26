"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { InnovationNodes, NodeData } from "./InnovationNodes";
import { InnovationNetwork, NetworkConnection } from "./InnovationNetwork";
import { SceneWrapper } from "./SceneWrapper";
import { FallbackCitySchematic } from "./FallbackCitySchematic";

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  name?: string;
}

function BuildingMesh({ position, size, color = "#1E293B" }: BuildingProps) {
  return (
    <mesh position={[position[0], size[1] / 2, position[2]]}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.25}
      />
    </mesh>
  );
}

function CityEnvironment({ isPaused = false }: { isPaused?: boolean }) {
  const cityGroup = useRef<THREE.Group>(null);

  // Subtle global rotation
  useFrame(() => {
    if (!isPaused && cityGroup.current) {
      cityGroup.current.rotation.y += 0.0006;
    }
  });

  // Architectural Municipal Buildings
  const buildings: BuildingProps[] = [
    // Government Secretariat (Monumental Tiered Center)
    { position: [0, 0, 0], size: [2.8, 3.6, 2.8], color: "#0F172A", name: "Government Secretariat" },
    { position: [0, 3.6, 0], size: [1.8, 1.2, 1.8], color: "#163A5F", name: "Secretariat Spire" },

    // Civic Infrastructure: Urban Development & Health
    { position: [-3.5, 0, -2.5], size: [2.0, 3.8, 1.8], color: "#1E293B", name: "Urban Development Dept" },
    { position: [3.5, 0, -2.5], size: [1.8, 3.2, 2.2], color: "#1E293B", name: "Public Health Facility" },

    // Innovation Labs & Startups
    { position: [-3.0, 0, 3.0], size: [1.8, 2.8, 1.8], color: "#1E293B", name: "Innovation Incubation Lab" },
    { position: [3.2, 0, 3.2], size: [2.2, 2.4, 2.0], color: "#1E293B", name: "AirSense Operations Base" },

    // Surrounding Municipal Infrastructure
    { position: [-5.0, 0, 0.5], size: [1.5, 1.8, 1.5], color: "#334155", name: "Ward 14 Transit Node" },
    { position: [5.0, 0, 0.5], size: [1.5, 2.0, 1.5], color: "#334155", name: "Ward 18 Monitoring Node" },
    { position: [0, 0, -5.0], size: [2.4, 1.6, 1.8], color: "#334155", name: "Central CPCB Station" },
    { position: [0, 0, 5.0], size: [2.2, 2.2, 1.6], color: "#334155", name: "Municipal GIS Data Center" },
  ];

  // Strategic Innovation Lifecycle Nodes
  const cityNodes: NodeData[] = [
    {
      id: "node-gov",
      type: "GOVERNMENT",
      label: "Government Secretariat",
      sublabel: "Problem Definition",
      position: [0, 4.9, 0],
      metric: "UP-DUD",
    },
    {
      id: "node-startup",
      type: "STARTUP",
      label: "Startup Base",
      sublabel: "AirSense Technologies",
      position: [3.2, 2.6, 3.2],
      metric: "DPIIT Certified",
    },
    {
      id: "node-pilot",
      type: "PILOT",
      label: "Lucknow Pilot Site",
      sublabel: "40 Nodes Mesh",
      position: [-3.0, 3.0, 3.0],
      metric: "94.0% Uptime",
    },
    {
      id: "node-validation",
      type: "VALIDATION",
      label: "Validation Station",
      sublabel: "CPCB Collocation Audit",
      position: [-3.5, 4.0, -2.5],
      metric: "95% Accuracy",
    },
    {
      id: "node-scale",
      type: "SCALE",
      label: "Scale-Up Tender",
      sublabel: "80 Municipal Wards",
      position: [3.5, 3.4, -2.5],
      metric: "₹1.85 Cr Approved",
    },
  ];

  // Lifecycle Data Network Arcs: Gov -> Startup -> Pilot -> Validation -> Scale
  const cityConnections: NetworkConnection[] = [
    { id: "c1", start: [0, 4.9, 0], end: [3.2, 2.6, 3.2], color: "#2563EB", pulseSpeed: 0.5 },
    { id: "c2", start: [3.2, 2.6, 3.2], end: [-3.0, 3.0, 3.0], color: "#38BDF8", pulseSpeed: 0.6 },
    { id: "c3", start: [-3.0, 3.0, 3.0], end: [-3.5, 4.0, -2.5], color: "#10B981", pulseSpeed: 0.5 },
    { id: "c4", start: [-3.5, 4.0, -2.5], end: [3.5, 3.4, -2.5], color: "#C084FC", pulseSpeed: 0.55 },
    { id: "c5", start: [3.5, 3.4, -2.5], end: [0, 4.9, 0], color: "#38BDF8", pulseSpeed: 0.4 },
  ];

  return (
    <group ref={cityGroup}>
      {/* Dark Architectural Ground Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#0A0F1D" roughness={0.9} />
      </mesh>

      {/* Road Grid Decals */}
      <gridHelper args={[24, 24, "#1E293B", "#111827"]} position={[0, 0.01, 0]} />

      {/* Buildings */}
      {buildings.map((b, i) => (
        <BuildingMesh key={i} {...b} />
      ))}

      {/* Lifecycle Flow Network */}
      <InnovationNetwork connections={cityConnections} isPaused={isPaused} />

      {/* Interactive Spatial Nodes */}
      <InnovationNodes nodes={cityNodes} isPaused={isPaused} />
    </group>
  );
}

export interface InnovationCityProps {
  height?: string;
  className?: string;
}

export function InnovationCity({ height = "h-[460px]", className }: InnovationCityProps) {
  return (
    <SceneWrapper
      title="Urban Innovation Ecosystem Grid"
      subtitle="Government → Challenge → Startup → Pilot → Evidence → Scale"
      badgeText="ARCHITECTURAL ECOSYSTEM 3D"
      height={height}
      fallback={<FallbackCitySchematic />}
      className={className}
    >
      {({ isPaused, resetKey }) => (
        <Canvas
          key={resetKey}
          camera={{ position: [11, 10, 13], fov: 42 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.65} />
          <directionalLight position={[15, 20, 12]} intensity={1.3} color="#FFFFFF" />
          <pointLight position={[-12, 8, -12]} intensity={0.5} color="#38BDF8" />

          <CityEnvironment isPaused={isPaused} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2.25}
            minPolarAngle={Math.PI / 6}
            dampingFactor={0.05}
          />
        </Canvas>
      )}
    </SceneWrapper>
  );
}
