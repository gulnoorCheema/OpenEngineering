import type { Point } from './sewing';
export function jetState(phase: number, bypass = 5) {
  const a = (phase * Math.PI) / 180;
  return {
    lowShaft: a,
    fan: a,
    lowTurbine: a,
    highShaft: a * 2,
    compressor: a * 2,
    highTurbine: a * 2,
    stator: 0,
    coreFraction: 1 / (1 + bypass),
    bypassFraction: bypass / (1 + bypass),
  };
}
/** Keep core traces inside the tapered exhaust, and bypass traces outside the core. */
export function jetFlowRadius(x: number, core: boolean) {
  if (!core) return 1.2;
  return 0.39 - 0.19 * Math.max(0, Math.min(1, (x - 1.8) / 1.15));
}
export function jetFlow(
  phase: number,
  index: number,
  bypass: number,
  total = 132,
): { position: Point; core: boolean; hot: number } {
  const core = index < Math.round(total / (1 + bypass));
  const t = (((phase / 720 + index * 0.61803398875) % 1) + 1) % 1;
  const a = index * 2.39996323;
  const x = -3.45 + t * 6.9;
  const r = jetFlowRadius(x, core);
  return {
    position: [x, Math.sin(a) * r, Math.cos(a) * r],
    core,
    hot: core && x > -0.2 ? Math.min(1, (x + 0.2) * 2) : 0,
  };
}
