import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import type { SceneProps } from '../../lib/exhibit';
import { gearKinematics } from '../../lib/mechanics';
import { MechanicalPart as Part } from './Assets';
import { Rod } from './primitives';
export default function GearScene(props: SceneProps) {
  const ratio = props.controls.ratio || 1,
    driver = ratio === 0.5 ? 32 : 16,
    driven = ratio === 0.5 ? 16 : driver * ratio,
    r1 = driver * 0.0475,
    r2 = driven * 0.0475,
    distance = r1 + r2,
    refs = useRef<Group[]>([]);
  useFrame((_, d) => {
    if (props.reduced) d = 1;
    const k = gearKinematics(props.motion?.current.phase ?? props.phase, driver, driven);
    refs.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.z = (i ? k.outputAngle : k.inputAngle) + (i ? Math.PI + Math.PI / driven : 0);
      g.position.z = MathUtils.damp(g.position.z, props.explode * (i ? 0.45 : -0.45), 7, d);
    });
  });
  return (
    <group rotation={[0, 0, 0.5]} scale={5.2 / (distance * (1 + Math.cos(0.5)) + 0.2)}>
      <group position={[(r1 - r2) / 2, 0, 0]}>
        {[driver, driven].map((teeth, i) => (
          <group
            key={i}
            position={[((i ? 1 : -1) * distance) / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              props.onSelect(i ? 'driven' : 'driver');
            }}
          >
            <group
              ref={(g) => {
                if (g) refs.current[i] = g;
              }}
            >
              <Part name={'Gear' + teeth} selected={props.selected === (i ? 'driven' : 'driver')} />
              <mesh position={[teeth * 0.0475 * 0.65, 0, 0.145]}>
                <circleGeometry args={[0.045, 16]} />
                <meshBasicMaterial color={i ? '#83d6e4' : '#ff8d55'} />
              </mesh>
            </group>
            <Rod start={[0, 0, -0.85]} end={[0, 0, 0.5]} radius={0.135} color="#666f78" />
            <Part name="Bearing" position={[0, 0, -0.59]} />
          </group>
        ))}
      </group>
    </group>
  );
}
