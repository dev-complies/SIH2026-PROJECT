"use client";

import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { SceneWrapper } from "@/components/3d/SceneWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import {
  MapPin,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Truck,
  Building2,
  Server,
  Zap,
  Info,
  Maximize2,
  RotateCcw,
} from "lucide-react";

export interface PilotDataNode {
  id: string;
  name: string;
  type: "LOCATION" | "DEVICE" | "INFRASTRUCTURE" | "DATA_NODE";
  ward: string;
  position: [number, number, number];
  status: "OPTIMAL" | "STANDBY" | "ALERT";
  pm25?: number;
  pm10?: number;
  battery?: string;
  uptime?: string;
  protocol?: string;
  description: string;
}

export const LUCKNOW_PILOT_NODES: PilotDataNode[] = [
  {
    id: "node-hazratganj",
    name: "Hazratganj Commercial Junction",
    type: "LOCATION",
    ward: "Ward 14 (High-Traffic Zone)",
    position: [-2.4, 0.4, -1.6],
    status: "OPTIMAL",
    pm25: 42,
    pm10: 88,
    battery: "96% (Solar Assisted)",
    uptime: "98.2%",
    protocol: "LoRaWAN 865-867 MHz",
    description: "4 optical particulate counters mounted on municipal streetlight poles monitoring arterial commercial flow.",
  },
  {
    id: "node-gomti",
    name: "Gomti Nagar Riverfront Testbed",
    type: "LOCATION",
    ward: "Ward 18 (Eco-Residential Zone)",
    position: [2.2, 0.4, -1.8],
    status: "OPTIMAL",
    pm25: 34,
    pm10: 64,
    battery: "98% (Solar Assisted)",
    uptime: "99.1%",
    protocol: "LoRaWAN + 4G NB-IoT",
    description: "High-density 12-node baseline array evaluating background atmospheric particulate dispersion along river corridor.",
  },
  {
    id: "node-alambagh",
    name: "Alambagh Bus Depot & Transit Gate",
    type: "DEVICE",
    ward: "Ward 22 (Intervention Hotspot)",
    position: [-1.8, 0.4, 2.0],
    status: "ALERT",
    pm25: 78,
    pm10: 165,
    battery: "91% (Solar Assisted)",
    uptime: "96.4%",
    protocol: "Dual-carrier LoRaWAN",
    description: "Elevated particulate hotspot triggering automated municipal dust-suppression misting vehicle dispatch.",
  },
  {
    id: "node-charbagh",
    name: "Charbagh Railway Hub Gateway",
    type: "LOCATION",
    ward: "Ward 29 (Multi-Modal Terminal)",
    position: [2.5, 0.4, 1.8],
    status: "OPTIMAL",
    pm25: 51,
    pm10: 102,
    battery: "94% (Solar Assisted)",
    uptime: "97.8%",
    protocol: "4G NB-IoT Primary",
    description: "Multi-parameter node monitoring locomotive diesel exhaust and high-volume pedestrian circulation plaza.",
  },
  {
    id: "node-cpcb",
    name: "CPCB BAM-1020 Collocation Station",
    type: "INFRASTRUCTURE",
    ward: "Central Reference Baseline",
    position: [0.0, 0.5, 0.0],
    status: "OPTIMAL",
    pm25: 41,
    pm10: 85,
    battery: "100% (Substation Grid)",
    uptime: "100%",
    protocol: "Fiber Optic Direct",
    description: "Government reference analyzer station conducting continuous regression calibration audits (R² = 0.95).",
  },
  {
    id: "node-iccc",
    name: "Lucknow Smart City ICCC Central Node",
    type: "DATA_NODE",
    ward: "Command & Control Centre",
    position: [-0.2, 1.1, -2.8],
    status: "OPTIMAL",
    battery: "Dual UPS Redundant",
    uptime: "99.99%",
    protocol: "TLS 1.3 REST / MQTT",
    description: "Receives real-time telemetry from all 40 field nodes and dispatches municipal street-misting vehicles.",
  },
  {
    id: "node-misting-truck",
    name: "Automated Misting Sprinkler #LMC-04",
    type: "DEVICE",
    ward: "En Route to Ward 22",
    position: [-1.0, 0.25, 1.2],
    status: "STANDBY",
    battery: "Vehicle Alternator",
    uptime: "Active Dispatch",
    protocol: "GPS Telematics",
    description: "Municipal 9,000L pressurized water misting vehicle automated via geofenced API trigger.",
  },
];

