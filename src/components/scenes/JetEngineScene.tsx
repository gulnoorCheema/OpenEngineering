import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Group, InstancedMesh, MathUtils, Object3D } from 'three';
import type { SceneProps } from '../../lib/exhibit';
import { jetState, jetFlow } from '../../lib/jet';
import { MechanicalPart } from './Assets';
import JetFlow from './JetFlow';
import JetCombustion from './JetCombustion';
const model = '/models/jet-engine.glb';
export default function JetEngineScene(p: SceneProps) {
  const fan = useRef<Group>(null),
    low = useRef<Group>(null),
    high = useRef<Group>(null),
    shell = useRef<Group>(null),
    flow = useRef<InstancedMesh>(null),
    fire = useRef<InstancedMesh>(null);
  const scratch = useMemo(() => new Object3D(), []),
    color = useMemo(() => new Color(), []);
  const count = p.quality === 'low' ? 66 : 132;
  useFrame((_, dt) => {
    const phase = p.motion?.current.phase ?? p.phase,
      k = jetState(phase, p.controls.bypass);
    if (fan.current) fan.current.rotation.x = k.fan;
    if (low.current) low.current.rotation.x = k.lowShaft;
    if (high.current) high.current.rotation.x = k.highShaft;
    if (shell.current)
      shell.current.position.z = MathUtils.lerp(
        shell.current.position.z,
        -(p.explode * 2 + (p.reveal?.includes('shafts') ? 1.2 : 0)),
        p.reduced ? 1 : 1 - Math.exp(-dt * 7),
      );
    if (flow.current) {
      for (let i = 0; i < count; i++) {
        const f = jetFlow(phase, i, p.controls.bypass, count),
          visible = (p.controls.flow !== 1 || f.core) && (p.controls.flow !== 2 || !f.core);
        scratch.position.set(...f.position);
        scratch.scale.set(visible ? 0.1 : 0, visible ? 0.006 : 0, visible ? 0.006 : 0);
        scratch.rotation.set(0, 0, 0);
        scratch.updateMatrix();
        flow.current.setMatrixAt(i, scratch.matrix);
        color.set(f.hot ? '#ff8b40' : '#63ddeb');
        flow.current.setColorAt(i, color);
      }
      flow.current.instanceMatrix.needsUpdate = true;
      if (flow.current.instanceColor) flow.current.instanceColor.needsUpdate = true;
    }
    if (fire.current) {
      for (let i = 0; i < 32; i++) {
        const a = i * 2.39996,
          t = (((phase / 420 + i * 0.618) % 1) + 1) % 1,
          r = 0.44 + 0.025 * Math.sin(a);
        scratch.position.set(-0.2 + t * 0.77, Math.sin(a) * r, Math.cos(a) * r);
        scratch.scale.set(0.1 + 0.07 * Math.sin(t * Math.PI), 0.05, 0.05);
        scratch.updateMatrix();
        fire.current.setMatrixAt(i, scratch.matrix);
      }
      fire.current.instanceMatrix.needsUpdate = true;
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
    <group>
      <group ref={shell}>
        {part('JetNacelle', 'bypass')}
        {part('JetCore', 'compressor')}
      </group>
      {part('JetStand', 'shafts')}
      <group ref={fan} position={[-2.94, 0, 0]}>
        {part('JetFan', 'fan')}
        {part('JetSpinner', 'fan', [-0.15, 0, 0])}
      </group>
      <group ref={high}>
        {part('JetHighShaft', 'shafts')}
        {[-1.9, -1.5, -1.1, -0.7].map((x, i) => (
          <group key={x} scale={[1, 1 - i * 0.07, 1 - i * 0.07]}>
            {part('JetCompressor', 'compressor', [x, 0, 0])}
          </group>
        ))}
        {part('JetTurbine', 'turbines', [0.95, 0, 0])}
      </group>
      <group ref={low}>
        {part('JetLowShaft', 'shafts')}
        {[1.4, 1.8].map((x) => (
          <group key={x}>{part('JetTurbine', 'turbines', [x, 0, 0])}</group>
        ))}
      </group>
      {[-1.7, -1.3, -0.9, 1.16, 1.6].map((x) => (
        <group key={x}>{part('JetStator', 'stators', [x, 0, 0])}</group>
      ))}
      {part('JetCombustor', 'combustor')}
      {part('JetNozzle', 'nozzle')}
      {p.effects !== false && !p.reduced && (
        <>
          <JetFlow p={p} />
          <JetCombustion p={p} />
          <instancedMesh ref={flow} args={[undefined, undefined, count]} frustumCulled={false}>
            <sphereGeometry args={[1, 6, 4]} />
            <meshStandardMaterial roughness={0.35} emissive="#72a3a5" emissiveIntensity={0.45} />
          </instancedMesh>
          <instancedMesh ref={fire} args={[undefined, undefined, 32]} frustumCulled={false}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial
              color="#ffad46"
              transparent
              opacity={0.3}
              depthWrite={false}
              toneMapped={false}
            />
          </instancedMesh>
          <pointLight position={[0.2, 0, 0.1]} color="#ff8a40" intensity={3} distance={2.1} />
        </>
      )}
    </group>
  );
}
