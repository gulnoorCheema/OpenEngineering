import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import type { SceneProps } from '../../lib/exhibit';
import { differentialKinematics } from '../../lib/mechanics';
import { MechanicalPart as Part } from './Assets';
import { Rod } from './primitives';
export default function DifferentialScene(props: SceneProps) {
  const sides = useRef<Group[]>([]),
    spiders = useRef<Group[]>([]),
    carrier = useRef<Group>(null),
    ring = useRef<Group>(null),
    housing = useRef<Group>(null);
  useFrame((_, d) => {
    if (props.reduced) d = 1;
    const k = differentialKinematics(
      props.motion?.current.phase ?? props.phase,
      props.controls.radius,
      props.controls.direction,
      props.controls.held === 1,
    );
    sides.current.forEach((g, i) => {
      if (g) {
        g.rotation.x = i ? k.right : k.left;
        g.position.x = MathUtils.damp(
          g.position.x,
          (i ? 1 : -1) * (0.57 * 0.81 + props.explode * 0.64),
          7,
          d,
        );
      }
    });
    if (carrier.current) carrier.current.rotation.x = k.carrier;
    if (housing.current)
      housing.current.scale.setScalar(
        MathUtils.damp(
          housing.current.scale.x,
          props.reveal && !props.reveal.includes('carrier') ? 0 : 1,
          7,
          d,
        ),
      );
    if (ring.current)
      ring.current.position.x = MathUtils.damp(
        ring.current.position.x,
        -1.3 - props.explode * 0.9,
        7,
        d,
      );
    spiders.current.forEach((g, i) => {
      if (g) {
        g.rotation.y = i ? k.spiderTop : k.spiderBottom;
        g.position.y = MathUtils.damp(
          g.position.y,
          (i ? 1 : -1) * (0.76 * 0.81 + props.explode * 0.6),
          7,
          d,
        );
      }
    });
  });
  const select = (id: string) => (e: any) => {
    e.stopPropagation();
    props.onSelect(id);
  };
  return (
    <group>
      {[-1, 1].map((s, i) => (
        <group
          key={s}
          ref={(o) => {
            if (o) sides.current[i] = o;
          }}
          position={[s * 0.57 * 0.81, 0, 0]}
          onClick={select(i ? 'right' : 'left')}
        >
          <group rotation={[0, 0, (s * Math.PI) / 2]}>
            <Part name="SideGear" selected={props.selected === (i ? 'right' : 'left')} />
          </group>
          <Rod start={[0, 0, 0]} end={[s * 2.1, 0, 0]} radius={0.13} color="#64737d" />
          <group position={[s * 2.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <Part name="Wheel" />
            <mesh position={[0, 0.228, 0.32]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.055, 12]} />
              <meshBasicMaterial color={i ? '#7bd9e8' : '#ff955e'} />
            </mesh>
          </group>
        </group>
      ))}
      {[-1, 1].map((s) => (
        <Part key={s} name="Bearing" position={[s * 1.6, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      ))}
      <group ref={carrier}>
        <group
          ref={ring}
          position={[-1.3, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          onClick={select('carrier')}
        >
          <Part name="RingGear" selected={props.selected === 'carrier'} />
        </group>
        <group ref={housing} rotation={[0, 0, Math.PI / 2]} onClick={select('carrier')}>
          <Part name="Carrier" selected={props.selected === 'carrier'} />
        </group>
        <Rod start={[0, -1.12, 0]} end={[0, 1.12, 0]} radius={0.08} color="#a6adb0" />
        {[-1, 1].map((s, i) => (
          <group
            key={s}
            ref={(o) => {
              if (o) spiders.current[i] = o;
            }}
            position={[0, s * 0.76 * 0.81, 0]}
          >
            <group rotation={[s < 0 ? 0 : Math.PI, 0, 0]} onClick={select('spider')}>
              <Part name="SpiderGear" selected={props.selected === 'spider'} />
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
