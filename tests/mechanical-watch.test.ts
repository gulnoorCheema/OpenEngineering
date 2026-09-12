import test from 'node:test';
import assert from 'node:assert/strict';
import { watchState, hairSpring, WATCH_TEETH as t } from '../src/lib/watch';
import { animationSpeed, defaultControls } from '../src/lib/exhibit';
import { mechanical_watch } from '../src/content/exhibits/mechanical-watch';
const near = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-10, `${a} != ${b}`);
test('watch escapement locks between two releases per oscillation', () => {
  for (const p of [-360, 0, 360]) {
    near(watchState(p + 40).escape, watchState(p + 60).escape);
    near(watchState(p + 120).escape, watchState(p + 200).escape);
    near(watchState(p + 360).escape - watchState(p).escape, (2 * Math.PI) / t.escape);
    assert.notEqual(watchState(p + 35).lockingSide, watchState(p + 215).lockingSide);
  }
});
test('watch gear train gives a 60-second fourth wheel at 4 Hz and exact hand ratios', () => {
  const k = watchState(360 * 4 * 60);
  near(k.fourth, -2 * Math.PI);
  near(k.center, k.fourth / 60);
  near(k.hour, k.center / 12);
  near(k.escape * t.escapePinion + k.fourth * t.fourth, 0);
  near(k.fourth * t.fourthPinion + k.third * t.third, 0);
  near(k.third * t.thirdPinion + k.center * t.center, 0);
  for (const rate of [0.75, 1, 1.25]) {
    const s = watchState(95, rate);
    near(s.frequency * 2, s.beatsPerSecond);
    near(s.relativeRate, s.frequency / 4);
    near(
      animationSpeed(mechanical_watch, { ...defaultControls(mechanical_watch), rate, speed: 0.5 }),
      72 * 0.5 * rate,
    );
  }
});
test('watch hairspring outer anchor stays fixed while inner end follows the balance', () => {
  const a = hairSpring(0),
    b = hairSpring(180);
  near(a[128][0], b[128][0]);
  near(a[128][1], b[128][1]);
  assert.notDeepEqual(a[0], b[0]);
  assert.deepEqual(hairSpring(20), hairSpring(20));
});
