import type { SceneProps } from '../../lib/exhibit';
import { differentialKinematics } from '../../lib/mechanics';
import { Gear, Rod, colors } from './primitives';
function Bevel({color,radius=.76,teeth=16}:{color:string;radius?:number;teeth?:number}) {
 return <group><mesh castShadow><cylinderGeometry args={[radius*.63,radius,.32,48]}/><meshStandardMaterial color={color} metalness={.55} roughness={.3}/></mesh>{Array.from({length:teeth},(_,i)=>{const a=i/teeth*Math.PI*2;return <mesh key={i} position={[Math.sin(a)*radius*.85,0,Math.cos(a)*radius*.85]} rotation={[0,a,0]} castShadow><boxGeometry args={[.13,.34,.25]}/><meshStandardMaterial color={color} metalness={.55} roughness={.3}/></mesh>;})}<mesh position={[0,.2,radius*.35]}><sphereGeometry args={[.055,8,6]}/><meshBasicMaterial color="#fff8e7"/></mesh></group>;
}
export default function DifferentialScene({phase,explode,controls,onSelect,selected}:SceneProps) {
 const k=differentialKinematics(phase,controls.radius,controls.direction,controls.held===1);
 const side = (id:string)=> selected===id?'#f0ba6b':id==='left'?colors.orange:colors.blue;
 return <group>
  {[-1,1].map((s,i)=><group key={s} position={[s*(.86+explode*.55),0,0]} rotation={[i===0?k.left:k.right,0,0]} onClick={e=>{e.stopPropagation();onSelect(i===0?'left':'right');}}>
   <Rod start={[0,0,0]} end={[s*2.2,0,0]} radius={.13} color={colors.dark}/>
   <group rotation={[0,0,s*Math.PI/2]}><Bevel color={side(i===0?'left':'right')}/></group>
   <group position={[s*2.25,0,0]} rotation={[0,0,Math.PI/2]}>
    <mesh castShadow><cylinderGeometry args={[.85,.85,.32,48]}/><meshStandardMaterial color="#354048" roughness={.8}/></mesh>
    <mesh><cylinderGeometry args={[.49,.49,.35,32]}/><meshStandardMaterial color={i===0?colors.orange:colors.blue} metalness={.45} roughness={.3}/></mesh>
    <mesh position={[0,.2,.65]}><boxGeometry args={[.09,.02,.25]}/><meshBasicMaterial color="#fff8e7"/></mesh>
   </group>
  </group>)}
  <group rotation={[k.carrier,0,0]}>
   <group onClick={e=>{e.stopPropagation();onSelect('carrier');}}>
    <group position={[-1.26-explode*.85,0,0]} rotation={[0,Math.PI/2,0]}><Gear teeth={40} radius={1.43} depth={.2} color={colors.steel}/></group>
    {[0,Math.PI].map(a=><group key={a} rotation={[a,0,0]}><Rod start={[-1.28,1.16,0]} end={[1.24,1.16,0]} radius={.11} color={colors.ivory}/><Rod start={[1.24,1.16,0]} end={[1.24,-1.16,0]} radius={.1} color={colors.ivory}/></group>)}
   </group>
   <Rod start={[0,-1.15,0]} end={[0,1.15,0]} radius={.075}/>
   {[-1,1].map(s=><group key={s} position={[0,s*(.8+explode*.55),0]} rotation={[s<0?0:Math.PI,k.pinionRelative*.76/.51,0]} onClick={e=>{e.stopPropagation();onSelect('spider');}}><Bevel color={selected==='spider'?'#f4c778':colors.gold} radius={.51} teeth={12}/></group>)}
  </group>
 </group>;
}
