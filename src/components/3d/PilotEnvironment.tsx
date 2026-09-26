"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { SceneWrapper } from "./SceneWrapper";
import { cn } from "@/utils";
import { MapPin, Activity, CheckCircle2, ShieldAlert } from "lucide-react";

interface SensorStation {
  id: string;
  name: string;
  ward: string;
  position: [number, number, number];
  pm25: number;
  status: "NORMAL" | "ALERT";
  uptime: number;
}

const PILOT_SENSORS: SensorStation[] = [
  { id: "s1", name: "Hazratganj Main Node", ward: "Ward 14", position: [-2.5, 0.4, -1.8], pm25: 48, status: "NORMAL", uptime: 96 },
  { id: "s2", name: "Gomti Nagar Clean Grid", ward: "Ward 18", position: [2.2, 0.4, -2.0], pm25: 38, status: "NORMAL", uptime: 98 },
  { id: "s3", name: "Alambagh Traffic Junction", ward: "Ward 22", position: [-1.8, 0.4, 2.2], pm25: 112, status: "ALERT", uptime: 92 },
  { id: "s4", name: "Charbagh Transit Gateway", ward: "Ward 29", position: [2.6, 0.4, 1.8], pm25: 54, status: "NORMAL", uptime: 94 },
];

function SensorMast({
  station,
  isSelected,
  onSelect,
}: {
  station: SensorStation;
  isSelected: boolean;
  onSelect: (s: SensorStation) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isAlert = station.status === "ALERT";

  return (
    <group position={station.position}>
      {/* Sensor Mast Pole */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.2, 12]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.8} />
      </mesh>

      {/* Solar Panel & Sensor Enclosure */}
      <mesh
        position={[0, 1.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(station);
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
        scale={hovered || isSelected ? [1.25, 1.25, 1.25] : [1, 1, 1]}
      >
        <boxGeometry args={[0.35, 0.25, 0.35]} />
        <meshStandardMaterial
          color={isAlert ? "#B91C1C" : "#0E7490"}
          emissive={isAlert ? "#EF4444" : "#22D3EE"}
          emissiveIntensity={hovered || isSelected ? 1.6 : 0.8}
        />
      </mesh>

      {/* Micro-hotspot aura if alert */}
      {isAlert && (
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.04, 32]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.25} />
        </mesh>
      )}

      {/* Ground Pin Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.3, 0.45, 24]} />
        <meshBasicMaterial
          color={isAlert ? "#EF4444" : "#38BDF8"}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sensor HTML HUD Pill */}
      <Html position={[0, 1.6, 0]} center distanceFactor={12} className="pointer-events-none">
        <div
          className={cn(
            "rounded-control px-2 py-0.5 text-center text-xs font-mono font-bold shadow-md border whitespace-nowrap backdrop-blur-xs",
            isAlert
              ? "bg-red-950/90 border-red-500 text-red-200"
              : "bg-slate-900/90 border-slate-700 text-slate-200"
          )}
        >
          <span>{station.name}</span>
          <span className={cn("block text-[10px]", isAlert ? "text-red-400" : "text-emerald-400")}>
            PM2.5: {station.pm25} µg/m³
          </span>
        </div>
      </Html>
    </group>
  );
}

function PilotTerrainEnvironment({
  selectedStation,
  onSelectStation,
}: {
  selectedStation: SensorStation | null;
  onSelectStation: (s: SensorStation) => void;
}) {
  return (
    <group>
      {/* Municipal Base District Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#0B132B" roughness={0.85} />
      </mesh>

      {/* Ward Boundary Demarcation Grid */}
      <gridHelper args={[16, 8, "#1E293B", "#111827"]} position={[0, 0.01, 0]} />

      {/* Central Reference CPCB BAM-1020 Analyzer Station */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.0, 1.0, 1.0]} />
          <meshStandardMaterial color="#163A5F" roughness={0.3} metalness={0.4} />
        </mesh>
        <Html position={[0, 1.2, 0]} center distanceFactor={12} className="pointer-events-none">
          <div className="bg-blue-950/90 border border-blue-500/80 rounded-control px-2 py-0.5 text-[9px] font-mono font-bold text-blue-200 shadow-md">
            CPCB REGULATORY STATION
          </div>
        </Html>
      </group>

      {/* 4 Ward Deployment Sensor Masts */}
      {PILOT_SENSORS.map((station) => (
        <SensorMast
          key={station.id}
          station={station}
          isSelected={selectedStation?.id === station.id}
          onSelect={onSelectStation}
        />
      ))}
    </group>
  );
}

function FallbackPilotEnvironment() {
  return (
    <div className="w-full h-[440px] rounded-card bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between text-left text-white shadow-inner">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
            LUCKNOW PILOT SITE SCHEMATIC
          </span>
          <h4 className="text-base font-bold text-white mt-2">
            40 IoT Sensor Nodes Across 4 Municipal Wards
          </h4>
          <p className="text-xs text-slate-400">
            Wards 14, 18, 22, 29 • Collocated Calibration against Central CPCB Monitor
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-1 rounded">
          94.0% FLEET UPTIME
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-auto">
        {PILOT_SENSORS.map((s) => (
          <div
            key={s.id}
            className={cn(
              "p-3 rounded-control border",
              s.status === "ALERT"
                ? "bg-red-950/40 border-red-700 text-red-200"
                : "bg-slate-800/80 border-slate-700 text-slate-200"
            )}
          >
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>{s.ward}</span>
              <span className={s.status === "ALERT" ? "text-red-400 font-bold" : "text-emerald-400"}>
                {s.status}
              </span>
            </div>
            <p className="text-xs font-bold text-white mt-1">{s.name}</p>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-lg font-bold">PM2.5: {s.pm25}</span>
              <span className="text-[10px] text-slate-400">{s.uptime}% Uptime</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 pt-3 text-xs text-slate-400 flex justify-between items-center">
        <span>Reference Station: CPCB BAM-1020 Analyzer</span>
        <span className="text-emerald-400 font-semibold font-mono">Correlation: 95%</span>
      </div>
    </div>
  );
}

export interface PilotEnvironmentProps {
  height?: string;
  className?: string;
}

export function PilotEnvironment({ height = "h-[440px]", className }: PilotEnvironmentProps) {
  const [selectedStation, setSelectedStation] = useState<SensorStation | null>(null);

  return (
    <SceneWrapper
      title="Pilot Site Infrastructure & Sensor Mesh"
      subtitle="Click sensor nodes to inspect localized particulate readings and uptime"
      badgeText="PILOT SPATIAL TELEMETRY"
      height={height}
      fallback={<FallbackPilotEnvironment />}
      className={className}
    >
      {({ resetKey }) => (
        <Canvas
          key={resetKey}
          camera={{ position: [7, 7, 9], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 10]} intensity={1.2} color="#FFFFFF" />
          <pointLight position={[-8, 6, -8]} intensity={0.4} color="#38BDF8" />

          <PilotTerrainEnvironment
            selectedStation={selectedStation}
            onSelectStation={setSelectedStation}
          />

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
  );
}
