import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import type { SceneProps } from '../../lib/exhibit';
import { sewingState, sewingThread, type Point } from '../../lib/sewing';
import { MechanicalPart } from './Assets';
import ThreadTube from './ThreadTube';
const model = '/models/sewing-machine.glb';
export default function SewingMachineScene(p: SceneProps) {
  const needle = useRef<Group>(null),
    hook = useRef<Group>(null),
    takeup = useRef<Group>(null),
    feed = useRef<Group>(null),
    wheel = useRef<Group>(null),
    housing = useRef<Group>(null),
    plate = useRef<Group>(null),
    cloth = useRef<Group>(null),
    stitches = useRef<Group>(null);
  const phase = () => p.motion?.current.phase ?? p.phase;
  useFrame((_, dt) => {
    const k = sewingState(phase(), p.controls.length);
    if (needle.current) needle.current.position.y = k.needleY;
    if (hook.current) hook.current.rotation.z = k.hookAngle;
    if (takeup.current) takeup.current.position.y = k.takeupY;
    if (feed.current) {
      feed.current.position.y = k.feedY;
      feed.current.position.z = k.feedZ;
    }
    if (wheel.current) wheel.current.rotation.x = (-phase() * Math.PI) / 180;
    const blend = p.reduced ? 1 : 1 - Math.exp(-dt * 7);
    if (housing.current)
      housing.current.position.z = MathUtils.lerp(
        housing.current.position.z,
        -(p.explode * 1.8 + (p.reveal?.includes('stitch-zone') ? 0.8 : 0)),
        blend,
      );
    if (plate.current)
      plate.current.position.x = MathUtils.lerp(plate.current.position.x, p.explode * 1.5, blend);
    if (cloth.current) cloth.current.position.z = ((k.fabricZ % k.pitch) + k.pitch) % k.pitch;
    if (stitches.current) {
      stitches.current.position.z = k.feed * k.pitch;
      stitches.current.scale.z = k.pitch;
      stitches.current.children.forEach((child, i) => {
        child.visible = i < Math.floor(1.8 / k.pitch);
      });
    }
  });
  const part = (name: string, id: string, position: [number, number, number] = [0, 0, 0]) => (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        p.onSelect(id);
      }}
    >
      <MechanicalPart name={name} model={model} selected={p.selected === id} />
    </group>
  );
  return (
    <group position={[0, -0.15, 0]}>
      <group ref={housing}>
        {part('SewingFrame', 'frame')}
        {part('ThreadSpool', 'upper-thread', [-1.45, 2.13, -0.18])}
      </group>
      <group ref={needle} position={[-0.64, 0, 0]}>
        {part('Needle', 'needle')}
        {part('NeedleBar', 'needle', [0, 0.98, 0])}
      </group>
      {part('Bobbin', 'bobbin', [0, -0.7, 0])}
      {part('BobbinCase', 'bobbin', [0, -0.7, 0])}
      <group ref={hook} position={[0, -0.7, 0.31]}>
        {part('ShuttleHook', 'hook')}
      </group>
      <group ref={plate} position={[0, 0.5, 0]}>
        {part('ThroatPlate', 'feed')}
      </group>
      {part('PresserFoot', 'feed', [-0.64, 0.64, 0])}
      <group ref={feed} position={[-0.64, 0.5, 0]}>
        {part('FeedDogs', 'feed')}
      </group>
      <group ref={takeup} position={[-1.29, 1.9, 0.12]}>
        {part('Takeup', 'takeup')}
      </group>
      <group ref={wheel} position={[1.4, 1.65, -0.55]}>
        {part('Handwheel', 'frame')}
      </group>
      <group ref={cloth}>
        <mesh position={[-0.62, 0.555, -0.75]}>
          <boxGeometry args={[1.16, 0.025, 2.15]} />
          <meshStandardMaterial
            color="#c2b18d"
            roughness={1}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} position={[-0.62, 0.573, -1.7 + i * 0.16]}>
            <boxGeometry args={[1.13, 0.002, 0.006]} />
            <meshStandardMaterial color="#a59372" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>
      <group ref={stitches} position={[-0.64, 0, 0]}>
        {Array.from({ length: 9 }, (_, i) => (
          <group key={i} position={[0, 0, -i - 1]}>
            <mesh position={[0, 0.584, 0.5]}>
              <boxGeometry args={[0.024, 0.018, 0.85]} />
              <meshStandardMaterial color="#ff8a51" />
            </mesh>
            <mesh position={[0, 0.53, 0.5]}>
              <boxGeometry args={[0.025, 0.018, 0.85]} />
              <meshStandardMaterial color="#60d6e5" />
            </mesh>
            <mesh position={[0, 0.556, 0.04]}>
              <boxGeometry args={[0.022, 0.07, 0.05]} />
              <meshStandardMaterial color="#ff8a51" />
            </mesh>
          </group>
        ))}
      </group>
      <ThreadTube count={80} color="#ff995f" sample={() => sewingThread(phase())} />
      <ThreadTube
        count={5}
        color="#60d6e5"
        sample={(): Point[] => [
          [0.34, -0.7, 0.3],
          [-0.3, -0.36, 0.35],
          [-0.64, 0.48, 0.25],
          [-0.64, 0.53, 0],
          [-0.64, 0.53, -1.5],
        ]}
      />
    </group>
  );
}
