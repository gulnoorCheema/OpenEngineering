import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  Expand,
  Share2,
  Check,
  Rotate3D,
} from 'lucide-react';
import { defaultControls, readState, shareQuery, type Exhibit, type Vec3 } from '../lib/exhibit';
import { mod } from '../lib/mechanics';
import { track } from '../lib/analytics';
import { path } from '../lib/paths';
import Readout from './Readout';
const Viewport = lazy(() => import('./SceneViewport'));
export default function ExhibitPlayer({ exhibit }: { exhibit: Exhibit }) {
  const [step, setStep] = useState(0),
    [mode, setMode] = useState<'story' | 'explore'>('story'),
    [phase, setPhase] = useState(exhibit.steps[0].phase),
    [playing, setPlaying] = useState(false),
    [explode, setExplode] = useState(0),
    [controls, setControls] = useState({
      ...defaultControls(exhibit),
      ...exhibit.steps[0].defaults,
    }),
    [selected, setSelected] = useState(''),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [mounted, setMounted] = useState(false),
    [view, setView] = useState(0),
    [revision, setRevision] = useState(0),
    [shared, setShared] = useState(false),
    [shareLink, setShareLink] = useState(''),
    [completed, setCompleted] = useState(false),
    [visible, setVisible] = useState(true);
  const root = useRef<HTMLElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    started = useRef(false),
    observed = useRef(new Set<number>()),
    inView = useRef(true);
  const story = exhibit.steps[step],
    part = exhibit.parts.find((p) => p.id === selected);
  const preset: Vec3 = view === 1 ? [0, 1, 12] : view === 2 ? [-7, 4, -11] : story.camera;
  useEffect(() => {
    const restore = () => {
      const s = readState(location.search, exhibit);
      setStep(s.step);
      setMode(s.mode);
      setPhase(s.phase);
      setExplode(s.explode);
      setControls(s.controls);
      setView(0);
      setPlaying(false);
    };
    restore();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (!reduced.matches && !new URLSearchParams(location.search).has('phase')) setPlaying(true);
    if (new URLSearchParams(location.search).get('view') === 'text') setFailed(true);
    const reduce = () => {
      if (reduced.matches) setPlaying(false);
    };
    reduced.addEventListener('change', reduce);
    setMounted(true);
    window.addEventListener('popstate', restore);
    const visibility = () => setVisible(!document.hidden && inView.current);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(
      (entries) => {
        inView.current = entries[0].isIntersecting;
        setVisible(inView.current && !document.hidden);
      },
      { threshold: 0.05 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      reduced.removeEventListener('change', reduce);
      window.removeEventListener('popstate', restore);
      document.removeEventListener('visibilitychange', visibility);
      observer.disconnect();
    };
  }, [exhibit]);
  useEffect(() => {
    if (!mounted) return;
    observed.current.add(step);
  }, [step, mounted]);
  useEffect(() => {
    if (!playing || !visible || failed || !ready) return;
    let frame: number,
      last = performance.now(),
      accum = 0;
    const tick = (now: number) => {
      accum += Math.min(now - last, 100);
      last = now;
      if (accum >= 1000 / 30) {
        const delta = accum;
        accum = 0;
        setPhase((p) => p + (delta / 1000) * exhibit.speed * (controls.speed || 1));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, visible, failed, ready, controls.speed, exhibit.speed]);
  const writeUrl = (i: number, m = mode, nextControls = controls) => {
    const url = new URL(location.href);
    url.search = shareQuery(exhibit, i, m, exhibit.steps[i].phase, explode, nextControls);
    history.pushState(null, '', url);
  };
  const go = (i: number) => {
    setStep(i);
    setPhase(exhibit.steps[i].phase);
    setControls((c) => ({ ...c, ...exhibit.steps[i].defaults }));
    setSelected('');
    setView(0);
    setCompleted(false);
    setRevision((n) => n + 1);
    writeUrl(i, mode, { ...controls, ...exhibit.steps[i].defaults });
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  };
  const change = (id: string, n: number) => {
    setControls((c) => ({ ...c, [id]: n }));
    track('experiment_change', { exhibit: exhibit.id, control: id });
  };
  const scrub = (n: number) => {
    setPlaying(false);
    setPhase(n);
    track('experiment_change', { exhibit: exhibit.id, control: 'cycle' });
  };
  const reset = () => {
    setPhase(story.phase);
    setControls({ ...defaultControls(exhibit), ...story.defaults });
    setExplode(0);
    setSelected('');
    setView(0);
    setRevision((n) => n + 1);
    setPlaying(false);
    setCompleted(false);
    setShared(false);
    setShareLink('');
  };
  const share = async () => {
    const url = new URL(location.href);
    url.search = shareQuery(exhibit, step, mode, phase, explode, controls);
    setShareLink(url.href);
    history.replaceState(null, '', url);
    try {
      await navigator.clipboard.writeText(url.href);
      setShared(true);
    } catch {
      setShared(false);
    }
    track('share', { exhibit: exhibit.id });
  };
  const visibleControls = exhibit.controls.filter(
    (c) => mode === 'explore' || story.controls.includes(c.id),
  );
  return (
    <section className="exhibit-wrap" ref={root} data-exhibit={exhibit.id}>
      <div className="exhibit-title">
        <div>
          <div className="eyebrow">
            <span className="orange-line" />
            EXHIBIT {exhibit.number} / THE MECHANICS OF MOTION
          </div>
          <h1>
            {exhibit.title}
            <span className="title-period">.</span>
          </h1>
          <p>{exhibit.subtitle}</p>
        </div>
        <span className="duration">
          {exhibit.steps.length} chapters <span>·</span>
          {exhibit.duration} of curiosity
        </span>
      </div>
      <div className="exhibit-shell">
        <div className="scene-column">
          <div className="scene-toolbar">
            <span className="mono">
              {exhibit.number} — {exhibit.id === 'gears' ? 'GEAR' : exhibit.id.toUpperCase()} STUDY
            </span>
            <button
              aria-pressed={!!explode}
              onClick={() => {
                setExplode(explode ? 0 : 1);
                track('experiment_change', { exhibit: exhibit.id, control: 'explode' });
              }}
            >
              <Expand size={16} />
              {explode ? 'Assemble' : 'Take apart'}
            </button>
          </div>
          <div
            className="scene-canvas"
            role="group"
            aria-label={`Interactive 3D ${exhibit.title}. Rotate by dragging. All parts and controls are also available below.`}
          >
            {mounted && !failed ? (
              <Suspense fallback={<div className="scene-loading">Opening the exhibit…</div>}>
                <Viewport
                  scene={exhibit.scene}
                  phase={phase}
                  explode={explode}
                  controls={controls}
                  stage={mode === 'explore' ? 99 : step}
                  selected={selected || (mode === 'story' ? story.parts[0] : '')}
                  onSelect={setSelected}
                  position={preset}
                  revision={revision}
                  onError={() => {
                    setFailed(true);
                    setPlaying(false);
                  }}
                  onReady={() => {
                    setReady(true);
                    if (!started.current) {
                      started.current = true;
                      track('exhibit_start', { exhibit: exhibit.id });
                      performance.mark(`exhibit-ready:${exhibit.id}`);
                    }
                  }}
                />
              </Suspense>
            ) : (
              <div className="scene-loading">
                <div>
                  <span className="eyebrow">
                    {failed ? 'A DIFFERENT WAY IN' : 'A LITTLE CURIOSITY'}
                  </span>
                  <h2>{failed ? 'The story still works.' : 'Opening the exhibit…'}</h2>
                  <p>
                    {failed
                      ? '3D is unavailable in this view. Follow the chapters, try the calculated controls, or read the illustrated story below.'
                      : 'The model loads here. The full written story is available below.'}
                  </p>
                  <a href="#written-story" className="text-link">
                    Read the story <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="camera-controls">
            <span>Drag to rotate · Pinch to zoom</span>
            <button
              aria-label="Change camera view"
              onClick={() => {
                setView((view + 1) % 3);
                setRevision((n) => n + 1);
              }}
            >
              <Rotate3D size={15} />
              {['Perspective', 'Front view', 'Rear view'][view]}
            </button>
          </div>
          <Readout id={exhibit.id} phase={phase} controls={controls} onPhase={scrub} />
          <div className="playback">
            <button
              disabled={failed || !ready}
              aria-label={playing ? 'Pause animation' : 'Play animation'}
              onClick={() => setPlaying(!playing)}
              className="play-button"
            >
              {playing ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
            </button>
            <label className="sr-only" htmlFor={`cycle-${exhibit.id}`}>
              Cycle position in degrees
            </label>
            <input
              id={`cycle-${exhibit.id}`}
              type="range"
              min="0"
              max={exhibit.period}
              step="1"
              value={phase === exhibit.period ? phase : mod(phase, exhibit.period)}
              onChange={(e) => scrub(Number(e.target.value))}
            />
            <output className="mono">
              {Math.round(phase === exhibit.period ? phase : mod(phase, exhibit.period))}°
            </output>
            <button aria-label="Reset exhibit" onClick={reset}>
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
        <aside className="story-panel">
          <div className="story-mode">
            <button
              className={mode === 'story' ? 'active' : ''}
              aria-pressed={mode === 'story'}
              onClick={() => {
                setMode('story');
                writeUrl(step, 'story');
              }}
            >
              Follow the story
            </button>
            <button
              className={mode === 'explore' ? 'active' : ''}
              aria-pressed={mode === 'explore'}
              onClick={() => {
                setMode('explore');
                writeUrl(step, 'explore');
              }}
            >
              Explore freely
            </button>
          </div>
          <div className="chapter-eyebrow">
            <span>{mode === 'story' ? story.label : 'YOUR OWN CURIOSITY'}</span>
            <span>
              {String(step + 1).padStart(2, '0')} / {String(exhibit.steps.length).padStart(2, '0')}
            </span>
          </div>
          <h2 ref={heading} tabIndex={-1}>
            {mode === 'story' ? story.title : exhibit.question}
          </h2>
          <p>
            {mode === 'story'
              ? story.body
              : 'Turn it around. Pull it apart. Change one thing and see what follows. Select a part to find out what it does.'}
          </p>
          {mode === 'story' && <p>{story.why}</p>}
          <div className="try-this">
            <span className="eyebrow">A LITTLE EXPERIMENT</span>
            <p>
              {mode === 'story'
                ? story.experiment
                : 'Try the controls below, or pause the motion and drag the cycle slider. The mechanism is yours to explore.'}
            </p>
          </div>
          <div className="experiment-controls">
            {visibleControls.map((c) => (
              <label className="control" key={c.id}>
                <span>
                  {c.label}
                  {c.kind === 'range' && (
                    <output>
                      {controls[c.id]} {c.unit}
                    </output>
                  )}
                </span>
                {c.kind === 'select' ? (
                  <select
                    value={controls[c.id]}
                    onChange={(e) => change(c.id, Number(e.target.value))}
                  >
                    {c.options!.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    aria-label={c.label}
                    type="range"
                    min={c.min}
                    max={c.max}
                    step={c.step}
                    value={controls[c.id]}
                    onChange={(e) => change(c.id, Number(e.target.value))}
                  />
                )}
              </label>
            ))}
          </div>
          <details className="deeper">
            <summary>
              Go deeper <span>+</span>
            </summary>
            <p>{story.deeper}</p>
            <p className="model-note">{exhibit.limitations}</p>
            <a className="text-link" href="#exhibit-sources">
              Sources & credits <ArrowRight size={14} />
            </a>
          </details>
          {mode === 'story' && (
            <>
              <div className="chapter-nav">
                <button
                  className="previous-chapter"
                  aria-label="Previous chapter"
                  disabled={step === 0}
                  onClick={() => go(step - 1)}
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  className="next-chapter"
                  onClick={() => {
                    if (step < exhibit.steps.length - 1) go(step + 1);
                    else {
                      setCompleted(true);
                      if (!completed && observed.current.size === exhibit.steps.length)
                        track('story_complete', { exhibit: exhibit.id });
                    }
                  }}
                >
                  {step === exhibit.steps.length - 1
                    ? 'Finish the story'
                    : step === 0
                      ? 'Let’s take a closer look'
                      : 'Next chapter'}
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="chapter-dots" aria-label="Chapters">
                {exhibit.steps.map((s, i) => (
                  <button
                    key={s.id}
                    aria-label={`Chapter ${i + 1}: ${s.title}`}
                    title={s.title}
                    aria-current={i === step ? 'step' : undefined}
                    className={i === step ? 'active' : ''}
                    onClick={() => go(i)}
                  >
                    <span />
                  </button>
                ))}
              </div>
            </>
          )}
          {completed && (
            <div className="completion" role="status">
              <strong>Now you know what’s going on inside.</strong>
              <p>Try explaining it to someone. Or follow your curiosity into another machine.</p>
              <a className="text-link" href={path('/#collection')}>
                Explore the collection <ArrowRight size={16} />
              </a>
            </div>
          )}
          <div className="share-row">
            <span>{exhibit.author}</span>
            <button onClick={share}>
              {shared ? <Check size={15} /> : <Share2 size={15} />}{' '}
              {shared ? 'Link copied' : 'Share this moment'}
            </button>
          </div>
          {shareLink && (
            <label className="share-link">
              Chapter link
              <input readOnly value={shareLink} onFocus={(e) => e.target.select()} />
            </label>
          )}
        </aside>
      </div>
      <div className="part-inspector">
        <span className="eyebrow">MEET THE PARTS</span>
        <div className="part-buttons">
          {exhibit.parts.map((p) => (
            <button
              key={p.id}
              aria-pressed={selected === p.id}
              onClick={() => setSelected(selected === p.id ? '' : p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
        {part && (
          <p role="status">
            <strong>{part.name}.</strong> {part.description}
          </p>
        )}
      </div>
      <div className="exhibit-caption">
        <span>
          <span className="orange-line" />A working explanation, one piece at a time.
        </span>
        <span>
          FREE TO EXPLORE <span className="caption-cross">+</span> OPEN SOURCE
        </span>
      </div>
    </section>
  );
}
