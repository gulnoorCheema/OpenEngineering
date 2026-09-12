import { smooth, type Point } from './sewing';
export const WATCH_TEETH = {
  escape: 15,
  escapePinion: 6,
  fourth: 96,
  fourthPinion: 10,
  third: 75,
  thirdPinion: 10,
  center: 80,
  centerPinion: 10,
  barrel: 60,
};
/** One 360° phase is one complete balance oscillation (two beats). */
export function watchState(phase: number, rate = 1) {
  const half = Math.floor(phase / 180),
    local = ((phase % 180) + 180) % 180;
  const release = smooth(65, 115, local),
    advance = ((half + release) * Math.PI) / 15;
  const fourth = (-advance * 6) / 96,
    third = (-fourth * 10) / 75,
    center = (-third * 10) / 80,
    barrel = (-center * 10) / 60;
  const sign = ((half % 2) + 2) % 2 === 0 ? 1 : -1;
  return {
    balance: Math.cos((phase * Math.PI) / 180) * 0.95,
    pallet: sign * (1 - 2 * release) * 0.14,
    escape: advance,
    fourth,
    third,
    center,
    barrel,
    minute: center,
    hour: center / 12,
    second: fourth,
    locked: local <= 65 || local >= 115,
    lockingSide: sign > 0 ? 'entry' : 'exit',
    frequency: 4 * rate,
    beatsPerSecond: 8 * rate,
    relativeRate: rate,
  };
}
export function hairSpring(phase: number): Point[] {
  const angle = watchState(phase).balance;
  return Array.from({ length: 129 }, (_, i) => {
    const t = i / 128,
      a = t * Math.PI * 12 + angle * (1 - t),
      r = 0.045 + 0.3 * t;
    return [0.585 + r * Math.cos(a), 1 + r * Math.sin(a), 0.85];
  });
}
