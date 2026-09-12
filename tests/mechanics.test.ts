import test from 'node:test';
import assert from 'node:assert/strict';
import {
  engineKinematics as engine,
  gearKinematics as gear,
  differentialKinematics as differential,
} from '../src/lib/mechanics.ts';
const near = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);
test('slider crank preserves rod length throughout forward and reverse motion', () => {
  for (let angle = -720; angle <= 1440; angle += 3) {
    const k = engine(angle);
    near(Math.hypot(k.crankX, k.pistonY - k.crankY), 2.08);
    assert.ok(k.pistonY >= 1.36 - 1e-9 && k.pistonY <= 2.8 + 1e-9);
  }
  near(engine(0).pistonY - engine(180).pistonY, 1.44);
});
test('four strokes cover 720 degrees and valves follow their own stroke', () => {
  assert.deepEqual(
    [90, 270, 450, 630].map((a) => engine(a).stroke),
    ['Intake', 'Compression', 'Power', 'Exhaust'],
  );
  for (let a = 0; a < 720; a += 5) {
    const k = engine(a);
    assert.equal(k.intakeLift > 0, k.stroke === 'Intake' && a % 180 !== 0);
    assert.equal(k.exhaustLift > 0, k.stroke === 'Exhaust' && a % 180 !== 0);
    near(k.camAngle, k.angle / 2);
  }
  assert.equal(engine(360).ignition, true);
  assert.equal(engine(720).stroke, 'Intake');
  near(engine(720).pistonY, engine(0).pistonY);
});
test('four-cylinder firing sequence is 1–3–4–2 with no power-stroke gap', () => {
  const firing = [361, 541, 721, 901].map(
    (a) => [0, 1, 2, 3].find((i) => engine(a, i, 4).stroke === 'Power')! + 1,
  );
  assert.deepEqual(firing, [1, 3, 4, 2]);
  for (let a = 1; a < 721; a += 5)
    assert.equal([0, 1, 2, 3].filter((i) => engine(a, i, 4).stroke === 'Power').length, 1);
});
test('gears preserve pitch motion and ideal power across unequal pairs', () => {
  for (const [n1, n2] of [
    [16, 16],
    [16, 32],
    [16, 48],
    [32, 16],
    [20, 30],
  ])
    for (const a of [-720, -90, 0, 90, 360, 1080]) {
      const k = gear(a, n1, n2);
      near(k.inputAngle * n1 + k.outputAngle * n2, 0);
      near(k.speedRatio * k.torqueRatio, 1);
    }
  near(gear(360, 16, 32).outputAngle, -Math.PI);
  near(gear(360, 32, 16).outputAngle, -4 * Math.PI);
});
test('differential conserves mean speed and angle in both directions', () => {
  for (const radius of [2, 3.5, 4, 8, 12])
    for (const dir of [-1, 0, 1])
      for (const a of [-180, 0, 45, 360, 1440]) {
        const k = differential(a, radius, dir);
        near((k.leftRate + k.rightRate) / 2, 1);
        near((k.left + k.right) / 2, k.carrier);
        if (dir === 0) near(k.pinionRelative, 0);
      }
  const left = differential(180, 4, 1),
    right = differential(180, 4, -1);
  near(left.leftRate, 0.8);
  near(left.rightRate, 1.2);
  near(left.leftRate, right.rightRate);
  const held = differential(180, 4, 1, true);
  near(held.leftRate, 0);
  near(held.rightRate, 2);
  near(held.right, 2 * held.carrier);
});
test('invalid physical inputs fail instead of showing misleading numbers', () => {
  assert.throws(() => gear(0, 0, 16), RangeError);
  assert.throws(() => engine(NaN), RangeError);
  assert.throws(() => engine(0, 4, 4), RangeError);
  assert.throws(() => differential(0, -1, 1), RangeError);
});
