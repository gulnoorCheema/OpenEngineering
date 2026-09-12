import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Group, MathUtils, Quaternion, Vector3 } from 'three';
import type { SceneProps } from '../../lib/exhibit';
import { engineKinematics } from '../../lib/mechanics';
import { MechanicalPart as Part } from './Assets';
import EngineEffects from './EngineEffects';
import { Rod } from './primitives';
function Cylinder({ props, index, count }: { props: SceneProps; index: number; count: number }) {
  const piston = useRef<Group>(null),
    rod = useRef<Group>(null),
    crank = useRef<Group>(null),
    shell = useRef<Group>(null),
    head = useRef<Group>(null),
    valves = useRef<Group[]>([]),
    springs = useRef<Group[]>([]),
    cams = useRef<Group[]>([]);
  const axis = new Vector3(0, 1, 0),
    direction = new Vector3(),
    quaternion = new Quaternion();
  useFrame((_, delta) => {
    if (props.reduced) delta = 1;
    const k = engineKinematics(props.motion?.current.phase ?? props.phase, index, count),
      e = props.explode;
    if (piston.current) piston.current.position.y = k.pistonY;
    if (rod.current) {
      rod.current.position.set(k.crankX, k.crankY, 0);
      direction.set(-k.crankX, k.pistonY - k.crankY, 0).normalize();
      quaternion.setFromUnitVectors(axis, direction);
      rod.current.quaternion.copy(quaternion);
    }
    if (crank.current) crank.current.rotation.z = -k.angle;
    if (shell.current) {
      shell.current.position.z = MathUtils.damp(shell.current.position.z, -e * 0.95, 7, delta);
      const target =
        props.reveal && !props.reveal.includes('cylinder') ? 0 : props.stage === 2 ? 0.28 : 1;
      shell.current.scale.setScalar(MathUtils.damp(shell.current.scale.x, target, 7, delta));
    }
    if (head.current) {
      head.current.position.y = MathUtils.damp(head.current.position.y, 3.4 + e * 1.3, 7, delta);
      head.current.visible = props.stage === 0 || props.stage >= 3;
    }
    [k.intakeLift, k.exhaustLift].forEach((lift, j) => {
      if (valves.current[j]) valves.current[j].position.y = -0.23 - lift;
      if (springs.current[j]) springs.current[j].scale.y = Math.max(0.13, 0.47 - lift);
      if (cams.current[j]) cams.current[j].rotation.z = -k.camAngle + (j ? Math.PI * 1.5 : 0);
    });
  });
  const choose = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    props.onSelect(id);
  };
  const z = (index - (count - 1) / 2) * 1.84;
  return (
    <group position={[0, 0, z]}>
      <group ref={piston} onClick={choose('piston')}>
        <Part name="Piston" selected={props.selected === 'piston'} />
      </group>
      <group ref={shell} onClick={choose('cylinder')}>
        <Part
          name="CylinderShell"
          position={[0, 2.35, 0]}
          selected={props.selected === 'cylinder'}
        />
        {[1.4, 3.3].map((y) => (
          <Part key={y} name="CylinderCollar" position={[0, y, 0]} />
        ))}
      </group>
      <EngineEffects
        phase={props.phase}
        motion={props.motion}
        cylinder={index}
        count={count}
        low={props.quality === 'low'}
        enabled={
          props.effects !== false && props.explode < 0.05 && (props.stage === 0 || props.stage >= 3)
        }
      />
      {(props.stage === 0 || props.stage >= 2) && (
        <>
          <group ref={rod} onClick={choose('crankshaft')}>
            <Part name="ConnectingRod" selected={props.selected === 'crankshaft'} />
          </group>
          <group ref={crank} onClick={choose('crankshaft')}>
            {[-0.48, 0.48].map((z) => (
              <Part name="CrankWeb" position={[0, 0, z]} key={z} />
            ))}
            <Part name="CrankPin" position={[0, 0.72, 0]} />
          </group>
          <Part name="Bearing" position={[0, 0, -0.85]} />
        </>
      )}
      <group ref={head} position={[0, 3.4, 0]} onClick={choose('valves')}>
        <Part name="Head" selected={props.selected === 'valves'} />
        <Part name="SparkPlug" position={[0, -0.22, 0]} />
        <Part name="IntakePort" />
        <Part name="ExhaustPort" />
        {[-0.38, 0.38].map((x, j) => (
          <group key={x} position={[x, 0, 0]}>
            <group
              ref={(o) => {
                if (o) valves.current[j] = o;
              }}
            >
              <Part name="Valve" />
            </group>
            <group
              position={[0, 0.04, 0]}
              ref={(o) => {
                if (o) springs.current[j] = o;
              }}
            >
              <Part name="ValveSpring" />
            </group>
            <group
              position={[0, 0.73, 0]}
              ref={(o) => {
                if (o) cams.current[j] = o;
              }}
            >
              <Part name="CamLobe" />
              <mesh position={[0, 0.21, 0.085]}>
                <circleGeometry args={[0.035, 12]} />
                <meshBasicMaterial color="#eee8d9" />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
export default function EngineModel(props: SceneProps) {
  const count = props.controls.cylinders === 4 ? 4 : 1,
    fly = useRef<Group>(null),
    top = useRef<Group>(null);
  useFrame((_, d) => {
    if (props.reduced) d = 1;
    const phase = props.motion?.current.phase ?? props.phase;
    if (fly.current) {
      fly.current.rotation.z = (-phase * Math.PI) / 180;
      fly.current.position.z = MathUtils.damp(
        fly.current.position.z,
        -count * 0.92 - 0.32 - props.explode * 0.9,
        7,
        d,
      );
    }
    if (top.current)
      top.current.position.y = MathUtils.damp(
        top.current.position.y,
        4.13 + props.explode * 1.3,
        7,
        d,
      );
  });
  return (
    <group position={[0, -1.15, 0]} scale={count === 4 ? 0.87 : 1}>
      {Array.from({ length: count }, (_, i) => (
        <Cylinder key={i} props={props} index={i} count={count} />
      ))}
      {(props.stage === 0 || props.stage >= 2) && (
        <Rod
          start={[0, 0, -count * 0.92 - 1]}
          end={[0, 0, count * 0.92 + 0.6]}
          radius={0.165}
          color="#89949d"
        />
      )}
      {(props.stage === 0 || props.stage >= 3) && (
        <>
          <group ref={top} position={[0, 4.13, 0]}>
            {[-0.38, 0.38].map((x) => (
              <Rod
                key={x}
                start={[x, 0, -count * 0.92]}
                end={[x, 0, count * 0.92]}
                radius={0.095}
                color="#8e969d"
              />
            ))}
          </group>
          <group
            ref={fly}
            position={[0, 0, -count * 0.92 - 0.32]}
            onClick={(e) => {
              e.stopPropagation();
              props.onSelect('flywheel');
            }}
          >
            <Part name="Flywheel" selected={props.selected === 'flywheel'} />
          </group>
        </>
      )}
    </group>
  );
}
