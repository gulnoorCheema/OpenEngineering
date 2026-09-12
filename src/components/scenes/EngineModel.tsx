import type { ThreeEvent } from '@react-three/fiber';
import { engineKinematics } from '../../lib/mechanics';
import type { SceneProps } from '../../lib/exhibit';
import { Bolt, Rod, colors } from './primitives';
const strokeColors = ['#6caaca', '#cdc4ac', '#f27c37', '#979a99'];
export default function EngineModel({
  phase,
  explode,
  controls,
  stage,
  selected,
  onSelect,
}: SceneProps) {
  const count = controls.cylinders === 4 ? 4 : 1;
  const full = stage === 0 || stage >= 3;
  const select = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(id);
  };
  const glow = (id: string) => (selected === id ? '#644315' : '#000000');
  return (
    <group position={[0, -1.3, 0]} scale={count === 4 ? 0.82 : 1}>
      {Array.from({ length: count }, (_, i) => {
        const k = engineKinematics(phase, i, count),
          z = (i - (count - 1) / 2) * 1.8;
        const piston = k.pistonY,
          gasHeight = Math.max(0.04, 3.2 - (piston + 0.3));
        return (
          <group key={i} position={[0, 0, z]}>
            <group onClick={select('piston')}>
              <mesh position={[0, piston, 0]} castShadow>
                <cylinderGeometry args={[0.64, 0.6, 0.6, 48]} />
                <meshStandardMaterial
                  color={colors.gold}
                  metalness={0.55}
                  roughness={0.3}
                  emissive={glow('piston')}
                />
              </mesh>
              {[0.15, 0.23].map((y) => (
                <mesh key={y} position={[0, piston + y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.64, 0.022, 6, 48]} />
                  <meshStandardMaterial color={colors.dark} />
                </mesh>
              ))}
              <mesh position={[0, piston - 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 1.31, 24]} />
                <meshStandardMaterial color={colors.steel} metalness={0.7} roughness={0.25} />
              </mesh>
            </group>
            <group position={[0, 0, -explode * 0.7]} onClick={select('cylinder')}>
              <mesh position={[0, 2.35, 0]} castShadow>
                <cylinderGeometry args={[0.73, 0.73, 1.95, 48, 1, true, Math.PI / 2, Math.PI]} />
                <meshStandardMaterial
                  color={colors.steel}
                  side={2}
                  metalness={0.45}
                  roughness={0.4}
                  emissive={glow('cylinder')}
                />
              </mesh>
              {[1.4, 3.3].map((y) => (
                <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.74, 0.055, 8, 48, Math.PI]} />
                  <meshStandardMaterial color="#d2d7d4" metalness={0.7} roughness={0.3} />
                </mesh>
              ))}
            </group>
            <mesh position={[0, piston + 0.3 + gasHeight / 2, 0]}>
              <cylinderGeometry args={[0.6, 0.6, gasHeight, 32]} />
              <meshStandardMaterial
                color={strokeColors[k.strokeIndex]}
                transparent
                opacity={0.3}
                depthWrite={false}
                roughness={1}
              />
            </mesh>
            {(full || stage >= 2) && (
              <group onClick={select('crankshaft')}>
                <Rod start={[k.crankX, k.crankY, 0]} end={[0, piston, 0]} radius={0.14} />
                <mesh position={[k.crankX, k.crankY, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.23, 0.23, 1.04, 24]} />
                  <meshStandardMaterial color={colors.dark} metalness={0.65} roughness={0.3} />
                </mesh>
                <group rotation={[0, 0, -k.angle]}>
                  {[-0.48, 0.48].map((zz) => (
                    <group key={zz} position={[0, 0, zz]}>
                      <mesh position={[0, 0.32, 0]} castShadow>
                        <boxGeometry args={[0.4, 1.12, 0.18]} />
                        <meshStandardMaterial
                          color={colors.orange}
                          metalness={0.45}
                          roughness={0.3}
                          emissive={glow('crankshaft')}
                        />
                      </mesh>
                      <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.46, 0.46, 0.22, 32]} />
                        <meshStandardMaterial
                          color={colors.orange}
                          metalness={0.5}
                          roughness={0.3}
                        />
                      </mesh>
                    </group>
                  ))}
                </group>
              </group>
            )}
            {full && (
              <group position={[0, 3.42 + explode * 0.95, 0]} onClick={select('valves')}>
                <mesh castShadow>
                  <boxGeometry args={[1.76, 0.18, 1.46]} />
                  <meshStandardMaterial
                    color={colors.steel}
                    metalness={0.5}
                    roughness={0.35}
                    emissive={glow('valves')}
                  />
                </mesh>
                {[-0.38, 0.38].map((x, v) => (
                  <group key={x} position={[x, -(v === 0 ? k.intakeLift : k.exhaustLift), 0.1]}>
                    <mesh position={[0, -0.2, 0]}>
                      <cylinderGeometry args={[0.23, 0.23, 0.09, 24]} />
                      <meshStandardMaterial color={v === 0 ? colors.blue : colors.orange} />
                    </mesh>
                    <mesh position={[0, 0.18, 0]}>
                      <cylinderGeometry args={[0.045, 0.045, 0.78, 12]} />
                      <meshStandardMaterial color="#d5d9d6" metalness={0.6} roughness={0.25} />
                    </mesh>
                    {[0.12, 0.2, 0.28, 0.36, 0.44].map((y) => (
                      <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.11, 0.018, 6, 16]} />
                        <meshStandardMaterial color={colors.dark} />
                      </mesh>
                    ))}
                  </group>
                ))}
                {[-0.7, 0.7].flatMap((x) =>
                  [-0.55, 0.55].map((zz) => <Bolt key={`${x}:${zz}`} position={[x, 0.14, zz]} />),
                )}
                <mesh position={[0, 0.18, 0.45]}>
                  <cylinderGeometry args={[0.085, 0.085, 0.5, 6]} />
                  <meshStandardMaterial color="#fff9e9" />
                </mesh>
                {k.ignition && (
                  <mesh position={[0, -0.25, 0.35]}>
                    <sphereGeometry args={[0.12, 12, 8]} />
                    <meshBasicMaterial color="#ffc53a" />
                  </mesh>
                )}
              </group>
            )}
          </group>
        );
      })}
      {(full || stage >= 2) && (
        <mesh rotation={[Math.PI / 2, 0, 0]} onClick={select('crankshaft')} castShadow>
          <cylinderGeometry args={[0.18, 0.18, count * 1.8 + 1.9, 32]} />
          <meshStandardMaterial color={colors.dark} metalness={0.7} roughness={0.3} />
        </mesh>
      )}
      {full && (
        <group
          position={[0, 4.17 + explode * 0.95, 0]}
          rotation={[0, 0, (-phase * Math.PI) / 360]}
          onClick={select('valves')}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, count * 1.8, 24]} />
            <meshStandardMaterial color={colors.dark} metalness={0.7} roughness={0.3} />
          </mesh>
          {Array.from({ length: count }, (_, i) => (
            <group key={i} position={[0, 0, (i - (count - 1) / 2) * 1.8]}>
              <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.22, 0.22, 0.19, 24]} />
                <meshStandardMaterial color={colors.steel} metalness={0.6} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.22, 0.11]}>
                <sphereGeometry args={[0.04, 8, 6]} />
                <meshBasicMaterial color="white" />
              </mesh>
            </group>
          ))}
        </group>
      )}
      {full && (
        <group
          position={[0, 0, -count * 0.9 - 0.3 - explode * 0.8]}
          rotation={[0, 0, (-phase * Math.PI) / 180]}
          onClick={select('flywheel')}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.97, 0.97, 0.2, 64]} />
            <meshStandardMaterial
              color={colors.dark}
              metalness={0.65}
              roughness={0.3}
              emissive={glow('flywheel')}
            />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <torusGeometry args={[0.76, 0.045, 8, 48]} />
            <meshStandardMaterial color={colors.steel} metalness={0.65} roughness={0.3} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <Bolt
              key={n}
              position={[
                0.53 * Math.cos((n * Math.PI) / 3),
                0.53 * Math.sin((n * Math.PI) / 3),
                0.14,
              ]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          ))}
        </group>
      )}
    </group>
  );
}
