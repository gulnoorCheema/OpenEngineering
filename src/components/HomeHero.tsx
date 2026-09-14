import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import type { MotionClock } from '../lib/presentation';
import { heroPlayback, legacyEngineLink } from '../lib/home';
import { path } from '../lib/paths';
const Viewport = lazy(() => import('./SceneViewport'));
export default function HomeHero({ count }: { count: number }) {
  const [mounted, setMounted] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [playing, setPlaying] = useState(false),
    [reduced, setReduced] = useState(false),
    [visible, setVisible] = useState(true),
    [apart, setApart] = useState(0),
    [low, setLow] = useState(false),
    [compact, setCompact] = useState(false);
  const root = useRef<HTMLElement>(null);
  const motion = useRef<MotionClock>({ phase: 160, speed: 24, playing: false, visible: true });
  motion.current.playing = heroPlayback(playing, ready, failed, visible);
  motion.current.visible = visible;
  const onError = useCallback(() => {
    setFailed(true);
    setPlaying(false);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onSlow = useCallback(() => setLow(true), []);
  useEffect(() => {
    if (legacyEngineLink(location.search, location.hash, path('/exhibits/engine/'))) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(preference.matches);
    setPlaying(!preference.matches);
    setLow(innerWidth < 768);
    setCompact(innerWidth <= 760);
    setMounted(true);
    const resize = () => setCompact(innerWidth <= 760);
    window.addEventListener('resize', resize);
    const reduce = () => {
      setReduced(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    const preview = () => {
      setReduced(true);
      setPlaying(false);
    };
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    if (root.current) observer.observe(root.current);
    preference.addEventListener('change', reduce);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('oe-preview-reduced-motion', preview);
    sync();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      preference.removeEventListener('change', reduce);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('oe-preview-reduced-motion', preview);
    };
  }, []);
  return (
    <section
      ref={root}
      className="home-hero"
      aria-labelledby="home-title"
      data-ready={ready && !failed}
    >
      <div className="home-container hero-inner">
        <div className="hero-copy">
          <h1 id="home-title">
            See what makes
            <br />
            the world move.
          </h1>
          <p className="hero-promise">
            Understand how machines work.
            <br />
            Play with them in 3D.
          </p>
          <a
            className="home-primary"
            href={path('/exhibits/jet-engine/?chapter=move-air&mode=story')}
          >
            Start exploring <ArrowUpRight size={22} aria-hidden="true" />
          </a>
          <p className="hero-reassurance">{count} machines. No sign-up. Open source.</p>
        </div>
        <div
          className="hero-machine scene-canvas"
          aria-label="Live cutaway of a two-spool jet engine"
        >
          {(!ready || failed) && (
            <picture className="hero-poster">
              <source media="(max-width: 760px)" srcSet={path('/home/jet-poster-phone.webp')} />
              <img
                src={path('/home/jet-poster.webp')}
                alt="A cutaway jet engine: cool air bypasses a continuously burning core."
                width="1440"
                height="1120"
                fetchPriority="high"
              />
            </picture>
          )}
          {mounted && !failed && (
            <Suspense fallback={null}>
              <Viewport
                scene="jet-engine"
                phase={160}
                motion={motion}
                controls={{ bypass: 5, flow: 0, speed: 0.3 }}
                stage={99}
                explode={apart}
                selected=""
                onSelect={() => {}}
                position={compact ? [-7, 2, 8.5] : [-9, 2.6, 10.5]}
                target={compact ? [0, 0, 0] : [-1.8, 0.2, 0]}
                fov={32}
                minAspect={1.2}
                interactive={false}
                reduced={reduced}
                quality={low ? 'low' : 'high'}
                effects={!reduced}
                active={visible}
                presentation="showcase"
                onError={onError}
                onReady={onReady}
                onSlow={onSlow}
                annotations={
                  apart < 0.75
                    ? [
                        { text: 'Cool air, two paths', anchor: [-1.5, 1.55, 0.1], tone: 'cool' },
                        {
                          text: 'A continuous fire inside',
                          anchor: [0.25, -0.72, 0.65],
                          tone: 'warm',
                        },
                      ]
                    : []
                }
              />
            </Suspense>
          )}
        </div>
        <div className="hero-controls">
          <div className="hero-model-caption">
            <span>JET ENGINE</span>
            <p>How does moving air move an airplane?</p>
          </div>
          <div className="hero-control-inputs">
            <label className="hero-reveal">
              Look inside{' '}
              <input
                type="range"
                aria-label="Look inside the jet engine"
                min="0"
                max="1"
                step="0.01"
                value={apart}
                disabled={!ready || failed}
                onChange={(e) => setApart(Number(e.target.value))}
                aria-valuetext={`${Math.round(apart * 100)}% revealed`}
              />
            </label>
            <button
              className="hero-play"
              aria-label={playing ? 'Pause jet animation' : 'Play jet animation'}
              disabled={!ready || failed}
              onClick={() => setPlaying((value) => !value)}
            >
              {playing ? <Pause size={19} /> : <Play size={19} />}
            </button>
          </div>
        </div>
        {failed && (
          <p className="hero-fallback" role="status">
            The 3D preview is unavailable on this device.{' '}
            <a href={path('/exhibits/jet-engine/?view=text')}>Read the illustrated story</a>.
          </p>
        )}
      </div>
    </section>
  );
}
