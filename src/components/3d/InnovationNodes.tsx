"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/utils";

export type NodeType = "GOVERNMENT" | "CHALLENGE" | "STARTUP" | "PILOT" | "VALIDATION" | "SCALE" | "SENSOR";

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  sublabel?: string;
  position: [number, number, number];
  metric?: string;
  status?: string;
}

const NODE_COLORS: Record<NodeType, { base: string; emissive: string; ring: string }> = {
  GOVERNMENT: { base: "#163A5F", emissive: "#38BDF8", ring: "#0284C7" },
  CHALLENGE: { base: "#1E293B", emissive: "#60A5FA", ring: "#3B82F6" },
  STARTUP: { base: "#2563EB", emissive: "#60A5FA", ring: "#93C5FD" },
  PILOT: { base: "#15803D", emissive: "#4ADE80", ring: "#86EFAC" },
  VALIDATION: { base: "#B45309", emissive: "#FBBF24", ring: "#FDE68A" },
  SCALE: { base: "#6D28D9", emissive: "#C084FC", ring: "#E9D5FF" },
  SENSOR: { base: "#0E7490", emissive: "#22D3EE", ring: "#A5F3FC" },
};

interface SingleNodeProps {
  node: NodeData;
  isPaused?: boolean;
  isSelected?: boolean;
  onSelect?: (node: NodeData) => void;
}

function SingleNode({ node, isPaused = false, isSelected = false, onSelect }: SingleNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const colors = NODE_COLORS[node.type] || NODE_COLORS.PILOT;

  useFrame(({ clock }) => {
    if (isPaused) return;
    const t = clock.getElapsedTime() + node.position[0];

    // Subtle restrained levitation
    if (meshRef.current) {
      meshRef.current.position.y = node.position[1] + Math.sin(t * 1.5) * 0.08;
    }
    // Subtle pulsating ring
    if (ringRef.current) {
      const s = 1 + Math.sin(t * 2) * 0.1;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[node.position[0], 0, node.position[2]]}>
      {/* Interactive Node Sphere */}
      <mesh
        ref={meshRef}
        position={[0, node.position[1], 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect && onSelect(node);
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
        scale={hovered || isSelected ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      >
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color={colors.base}
          emissive={colors.emissive}
          emissiveIntensity={hovered || isSelected ? 1.8 : 0.9}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Ground Projection Ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <ringGeometry args={[0.4, 0.55, 32]} />
        <meshBasicMaterial
          color={colors.ring}
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D HTML Tooltip Badge */}
      <Html
        position={[0, node.position[1] + 0.65, 0]}
        center
        distanceFactor={14}
        className="pointer-events-none"
      >
        <div
          className={cn(
            "flex flex-col items-center rounded-control px-2.5 py-1 text-center shadow-lg backdrop-blur-xs transition-all duration-200 border whitespace-nowrap",
            hovered || isSelected
              ? "bg-slate-900/95 border-blue-500 text-white scale-110"
              : "bg-slate-950/80 border-slate-700 text-slate-300"
          )}
        >
          <span className="text-xs font-bold tracking-tight">{node.label}</span>
          {node.metric && (
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {node.metric}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

export interface InnovationNodesProps {
  nodes: NodeData[];
  isPaused?: boolean;
  selectedNodeId?: string;
  onSelectNode?: (node: NodeData) => void;
}

export function InnovationNodes({
  nodes,
  isPaused = false,
  selectedNodeId,
  onSelectNode,
}: InnovationNodesProps) {
  return (
    <group>
      {nodes.map((node) => (
        <SingleNode
          key={node.id}
          node={node}
          isPaused={isPaused}
          isSelected={node.id === selectedNodeId}
          onSelect={onSelectNode}
        />
      ))}
    </group>
  );
}
