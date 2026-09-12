import test from 'node:test';
import assert from 'node:assert/strict';
import { sewingState, sewingThread } from '../src/lib/sewing';
test('sewing feed occurs only with the needle clear and advances the selected distance', () => {
  for (const length of [1, 2, 4]) {
    for (let phase = -720; phase < 720; phase++) {
      const a = sewingState(phase, length),
        b = sewingState(phase + 0.01, length);
      if (b.fabricZ - a.fabricZ > 1e-8) assert.ok(a.needleY > 0.55);
    }
    assert.ok(
      Math.abs(sewingState(360, length).fabricZ - sewingState(0, length).fabricZ - length * 0.16) <
        1e-10,
    );
  }
  assert.ok(sewingState(195).captured);
  assert.ok(sewingState(196).needleY > sewingState(195).needleY);
});
test('sewing thread is phase-pure and stays outside the solid bobbin envelope', () => {
  const initial = sewingThread(270);
  sewingThread(340);
  sewingThread(-100);
  assert.deepEqual(sewingThread(270), initial);
  for (let p = -360; p <= 720; p += 2)
    for (const [x, y, z] of sewingThread(p)) {
      assert.ok([x, y, z].every(Number.isFinite));
      assert.ok(
        !(Math.hypot(x, y + 0.7) < 0.49 && Math.abs(z) < 0.24),
        `thread enters bobbin at ${p}`,
      );
    }
  assert.ok(sewingState(275).loop > 0.9);
  assert.equal(sewingState(330).tighten, 1);
});

test('thread and hook meet during capture and the thread path closes smoothly at the cycle boundary', () => {
  for (let phase = 200; phase <= 275; phase += 5) {
    const k = sewingState(phase),
      points = sewingThread(phase),
      tip = points[39];
    const angle = k.hookAngle - Math.atan2(0.38, 0.78);
    assert.ok(
      Math.abs(Math.atan2(tip[1] + 0.7, tip[0]) - Math.atan2(Math.sin(angle), Math.cos(angle))) <
        1e-8,
    );
  }
  const a = sewingThread(359.999),
    b = sewingThread(0);
  for (let i = 0; i < a.length; i++)
    assert.ok(Math.hypot(...a[i].map((v, j) => v - b[i][j])) < 1e-4);
});
