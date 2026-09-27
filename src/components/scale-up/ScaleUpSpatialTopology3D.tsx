"use client";

import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { SceneWrapper } from "@/components/3d/SceneWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { ExpansionCityTarget } from "@/database/scaleUpDatabase";
import {
  MapPin,
  Building2,
  Layers,
  Maximize2,
  RotateCcw,
  Info,
  CheckCircle2,
  TrendingUp,
  Radio,
  Sparkles,
} from "lucide-react";

export interface ScaleUpSpatialTopology3DProps {
  cities: ExpansionCityTarget[];
  selectedCityId?: string;
  onSelectCity?: (city: ExpansionCityTarget) => void;
  className?: string;
}

// 3D City Node Sphere with subtle hovering animation
function CityMarker3D({
  city,
  isSelected,
  onClick,
}: {
  city: ExpansionCityTarget;
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle hovering animation
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y =
      city.position3D[1] + Math.sin(t * 1.5 + city.position3D[0]) * 0.05;

    if (ringRef.current && isSelected) {
      ringRef.current.rotation.z += 0.02;
    }
  });

  const isHub = city.name === "Lucknow";
  const baseColor = isSelected ? "#f59e0b" : isHub ? "#1e40af" : "#0284c7";

  return (
    <group ref={meshRef} position={city.position3D}>
      {/* Vertical Laser Elevation Stalk */}
      <mesh position={[0, -city.position3D[1] / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, city.position3D[1], 8]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={isSelected ? 0.8 : 0.3}
        />
      </mesh>

      {/* Ground Projection Ring */}
      <mesh position={[0, -city.position3D[1] + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.28, 24]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={isSelected ? 0.6 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Elevated Node Sphere */}
      <mesh onClick={onClick} castShadow>
        <sphereGeometry args={[isHub ? 0.32 : 0.24, 24, 24]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.2}
          metalness={0.8}
          emissive={baseColor}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
        />
      </mesh>

      {/* Subtle Rotating Pulse Ring for Selected / Hub Node */}
      {(isSelected || isHub) && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.44, 32]} />
          <meshBasicMaterial
            color={isSelected ? "#f59e0b" : "#60a5fa"}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Interactive HTML Label floating above 3D node */}
      <Html position={[0, isHub ? 0.48 : 0.38, 0]} center distanceFactor={14}>
        <button
          onClick={onClick}
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-tight shadow-md transition-all whitespace-nowrap cursor-pointer",
            isSelected
              ? "bg-amber-500 text-slate-950 ring-2 ring-white scale-110"
              : isHub
              ? "bg-gov-primary text-white hover:bg-gov-primary/90"
              : "bg-slate-900/90 text-slate-100 hover:bg-slate-800"
          )}
        >
          {city.name} ({city.plannedNodes})
        </button>
      </Html>
    </group>
  );
}

function TelemetryArch({
  hub,
  city,
  isSelected,
}: {
  hub: ExpansionCityTarget;
  city: ExpansionCityTarget;
  isSelected: boolean;
}) {
  const lineObject = React.useMemo(() => {
    const p1 = new THREE.Vector3(...hub.position3D);
    const p3 = new THREE.Vector3(...city.position3D);
    const midX = (p1.x + p3.x) / 2;
    const midZ = (p1.z + p3.z) / 2;
    const p2 = new THREE.Vector3(midX, Math.max(p1.y, p3.y) + 0.8, midZ);

    const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
    const points = curve.getPoints(24);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: isSelected ? "#f59e0b" : "#3b82f6",
      transparent: true,
      opacity: isSelected ? 0.75 : 0.25,
    });
    return new THREE.Line(geometry, material);
  }, [hub, city, isSelected]);

  return <primitive object={lineObject} />;
}

// Inter-city Telemetry Backhaul Lines
function TelemetryArches({
  cities,
  selectedCityId,
}: {
  cities: ExpansionCityTarget[];
  selectedCityId?: string;
}) {
  const hub = cities.find((c) => c.name === "Lucknow") || cities[0];

  return (
    <group>
      {cities
        .filter((c) => c.id !== hub.id)
        .map((city) => {
          const isConnectedToSelected =
            selectedCityId === city.id || selectedCityId === hub.id;

          return (
            <TelemetryArch
              key={`arch-${city.id}`}
              hub={hub}
              city={city}
              isSelected={isConnectedToSelected}
            />
          );
        })}
    </group>
  );
}

