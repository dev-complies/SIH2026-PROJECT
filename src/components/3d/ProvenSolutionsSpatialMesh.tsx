"use client";

import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { SceneWrapper } from "./SceneWrapper";
import { ProvenSolution, INITIAL_PROVEN_SOLUTIONS } from "@/database/provenSolutionsDatabase";
import { cn } from "@/utils";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SpatialSolutionNode {
  solution: ProvenSolution;
  coordinates: [number, number, number];
  color: string;
  emissive: string;
}

const SECTOR_COLORS: Record<string, { color: string; emissive: string }> = {
  "Air Quality & Environment": { color: "#0284C7", emissive: "#38BDF8" },
  "Smart Mobility & Traffic": { color: "#4F46E5", emissive: "#818CF8" },
  "Water & Sanitation": { color: "#0D9488", emissive: "#2DD4BF" },
  "Heritage & Infrastructure": { color: "#D97706", emissive: "#FBBF24" },
  "Healthcare & Public Health": { color: "#059669", emissive: "#34D399" },
  "Clean Energy & Waste": { color: "#7C3AED", emissive: "#A78BFA" },
};

function SolutionPillar({
  node,
  isSelected,
  onSelect,
}: {
  node: SpatialSolutionNode;
  isSelected: boolean;
  onSelect: (sol: ProvenSolution) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  // Height reflects validated KPI attainment margin (scaled between 1.4 and 3.2)
  const primaryKpi = node.solution.validatedKpis[0];
  const improvement = primaryKpi?.improvementPercentage || 25;
  const height = Math.max(1.4, Math.min(3.2, 1.4 + (improvement / 100) * 2.0));

  return (
    <group position={[node.coordinates[0], 0, node.coordinates[2]]}>
      {/* Volumetric Performance Tower */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.solution);
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
        scale={hovered || isSelected ? [1.2, 1.05, 1.2] : [1, 1, 1]}
      >
        <cylinderGeometry args={[0.5, 0.65, height, 16]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.emissive}
          emissiveIntensity={hovered || isSelected ? 1.5 : 0.6}
          roughness={0.25}
          metalness={0.4}
        />
      </mesh>

      {/* Floating 3D Label & Location Tag */}
      <Html position={[0, height + 0.6, 0]} center distanceFactor={14} className="pointer-events-none">
        <div
          className={cn(
            "rounded-control px-2.5 py-1 text-center font-bold text-xs shadow-md border whitespace-nowrap backdrop-blur-xs transition-all",
            hovered || isSelected
              ? "bg-slate-900/95 border-blue-400 text-white scale-110"
              : "bg-slate-950/80 border-slate-700 text-slate-300"
          )}
        >
          <span className="text-[9px] font-mono block text-slate-400 font-semibold truncate max-w-[120px]">
            {node.solution.pilotLocation.city}, {node.solution.pilotLocation.state}
          </span>
          <span className="text-xs font-bold text-white block truncate max-w-[140px]">
            {node.solution.startup.name}
          </span>
          <span className="text-[9px] font-mono text-emerald-400 block">
            {primaryKpi ? primaryKpi.actualAchieved : "Validated"} ({primaryKpi ? primaryKpi.name.substring(0, 10) : "KPI"})
          </span>
        </div>
      </Html>
    </group>
  );
}

function SolutionsScene({
  nodes,
  selectedSolution,
  onSelectSolution,
}: {
  nodes: SpatialSolutionNode[];
  selectedSolution: ProvenSolution | null;
  onSelectSolution: (sol: ProvenSolution) => void;
}) {
  return (
    <group>
      {/* Base Grid Plane representing Indian Municipal Testbeds */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#0A0F1D" roughness={0.9} />
      </mesh>

      <gridHelper args={[18, 14, "#1E293B", "#111827"]} position={[0, 0.01, 0]} />

      {nodes.map((node) => (
        <SolutionPillar
          key={node.solution.id}
          node={node}
          isSelected={selectedSolution?.id === node.solution.id}
          onSelect={onSelectSolution}
        />
      ))}
    </group>
  );
}

// Accessible 2D Fallback for Proven Solutions
function FallbackProvenSolutionsSchematic({
  solutions,
  selectedSolution,
  onSelectSolution,
}: {
  solutions: ProvenSolution[];
  selectedSolution: ProvenSolution | null;
  onSelectSolution: (sol: ProvenSolution) => void;
}) {
  return (
    <div className="w-full min-h-[380px] rounded-card bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between text-left text-white shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            PROVEN SOLUTIONS SPATIAL REPLICATION MESH
          </span>
          <h4 className="text-sm font-bold text-white mt-1">
            Geographic Municipal Deployment & Validation Matrix
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {solutions.length} Certified Innovations
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-auto">
        {solutions.map((sol) => {
          const isSelected = selectedSolution?.id === sol.id;
          const kpi = sol.validatedKpis[0];
          return (
            <button
              key={sol.id}
              onClick={() => onSelectSolution(sol)}
              className={cn(
                "p-3 rounded-control border text-left transition-all",
                isSelected
                  ? "bg-slate-800 border-blue-400 shadow-md shadow-blue-500/10"
                  : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
              )}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-blue-400" />
                  {sol.pilotLocation.city}, {sol.pilotLocation.state}
                </span>
                <span className="text-emerald-400 font-semibold">{sol.pilotDuration.durationDays} Days</span>
              </div>
              <h5 className="font-bold text-white text-xs truncate">{sol.problem.statement}</h5>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5 truncate">{sol.startup.name}</p>
              {kpi && (
                <div className="mt-2 pt-1.5 border-t border-slate-700/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 truncate max-w-[120px]">{kpi.name}</span>
                  <span className="text-emerald-400 font-bold">{kpi.actualAchieved} (Baseline: {kpi.baseline})</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400 flex justify-between items-center mt-3">
        <span>Click any proven solution to view validation dossier & replication terms.</span>
        <span className="text-emerald-400 font-mono">100% GFR 149 Direct Procurement Ready</span>
      </div>
    </div>
  );
}

export interface ProvenSolutionsSpatialMeshProps {
  solutions?: ProvenSolution[];
  selectedSolution?: ProvenSolution | null;
  onSelectSolution?: (solution: ProvenSolution) => void;
  height?: string;
  className?: string;
}

export function ProvenSolutionsSpatialMesh({
  solutions = INITIAL_PROVEN_SOLUTIONS,
  selectedSolution = null,
  onSelectSolution,
  height = "h-[420px]",
  className,
}: ProvenSolutionsSpatialMeshProps) {
  const [internalSelected, setInternalSelected] = useState<ProvenSolution | null>(
    selectedSolution || solutions[0] || null
  );

  const activeSelected = selectedSolution || internalSelected;

  const handleSelect = (sol: ProvenSolution) => {
    setInternalSelected(sol);
    if (onSelectSolution) {
      onSelectSolution(sol);
    }
  };

  // Map solutions to spatial 3D coordinates based on location & department
  const spatialNodes: SpatialSolutionNode[] = solutions.map((sol, index) => {
    const angle = (index / (solutions.length || 1)) * Math.PI * 2;
    const radius = 4.2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const sectorConfig =
      SECTOR_COLORS[sol.category] || { color: "#3B82F6", emissive: "#60A5FA" };

    return {
      solution: sol,
      coordinates: [x, 0, z],
      color: sectorConfig.color,
      emissive: sectorConfig.emissive,
    };
  });

  return (
    <div className={cn("space-y-3", className)}>
      <SceneWrapper
        title="Proven Solutions Deployment Topology"
        subtitle="Audited Municipal Testbeds & Validated KPI Performance Towers"
        badgeText="SPATIAL REPLICATION MESH 3D"
        height={height}
        fallback={
          <FallbackProvenSolutionsSchematic
            solutions={solutions}
            selectedSolution={activeSelected}
            onSelectSolution={handleSelect}
          />
        }
      >
        {({ resetKey }) => (
          <Canvas
            key={resetKey}
            camera={{ position: [0, 8, 11], fov: 42 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <ambientLight intensity={0.65} />
            <directionalLight position={[10, 16, 10]} intensity={1.2} color="#FFFFFF" />
            <pointLight position={[-8, 6, -8]} intensity={0.5} color="#38BDF8" />

            <SolutionsScene
              nodes={spatialNodes}
              selectedSolution={activeSelected}
              onSelectSolution={handleSelect}
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

      {/* Selected Proven Solution Detail Strip */}
      {activeSelected && (
        <div className="bg-white border border-gov-border rounded-control p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-left">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] font-bold text-gov-primary bg-slate-100 px-2 py-0.5 rounded">
                {activeSelected.code}
              </span>
              <span className="font-mono text-[10px] text-gov-muted flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-slate-500" />
                {activeSelected.pilotLocation.city}, {activeSelected.pilotLocation.state}
              </span>
              <Badge variant="outline" className="text-[9px] font-mono border-emerald-300 text-emerald-800 bg-emerald-50">
                VALIDATED • {activeSelected.validationStatus.rating}
              </Badge>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              {activeSelected.problem.statement} — <strong className="text-gov-primary">{activeSelected.startup.name}</strong>
            </h4>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-gov-muted hidden md:inline">
              Auditor: <strong className="text-slate-700">{activeSelected.validationStatus.accreditedAgency}</strong>
            </span>
            <Button
              size="sm"
              onClick={() => handleSelect(activeSelected)}
              className="bg-gov-primary hover:bg-gov-primary-hover h-7 text-xs text-white"
            >
              Inspect Replication Dossier
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
