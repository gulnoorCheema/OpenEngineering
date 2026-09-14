import { exhibits } from '../content/exhibits';
import { defaultControls, animationSpeed, type Exhibit, type Controls, type Vec3 } from './exhibit';
export interface RecordingFrame {
  phase: number;
  controls: Controls;
  explode: number;
  position: Vec3;
  target?: Vec3;
  fov: number;
  caption: [string, string];
}
const captions: Record<string, [string, string][]> = {
  engine: [
    ['How does a push become rotation?', 'Burning fuel pushes the piston.'],
    ['A line becomes a circle.', 'The connecting rod links two different paths.'],
    ['One cycle. Four strokes.', 'Only the power stroke supplies combustion work.'],
    ['Share the pushes.', 'Four cylinders spread the power strokes.'],
  ],
  gears: [
    ['Make it stronger.', 'Watch what happens to speed.'],
    ['Twice the teeth.', 'Half the output speed.'],
    ['Three times the torque.', 'One third the speed, ideally.'],
    ['Try the opposite.', 'More speed trades away torque.'],
  ],
  differential: [
    ['One engine. Two wheels.', 'Why do they turn differently?'],
    ['The outer wheel goes farther.', 'The outputs can turn at different speeds.'],
    ['Small gears make the difference.', 'Their average still follows the carrier.'],
    ['Hold one output.', 'The other turns twice as fast.'],
  ],
  'sewing-machine': [
    ['A needle leaves a stitch.', 'But the whole needle never goes through.'],
    ['The secret is underneath.', 'A hook catches the rising needle’s loop.'],
    ['Two threads interlock.', 'The orange loop travels around the bobbin.'],
    ['One stitch, then a step.', 'The feed advances while the needle is clear.'],
  ],
  'jet-engine': [
    ['A river of air. A way to fly.', 'The fan accelerates air toward the rear.'],
    ['A fire inside the core.', 'Continuous combustion supplies energy to the turbines.'],
    ['Two shafts share the work.', 'One drives the core. The other drives the fan.'],
    ['Most air misses the fire.', 'Bypass ratio compares mass flow, not thrust.'],
  ],
  'mechanical-watch': [
    ['How does a spring keep time?', 'The mainspring supplies energy to a train of gears.'],
    ['First, stop the wheel.', 'The pallet holds the escape wheel between beats.'],
    ['Then release a little motion.', 'Two beats make one complete balance oscillation.'],
    ['The hands count the rhythm.', 'A fixed gear train runs faster at a higher balance rate.'],
  ],
};
export const recordingChoices = [
  ...exhibits.map((e) => ({ id: e.id, label: `${e.title} · 20s portrait` })),
  { id: 'demo', label: 'Original collection · 55s landscape' },
  { id: 'new-collection', label: 'New ways to wonder · 55s landscape' },
];
export const isLandscape = (id: string) => id === 'demo' || id === 'new-collection';
export function recordingSegment(choice: string, time: number) {
  const ids =
    choice === 'new-collection'
      ? ['sewing-machine', 'jet-engine', 'mechanical-watch']
      : ['engine', 'gears', 'differential'];
  const limits = choice === 'new-collection' ? [16, 32, 48] : [20, 35, 47];
  if (!isLandscape(choice)) return { id: choice, local: time, closing: false };
  const index = time < limits[0] ? 0 : time < limits[1] ? 1 : 2;
  const start = index === 0 ? 0 : limits[index - 1],
    duration = limits[index] - start;
  return {
    id: ids[index],
    local: Math.min(20, ((time - start) * 20) / duration),
    closing: time >= limits[2],
  };
}
export function recordingFrame(id: string, t: number): RecordingFrame {
  const exhibit = exhibits.find((e) => e.id === id);
  if (!exhibit) throw new Error(`Unknown recording exhibit: ${id}`);
  return exhibitRecordingFrame(exhibit, t);
}
/** New manifests get a usable default shot before an author adds custom direction. */
export function exhibitRecordingFrame(e: Exhibit, t: number): RecordingFrame {
  const id = e.id;
  t = Math.max(0, Math.min(20, t));
  const controls = defaultControls(e),
    section = Math.min(3, Math.floor(t / 5));
  let phase = t * animationSpeed(e, controls) + e.steps[0].phase,
    explode = 0;
  let position: Vec3 =
    e.presentation?.cameras?.overview ||
    (id === 'engine' ? [6, 3.5, 9] : id === 'gears' ? [0.6, 2.5, 9] : [6, 3.4, 9]);
  let target = e.presentation?.target;
  if (id === 'engine') {
    controls.cylinders = t >= 15 ? 4 : 1;
    if (t >= 15) position = [7.8, 4.2, 10.8];
  }
  if (id === 'gears') controls.ratio = [1, 2, 3, 0.5][section];
  if (id === 'differential') {
    controls.direction = t < 5 ? 0 : 1;
    controls.radius = t < 10 ? 5 : 2;
    controls.held = t >= 15 ? 1 : 0;
    explode = t >= 15 ? 0.45 : 0;
  }
  if (id === 'sewing-machine') {
    phase = t < 5 ? 100 + t * 45 : t < 15 ? 175 + (t - 5) * 14 : 305 + (t - 15) * 12;
    controls.length = t >= 15 ? 4 : 2;
    if (t >= 5 && t < 15) {
      position = [2, 0.5, 7];
      target = [-0.25, -0.25, 0];
    }
  }
  if (id === 'jet-engine') {
    controls.bypass = t >= 15 ? 10 : 5;
    controls.flow = t >= 5 && t < 15 ? 1 : 0;
    explode = t >= 10 && t < 15 ? 0.5 : 0;
  }
  if (id === 'mechanical-watch') {
    phase = t * 110;
    controls.rate = t >= 15 ? 1.25 : 1;
    if (t >= 5 && t < 15) {
      position = [1.3, 1.5, 6];
      target = [0.58, 0.45, 0.5];
    }
    if (t >= 15) phase = 1650 + (t - 15) * 137.5;
  }
  return {
    phase,
    controls,
    explode,
    position,
    target,
    fov: e.presentation?.fov || 34,
    caption: captions[id]?.[section] ?? [e.question, e.subtitle],
  };
}
