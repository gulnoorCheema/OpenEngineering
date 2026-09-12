import type { ThreeEvent } from '@react-three/fiber';
import { engineKinematics } from '../../lib/mechanics';
import type { SceneProps } from '../../lib/exhibit';
import { Bolt, Rod, colors } from './primitives';
const strokeColors = ['#6caaca','#cdc4ac','#f27c37','#979a99'];
export default function EngineModel({ phase, explode, controls, stage, selected, onSelect }: SceneProps) {
 const count = controls.cylinders === 4 ? 4 : 1;
 const full = stage === 0 || stage >= 3;
 const select = (id: string) => (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(id); };
 const glow = (id: string) => selected === id ? '#644315' : '#000000';
 return <group position={[0,-1.3,0]} scale={count === 4 ? .82 : 1}>
  {Array.from({length:count},(_,i) => {
   const k = engineKinematics(phase,i,count), z = (i-(count-1)/2)*1.8;
   const piston = k.pistonY, gasHeight = Math.max(.04,3.2-(piston+.3));
   return <group key={i} position={[0,0,z]}>
    <group onClick={select('piston')}>
     <mesh position={[0,piston,0]} castShadow><cylinderGeometry args={[.64,.6,.6,48]}/><meshStandardMaterial color={colors.gold} metalness={.55} roughness={.3} emissive={glow('piston')}/></mesh>
     {[.15,.23].map(y => <mesh key={y} position={[0,piston+y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.64,.022,6,48]}/><meshStandardMaterial color={colors.dark}/></mesh>)}
     <mesh position={[0,piston-.04,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.14,.14,1.31,24]}/><meshStandardMaterial color={colors.steel} metalness={.7} roughness={.25}/></mesh>
    </group>
    <group position={[0,0,-explode*.7]} onClick={select('cylinder')}>
     <mesh position={[0,2.35,0]} castShadow><cylinderGeometry args={[.73,.73,1.95,48,1,true,Math.PI/2,Math.PI]}/><meshStandardMaterial color={colors.steel} side={2} metalness={.45} roughness={.4} emissive={glow('cylinder')}/></mesh>
     {[1.4,3.3].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.74,.055,8,48,Math.PI]}/><meshStandardMaterial color="#d2d7d4" metalness={.7} roughness={.3}/></mesh>)}
    </group>
    <mesh position={[0,piston+.3+gasHeight/2,0]}><cylinderGeometry args={[.6,.6,gasHeight,32]}/><meshStandardMaterial color={strokeColors[k.strokeIndex]} transparent opacity={.3} depthWrite={false} roughness={1}/></mesh>
    {(full || stage >= 2) && <group onClick={select('crankshaft')}>
     <Rod start={[k.crankX,k.crankY,0]} end={[0,piston,0]} radius={.14}/>
     <mesh position={[k.crankX,k.crankY,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.23,.23,1.04,24]}/><meshStandardMaterial color={colors.dark} metalness={.65} roughness={.3}/></mesh>
     <group rotation={[0,0,-k.angle]}>
      {[-.48,.48].map(zz=><group key={zz} position={[0,0,zz]}><mesh position={[0,.32,0]} castShadow><boxGeometry args={[.4,1.12,.18]}/><meshStandardMaterial color={colors.orange} metalness={.45} roughness={.3} emissive={glow('crankshaft')}/></mesh><mesh position={[0,-.3,0]} rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.46,.46,.22,32]}/><meshStandardMaterial color={colors.orange} metalness={.5} roughness={.3}/></mesh></group>)}
     </group>
    </group>}
    {full && <group position={[0,3.42+explode*.95,0]} onClick={select('valves')}>
     <mesh castShadow><boxGeometry args={[1.76,.18,1.46]}/><meshStandardMaterial color={colors.steel} metalness={.5} roughness={.35} emissive={glow('valves')}/></mesh>
     {[-.38,.38].map((x,v)=><group key={x} position={[x,-(v===0?k.intakeLift:k.exhaustLift),.1]}>
      <mesh position={[0,-.2,0]}><cylinderGeometry args={[.23,.23,.09,24]}/><meshStandardMaterial color={v===0?colors.blue:colors.orange}/></mesh>
      <mesh position={[0,.18,0]}><cylinderGeometry args={[.045,.045,.78,12]}/><meshStandardMaterial color="#d5d9d6" metalness={.6} roughness={.25}/></mesh>
      {[.12,.2,.28,.36,.44].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.11,.018,6,16]}/><meshStandardMaterial color={colors.dark}/></mesh>)}
     </group>)}
     {[-.7,.7].flatMap(x=>[-.55,.55].map(zz=><Bolt key={`${x}:${zz}`} position={[x,.14,zz]}/>))}
     <mesh position={[0,.18,.45]}><cylinderGeometry args={[.085,.085,.5,6]}/><meshStandardMaterial color="#fff9e9"/></mesh>
     {k.ignition && <mesh position={[0,-.25,.35]}><sphereGeometry args={[.12,12,8]}/><meshBasicMaterial color="#ffc53a"/></mesh>}
    </group>}
   </group>;
  })}
  {(full || stage>=2) && <mesh rotation={[Math.PI/2,0,0]} onClick={select('crankshaft')} castShadow><cylinderGeometry args={[.18,.18,count*1.8+1.9,32]}/><meshStandardMaterial color={colors.dark} metalness={.7} roughness={.3}/></mesh>}
  {full && <group position={[0,4.17+explode*.95,0]} rotation={[0,0,-phase*Math.PI/360]} onClick={select('valves')}>
   <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.1,.1,count*1.8,24]}/><meshStandardMaterial color={colors.dark} metalness={.7} roughness={.3}/></mesh>
   {Array.from({length:count},(_,i)=><group key={i} position={[0,0,(i-(count-1)/2)*1.8]}><mesh position={[0,.09,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.22,.22,.19,24]}/><meshStandardMaterial color={colors.steel} metalness={.6} roughness={.3}/></mesh><mesh position={[0,.22,.11]}><sphereGeometry args={[.04,8,6]}/><meshBasicMaterial color="white"/></mesh></group>)}
  </group>}
  {full && <group position={[0,0,-count*.9-.3-explode*.8]} rotation={[0,0,-phase*Math.PI/180]} onClick={select('flywheel')}>
   <mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.97,.97,.2,64]}/><meshStandardMaterial color={colors.dark} metalness={.65} roughness={.3} emissive={glow('flywheel')}/></mesh>
   <mesh position={[0,0,.12]}><torusGeometry args={[.76,.045,8,48]}/><meshStandardMaterial color={colors.steel} metalness={.65} roughness={.3}/></mesh>
   {[0,1,2,3,4,5].map(n=><Bolt key={n} position={[.53*Math.cos(n*Math.PI/3),.53*Math.sin(n*Math.PI/3),.14]} rotation={[Math.PI/2,0,0]}/>)}
  </group>}
 </group>;
}
