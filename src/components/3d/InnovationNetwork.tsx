"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface NetworkConnection {
  id: string;
  start: [number, number, number];
  end: [number, number, number];
  midElevation?: number;
  color?: string;
  pulseSpeed?: number;
}

interface PulseBeaconProps {
  curve: THREE.QuadraticBezierCurve3;
  color?: string;
  speed?: number;
  isPaused?: boolean;
}

function PulseBeacon({
  curve,
  color = "#38BDF8",
  speed = 0.4,
  isPaused = false,
}: PulseBeaconProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(Math.random());

  useFrame((_, delta) => {
    if (isPaused || !meshRef.current) return;
    progressRef.current = (progressRef.current + delta * speed) % 1;
    const point = curve.getPoint(progressRef.current);
    meshRef.current.position.copy(point);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function SingleConnection({
  conn,
  isPaused = false,
}: {
  conn: NetworkConnection;
  isPaused?: boolean;
}) {
  const { curve, lineGeometry } = useMemo(() => {
    const startVec = new THREE.Vector3(...conn.start);
    const endVec = new THREE.Vector3(...conn.end);
    const midVec = new THREE.Vector3(
      (startVec.x + endVec.x) / 2,
      (startVec.y + endVec.y) / 2 + (conn.midElevation || 1.2),
      (startVec.z + endVec.z) / 2
    );

    const bezier = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
    const points = bezier.getPoints(36);
    const geom = new THREE.BufferGeometry().setFromPoints(points);

    return { curve: bezier, lineGeometry: geom };
  }, [conn]);

  return (
    <group>
      {/* Static Translucent Arc Line */}
      {/* @ts-ignore line is a valid Three.js element */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={conn.color || "#2563EB"}
          transparent
          opacity={0.35}
          linewidth={1}
        />
      </line>

      {/* Animated Traveling Pulse Beacon */}
      <PulseBeacon
        curve={curve}
        color={conn.color || "#38BDF8"}
        speed={conn.pulseSpeed || 0.4}
        isPaused={isPaused}
      />
    </group>
  );
}

export interface InnovationNetworkProps {
  connections: NetworkConnection[];
  isPaused?: boolean;
}

export function InnovationNetwork({
  connections,
  isPaused = false,
}: InnovationNetworkProps) {
  return (
    <group>
      {connections.map((conn) => (
        <SingleConnection key={conn.id} conn={conn} isPaused={isPaused} />
      ))}
    </group>
  );
}
