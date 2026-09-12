import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { recordingChoices, recordingSegment, recordingFrame } from '../src/lib/recordings';
import { exhibits } from '../src/content/exhibits';
test('each new model is separately compressed and contains semantic moving parts at finite bounds', () => {
  const expected: Record<string, string[]> = {
    'sewing-machine': ['Needle', 'Bobbin', 'ShuttleHook', 'FeedDogs', 'Takeup'],
    'jet-engine': ['JetFan', 'JetHighShaft', 'JetLowShaft', 'JetStator', 'JetCombustor'],
    'mechanical-watch': [
      'WatchEscape',
      'WatchPallet',
      'WatchBalance',
      'WatchMainspring',
      'WatchFourth',
    ],
  };
  for (const [id, names] of Object.entries(expected)) {
    const bytes = readFileSync(new URL(`../public/models/${id}.glb`, import.meta.url)),
      g = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
    assert.ok(bytes.length < 1000000, `${id} delivery budget`);
    assert.ok(g.extensionsUsed.includes('KHR_draco_mesh_compression'));
    for (const name of names)
      assert.ok(
        g.nodes.some((n: { name: string }) => n.name === name),
        name,
      );
    for (const a of g.accessors)
      if (a.min && a.type === 'VEC3') {
        assert.ok([...a.min, ...a.max].every(Number.isFinite));
        assert.ok([...a.min, ...a.max].every((v: number) => Math.abs(v) < 10));
      }
  }
});
test('recording definitions cover all six exhibits and both complete demo schedules', () => {
  for (const e of exhibits) {
    assert.ok(recordingChoices.some((c) => c.id === e.id));
    assert.deepEqual(recordingFrame(e.id, -0.01), recordingFrame(e.id, 0));
  }
  for (const choice of recordingChoices)
    for (let t = 0; t <= 55; t += 0.5) {
      const s = recordingSegment(choice.id, t),
        f = recordingFrame(s.id, s.local);
      assert.ok(Number.isFinite(f.phase));
      assert.equal(f.caption.length, 2);
      assert.ok(f.position.every(Number.isFinite));
    }
  assert.equal(recordingSegment('new-collection', 0).id, 'sewing-machine');
  assert.equal(recordingSegment('new-collection', 17).id, 'jet-engine');
  assert.equal(recordingSegment('new-collection', 33).id, 'mechanical-watch');
  assert.ok(recordingSegment('new-collection', 49).closing);
});
