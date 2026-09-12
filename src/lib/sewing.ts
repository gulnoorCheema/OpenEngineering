import { clamp } from './mechanics';
export const TAU = Math.PI * 2;
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
export type Point = [number, number, number];
export function sewingState(phase: number, length = 2) {
  const cycle = ((phase % 360) + 360) % 360;
  const angle = (cycle * Math.PI) / 180;
  const feed = smooth(305, 350, cycle);
  const pitch = length * 0.16;
  const loop = smooth(190, 280, cycle);
  const tighten = smooth(282, 320, cycle);
  return {
    cycle,
    needleY: 0.8 + 0.9 * Math.cos(angle),
    hookAngle:
      Math.PI * 0.76 +
      Math.atan2(0.38, 0.78) -
      Math.PI * 1.68 * loop * (1 - smooth(290, 355, cycle)),
    takeupY: 1.9 + 0.4 * Math.cos(angle - 0.25),
    feed,
    pitch,
    feedY:
      cycle >= 300 && cycle <= 355 ? 0.53 + 0.085 * Math.sin((Math.PI * (cycle - 300)) / 55) : 0.46,
    feedZ: pitch * (feed - smooth(355, 360, cycle)),
    fabricZ: (Math.floor(phase / 360) + feed) * pitch,
    loop,
    tighten,
    stage:
      cycle < 175 ? 0 : cycle < 205 ? 1 : cycle < 260 ? 2 : cycle < 290 ? 3 : cycle < 305 ? 4 : 5,
    captured: cycle >= 195 && cycle < 285,
  };
}
/** A staged, continuous pair of loop legs around opposite faces of the bobbin case.
 * It is a taught thread path, not a cloth or friction simulation. */
export function sewingThread(phase: number): Point[] {
  const k = sewingState(phase),
    eye: Point = [-0.64, k.needleY + 0.08, 0];
  const points: Point[] = [[-1.45, 2.05, 0.12], [-0.64, k.takeupY, 0.12], eye];
  const extent = k.loop;
  const opening = smooth(180, 195, k.cycle) * (1 - k.tighten);
  const slip = smooth(278, 294, k.cycle);
  const start = Math.PI * 0.76;
  const count = 36;
  for (const direction of [1, -1]) {
    for (let i = 0; i <= count; i++) {
      const t = direction === 1 ? i / count : 1 - i / count;
      const a = start - Math.PI * 1.68 * t * extent;
      const z = direction === 1 ? 0.43 : -0.43 + 0.93 * slip;
      const x = 0.77 * Math.cos(a),
        y = -0.7 + 0.77 * Math.sin(a);
      points.push([eye[0] + (x - eye[0]) * opening, eye[1] + (y - eye[1]) * opening, z * opening]);
    }
  }
  points.push(eye, [-0.64, 0.55, 0], [-0.64, 0.55, -0.7]);
  return points;
}
