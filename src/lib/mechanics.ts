export const TAU = Math.PI * 2;
export const mod = (value: number, period: number) => ((value % period) + period) % period;
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
export type Stroke = 'Intake' | 'Compression' | 'Power' | 'Exhaust';
export const STROKES: Stroke[] = ['Intake', 'Compression', 'Power', 'Exhaust'];

// theta=0 is top dead center at the start of intake. A cycle is 4π radians.
export function engineKinematics(phase: number, cylinder = 0, cylinders = 1) {
  if (
    !Number.isFinite(phase) ||
    ![1, 4].includes(cylinders) ||
    !Number.isInteger(cylinder) ||
    cylinder < 0 ||
    cylinder >= cylinders
  )
    throw new RangeError('Invalid engine phase or cylinder');
  const offsets = [0, Math.PI, 3 * Math.PI, 2 * Math.PI]; // firing order 1–3–4–2
  const angle = (phase * Math.PI) / 180 + (cylinders === 4 ? offsets[cylinder] : 0);
  const cycle = mod(angle, 2 * TAU);
  const radius = 0.72;
  const rodLength = 2.08;
  const crankX = radius * Math.sin(angle);
  const crankY = radius * Math.cos(angle);
  const pistonY = crankY + Math.sqrt(rodLength ** 2 - crankX ** 2);
  const strokeIndex = Math.floor(cycle / Math.PI);
  const strokePhase = (cycle % Math.PI) / Math.PI;
  return {
    angle,
    cycle,
    crankX,
    crankY,
    pistonY,
    radius,
    rodLength,
    stroke: STROKES[strokeIndex],
    strokeIndex,
    strokePhase,
    intakeLift: strokeIndex === 0 ? Math.sin(strokePhase * Math.PI) * 0.3 : 0,
    exhaustLift: strokeIndex === 3 ? Math.sin(strokePhase * Math.PI) * 0.3 : 0,
    camAngle: angle / 2,
    ignition: cycle >= TAU && cycle < TAU + 0.25,
  };
}

export function gearKinematics(inputDegrees: number, driverTeeth: number, drivenTeeth: number) {
  if (
    !Number.isFinite(inputDegrees) ||
    ![driverTeeth, drivenTeeth].every((n) => Number.isInteger(n) && n > 0)
  )
    throw new RangeError('Gear tooth counts must be positive integers');
  const ratio = drivenTeeth / driverTeeth;
  return {
    inputAngle: (inputDegrees * Math.PI) / 180,
    outputAngle: (-inputDegrees * Math.PI) / 180 / ratio,
    ratio,
    speedRatio: 1 / ratio,
    torqueRatio: ratio,
  };
}

export function differentialKinematics(
  inputDegrees: number,
  turnRadius: number,
  direction: number,
  held = false,
) {
  if (
    ![inputDegrees, turnRadius, direction].every(Number.isFinite) ||
    turnRadius < 0 ||
    ![-1, 0, 1].includes(direction)
  )
    throw new RangeError('Invalid differential input');
  const trackWidth = 1.6;
  const split = held
    ? 1
    : turnRadius === 0
      ? 0
      : clamp(trackWidth / (2 * turnRadius), 0, 1) * direction;
  const carrier = (inputDegrees * Math.PI) / 180;
  return {
    carrier,
    left: carrier * (1 - split),
    right: carrier * (1 + split),
    leftRate: 1 - split,
    rightRate: 1 + split,
    pinionRelative: -split * carrier,
    // Opposing 12-tooth spiders mesh with 16-tooth side gears. Angles are
    // measured around the same carrier-local +Y axis, so their signs differ.
    spiderTop: -split * carrier * (16 / 12),
    spiderBottom: split * carrier * (16 / 12),
    split,
    trackWidth,
  };
}
