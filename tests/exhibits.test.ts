import test from 'node:test';
import assert from 'node:assert/strict';
import {exhibits} from '../src/content/exhibits/index.ts';
import {readState,shareQuery} from '../src/lib/exhibit.ts';
test('every exhibit has usable chapters, source credits and valid control references',()=>{
 const ids=new Set<string>();
 for(const e of exhibits){assert.ok(!ids.has(e.id));ids.add(e.id);assert.ok(e.sources.length&&e.assetCredits&&e.limitations);assert.equal(new Set(e.steps.map(s=>s.id)).size,e.steps.length);
 for(const s of e.steps){assert.ok(s.body&&s.why&&s.experiment&&s.deeper);assert.ok(s.phase>=0&&s.phase<=e.period);for(const c of s.controls)assert.ok(e.controls.some(x=>x.id===c));for(const p of s.parts)assert.ok(e.parts.some(x=>x.id===p));}}
});
test('share links round-trip a chapter, experiment, camera-independent state and backwards scrub',()=>{
 for(const e of exhibits){const i=e.steps.length-1,state=readState(`chapter=${e.steps[i].id}`,e);const q=shareQuery(e,i,'explore',37,1,state.controls);const restored=readState(q,e);assert.equal(restored.step,i);assert.equal(restored.mode,'explore');assert.equal(restored.phase,37);assert.equal(restored.explode,1);assert.deepEqual(restored.controls,state.controls);}
});
test('untrusted URL parameters cannot insert unsupported controls or NaN',()=>{
 const e=exhibits.find(e=>e.id==='differential')!,s=readState('chapter=missing&phase=NaN&radius=-100&direction=900&held=NaN&injected=3',e);
 assert.equal(s.step,0);assert.equal(s.phase,e.steps[0].phase);assert.equal(s.controls.radius,2);assert.equal(s.controls.direction,1);assert.equal(s.controls.held,0);assert.ok(!('injected' in s.controls));
});
test('chapter defaults restore the four-cylinder comparison and held differential',()=>{assert.equal(readState('chapter=share-the-work',exhibits.find(e=>e.id==='engine')!).controls.cylinders,4);assert.equal(readState('chapter=hold-one-side',exhibits.find(e=>e.id==='differential')!).controls.held,1);assert.equal(readState('chapter=hold-one-side&held=0',exhibits.find(e=>e.id==='differential')!).controls.held,0);});
