import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Expand,
  Pause,
  Play,
  Rotate3D,
  RotateCcw,
  Share2,
  SlidersHorizontal,
} from 'lucide-react';
import { defaultControls, readState, shareQuery, type Exhibit, type Vec3 } from '../lib/exhibit';
import type { MotionClock } from '../lib/presentation';
import { track } from '../lib/analytics';
import { path } from '../lib/paths';
import Readout from './Readout';
const Viewport = lazy(() => import('./SceneViewport'));
export default function ExhibitPlayer({
  exhibit,
  home = false,
}: {
  exhibit: Exhibit;
  home?: boolean;
}) {
  const [step, setStep] = useState(0),
    [intro, setIntro] = useState(true),
    [mode, setMode] = useState<'story' | 'explore'>('story'),
    [controls, setControls] = useState(() => defaultControls(exhibit)),
    [phase, setPhase] = useState(exhibit.steps[0].phase),
    [playing, setPlaying] = useState(false),
    [explode, setExplode] = useState(0),
    [selected, setSelected] = useState(''),
    [view, setView] = useState(0),
    [revision, setRevision] = useState(0),
    [mounted, setMounted] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [reduced, setReduced] = useState(false),
    [touch, setTouch] = useState(false),
    [rotate, setRotate] = useState(false),
    [quality, setQuality] = useState('auto'),
    [autoLow, setAutoLow] = useState(false),
    [shareLink, setShareLink] = useState(''),
    [copied, setCopied] = useState(false),
    [finished, setFinished] = useState(false);
  const motion = useRef<MotionClock>({
      phase: exhibit.steps[0].phase,
      playing: false,
      speed: exhibit.speed,
      visible: true,
    }),
    root = useRef<HTMLElement>(null),
    suppressed = useRef(0),
    active = useRef(-1),
    inView = useRef(true),
    observed = useRef(new Set<number>()),
    started = useRef(false),
    state = useRef({ step, mode, controls, explode });
  state.current = { step, mode, controls, explode };
  motion.current.playing = playing && ready && !failed;
  motion.current.speed = exhibit.speed * (controls.speed || 1);
  const story = exhibit.steps[step],
    low = quality === 'low' || (quality === 'auto' && autoLow),
    part = exhibit.parts.find((p) => p.id === selected);
  const seek = useCallback((n: number) => {
    motion.current.phase = n;
    setPhase(n);
    setPlaying(false);
  }, []);
  const position: Vec3 =
    view === 1
      ? [0, 1, 11.5]
      : view === 2
        ? [-6, 3, -9]
        : intro || mode === 'explore'
          ? exhibit.id === 'engine'
            ? [6, 3.5, 9]
            : exhibit.id === 'gears'
              ? [0.6, 2.5, 9]
              : [6, 3.4, 9]
          : story.camera;
  const scrollToChapter = (i: number, behavior: ScrollBehavior = 'instant') => {
    suppressed.current = performance.now() + 1000;
    requestAnimationFrame(() =>
      document
        .getElementById(`chapter-${exhibit.id}-${exhibit.steps[i].id}`)
        ?.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : behavior }),
    );
  };
  const go = (i: number) => {
    const next = { ...defaultControls(exhibit), ...exhibit.steps[i].defaults };
    active.current = i;
    setStep(i);
    setIntro(false);
    setControls(next);
    motion.current.phase = exhibit.steps[i].phase;
    setPhase(motion.current.phase);
    setSelected('');
    setView(0);
    setRevision((v) => v + 1);
    observed.current.add(i);
    if (mode === 'story') scrollToChapter(i);
    const url = new URL(location.href);
    url.search = shareQuery(exhibit, i, mode, motion.current.phase, explode, next);
    history.pushState(null, '', url);
  };
  const switchMode = (next: 'story' | 'explore') => {
    setMode(next);
    setRotate(false);
    setShareLink('');
    suppressed.current = performance.now() + 1100;
    const url = new URL(location.href);
    url.search = shareQuery(exhibit, step, next, motion.current.phase, explode, controls);
    history.pushState(null, '', url);
    requestAnimationFrame(() => {
      if (next === 'story' && !intro) scrollToChapter(step, 'instant');
      else root.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  };
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)'),
      phone = matchMedia('(max-width: 700px)');
    setReduced(media.matches);
    setTouch(phone.matches);
    setAutoLow(innerWidth < 768);
    setMounted(true);
    const restore = () => {
      const s = readState(location.search, exhibit);
      suppressed.current = performance.now() + 1100;
      setStep(s.step);
      setMode(s.mode);
      setControls(s.controls);
      setExplode(s.explode);
      motion.current.phase = s.phase;
      setPhase(s.phase);
      setPlaying(false);
      setView(0);
      setRevision((v) => v + 1);
      const linked = new URLSearchParams(location.search).has('chapter');
      setIntro(!linked);
      active.current = linked ? s.step : -1;
      if (linked && s.mode === 'story') scrollToChapter(s.step, 'instant');
    };
    restore();
    if (!media.matches && !new URLSearchParams(location.search).has('phase')) setPlaying(true);
    if (new URLSearchParams(location.search).get('view') === 'text') setFailed(true);
    const reduce = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    const resize = () => {
      setTouch(phone.matches);
      setRotate(false);
    };
    media.addEventListener('change', reduce);
    phone.addEventListener('change', resize);
    window.addEventListener('popstate', restore);
    const visible = () => {
      motion.current.visible = inView.current && !document.hidden;
    };
    document.addEventListener('visibilitychange', visible);
    const previewReduced = () => {
      setReduced(true);
      setPlaying(false);
    };
    window.addEventListener('oe-preview-reduced-motion', previewReduced);
    const interval = setInterval(() => {
      if (motion.current.playing && motion.current.visible) setPhase(motion.current.phase);
    }, 100);
    return () => {
      clearInterval(interval);
      media.removeEventListener('change', reduce);
      phone.removeEventListener('change', resize);
      window.removeEventListener('popstate', restore);
      document.removeEventListener('visibilitychange', visible);
      window.removeEventListener('oe-preview-reduced-motion', previewReduced);
    };
  }, [exhibit]);
  useEffect(() => {
    if (!mounted) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (state.current.mode !== 'story' || performance.now() < suppressed.current) return;
      const items = root.current?.querySelectorAll<HTMLElement>('[data-story-index]');
      if (!items) return;
      const line = touch ? Math.max(innerHeight * 0.42, 380) + 95 : innerHeight * 0.43;
      let index = -1;
      items.forEach((el) => {
        if (el.getBoundingClientRect().top <= line) index = Number(el.dataset.storyIndex);
      });
      if (index === active.current) return;
      active.current = index;
      setIntro(index < 0);
      setRotate(false);
      setView(0);
      setRevision((v) => v + 1);
      if (index >= 0) {
        const next = { ...defaultControls(exhibit), ...exhibit.steps[index].defaults };
        setStep(index);
        setControls(next);
        setSelected('');
        observed.current.add(index);
        const url = new URL(location.href);
        url.search = shareQuery(
          exhibit,
          index,
          'story',
          motion.current.phase,
          state.current.explode,
          next,
        );
        history.replaceState(null, '', url);
      }
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', scroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', scroll);
      cancelAnimationFrame(frame);
    };
  }, [mounted, touch, exhibit]);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver((entries) => {
      inView.current = entries[0].isIntersecting;
      motion.current.visible = inView.current && !document.hidden;
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const reset = () => {
    seek(story.phase);
    setControls({ ...defaultControls(exhibit), ...story.defaults });
    setExplode(0);
    setSelected('');
    setView(0);
    setRevision((v) => v + 1);
    setShareLink('');
    setFinished(false);
  };
  const change = (id: string, n: number) => {
    setControls((c) => ({ ...c, [id]: n }));
    track('experiment_change', { exhibit: exhibit.id, control: id });
  };
  const share = async () => {
    const url = new URL(location.href);
    url.search = shareQuery(exhibit, step, mode, motion.current.phase, explode, controls);
    setShareLink(url.href);
    history.replaceState(null, '', url);
    try {
      await navigator.clipboard.writeText(url.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    track('share', { exhibit: exhibit.id });
  };
  const inputs = (ids?: string[]) =>
    exhibit.controls
      .filter((c) => !ids || ids.includes(c.id))
      .map((c) => (
        <label className="lab-control" key={c.id}>
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
              aria-label={c.label}
              value={controls[c.id]}
              onChange={(e) => change(c.id, Number(e.target.value))}
            >
              {c.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="range"
              aria-label={c.label}
              min={c.min}
              max={c.max}
              step={c.step}
              value={controls[c.id]}
              onChange={(e) => change(c.id, Number(e.target.value))}
            />
          )}
        </label>
      ));
  const shareUI = (
    <div className="moment-share">
      <button onClick={share}>
        {copied ? <Check size={15} /> : <Share2 size={15} />}{' '}
        {copied ? 'Link copied' : 'Share this moment'}
      </button>
      {shareLink && (
        <label>
          Chapter link
          <input readOnly value={shareLink} onFocus={(e) => e.target.select()} />
        </label>
      )}
    </div>
  );
  const failure = useCallback(() => {
    setFailed(true);
    setPlaying(false);
  }, []);
  const loaded = useCallback(() => {
    setReady(true);
    if (!started.current) {
      started.current = true;
      track('exhibit_start', { exhibit: exhibit.id });
      performance.mark(`exhibit-ready:${exhibit.id}`);
    }
  }, [exhibit.id]);
  const slow = useCallback(() => setAutoLow(true), []);
  return (
    <section
      ref={root}
      className={`exhibit-wrap experience mode-${mode}`}
      data-exhibit={exhibit.id}
    >
      <div className="cinema-column">
        <div className="cinema-stage">
          <div className="cinema-top">
            <span className="mono">
              {exhibit.number} /{' '}
              {exhibit.id === 'engine' ? 'INTERNAL COMBUSTION' : exhibit.title.toUpperCase()}
            </span>
            <span className="cinema-status">
              <i />
              {playing ? 'IN MOTION' : 'PAUSED'}
            </span>
          </div>
          <div
            className={`scene-canvas ${rotate ? 'rotation-active' : ''}`}
            role="group"
            aria-label={`Interactive 3D ${exhibit.title}.`}
          >
            {mounted && !failed ? (
              <Suspense fallback={<div className="scene-loading">Preparing the machinery…</div>}>
                <Viewport
                  scene={exhibit.scene}
                  phase={phase}
                  motion={motion}
                  controls={controls}
                  explode={explode}
                  reveal={!intro && mode === 'story' ? story.presentation?.reveal : undefined}
                  stage={intro || mode === 'explore' ? 99 : step}
                  selected={selected || (!intro && mode === 'story' ? story.parts[0] : '')}
                  onSelect={setSelected}
                  position={position}
                  target={!intro && mode === 'story' ? story.presentation?.target : undefined}
                  fov={!intro && mode === 'story' ? story.presentation?.fov || 34 : 34}
                  revision={revision}
                  quality={low ? 'low' : 'high'}
                  effects={!reduced}
                  reduced={reduced}
                  interactive={!touch || rotate}
                  onError={failure}
                  onReady={loaded}
                  onSlow={slow}
                  annotation={
                    !intro && mode === 'story' ? story.presentation?.annotation : undefined
                  }
                />
              </Suspense>
            ) : (
              <div className="scene-loading">
                <span className="mono">{failed ? 'A DIFFERENT WAY IN' : 'OPENENGINEERING'}</span>
                <h2>{failed ? 'The story still works.' : 'Preparing the machinery…'}</h2>
                <p>
                  {failed
                    ? '3D is unavailable. The chapters, calculated controls, and written explanation are still here.'
                    : 'A little curiosity goes a long way.'}
                </p>
                <a href="#written-story">
                  Read the complete story <ArrowDown size={16} />
                </a>
              </div>
            )}
          </div>
          <div className="cinema-tools">
            <span className="drag-hint">
              {touch
                ? rotate
                  ? 'Drag to rotate · pinch to zoom'
                  : 'Scroll to discover'
                : 'Drag to rotate · scroll to discover'}
            </span>
            <div>
              {touch && (
                <button onClick={() => setRotate(!rotate)} aria-pressed={rotate}>
                  <Rotate3D size={15} />
                  {rotate ? 'Done rotating' : 'Rotate model'}
                </button>
              )}
              <button onClick={() => setExplode(explode ? 0 : 1)} aria-pressed={!!explode}>
                <Expand size={15} />
                {explode ? 'Assemble' : 'Take apart'}
              </button>
              <button
                aria-label="Change camera view"
                onClick={() => {
                  setView((view + 1) % 3);
                  setRevision((v) => v + 1);
                }}
              >
                <Rotate3D size={15} />
                <span>{['Perspective', 'Front', 'Rear'][view]}</span>
              </button>
            </div>
          </div>
          <div className="cinema-dashboard">
            <Readout
              id={exhibit.id}
              phase={phase}
              controls={controls}
              onPhase={(n) => {
                seek(n);
                track('experiment_change', { exhibit: exhibit.id, control: 'cycle' });
              }}
            />
            <div className="transport">
              <button
                className="play-button"
                aria-label={playing ? 'Pause animation' : 'Play animation'}
                disabled={!ready || failed}
                onClick={() => setPlaying(!playing)}
              >
                {playing ? (
                  <Pause size={17} fill="currentColor" />
                ) : (
                  <Play size={17} fill="currentColor" />
                )}
              </button>
              <input
                aria-label="Cycle position in degrees"
                type="range"
                min="0"
                max={exhibit.period}
                step="1"
                value={Math.round(phase % exhibit.period)}
                onChange={(e) => seek(Number(e.target.value))}
              />
              <output className="mono" aria-live="off">
                {Math.round(phase % exhibit.period)}°
              </output>
              <button aria-label="Reset exhibit" onClick={reset}>
                <RotateCcw size={17} />
              </button>
            </div>
          </div>
          <div className="cinema-bottom">
            <span className="mono">A SIMPLIFIED TEACHING MODEL</span>
            <label className="quality-label">
              Effects
              <select
                aria-label="Visual quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
              >
                <option value="auto">Auto{autoLow ? ' · low' : ''}</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="narrative-column">
        <div className="mode-tabs">
          <button aria-pressed={mode === 'story'} onClick={() => switchMode('story')}>
            Follow the story
          </button>
          <button aria-pressed={mode === 'explore'} onClick={() => switchMode('explore')}>
            Explore freely <ArrowUpRight size={14} />
          </button>
          <select
            className="chapter-mobile-select"
            aria-label="Jump to chapter"
            value={step}
            onChange={(e) => go(Number(e.target.value))}
          >
            {exhibit.steps.map((s, i) => (
              <option key={s.id} value={i}>
                {String(i + 1).padStart(2, '0')} / {exhibit.steps.length}
              </option>
            ))}
          </select>
        </div>
        {mode === 'story' ? (
          <>
            <div className="story-intro">
              <div className="eyebrow">
                <span className="orange-line" />
                {home
                  ? 'A FIELD GUIDE TO EVERYDAY INGENUITY'
                  : `EXHIBIT ${exhibit.number} / ${exhibit.duration} OF CURIOSITY`}
              </div>
              <h1>
                {home ? (
                  <>
                    Every machine
                    <br /> has a <em>story.</em>
                  </>
                ) : (
                  <>
                    {exhibit.title}
                    <em>.</em>
                  </>
                )}
              </h1>
              <p className="intro-promise">
                {home ? 'Understand how machines work. Play with them in 3D.' : exhibit.question}
              </p>
              <p className="intro-note">
                {home
                  ? 'Start with a little fire. Follow the clever ideas that turn it into motion. Then take the controls.'
                  : exhibit.subtitle}
              </p>
              <button className="primary-action" onClick={() => go(0)}>
                {exhibit.id === 'engine' ? 'Start with a spark' : 'Discover the mechanism'}
                <ArrowDown size={17} />
              </button>
              <button className="text-action" onClick={() => switchMode('explore')}>
                Or take the controls <ArrowUpRight size={16} />
              </button>
              <div className="intro-foot">
                <span>{exhibit.steps.length} SHORT CHAPTERS</span>
                <span>FREE & OPEN SOURCE</span>
              </div>
            </div>
            {exhibit.steps.map((s, i) => (
              <article
                data-story-index={i}
                id={`chapter-${exhibit.id}-${s.id}`}
                key={s.id}
                className={`story-chapter ${!intro && i === step ? 'is-current' : ''}`}
              >
                <div className="chapter-number">
                  {String(i + 1).padStart(2, '0')}
                  <span> / {String(exhibit.steps.length).padStart(2, '0')}</span>
                </div>
                <div className="eyebrow">{s.label.replace(/^\d+\s*\/\s*/, '')}</div>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
                <p className="chapter-why">{s.why}</p>
                <div className="experiment">
                  <span className="eyebrow">TRY IT YOURSELF</span>
                  <p>{s.experiment}</p>
                  {i === step && (
                    <>
                      {inputs(s.controls)}
                      <div className="story-parts" aria-label="Inspect highlighted parts">
                        {exhibit.parts
                          .filter((p) => s.parts.includes(p.id))
                          .map((p) => (
                            <button
                              key={p.id}
                              aria-pressed={selected === p.id}
                              onClick={() => setSelected(selected === p.id ? '' : p.id)}
                            >
                              {p.name}
                            </button>
                          ))}
                      </div>
                      {part && <p className="part-note">{part.description}</p>}
                    </>
                  )}
                </div>
                <details className="deeper">
                  <summary>
                    Go deeper <span>+</span>
                  </summary>
                  <p>{s.deeper}</p>
                  <a href="#exhibit-sources">
                    Sources & model boundaries <ArrowUpRight size={13} />
                  </a>
                </details>
                {i === step && (
                  <>
                    <div className="story-pagination">
                      <button
                        aria-label="Previous chapter"
                        disabled={i === 0}
                        onClick={() => go(i - 1)}
                      >
                        Previous
                      </button>
                      {i < exhibit.steps.length - 1 ? (
                        <button onClick={() => go(i + 1)}>
                          Next chapter <ArrowDown size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setFinished(true);
                            if (observed.current.size === exhibit.steps.length && !finished)
                              track('story_complete', { exhibit: exhibit.id });
                          }}
                        >
                          Finish the story <Check size={15} />
                        </button>
                      )}
                    </div>
                    {shareUI}
                  </>
                )}
              </article>
            ))}
            {finished && (
              <div className="story-finish">
                <span className="eyebrow">A NEW WAY TO SEE IT</span>
                <h2>Now you know what’s going on inside.</h2>
                <p>Try explaining it to someone. That’s when the idea becomes yours.</p>
                <a className="primary-action" href={path('/#collection')}>
                  Meet another machine <ArrowRight size={16} />
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="free-lab">
            <div className="eyebrow">
              <SlidersHorizontal size={13} /> YOUR CURIOSITY. YOUR CONTROLS.
            </div>
            <h1>
              {exhibit.title}
              <em>.</em>
            </h1>
            <p>Slow it down. Take it apart. Follow the part that catches your eye.</p>
            {inputs()}
            <div className="part-list">
              <span className="eyebrow">MEET THE PARTS</span>
              {exhibit.parts.map((p) => (
                <button
                  key={p.id}
                  aria-pressed={selected === p.id}
                  onClick={() => setSelected(selected === p.id ? '' : p.id)}
                >
                  {p.name}
                  <span>{selected === p.id ? '−' : '+'}</span>
                </button>
              ))}
            </div>
            {part && (
              <p className="part-description" role="status">
                {part.description}
              </p>
            )}
            <details className="deeper">
              <summary>
                Sources & model boundaries <span>+</span>
              </summary>
              <p>{exhibit.limitations}</p>
              {exhibit.sources.map((s) => (
                <a href={s.url} key={s.url} target="_blank" rel="noreferrer">
                  {s.title} <ArrowUpRight size={12} />
                </a>
              ))}
            </details>
            {shareUI}
            <button className="text-action" onClick={() => switchMode('story')}>
              Return to chapter {step + 1}
              <ArrowDown size={15} />
            </button>
          </div>
        )}
      </div>
      <nav className="chapter-rail" aria-label="Chapters">
        {exhibit.steps.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Chapter ${i + 1}: ${s.title}`}
            aria-current={!intro && i === step ? 'step' : undefined}
            onClick={() => go(i)}
          >
            <span />
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </nav>
    </section>
  );
}
