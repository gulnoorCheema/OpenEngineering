import test from 'node:test';
import assert from 'node:assert/strict';
import { engineEffects, seed } from '../src/lib/presentation';
import { readFileSync } from 'node:fs';
test('gas volume stays between the piston crown and cylinder head across reverse and multi-cylinder motion', () => {
  for (const count of [1, 4])
    for (let cylinder = 0; cylinder < count; cylinder++)
      for (let phase = -1440; phase <= 1440; phase += 3) {
        const k = engineEffects(phase, cylinder, count);
        assert.ok(k.chamberBottom >= 1.66);
        assert.ok(Math.abs(k.chamberBottom + k.chamberHeight - 3.2) < 1e-9);
        assert.ok(k.spark >= 0 && k.spark <= 1);
        if (k.spark > 0) assert.equal(k.strokeIndex, 2);
        if (k.flame > 0) assert.equal(k.strokeIndex, 2);
        if (k.intake > 0) assert.equal(k.strokeIndex, 0);
        if (k.exhaust > 0) assert.equal(k.strokeIndex, 3);
      }
});
test('seeking to an earlier moment gives exactly the same effects without particle history', () => {
  const before = engineEffects(367);
  for (let p = 367; p < 1300; p += 7) engineEffects(p);
  assert.deepEqual(engineEffects(367), before);
  assert.deepEqual(engineEffects(367 + 720).spark, before.spark);
  assert.ok(before.spark > 0.8);
  assert.equal(engineEffects(359).spark, 0);
  assert.equal(engineEffects(540).flame, 0);
  for (let i = 0; i < 200; i++) assert.ok(seed(i) >= 0 && seed(i) < 1);
});
test('the optimized model library contains named independently addressable teaching parts', () => {
  const bytes = readFileSync(new URL('../public/models/mechanical-parts.glb', import.meta.url));
  assert.equal(bytes.toString('utf8', 0, 4), 'glTF');
  const len = bytes.readUInt32LE(12);
  const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + len));
  const names = new Set(gltf.nodes.map((n: { name: string }) => n.name));
  for (const name of [
    'Piston',
    'ConnectingRod',
    'CrankWeb',
    'SparkPlug',
    'ValveSpring',
    'IntakePort',
    'ExhaustPort',
    'SideGear',
    'SpiderGear',
    'Gear16',
    'Gear32',
    'Gear48',
  ])
    assert.ok(names.has(name), name);
  assert.ok(gltf.extensionsUsed.includes('KHR_draco_mesh_compression'));
  assert.ok(bytes.length < 1500000, 'Model library exceeds the delivery budget');
});

// Compare tangential motion at the common pitch cone, not just output means.
test('opposing differential spiders roll with the side gears in both directions', async () => {
  const { differentialKinematics } = await import('../src/lib/mechanics');
  for (const phase of [-720, -77, 0, 91, 360, 950]) {
    for (const direction of [-1, 0, 1]) {
      for (const held of [false, true]) {
        const k = differentialKinematics(phase, 4, direction, held);
        const rightTravel = (k.right - k.carrier) * 0.76;
        assert.ok(Math.abs(k.spiderTop * 0.57 + rightTravel) < 1e-10);
        assert.ok(Math.abs(k.spiderBottom * 0.57 - rightTravel) < 1e-10);
      }
    }
  }
});
