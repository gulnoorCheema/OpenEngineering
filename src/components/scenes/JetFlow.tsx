import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { CatmullRomCurve3, Color, ShaderMaterial, TubeGeometry, Vector3, DoubleSide } from 'three';
import type { SceneProps } from '../../lib/exhibit';
import { jetFlowRadius } from '../../lib/jet';

/** Static path geometry, moving phase-derived light: scrubbing has no particle history. */
function Stream({ angle, core, p }: { angle: number; core: boolean; p: SceneProps }) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 35 }, (_, i) => {
      const t = i / 34,
        x = -4.6 + t * 9.1;
      const r = jetFlowRadius(x, core) + (core ? 0 : 0.16 * Math.max(0, Math.abs(x) - 3));
      return new Vector3(x, Math.sin(angle) * r, Math.cos(angle) * r);
    });
    return new TubeGeometry(
      new CatmullRomCurve3(points),
      p.quality === 'low' ? 48 : 88,
      core ? 0.018 : 0.028,
      5,
      false,
    );
  }, [angle, core, p.quality]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: {
          phase: { value: 0 },
          hot: { value: core ? 1 : 0 },
          cool: { value: new Color('#65d7ef') },
          warm: { value: new Color('#ff9b53') },
        },
        vertexShader:
          'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: `varying vec2 vUv; uniform float phase; uniform float hot; uniform vec3 cool; uniform vec3 warm;
      void main(){float t=vUv.x;float pulse=pow(.5+.5*cos((t*4.0-phase/360.0)*6.283185),10.0);
      float edge=smoothstep(0.0,.13,t)*(1.0-smoothstep(.87,1.0,t));
      float heat=hot*smoothstep(.49,.58,t); vec3 color=mix(cool,warm,heat);
      gl_FragColor=vec4(color*(1.0+pulse*.7),edge*(.035+pulse*.32)*pow(sin(vUv.y*3.14159),0.5));}`,
      }),
    [core],
  );
  useFrame(() => {
    material.uniforms.phase.value = p.motion?.current.phase ?? p.phase;
  });
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  return <mesh geometry={geometry} material={material} />;
}
export default function JetFlow({ p }: { p: SceneProps }) {
  const count = p.quality === 'low' ? 4 : 7;
  return (
    <group>
      {p.controls.flow !== 1 &&
        Array.from({ length: count }, (_, i) => (
          <Stream key={`b${i}`} angle={(i * Math.PI * 2) / count + 0.2} core={false} p={p} />
        ))}
      {p.controls.flow !== 2 &&
        Array.from({ length: 3 }, (_, i) => (
          <Stream key={`c${i}`} angle={(i * Math.PI * 2) / 3} core p={p} />
        ))}
    </group>
  );
}
