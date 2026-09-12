import type { SceneProps } from '../../lib/exhibit';
import { gearKinematics } from '../../lib/mechanics';
import { Gear, Rod, colors } from './primitives';
export function gearTeeth(ratio: number) {
  return ratio === 0.5 ? [32, 16] : [16, 16 * ratio];
}
export default function GearScene({ phase, explode, controls, onSelect, selected }: SceneProps) {
  const [n1, n2] = gearTeeth(controls.ratio),
    r1 = n1 * 0.055,
    r2 = n2 * 0.055;
  const k = gearKinematics(phase, n1, n2),
    left = -r2,
    right = r1;
  return (
    <group>
      <Rod start={[left, 0, -0.8]} end={[right, 0, -0.8]} radius={0.22} color={colors.ivory} />
      {[left, right].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 1.8, 24]} />
            <meshStandardMaterial color={colors.dark} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, -0.7]}>
            <boxGeometry args={[0.72, 0.72, 0.25]} />
            <meshStandardMaterial color={colors.steel} metalness={0.45} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect('driver');
        }}
      >
        <Gear
          teeth={n1}
          radius={r1}
          position={[left, 0, explode * 0.55]}
          angle={k.inputAngle}
          color={selected === 'driver' ? '#f59944' : colors.orange}
        />
      </group>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect('driven');
        }}
      >
        <Gear
          teeth={n2}
          radius={r2}
          position={[right, 0, -explode * 0.55]}
          angle={k.outputAngle + Math.PI + Math.PI / n2}
          color={selected === 'driven' ? '#70a6be' : colors.blue}
        />
      </group>
    </group>
  );
}
