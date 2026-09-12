import test from 'node:test';
import assert from 'node:assert/strict';
import { jetState, jetFlow } from '../src/lib/jet';
test('jet mass-flow shares and sampled flow partitions match each bypass ratio', () => {
  for (const b of [2, 5, 10]) {
    const k = jetState(73, b);
    assert.equal(k.coreFraction + k.bypassFraction, 1);
    assert.ok(Math.abs(k.bypassFraction / k.coreFraction - b) < 1e-12);
    for (const count of [66, 132]) {
      const samples = Array.from({ length: count }, (_, i) => jetFlow(-580, i, b, count));
      const core = samples.filter((x) => x.core).length;
      assert.equal((count - core) / core, b);
      for (const s of samples) {
        const r = Math.hypot(s.position[1], s.position[2]);
        assert.ok(s.core ? r < 0.6 : r > 1.1);
        assert.ok(s.core || s.hot === 0);
      }
    }
  }
});
test('jet shafts remain linked and stators remain fixed under reverse scrubbing', () => {
  for (const p of [-800, -20, 0, 700, 1440]) {
    const k = jetState(p);
    assert.equal(k.fan, k.lowTurbine);
    assert.equal(k.compressor, k.highTurbine);
    assert.equal(k.highShaft, 2 * k.lowShaft);
    assert.equal(k.stator, 0);
  }
  assert.deepEqual(jetFlow(500, 12, 5), jetFlow(500, 12, 5));
});
