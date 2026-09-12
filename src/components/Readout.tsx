import { engineKinematics, differentialKinematics, STROKES } from '../lib/mechanics';
import type { Controls } from '../lib/exhibit';
export default function Readout({
  id,
  phase,
  controls,
  onPhase,
}: {
  id: string;
  phase: number;
  controls: Controls;
  onPhase: (n: number) => void;
}) {
  if (id === 'engine')
    return (
      <div className="engine-readout">
        <div className="stroke-row" aria-label="Jump to a stroke">
          {STROKES.map((s, i) => (
            <button
              key={s}
              className={`stroke stroke-${i} ${engineKinematics(phase).stroke === s ? 'current' : ''}`}
              onClick={() => onPhase(i * 180 + 90)}
              aria-pressed={engineKinematics(phase).stroke === s}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {s}
            </button>
          ))}
        </div>
        {controls.cylinders === 4 && (
          <div className="cylinder-row">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={engineKinematics(phase, i, 4).stroke === 'Power' ? 'firing' : ''}
              >
                Cyl {i + 1} <b>{engineKinematics(phase, i, 4).stroke}</b>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  if (id === 'gears')
    return (
      <div className="metric-row">
        <div>
          <span>Input speed</span>
          <strong className="orange">1.00×</strong>
        </div>
        <div>
          <span>Output speed</span>
          <strong className="blue">{(1 / controls.ratio).toFixed(2)}×</strong>
        </div>
        <div>
          <span>Ideal torque gain</span>
          <strong>{controls.ratio.toFixed(2)}×</strong>
        </div>
        <small>Output rotates in the opposite direction. Losses ignored.</small>
      </div>
    );
  if (id !== 'differential')
    return (
      <div className="metric-row">
        <small>Change a control and observe the mechanism.</small>
      </div>
    );
  const k = differentialKinematics(phase, controls.radius, controls.direction, controls.held === 1);
  return (
    <div className="metric-row">
      <div>
        <span>Left output</span>
        <strong className="orange">{k.leftRate.toFixed(2)}×</strong>
      </div>
      <div>
        <span>Carrier</span>
        <strong>1.00×</strong>
      </div>
      <div>
        <span>Right output</span>
        <strong className="blue">{k.rightRate.toFixed(2)}×</strong>
      </div>
      <small>
        ({k.leftRate.toFixed(2)} + {k.rightRate.toFixed(2)}) ÷ 2 = 1.00 · average speed stays the
        same
      </small>
    </div>
  );
}
