"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { SceneWrapper } from "./SceneWrapper";
import { cn } from "@/utils";
import { Layers, CheckCircle2, ChevronRight, Activity } from "lucide-react";

export interface PipelineStageData {
  id: string;
  name: string;
  count: number;
  subtext: string;
  color: string;
  emissive: string;
  position: [number, number, number];
}

export const DEFAULT_STAGES: PipelineStageData[] = [
  { id: "challenges", name: "1. CHALLENGES", count: 42, subtext: "Problem Formulations", color: "#163A5F", emissive: "#0284C7", position: [-5.0, 0, 0] },
  { id: "applications", name: "2. APPLICATIONS", count: 48, subtext: "Startup Proposals", color: "#1D4ED8", emissive: "#3B82F6", position: [-3.0, 0, 0] },
  { id: "evaluation", name: "3. EVALUATION", count: 18, subtext: "Blind Scoring Matrix", color: "#7C3AED", emissive: "#A78BFA", position: [-1.0, 0, 0] },
  { id: "pilots", name: "4. PILOTS", count: 6, subtext: "Active Testbeds", color: "#0F766E", emissive: "#14B8A6", position: [1.0, 0, 0] },
  { id: "validation", name: "5. VALIDATION", count: 4, subtext: "Audited Outcomes", color: "#B45309", emissive: "#F59E0B", position: [3.0, 0, 0] },
  { id: "scale", name: "6. SCALE", count: 3, subtext: "Procurement Scaling", color: "#047857", emissive: "#10B981", position: [5.0, 0, 0] },
];

function StagePillar({
  stage,
  isSelected,
  onSelect,
}: {
  stage: PipelineStageData;
  isSelected: boolean;
  onSelect: (s: PipelineStageData) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  // Height proportional to volume/count
  const height = Math.max(1.2, Math.min(3.5, stage.count * 0.08));

  return (
    <group position={[stage.position[0], 0, stage.position[2]]}>
      {/* 3D Volumetric Stage Pillar */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(stage);
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
        scale={hovered || isSelected ? [1.15, 1.05, 1.15] : [1, 1, 1]}
      >
        <boxGeometry args={[1.8, height, 1.8]} />
        <meshStandardMaterial
          color={stage.color}
          emissive={stage.emissive}
          emissiveIntensity={hovered || isSelected ? 1.4 : 0.6}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Floating 3D Stage Label & Count */}
      <Html position={[0, height + 0.6, 0]} center distanceFactor={14} className="pointer-events-none">
        <div
          className={cn(
            "rounded-control px-2.5 py-1 text-center font-bold text-xs shadow-md border whitespace-nowrap backdrop-blur-xs transition-all",
            hovered || isSelected
              ? "bg-slate-900/95 border-blue-400 text-white scale-110"
              : "bg-slate-950/80 border-slate-700 text-slate-300"
          )}
        >
          <span className="text-[10px] font-mono block text-slate-400 font-semibold">{stage.name}</span>
          <span className="text-sm font-extrabold text-white">{stage.count} Active</span>
        </div>
      </Html>
    </group>
  );
}

function PipelineScene({
  selectedStage,
  onSelectStage,
}: {
  selectedStage: PipelineStageData | null;
  onSelectStage: (s: PipelineStageData) => void;
}) {
  return (
    <group>
      {/* Base Grid Runway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color="#0A0F1D" roughness={0.9} />
      </mesh>

      <gridHelper args={[16, 8, "#1E293B", "#111827"]} position={[0, 0.01, 0]} />

      {DEFAULT_STAGES.map((s) => (
        <StagePillar
          key={s.id}
          stage={s}
          isSelected={selectedStage?.id === s.id}
          onSelect={onSelectStage}
        />
      ))}
    </group>
  );
}

function FallbackPipeline({ onSelectStage }: { onSelectStage: (s: PipelineStageData) => void }) {
  return (
    <div className="w-full h-[360px] rounded-card bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between text-left text-white shadow-inner">
      <div>
        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
          LIFECYCLE CONVERSION PIPELINE
        </span>
        <h4 className="text-base font-bold text-white mt-2">
          End-to-End Innovation Procurement Funnel
        </h4>
        <p className="text-xs text-slate-400">
          Throughput and stage velocity across all municipal challenges
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 my-auto">
        {DEFAULT_STAGES.map((st) => (
          <div
            key={st.id}
            onClick={() => onSelectStage(st)}
            className="p-3 rounded-control border border-slate-700 bg-slate-800/80 hover:border-blue-500 cursor-pointer transition-colors text-left"
          >
            <span className="text-[10px] font-mono text-slate-400 block">{st.name}</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{st.count}</span>
            <p className="text-[10px] text-gov-muted mt-0.5 truncate">{st.subtext}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 pt-2 text-xs text-slate-400 flex justify-between items-center">
        <span>Click any stage card to filter operational queue.</span>
        <span className="text-emerald-400 font-mono text-[11px]">Lifecycle Traceability 100%</span>
      </div>
    </div>
  );
}

export interface InnovationPipelineProps {
  height?: string;
  className?: string;
  onSelectStage?: (stage: PipelineStageData) => void;
}

export function InnovationPipeline({
  height = "h-[360px]",
  className,
  onSelectStage,
}: InnovationPipelineProps) {
  const [selectedStage, setSelectedStage] = useState<PipelineStageData | null>(DEFAULT_STAGES[2]);

  const handleSelect = (stage: PipelineStageData) => {
    setSelectedStage(stage);
    if (onSelectStage) onSelectStage(stage);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <SceneWrapper
        title="Innovation Pipeline Volumetric Funnel"
        subtitle="Challenges → Applications → Evaluation → Pilots → Validation → Scale"
        badgeText="VOLUMETRIC PIPELINE 3D"
        height={height}
        fallback={<FallbackPipeline onSelectStage={handleSelect} />}
      >
        {({ resetKey }) => (
          <Canvas
            key={resetKey}
            camera={{ position: [0, 6, 11], fov: 42 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 12, 8]} intensity={1.2} color="#FFFFFF" />
            <pointLight position={[-6, 4, -4]} intensity={0.4} color="#38BDF8" />

            <PipelineScene selectedStage={selectedStage} onSelectStage={handleSelect} />

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

      {/* Selected Stage Detail Drawer / Ribbon */}
      {selectedStage && (
        <div className="bg-white border border-gov-border rounded-control p-3.5 shadow-2xs flex items-center justify-between text-xs text-left">
          <div className="flex items-center space-x-3">
            <span className="font-mono font-bold text-gov-primary px-2 py-0.5 bg-slate-100 rounded">
              {selectedStage.name}
            </span>
            <span className="text-slate-700">
              Active Items: <strong className="text-gov-primary">{selectedStage.count}</strong> ({selectedStage.subtext})
            </span>
          </div>
          <span className="text-[11px] text-gov-muted">Filtered in operational table below</span>
        </div>
      )}
    </div>
  );
}
