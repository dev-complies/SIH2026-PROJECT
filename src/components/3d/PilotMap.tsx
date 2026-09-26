"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { SceneWrapper } from "./SceneWrapper";
import { cn } from "@/utils";
import { MapPin, ShieldCheck, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PilotLocationPin {
  id: string;
  code: string;
  name: string;
  location: string;
  startup: string;
  progress: number;
  kpiSummary: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  status: "ACTIVE" | "VALIDATED" | "SCALE_PENDING";
  coordinates: [number, number, number];
}

const DEMO_PILOTS_PINS: PilotLocationPin[] = [
  {
    id: "p1",
    code: "PILOT-UP-UAQ-01",
    name: "Urban Air Quality Hyperlocal Pilot",
    location: "Lucknow, Uttar Pradesh",
    startup: "AirSense Technologies",
    progress: 75,
    kpiSummary: "Accuracy: 95.0% (CPCB Collocated)",
    risk: "LOW",
    status: "ACTIVE",
    coordinates: [0, 0.4, 0],
  },
  {
    id: "p2",
    code: "PILOT-UP-TRAFFIC-02",
    name: "Adaptive Corridor Signal Control",
    location: "Kanpur Nagar",
    startup: "OptiFlow AI",
    progress: 90,
    kpiSummary: "Congestion Delay: -28%",
    risk: "LOW",
    status: "VALIDATED",
    coordinates: [-3.2, 0.4, 2.0],
  },
  {
    id: "p3",
    code: "PILOT-UP-WASTE-03",
    name: "Automated Segregation Optical Sorter",
    location: "Noida Sector 62",
    startup: "EcoSort Robotics",
    progress: 40,
    kpiSummary: "Purity: 88%",
    risk: "MEDIUM",
    status: "ACTIVE",
    coordinates: [3.5, 0.4, -2.2],
  },
];

function LocationPinMesh({
  pin,
  isSelected,
  onSelect,
}: {
  pin: PilotLocationPin;
  isSelected: boolean;
  onSelect: (p: PilotLocationPin) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const statusColors = {
    ACTIVE: "#2563EB",
    VALIDATED: "#15803D",
    SCALE_PENDING: "#7C3AED",
  };

  return (
    <group position={pin.coordinates}>
      {/* Pin Pole */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
        <meshStandardMaterial color="#94A3B8" />
      </mesh>

      {/* Pin Head */}
      <mesh
        position={[0, 1.1, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(pin);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        scale={hovered || isSelected ? [1.3, 1.3, 1.3] : [1, 1, 1]}
      >
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial
          color={statusColors[pin.status]}
          emissive={statusColors[pin.status]}
          emissiveIntensity={hovered || isSelected ? 1.8 : 0.8}
        />
      </mesh>

      {/* Ground ripple */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.4, 0.6, 32]} />
        <meshBasicMaterial
          color={statusColors[pin.status]}
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D Label */}
      <Html position={[0, 1.6, 0]} center distanceFactor={14} className="pointer-events-none">
        <div
          className={cn(
            "rounded-control px-2.5 py-1 text-center font-bold text-xs shadow-lg border whitespace-nowrap backdrop-blur-xs transition-all",
            hovered || isSelected
              ? "bg-slate-900/95 border-blue-500 text-white scale-110"
              : "bg-slate-950/80 border-slate-700 text-slate-300"
          )}
        >
          <span>{pin.name}</span>
          <span className="block text-[9px] font-mono text-gov-muted font-normal">
            {pin.location}
          </span>
        </div>
      </Html>
    </group>
  );
}

function RegionalTerrain({
  selectedPin,
  onSelectPin,
}: {
  selectedPin: PilotLocationPin | null;
  onSelectPin: (p: PilotLocationPin) => void;
}) {
  return (
    <group>
      {/* Topographic State Boundary Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#0A1128" roughness={0.8} />
      </mesh>

      <gridHelper args={[20, 20, "#1E293B", "#111827"]} position={[0, 0.01, 0]} />

      {DEMO_PILOTS_PINS.map((pin) => (
        <LocationPinMesh
          key={pin.id}
          pin={pin}
          isSelected={selectedPin?.id === pin.id}
          onSelect={onSelectPin}
        />
      ))}
    </group>
  );
}

function FallbackPilotMap({ onSelectPin }: { onSelectPin: (p: PilotLocationPin) => void }) {
  return (
    <div className="w-full h-[450px] rounded-card bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between text-left text-white shadow-inner">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
            REGIONAL PILOT DEPLOYMENTS
          </span>
          <h4 className="text-base font-bold text-white mt-2">
            Active Innovation Pilots Map
          </h4>
          <p className="text-xs text-slate-400">
            Geographic distribution of contracted GovTech pilot sites
          </p>
        </div>
        <Badge variant="outline" className="border-slate-700 text-slate-300">
          3 PILOT SITES ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto">
        {DEMO_PILOTS_PINS.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectPin(p)}
            className="p-3.5 rounded-control border border-slate-700 bg-slate-800/80 hover:border-blue-500 cursor-pointer transition-colors"
          >
            <span className="text-[10px] font-mono text-gov-muted block">{p.code}</span>
            <p className="text-xs font-bold text-white mt-1">{p.name}</p>
            <p className="text-[11px] text-blue-300 mt-0.5">{p.location}</p>
            <div className="flex justify-between items-baseline mt-3 border-t border-slate-700 pt-2 text-xs">
              <span className="text-[11px] text-slate-300">{p.startup}</span>
              <span className="font-bold text-emerald-400">{p.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 pt-3 text-xs text-slate-400 flex justify-between items-center">
        <span>Click any pilot card or 3D pin to inspect operational telemetry.</span>
      </div>
    </div>
  );
}

export interface PilotMapProps {
  height?: string;
  className?: string;
  onSelectPilot?: (pilot: PilotLocationPin) => void;
}

export function PilotMap({ height = "h-[450px]", className, onSelectPilot }: PilotMapProps) {
  const [selectedPin, setSelectedPin] = useState<PilotLocationPin | null>(DEMO_PILOTS_PINS[0]);

  const handleSelect = (pin: PilotLocationPin) => {
    setSelectedPin(pin);
    if (onSelectPilot) onSelectPilot(pin);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <SceneWrapper
        title="Innovation Pilots Geographic Map"
        subtitle="Click pins to inspect pilot telemetry, startup partner, and risk indicators"
        badgeText="GEOSPATIAL PILOT MAP 3D"
        height={height}
        fallback={<FallbackPilotMap onSelectPin={handleSelect} />}
      >
        {({ resetKey }) => (
          <Canvas
            key={resetKey}
            camera={{ position: [8, 9, 10], fov: 45 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.65} />
            <directionalLight position={[12, 18, 12]} intensity={1.2} color="#FFFFFF" />
            <pointLight position={[-8, 6, -8]} intensity={0.4} color="#38BDF8" />

            <RegionalTerrain selectedPin={selectedPin} onSelectPin={handleSelect} />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              maxPolarAngle={Math.PI / 2.3}
              minPolarAngle={Math.PI / 6}
              dampingFactor={0.05}
            />
          </Canvas>
        )}
      </SceneWrapper>

      {/* Selected Pilot Interactive Drawer / Card */}
      {selectedPin && (
        <div className="bg-white border border-gov-border rounded-card p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-gov-accent">
                {selectedPin.code}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {selectedPin.status}
              </Badge>
            </div>
            <h4 className="text-sm font-bold text-gov-primary mt-0.5">{selectedPin.name}</h4>
            <p className="text-xs text-gov-muted">
              {selectedPin.location} • Startup: <strong className="text-slate-800">{selectedPin.startup}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-6 shrink-0 text-xs">
            <div>
              <span className="text-[10px] text-gov-muted block">KEY RESULT</span>
              <span className="font-semibold text-emerald-700">{selectedPin.kpiSummary}</span>
            </div>
            <div>
              <span className="text-[10px] text-gov-muted block">RISK</span>
              <Badge variant={selectedPin.risk === "LOW" ? "success" : "warning"} className="text-[10px]">
                {selectedPin.risk}
              </Badge>
            </div>
            <Link href="/gov/dashboard">
              <Button size="sm" variant="default" className="h-8 text-xs bg-gov-primary">
                Open Pilot Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
