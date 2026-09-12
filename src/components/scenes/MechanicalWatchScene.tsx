import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import type { SceneProps } from '../../lib/exhibit';
import { watchState, hairSpring } from '../../lib/watch';
import { MechanicalPart } from './Assets';
import ThreadTube from './ThreadTube';
const model = '/models/mechanical-watch.glb';
export default function MechanicalWatchScene(p: SceneProps) {
  const moving = useRef<Record<string, Group | null>>({}),
    plate = useRef<Group>(null);
  const phase = () => p.motion?.current.phase ?? p.phase;
  useFrame((_, dt) => {
    const k = watchState(phase(), p.controls.rate);
    for (const [name, value] of Object.entries({
      barrel: k.barrel,
      center: k.center,
      third: k.third,
      fourth: k.fourth,
      escape: k.escape,
      pallet: k.pallet,
      balance: k.balance,
      minute: k.minute,
      hour: k.hour,
      second: k.second,
      motion: -k.minute / 3,
    }))
      if (moving.current[name]) moving.current[name]!.rotation.z = value;
    if (plate.current)
      plate.current.position.z = MathUtils.lerp(
        plate.current.position.z,
        -p.explode * 1.2,
        p.reduced ? 1 : 1 - Math.exp(-dt * 7),
      );
  });
  const part = (name: string, id: string, pos: [number, number, number] = [0, 0, 0]) => (
    <group
      position={pos}
      onClick={(e) => {
        e.stopPropagation();
        p.onSelect(id);
      }}
    >
      <MechanicalPart name={name} model={model} selected={p.selected === id} />
    </group>
  );
  const gear = (key: string, pos: [number, number, number], children: React.ReactNode) => (
    <group
      ref={(o) => {
        moving.current[key] = o;
      }}
      position={pos}
    >
      {children}
    </group>
  );
  return (
    <group rotation={[-0.12, 0, 0]} position={[0, 0, 0]}>
      <group ref={plate}>{part('WatchPlate', 'plate')}</group>
      {gear(
        'barrel',
        [-1.15, -0.84, -0.05],
        <>
          {part('WatchBarrelGear', 'mainspring', [0, 0, -0.13])}
          {part('WatchBarrel', 'mainspring')}
          {part('WatchMainspring', 'mainspring')}
        </>,
      )}
      {gear(
        'center',
        [-1.15, -0.35, 0],
        <>
          {part('WatchCenter', 'train')}
          {part('WatchPinion', 'train', [0, 0, -0.18])}
        </>,
      )}
      {gear(
        'third',
        [-0.52, -0.35, 0.2],
        <>
          {part('WatchThird', 'train')}
          {part('WatchPinion', 'train', [0, 0, -0.2])}
        </>,
      )}
      {gear(
        'fourth',
        [0.075, -0.35, 0.4],
        <>
          {part('WatchFourth', 'train')}
          {part('WatchPinion', 'train', [0, 0, -0.2])}
        </>,
      )}
      {gear(
        'escape',
        [0.585, -0.35, 0.6],
        <>
          {part('WatchEscape', 'escapement')}
          {part('WatchEscapePinion', 'train', [0, 0, -0.2])}
        </>,
      )}
      {gear('pallet', [0.585, 0.18, 0.6], part('WatchPallet', 'escapement'))}
      {gear('balance', [0.585, 1, 0.7], part('WatchBalance', 'balance'))}
      <ThreadTube count={129} color="#bac9d0" radius={0.006} sample={() => hairSpring(phase())} />
      {part('WatchJewel', 'balance', [0.585, 1, 0.94])}
      {part('WatchBridge', 'plate', [1.2, 0.55, 0.1])}
      {part('WatchCrown', 'mainspring', [1.9, -0.5, 0])}
      {gear(
        'minute',
        [-1.15, -0.35, 0.91],
        <>
          {part('WatchMinutePinion', 'hands', [0, 0, -0.04])}
          {part('WatchMinuteHand', 'hands', [0, 0, 0.14])}
        </>,
      )}
      {gear(
        'motion',
        [-0.814, -0.35, 0.87],
        <>
          {part('WatchMotionWheel', 'hands')}
          {part('WatchMotionPinion', 'hands', [0, 0, 0.12])}
        </>,
      )}
      {gear(
        'hour',
        [-1.15, -0.35, 0.99],
        <>
          {part('WatchHourWheel', 'hands')}
          {part('WatchHourHand', 'hands', [0, 0, 0.14])}
        </>,
      )}
      {gear('second', [0.075, -0.35, 0.8], part('WatchSecondHand', 'hands'))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return (
          <mesh
            key={i}
            position={[-1.15 + Math.sin(a) * 0.7, -0.35 + Math.cos(a) * 0.7, 1.02]}
            rotation={[0, 0, -a]}
          >
            <boxGeometry args={[0.014, 0.055, 0.008]} />
            <meshStandardMaterial color="#e4dcca" />
          </mesh>
        );
      })}
    </group>
  );
}
