import { engineKinematics, clamp } from './mechanics';
export type Quality = 'high' | 'low';
export interface MotionClock {
  phase: number;
  playing: boolean;
  speed: number;
  visible: boolean;
}
export interface MotionRef {
  current: MotionClock;
}
/** All visual effects are phase functions: no accumulated particles or physics claims. */
export function engineEffects(phase: number, cylinder = 0, count = 1) {
  const k = engineKinematics(phase, cylinder, count);
  const cycle = (k.cycle * 180) / Math.PI;
  const burn = clamp((cycle - 360) / 72, 0, 1);
  return {
    ...k,
    cycleDegrees: cycle,
    spark: cycle >= 360 && cycle < 375 ? Math.sin(((cycle - 360) / 15) * Math.PI) : 0,
    flame: k.strokeIndex === 2 ? Math.sin(Math.PI * clamp((cycle - 360) / 180, 0, 1)) ** 0.65 : 0,
    front: burn,
    intake: k.strokeIndex === 0 ? Math.sin(k.strokePhase * Math.PI) : 0,
    exhaust: k.strokeIndex === 3 ? Math.sin(k.strokePhase * Math.PI) : 0,
    density:
      k.strokeIndex === 1
        ? 0.25 + 0.65 * k.strokePhase
        : k.strokeIndex === 0
          ? 0.18 + 0.12 * k.strokePhase
          : 0.25,
    chamberBottom: k.pistonY + 0.31,
    chamberHeight: Math.max(0.06, 3.2 - (k.pistonY + 0.31)),
  };
}
/** Stable pseudo-random coordinates for a visual sample. */
export function seed(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
