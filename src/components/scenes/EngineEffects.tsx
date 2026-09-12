import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as T from 'three';
import { engineEffects, seed, type MotionRef } from '../../lib/presentation';
const vertex = `varying vec3 vPosition; void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragment = `varying vec3 vPosition; uniform float burn; uniform float density; uniform float stage; uniform float cycle; uniform vec3 tint; uniform vec3 localCamera; uniform float samples;
float noise(vec3 p){return sin(p.x*18.+sin(p.y*11.))*sin(p.y*21.+p.z*13.)*.5+.5;}
void main(){vec3 rd=normalize(vPosition-localCamera);vec3 t0=(vec3(-.6,-.5,-.6)-localCamera)/rd;vec3 t1=(vec3(.6,.5,.6)-localCamera)/rd;vec3 mn=min(t0,t1),mx=max(t0,t1);float near=max(max(mn.x,mn.y),mn.z);float far=min(min(mx.x,mx.y),mx.z);float stepSize=(far-max(near,0.))/samples;if(stepSize<=0.)discard;vec3 col=vec3(0.);float alpha=0.;
for(int i=0;i<24;i++){if(float(i)>=samples)break;vec3 p=localCamera+rd*(max(near,0.)+(float(i)+.5)*stepSize);float edge=1.-smoothstep(.45,.595,length(p.xz));float n=noise(p*2.+vec3(0.,cycle*.015,0.));float front=1.-smoothstep(burn-.15,burn+.08,.5-p.y);float a=edge*(.18+density*.50+n*.30)*stepSize;vec3 c=tint;if(stage>1.5&&stage<2.5){a*=front;c=mix(vec3(2.1,.12,.008),vec3(3.2,.82,.06),smoothstep(-.2,.5,p.y))*(.65+n*.7);a*=6.0;}float weight=(1.-alpha)*a;col+=c*weight;alpha+=weight;}if(alpha<.005)discard;gl_FragColor=vec4(col/max(alpha,.001),alpha);}`;
export default function EngineEffects({
  phase,
  motion,
  cylinder,
  count,
  low = false,
  enabled = true,
}: {
  phase: number;
  motion?: MotionRef;
  cylinder: number;
  count: number;
  low?: boolean;
  enabled?: boolean;
}) {
  const material = useRef<T.ShaderMaterial>(null);
  const gas = useRef<T.Mesh>(null),
    particles = useRef<T.Points>(null),
    spark = useRef<T.LineSegments>(null),
    light = useRef<T.PointLight>(null);
  const N = low ? 60 : 180;
  const { camera } = useThree();
  const localCamera = useMemo(() => new T.Vector3(), []);
  const { geometry, colors, positions, sparkGeometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(N * 3),
      colors = new Float32Array(N * 3),
      geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new T.BufferAttribute(colors, 3));
    const sparkGeometry = new T.BufferGeometry();
    sparkGeometry.setAttribute('position', new T.BufferAttribute(new Float32Array(36), 3));
    return {
      geometry,
      colors,
      positions,
      sparkGeometry,
      uniforms: {
        burn: { value: 0 },
        density: { value: 0.2 },
        stage: { value: 0 },
        cycle: { value: 0 },
        tint: { value: new T.Color('#68d5ea') },
        localCamera: { value: new T.Vector3() },
        samples: { value: low ? 12 : 24 },
      },
    };
  }, [N]);
  useEffect(
    () => () => {
      geometry.dispose();
      sparkGeometry.dispose();
    },
    [geometry, sparkGeometry],
  );
  useFrame(() => {
    const uniforms = material.current?.uniforms;
    if (!uniforms) return;
    const k = engineEffects(motion?.current.phase ?? phase, cylinder, count),
      p = k.cycleDegrees;
    if (gas.current) {
      gas.current.position.y = k.chamberBottom + k.chamberHeight / 2;
      gas.current.scale.y = k.chamberHeight;
      gas.current.visible = enabled;
      gas.current.updateWorldMatrix(true, false);
      localCamera.copy(camera.position);
      gas.current.worldToLocal(localCamera);
      uniforms.localCamera.value.copy(localCamera);
    }
    uniforms.burn.value = k.front;
    uniforms.density.value = k.density;
    uniforms.stage.value = k.strokeIndex;
    uniforms.cycle.value = p;
    uniforms.tint.value.set(
      k.strokeIndex === 3 ? '#c3a286' : k.strokeIndex === 1 ? '#a9dedc' : '#72d7e9',
    );
    const a = sparkGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 6; i++) {
      let t = i / 6,
        t2 = (i + 1) / 6;
      for (let j = 0; j < 2; j++) {
        let u = j ? t2 : t;
        a[i * 6 + j * 3] = 0.007 + u * 0.028 + Math.sin(u * 26 + p) * 0.014;
        a[i * 6 + j * 3 + 1] = 3.125 - u * 0.052;
        a[i * 6 + j * 3 + 2] = 0.006;
      }
    }
    sparkGeometry.attributes.position.needsUpdate = true;
    if (spark.current) spark.current.visible = enabled && k.spark > 0.02;
    if (light.current) {
      light.current.intensity = enabled ? k.flame * 0.9 + k.spark * 2.3 : 0;
      light.current.position.y = 3.08;
    }
    const c = uniforms.tint.value.clone();
    if (k.strokeIndex === 2) c.set('#ffb45d');
    for (let i = 0; i < N; i++) {
      let x = 0,
        y = 0,
        z = 0;
      const a = seed(i + 11) * Math.PI * 2,
        r = Math.sqrt(seed(i + 49)) * 0.56;
      const flow = i < N * 0.44;
      if (flow && (k.intake > 0.01 || k.exhaust > 0.01)) {
        const intake = k.strokeIndex === 0,
          s = intake ? -1 : 1;
        const travel = (seed(i + 7) + (intake ? k.strokePhase : 1 - k.strokePhase) * 2) % 1;
        const t = travel,
          swirl = Math.sin(t * 12 + seed(i) * 7) * 0.04;
        if (t < 0.62) {
          const q = t / 0.62;
          x = s * (1.6 * (1 - q) + 0.38 * q);
          y = 3.8 - 0.44 * q;
          z = -0.1 + swirl;
        } else {
          const q = (t - 0.62) / 0.38;
          x = s * 0.38 * (1 - q) + Math.cos(a) * r * q;
          y = 3.36 - (3.36 - k.chamberBottom - 0.04) * q;
          z = Math.sin(a) * r * q;
        }
      } else {
        x = Math.cos(a + p * 0.009) * r;
        y = k.chamberBottom + 0.02 + seed(i + 103) * (k.chamberHeight - 0.025);
        z = Math.sin(a + p * 0.009) * r;
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    if (particles.current) particles.current.visible = enabled;
  });
  return (
    <group>
      <mesh ref={gas} renderOrder={2}>
        <boxGeometry args={[1.2, 1, 1.2]} />
        <shaderMaterial
          ref={material}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={T.FrontSide}
        />
      </mesh>
      <points ref={particles} geometry={geometry} frustumCulled={false} renderOrder={3}>
        <pointsMaterial
          size={low ? 0.022 : 0.028}
          vertexColors
          transparent
          opacity={0.48}
          depthWrite={false}
          blending={T.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={spark} geometry={sparkGeometry}>
        <lineBasicMaterial color={[3, 2.6, 1.8]} toneMapped={false} />
      </lineSegments>
      <pointLight ref={light} color="#ff913c" distance={4} decay={2} />
    </group>
  );
}
