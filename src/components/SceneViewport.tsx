import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, Html } from '@react-three/drei';
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type ComponentRef,
} from 'react';
import { ACESFilmicToneMapping, MathUtils, PCFShadowMap, Vector3 } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Vector2 } from 'three';
import type { SceneProps, Vec3 } from '../lib/exhibit';
import type { MotionRef, Quality } from '../lib/presentation';
import { scenes } from './scenes/registry';
import { path } from '../lib/paths';
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
function Lifecycle({ onError, onReady }: { onError: () => void; onReady?: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    el.addEventListener('webglcontextlost', onError);
    return () => el.removeEventListener('webglcontextlost', onError);
  }, [gl, onError]);
  const readyFrames = useRef(0);
  useFrame(() => {
    if (readyFrames.current < 2 && ++readyFrames.current === 2) onReady?.();
  });
  return null;
}
function Camera({
  position,
  target,
  fov,
  minAspect = 0,
  revision,
  reduced,
  interactive,
}: {
  position: Vec3;
  target: Vec3;
  fov: number;
  minAspect?: number;
  revision: number;
  reduced: boolean;
  interactive: boolean;
}) {
  const { camera, gl, size } = useThree(),
    orbit = useRef<ComponentRef<typeof OrbitControls>>(null),
    manual = useRef(false),
    initial = useRef(true),
    dest = useMemo(() => new Vector3(), []),
    look = useMemo(() => new Vector3(), []);
  useEffect(() => {
    manual.current = false;
  }, [revision, position[0], position[1], position[2], target[0], target[1], target[2]]);
  useEffect(() => {
    gl.domElement.style.touchAction = interactive ? 'none' : 'pan-y';
  }, [interactive, gl]);
  useFrame((_, d) => {
    if (manual.current) return;
    dest.set(...position);
    look.set(...target);
    const a = reduced || initial.current ? 1 : 1 - Math.exp(-d * 6.5);
    camera.position.lerp(dest, a);
    if ('fov' in camera) {
      const fittedFov =
        (2 *
          Math.atan(
            Math.tan((fov * Math.PI) / 360) * Math.max(1, minAspect / (size.width / size.height)),
          ) *
          180) /
        Math.PI;
      camera.fov = MathUtils.lerp(camera.fov as number, fittedFov, a);
      camera.updateProjectionMatrix();
    }
    if (orbit.current) {
      orbit.current.target.lerp(look, a);
      orbit.current.update();
    } else camera.lookAt(look);
    initial.current = false;
  });
  return interactive ? (
    <OrbitControls
      ref={orbit}
      target={target}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.1}
      minDistance={5.8}
      maxDistance={19}
      maxPolarAngle={Math.PI * 0.83}
      onStart={() => {
        manual.current = true;
      }}
    />
  ) : null;
}
function AnimationDriver({ motion, onSlow }: { motion?: MotionRef; onSlow?: () => void }) {
  const elapsed = useRef(0),
    frames = useRef(0),
    warm = useRef(0);
  useFrame((_, delta) => {
    if (motion?.current.playing && motion.current.visible)
      motion.current.phase += Math.min(delta, 0.06) * motion.current.speed;
    warm.current += delta;
    if (warm.current < 3) return;
    elapsed.current += Math.min(delta, 0.15);
    frames.current++;
    if (elapsed.current > 3) {
      if (frames.current / elapsed.current < 27) onSlow?.();
      elapsed.current = 0;
      frames.current = 0;
    }
  });
  return null;
}
function RenderMetrics({ quality }: { quality: Quality }) {
  const elapsed = useRef(0),
    frames = useRef(0),
    first = useRef(0);
  useFrame(({ gl }, delta) => {
    frames.current++;
    elapsed.current += delta;
    if (!first.current && frames.current > 1) first.current = performance.now();
    if (elapsed.current >= 3) {
      window.dispatchEvent(
        new CustomEvent('oe-render-metrics', {
          detail: {
            fps: Math.round(frames.current / elapsed.current),
            readyMs: Math.round(first.current),
            triangles: gl.info.render.triangles,
            calls: gl.info.render.calls,
            quality,
          },
        }),
      );
      frames.current = 0;
      elapsed.current = 0;
    }
  });
  return null;
}
function Bloom() {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new Vector2(512, 512), 0.2, 0.45, 1.1));
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera]);
  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size]);
  useEffect(
    () => () => {
      composer.passes.forEach((p) => p.dispose());
      composer.dispose();
    },
    [composer],
  );
  useFrame((_, d) => composer.render(d), 1);
  return null;
}
export default function SceneViewport({
  scene,
  position,
  revision = 0,
  target: customTarget,
  fov = 34,
  minAspect,
  reduced = false,
  interactive = true,
  onError,
  onReady,
  onCanvas,
  onSlow,
  annotation,
  ...props
}: SceneProps & {
  scene: string;
  position: Vec3;
  target?: Vec3;
  fov?: number;
  minAspect?: number;
  revision?: number;
  reduced?: boolean;
  interactive?: boolean;
  onError: () => void;
  onReady?: () => void;
  onCanvas?: (canvas: HTMLCanvasElement) => void;
  onSlow?: () => void;
  annotation?: { text: string; anchor: Vec3 };
}) {
  const Scene = scenes[scene as keyof typeof scenes],
    quality: Quality = props.quality || 'high',
    target: Vec3 = customTarget || (scene === 'engine' ? [0, 0.6, 0] : [0, 0, 0]);
  if (!Scene) return <p>Scene not registered. The written story is available below.</p>;
  return (
    <SceneBoundary onError={onError}>
      <Canvas
        shadows={{ type: PCFShadowMap }}
        dpr={quality === 'low' ? 1 : [1, 1.5]}
        camera={{ position, fov }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: false,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        onCreated={({ gl }) => onCanvas?.(gl.domElement)}
      >
        <color attach="background" args={['#101719']} />
        <fog attach="fog" args={['#101719', 12, 30]} />
        <ambientLight intensity={0.32} />
        <directionalLight
          position={[3, 8, 5]}
          intensity={3.5}
          castShadow
          shadow-mapSize={quality === 'low' ? [512, 512] : [1024, 1024]}
          shadow-normalBias={0.025}
        />
        <directionalLight position={[-6, 3, -3]} color="#8cbac8" intensity={2.3} />
        <directionalLight position={[5, 1, -6]} color="#ff995a" intensity={1.9} />
        <Suspense fallback={null}>
          <Environment files={path('/environments/studio.hdr')} />
          <Scene {...props} reduced={reduced} />
          <Lifecycle onError={onError} onReady={onReady} />
          {typeof window !== 'undefined' && new URLSearchParams(location.search).has('capture') && (
            <RenderMetrics quality={quality} />
          )}

          {annotation && (
            <Html position={annotation.anchor} center style={{ pointerEvents: 'none' }}>
              <span className="scene-annotation">{annotation.text}</span>
            </Html>
          )}
        </Suspense>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, scene === 'engine' ? -2.42 : -2.25, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#030607" envMapIntensity={0.1} metalness={0} roughness={1} />
        </mesh>
        <Camera
          position={position}
          target={target}
          fov={fov}
          minAspect={minAspect}
          revision={revision}
          reduced={reduced}
          interactive={interactive}
        />
        <AnimationDriver motion={props.motion} onSlow={onSlow} />
        {quality === 'high' && props.effects !== false && <Bloom />}
      </Canvas>
    </SceneBoundary>
  );
}