// 3D Visual Mesh for each Node
function InteractiveCityNode({
  node,
  isSelected,
  onSelect,
}: {
  node: PilotDataNode;
  isSelected: boolean;
  onSelect: (node: PilotDataNode) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isAlert = node.status === "ALERT";
  const isSelectedOrHovered = isSelected || hovered;

  // Color selection based on node type & status
  let baseColor = "#0284C7"; // Blue
  let emissiveColor = "#38BDF8";
  if (isAlert) {
    baseColor = "#DC2626"; // Red alert
    emissiveColor = "#EF4444";
  } else if (node.type === "INFRASTRUCTURE") {
    baseColor = "#059669"; // Emerald
    emissiveColor = "#34D399";
  } else if (node.type === "DATA_NODE") {
    baseColor = "#7C3AED"; // Purple
    emissiveColor = "#A78BFA";
  } else if (node.type === "DEVICE" && node.id.includes("truck")) {
    baseColor = "#D97706"; // Amber
    emissiveColor = "#FBBF24";
  }

  return (
    <group position={node.position}>
      {/* Ground Pin Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.25, 0.38, 20]} />
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={isSelectedOrHovered ? 0.9 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical Support Pole / Beacon */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.8, 10]} />
        <meshStandardMaterial color="#64748B" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main Node Housing Box / Sphere */}
      <mesh
        position={[0, 0.85, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
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
        scale={isSelectedOrHovered ? [1.3, 1.3, 1.3] : [1, 1, 1]}
      >
        {node.type === "DATA_NODE" ? (
          <octahedronGeometry args={[0.24, 0]} />
        ) : node.type === "INFRASTRUCTURE" ? (
          <boxGeometry args={[0.3, 0.35, 0.3]} />
        ) : (
          <sphereGeometry args={[0.2, 16, 16]} />
        )}
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={isSelectedOrHovered ? 1.5 : 0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Small floating HUD Pill */}
      <Html position={[0, 1.35, 0]} center distanceFactor={14} className="pointer-events-none">
        <div
          className={cn(
            "px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold shadow-xs whitespace-nowrap transition-all border backdrop-blur-xs",
            isAlert
              ? "bg-red-950/90 text-red-200 border-red-500 animate-pulse"
              : isSelectedOrHovered
              ? "bg-slate-900 text-cyan-300 border-cyan-400 scale-105"
              : "bg-slate-900/80 text-slate-300 border-slate-700"
          )}
        >
          {node.type === "DEVICE" && node.id.includes("truck") ? "MISTING TRUCK" : node.name.split(" ")[0]}
          {node.pm25 !== undefined ? ` • ${node.pm25}` : ""}
        </div>
      </Html>
    </group>
  );
}

// Low-poly City Blocks Environment
function CityGridGround() {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Ground Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Grid Pattern */}
      <gridHelper args={[16, 16, "#334155", "#1E293B"]} position={[0, 0.01, 0]} />

      {/* Simplified Stylized City Buildings */}
      <mesh position={[-3.5, 0.7, -3.2]}>
        <boxGeometry args={[1.6, 1.4, 1.4]} />
        <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.5} />
      </mesh>

      <mesh position={[3.6, 0.9, -3.0]}>
        <boxGeometry args={[1.5, 1.8, 1.3]} />
        <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.5} />
      </mesh>

      <mesh position={[-3.8, 0.8, 2.5]}>
        <boxGeometry args={[1.4, 1.6, 1.5]} />
        <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.5} />
      </mesh>

      <mesh position={[3.8, 0.6, 2.8]}>
        <boxGeometry args={[1.6, 1.2, 1.4]} />
        <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Central Municipal Hub Structure */}
      <mesh position={[-0.2, 0.7, -2.8]}>
        <cylinderGeometry args={[0.6, 0.7, 1.4, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Accessible 2D Vector & Schematic Fallback for Contextual City Pilot
function FallbackPilotCitySchematic({
  selectedNode,
  onSelectNode,
}: {
  selectedNode: PilotDataNode;
  onSelectNode: (node: PilotDataNode) => void;
}) {
  return (
    <div className="w-full min-h-[260px] bg-slate-950 border border-slate-800 rounded-card p-4 flex flex-col justify-between text-left">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-mono text-xs font-bold text-slate-200 uppercase">
            Lucknow Ward Testbed Schematic (2D Accessible Grid)
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          5 Monitored Telemetry Nodes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 my-auto">
        {LUCKNOW_PILOT_NODES.map((node) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={cn(
                "p-3 rounded-control border text-left transition-all",
                isSelected
                  ? "bg-slate-900 border-cyan-400 shadow-sm shadow-cyan-500/20"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {node.ward}
                </span>
                <span
                  className={cn(
                    "text-xs font-mono px-1.5 py-0.2 rounded font-bold",
                    node.status === "ALERT"
                      ? "bg-rose-950 text-rose-300 border border-rose-800"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  )}
                >
                  {node.status}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate">{node.name}</p>
              <div className="mt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
                <span>PM2.5: {node.pm25 !== undefined ? `${node.pm25} µg/m³` : "Ref BAM"}</span>
                <span className="text-cyan-400">{node.uptime}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>Click any node card to load live telemetry into the inspector below</span>
        <span className="text-emerald-400">● 40 Municipal Streetlight Poles Linked</span>
      </div>
    </div>
  );
}

export function ContextualCityPilot3D({
  selectedNode,
  onSelectNode,
}: {
  selectedNode: PilotDataNode;
  onSelectNode: (node: PilotDataNode) => void;
}) {
  return (
    <div className="bg-slate-950 border border-gov-border rounded-card overflow-hidden shadow-sm space-y-0 text-left">
      <SceneWrapper
        title="3D Spatial Testbed: Lucknow Wards"
        subtitle="40 Nodes Active • Real-time PM2.5 / PM10 telemetry mesh"
        badgeText="SPATIAL TESTBED 3D"
        height="h-[280px]"
        fallback={
          <FallbackPilotCitySchematic
            selectedNode={selectedNode}
            onSelectNode={onSelectNode}
          />
        }
      >
        {({ resetKey }) => (
          <div className="relative w-full h-full bg-slate-950">
            <Canvas
              key={resetKey}
              camera={{ position: [5.5, 6.0, 7.5], fov: 42 }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
              <ambientLight intensity={0.65} />
              <directionalLight position={[10, 15, 8]} intensity={1.2} color="#FFFFFF" />
              <pointLight position={[-6, 5, -6]} intensity={0.6} color="#38BDF8" />
              <pointLight position={[6, 4, 6]} intensity={0.4} color="#A78BFA" />

              <CityGridGround />

              {LUCKNOW_PILOT_NODES.map((node) => (
                <InteractiveCityNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode.id === node.id}
                  onSelect={onSelectNode}
                />
              ))}

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                maxPolarAngle={Math.PI / 2.3}
                minPolarAngle={Math.PI / 5}
                dampingFactor={0.05}
              />
            </Canvas>

            {/* Legend Overlay Strip */}
            <div className="absolute bottom-2 left-2 right-2 pointer-events-none flex flex-wrap items-center justify-between gap-1 text-xs font-mono px-2 py-1 bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded">
              <div className="flex items-center space-x-3 text-slate-300">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-sky-500 mr-1" /> Locations
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-1" /> Mobile Misting
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" /> CPCB Reference
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-1" /> ICCC Hub
                </span>
              </div>
              <span className="text-slate-400 hidden sm:inline">Orbit: Drag to rotate view</span>
            </div>
          </div>
        )}
      </SceneWrapper>

      {/* Selected Node Real-time Telemetry Drawer */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 text-xs text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-white text-xs">{selectedNode.name}</span>
              <span className="text-xs text-slate-400 font-mono ml-2">
                ({selectedNode.ward})
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant={
                selectedNode.status === "ALERT"
                  ? "destructive"
                  : selectedNode.status === "OPTIMAL"
                  ? "success"
                  : "warning"
              }
              className="text-xs font-mono"
            >
              STATUS: {selectedNode.status}
            </Badge>
            <span className="text-xs font-mono text-cyan-400">{selectedNode.protocol}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-2 font-mono">
          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <span className="text-xs text-slate-400 block uppercase">PM2.5 CONCENTRATION</span>
            <span className="text-sm font-bold text-cyan-300">
              {selectedNode.pm25 !== undefined ? `${selectedNode.pm25} µg/m³` : "N/A"}
            </span>
          </div>

          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <span className="text-xs text-slate-400 block uppercase">PM10 CONCENTRATION</span>
            <span className="text-sm font-bold text-cyan-300">
              {selectedNode.pm10 !== undefined ? `${selectedNode.pm10} µg/m³` : "N/A"}
            </span>
          </div>

          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <span className="text-xs text-slate-400 block uppercase">HARDWARE UPTIME</span>
            <span className="text-sm font-bold text-emerald-400">{selectedNode.uptime || "100%"}</span>
          </div>

          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <span className="text-xs text-slate-400 block uppercase">POWER RESERVE</span>
            <span className="text-sm font-bold text-amber-300">{selectedNode.battery || "Nominal"}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{selectedNode.description}</p>
      </div>
    </div>
  );
}
