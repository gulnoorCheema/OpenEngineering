import {useEffect,useState} from 'react';
export default function CaptureTools(){
 const [enabled,setEnabled]=useState(false),[status,setStatus]=useState('Save gallery PNG'),[preview,setPreview]=useState('');
 useEffect(()=>setEnabled(new URLSearchParams(location.search).has('capture')),[]);
 if(!enabled)return null;
 async function capture(){
  setStatus('Rendering…');
  try{await document.fonts.ready;const node=document.querySelector<HTMLElement>('.exhibit-wrap, .editorial')!;const {toPng}=await import('html-to-image');const data=await toPng(node,{pixelRatio:1.5,backgroundColor:'#f7f5f0',cacheBust:false});const a=document.createElement('a');a.download=`openengineering-${node.dataset.exhibit||'contribution-kit'}-${innerWidth<761?'phone':'desktop'}.png`;a.href=data;a.click();setPreview(data);setStatus('PNG ready');}catch(e){setStatus('Capture failed — try Chrome');console.error(e);}
 }
 return <div className="capture-tools"><button onClick={capture}>{status}</button>{preview&&<details><summary>Preview / save image</summary><a href={preview} download="openengineering-gallery.png"><img src={preview} alt="Exported gallery capture" style={{width:180,maxHeight:260,objectFit:'contain',display:'block'}}/></a></details>}</div>;
}
