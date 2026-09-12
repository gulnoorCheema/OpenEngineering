import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Component, Suspense, useEffect, useRef, type ReactNode, type ComponentRef } from 'react';
import type { SceneProps, Vec3 } from '../lib/exhibit';
import { scenes } from './scenes/registry';
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Camera({
  position,
  target,
  revision,
}: {
  position: Vec3;
  target: Vec3;
  revision: number;
}) {
  const { camera } = useThree(),
    orbit = useRef<ComponentRef<typeof OrbitControls>>(null);
  useEffect(() => {
    camera.position.set(...position);
    orbit.current?.target.set(...target);
    orbit.current?.update();
  }, [position[0], position[1], position[2], target[1], revision]);
  return (
    <OrbitControls
      ref={orbit}
      target={target}
      enablePan={false}
      enableDamping={false}
      minDistance={5}
      maxDistance={22}
      maxPolarAngle={Math.PI * 0.85}
    />
  );
}
function SceneReady({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, []);
  return null;
}
function ContextLossGuard({ onError }: { onError: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onError);
    // R3F deliberately loses the old context when a scene is unmounted.
    // Only a loss while this viewport is mounted is a rendering failure.
    return () => canvas.removeEventListener('webglcontextlost', onError);
  }, [gl, onError]);
  return null;
}
export default function SceneViewport({
  scene,
  position,
  revision = 0,
  onError,
  onReady,
  onCanvas,
  ...props
}: SceneProps & {
  scene: string;
  position: Vec3;
  revision?: number;
  onError: () => void;
  onReady?: () => void;
  onCanvas?: (canvas: HTMLCanvasElement) => void;
}) {
  const Scene = scenes[scene as keyof typeof scenes];
  if (!Scene) return <p>Scene not registered. The written story is available below.</p>;
  const target: Vec3 = scene === 'engine' ? [0, 0.7, 0] : [0, 0, 0];
  return (
    <SceneBoundary onError={onError}>
      <Canvas
        shadows="percentage"
        dpr={[1, 1.5]}
        camera={{ position, fov: 36 }}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: false }}
        onCreated={({ gl }) => {
          onCanvas?.(gl.domElement);
        }}
      >
        <ContextLossGuard onError={onError} />
        <color attach="background" args={['#efeee8']} />
        <ambientLight intensity={1.7} />
        <directionalLight
          position={[4, 8, 7]}
          intensity={3.3}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 3, -5]} intensity={2} color="#c4d4df" />
        <Suspense fallback={null}>
          <Scene {...props} />
          <SceneReady onReady={onReady} />
        </Suspense>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, scene === 'engine' ? -2.38 : -2.9, 0]}
          receiveShadow
        >
          <planeGeometry args={[40, 40]} />
          <shadowMaterial transparent opacity={0.12} />
        </mesh>
        <Camera position={position} target={target} revision={revision} />
      </Canvas>
    </SceneBoundary>
  );
}