// Stylized Ground Plane with Elevation Grid
function TopoGroundGrid() {
  return (
    <group position={[0, -0.05, 0]}>
      <gridHelper
        args={[14, 28, "#94a3b8", "#e2e8f0"]}
        position={[0, 0, 0]}
      />
      {/* Subtle Uttar Pradesh Territorial Base Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[6.8, 36]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}

// 2D Accessible Fallback Schematic
function Topology2DFallback({
  cities,
  selectedCity,
  onSelectCity,
}: {
  cities: ExpansionCityTarget[];
  selectedCity: ExpansionCityTarget;
  onSelectCity: (city: ExpansionCityTarget) => void;
}) {
  return (
    <div className="h-full flex flex-col justify-center items-center p-4 bg-slate-50">
      <div className="max-w-md w-full space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
          <span className="font-bold text-slate-800 flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1 text-gov-primary" />
            2D Regional Expansion Schematic
          </span>
          <Badge variant="outline" className="font-mono text-xs">
            6 State Cities • 910 Nodes
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className={cn(
                "p-2.5 rounded-control border text-left transition-all",
                selectedCity.id === city.id
                  ? "bg-amber-50 border-amber-300 ring-1 ring-amber-400"
                  : "bg-white border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{city.name}</span>
                <span className="font-mono text-xs text-gov-primary font-semibold">
                  {city.plannedNodes} nodes
                </span>
              </div>
              <span className="text-xs text-slate-500 block truncate">
                {city.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScaleUpSpatialTopology3D({
  cities,
  selectedCityId,
  onSelectCity,
  className,
}: ScaleUpSpatialTopology3DProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    selectedCityId || cities[0]?.id || "city-lko"
  );
  const [expansionFilter, setExpansionFilter] = useState<"ALL" | "PHASE_1" | "PHASE_2">(
    "ALL"
  );

  const selectedCity =
    cities.find((c) => c.id === (selectedCityId || internalSelectedId)) || cities[0];

  const handleCityClick = (city: ExpansionCityTarget) => {
    setInternalSelectedId(city.id);
    onSelectCity?.(city);
  };

  const filteredCities = cities.filter((c) => {
    if (expansionFilter === "PHASE_1") return c.priorityLevel === "IMMEDIATE_PHASE_1";
    if (expansionFilter === "PHASE_2")
      return c.priorityLevel === "IMMEDIATE_PHASE_1" || c.priorityLevel === "PHASE_2";
    return true;
  });

  return (
    <div
      className={cn(
        "bg-white border border-gov-border rounded-card shadow-2xs overflow-hidden",
        className
      )}
    >
      {/* Header with Spatial Context & Layer Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border-b border-slate-200 text-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-gov-primary text-xs uppercase tracking-wide">
              SPATIAL 3D CORRIDOR TOPOLOGY
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-xs">
              Subtle Spatial Depth Model
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm mt-0.5">
            Proposed Uttar Pradesh Multi-City Telemetry Network
          </h3>
        </div>

        {/* Expansion Phase Filter */}
        <div className="flex items-center space-x-1 self-start sm:self-center">
          <span className="text-xs font-mono text-gov-muted mr-1 hidden sm:inline">
            Scope:
          </span>
          <button
            onClick={() => setExpansionFilter("ALL")}
            className={cn(
              "px-2 py-1 rounded-control text-xs font-semibold transition-all",
              expansionFilter === "ALL"
                ? "bg-gov-primary text-white shadow-2xs"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
            )}
          >
            All 6 Cities (910 Nodes)
          </button>
          <button
            onClick={() => setExpansionFilter("PHASE_1")}
            className={cn(
              "px-2 py-1 rounded-control text-xs font-semibold transition-all",
              expansionFilter === "PHASE_1"
                ? "bg-gov-primary text-white shadow-2xs"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
            )}
          >
            Phase 1 Only (500 Nodes)
          </button>
        </div>
      </div>

      {/* 3D Canvas / Spatial Visualizer Container */}
      <div className="relative h-[380px] bg-slate-950">
        <SceneWrapper
          title="UP Regional Expansion Network"
          badgeText="INTERACTIVE 3D SPATIAL TOPOLOGY"
          height="h-[380px]"
          fallback={
            <Topology2DFallback
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={handleCityClick}
            />
          }
        >
          {({ isPaused, resetKey }) => (
            <Canvas
              key={resetKey}
              camera={{ position: [0, 4.2, 5.8], fov: 45 }}
              shadows
            >
              <color attach="background" args={["#090d16"]} />
              <ambientLight intensity={0.65} />
              <directionalLight
                position={[5, 8, 4]}
                intensity={1.2}
                castShadow
              />
              <pointLight position={[-4, 3, -3]} intensity={0.4} color="#60a5fa" />

              <OrbitControls
                enableZoom={true}
                maxPolarAngle={Math.PI / 2.1}
                minDistance={3.5}
                maxDistance={12}
                autoRotate={!isPaused}
                autoRotateSpeed={0.5}
              />

              <TopoGroundGrid />
              <TelemetryArches
                cities={filteredCities}
                selectedCityId={selectedCity.id}
              />

              {filteredCities.map((city) => (
                <CityMarker3D
                  key={city.id}
                  city={city}
                  isSelected={city.id === selectedCity.id}
                  onClick={() => handleCityClick(city)}
                />
              ))}
            </Canvas>
          )}
        </SceneWrapper>

        {/* Overlay Badge for Active 3D Node Details */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-20 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white rounded-control p-3 shadow-xl text-xs space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-sm text-slate-100">
                  {selectedCity.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  [{selectedCity.category}]
                </span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-mono">
                {selectedCity.readinessScore}% READY
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
              <div>
                <span className="text-slate-400 block text-xs">Planned Wards:</span>
                <strong className="text-slate-100 font-mono">
                  {selectedCity.targetWards} Wards
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Sensor Density:</span>
                <strong className="text-slate-100 font-mono">
                  {selectedCity.plannedNodes} Nodes
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Budget Allocated:</span>
                <strong className="text-amber-400 font-mono">
                  ₹{(selectedCity.estimatedCostInr / 100000).toFixed(1)} Lakh
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Timeline:</span>
                <strong className="text-slate-100 font-mono">
                  {selectedCity.targetTimelineMonths} Months
                </strong>
              </div>
            </div>

            <p className="text-xs text-slate-300 border-t border-slate-800 pt-1 line-clamp-1">
              Focus: {selectedCity.primaryAirPollutantFocus}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info Ribbon */}
      <div className="p-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gov-muted">
        <span className="flex items-center">
          <Info className="w-3.5 h-3.5 mr-1 text-gov-primary shrink-0" />
          Click any 3D node to inspect city readiness, sensor allocations, and municipal partner.
        </span>
        <span className="font-mono text-slate-700 font-semibold shrink-0">
          Statewide Corridors: 6 Cities • 380 Wards • 910 Nodes
        </span>
      </div>
    </div>
  );
}
