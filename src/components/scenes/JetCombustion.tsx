import { useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, DoubleSide } from 'three';
import type { SceneProps } from '../../lib/exhibit';
/** An illustrative luminous volume, confined to the annular combustion chamber. */
export default function JetCombustion({ p }: { p: SceneProps }) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: { phase: { value: 0 } },
        vertexShader:
          'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: `varying vec2 vUv;uniform float phase;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      void main(){vec2 q=vec2(vUv.x*9.,vUv.y*3.-phase*.008);
      float n=noise(q)*.6+noise(q*2.3)*.28+noise(q*5.1)*.12;
      float edge=smoothstep(0.,.2,vUv.y)*(1.-smoothstep(.8,1.,vUv.y));
      vec3 color=mix(vec3(1.,.14,.008),vec3(1.,.66,.18),smoothstep(.25,.8,n));
      gl_FragColor=vec4(color*1.6,edge*(.2+n*.58));}`,
      }),
    [],
  );
  useFrame(() => {
    material.uniforms.phase.value = p.motion?.current.phase ?? p.phase;
  });
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={material}>
      <cylinderGeometry args={[0.53, 0.53, 0.84, 48, 1, true]} />
    </mesh>
  );
}
