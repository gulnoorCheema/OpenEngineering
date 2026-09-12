import { sewingState } from '../lib/sewing';
import { jetState } from '../lib/jet';
import { watchState } from '../lib/watch';
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
  if (id === 'sewing-machine') {
    const k = sewingState(phase, controls.length);
    const labels = ['Needle down', 'Loop', 'Catch', 'Around bobbin', 'Tighten', 'Feed'];
    const moments = [100, 195, 225, 275, 302, 330];
    return (
      <div className="new-readout">
        <div className="mechanism-stages" aria-label="Jump to a stitch stage">
          {labels.map((label, i) => (
            <button key={label} aria-pressed={k.stage === i} onClick={() => onPhase(moments[i])}>
              {label}
            </button>
          ))}
        </div>
        <small>
          {controls.length} mm between stitches · one shaft turn per stitch · motion slowed
        </small>
      </div>
    );
  }
  if (id === 'jet-engine') {
    const k = jetState(phase, controls.bypass);
    return (
      <div className="metric-row">
        <div>
          <span>Core mass flow</span>
          <strong className="orange">{(k.coreFraction * 100).toFixed(1)}%</strong>
        </div>
        <div>
          <span>Bypass mass flow</span>
          <strong className="blue">{(k.bypassFraction * 100).toFixed(1)}%</strong>
        </div>
        <div>
          <span>Bypass : core</span>
          <strong>{controls.bypass}:1</strong>
        </div>
        <small>
          Mass-flow shares, not thrust shares. Same schematic geometry; illustrative speeds.
        </small>
      </div>
    );
  }
  if (id === 'mechanical-watch') {
    const k = watchState(phase, controls.rate);
    return (
      <div className="new-readout">
        <div className="metric-row">
          <div>
            <span>Balance</span>
            <strong>{k.frequency} Hz</strong>
          </div>
          <div>
            <span>Beats / second</span>
            <strong>{k.beatsPerSecond}</strong>
          </div>
          <div>
            <span>Ideal hand rate</span>
            <strong>{k.relativeRate.toFixed(2)}×</strong>
          </div>
        </div>
        <div className="mechanism-stages" aria-label="Jump to an escapement stage">
          {['Hold · entry', 'Release', 'Hold · exit', 'Return release'].map((label, i) => (
            <button key={label} onClick={() => onPhase([35, 95, 215, 275][i])}>
              {label}
            </button>
          ))}
        </div>
        <small>
          {k.locked ? 'Pallet holding' : 'Escape wheel advancing'} · two beats per oscillation ·
          animation slowed
        </small>
      </div>
    );
  }
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
