import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export const colors = { orange: '#ea6129', gold: '#dca852', steel: '#9fa9af', dark: '#3a4853', blue: '#467b98', ivory: '#e0ded5' };
export function Rod({ start, end, radius = 0.13, color = colors.steel }: { start: [number, number, number]; end: [number, number, number]; radius?: number; color?: string }) {
  const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
  const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  const length = a.distanceTo(b);
  return <mesh position={a.clone().add(b).multiplyScalar(0.5)} quaternion={rotation} castShadow><cylinderGeometry args={[radius, radius, length, 16]} /><meshStandardMaterial color={color} metalness={0.65} roughness={0.3} /></mesh>;
}
export function Bolt({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return <mesh position={position} rotation={rotation} castShadow><cylinderGeometry args={[0.09, 0.09, 0.09, 6]} /><meshStandardMaterial color="#52616d" metalness={0.8} roughness={0.3} /></mesh>;
}
export function Gear({ teeth, radius, depth = 0.32, color = colors.orange, angle = 0, position = [0, 0, 0] }: { teeth: number; radius: number; depth?: number; color?: string; angle?: number; position?: [number, number, number] }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    for (let tooth = 0; tooth < teeth; tooth++) {
      const points = [[0, radius - 0.12], [0.2, radius - 0.12], [0.32, radius + 0.10], [0.68, radius + 0.10], [0.8, radius - 0.12], [1, radius - 0.12]];
      points.forEach(([f, r], i) => { const a = (tooth + f) / teeth * Math.PI * 2; if (tooth === 0 && i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r); else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r); });
    }
    shape.closePath();
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.18, 0, Math.PI * 2, true); shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.025, bevelThickness: 0.025 });
    geo.translate(0, 0, -depth / 2);
    return geo;
  }, [teeth, radius, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group position={position} rotation={[0, 0, angle]}><mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial color={color} metalness={0.7} roughness={0.3} /></mesh><mesh position={[0, 0, depth / 2 + 0.06]}><torusGeometry args={[radius * 0.5, 0.035, 8, 60]} /><meshStandardMaterial color="#fff0d9" metalness={0.6} roughness={0.3} /></mesh><mesh position={[radius * 0.69, 0, depth / 2 + 0.03]}><circleGeometry args={[0.07, 20]} /><meshBasicMaterial color="#fff9e8" /></mesh></group>;
}
