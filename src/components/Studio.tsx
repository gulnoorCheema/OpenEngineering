import { useEffect, useRef, useState } from 'react';
import { exhibits } from '../content/exhibits';
import SceneViewport from './SceneViewport';
import { saveMedia } from '../lib/save-media';
import type { MotionClock } from '../lib/presentation';
import { recordingChoices, recordingFrame, recordingSegment, isLandscape } from '../lib/recordings';
const wrap = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  max: number,
  line: number,
) => {
  let current = '';
  for (const word of text.split(' ')) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > max && current) {
      ctx.fillText(current, x, y);
      current = word;
      y += line;
    } else current = test;
  }
  ctx.fillText(current, x, y);
  return y + line;
};
export default function Studio() {
  const [collection, setCollection] = useState(false),
    [choice, setChoice] = useState('engine'),
    [active, setActive] = useState('engine'),
    [sample, setSample] = useState(() => recordingFrame('engine', 0)),
    [recording, setRecording] = useState(false),
    [ready, setReady] = useState(false),
    [elapsed, setElapsed] = useState(0),
    [status, setStatus] = useState('Ready to record'),
    [videoUrl, setVideoUrl] = useState('');
  const source = useRef<HTMLCanvasElement | null>(null),
    output = useRef<HTMLCanvasElement>(null),
    frame = useRef(0),
    recorder = useRef<MediaRecorder | null>(null),
    readyRef = useRef(false),
    activeRef = useRef('engine'),
    running = useRef(false),
    lastSample = useRef('');
  const motion = useRef<MotionClock>({ phase: 420, playing: false, visible: true, speed: 0 });
  const exhibit = exhibits.find((e) => e.id === active)!,
    landscape = isLandscape(choice);
  const paint = (time: number, selectedChoice = choice) => {
    const canvas = output.current,
      src = source.current;
    if (!canvas || !src) return;
    const ctx = canvas.getContext('2d')!,
      w = canvas.width,
      h = canvas.height,
      wide = isLandscape(selectedChoice),
      seg = recordingSegment(selectedChoice, time),
      f = recordingFrame(seg.id, seg.local),
      e = exhibits.find((e) => e.id === seg.id)!;
    ctx.fillStyle = '#f3f0e9';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#191e20';
    ctx.font = '500 24px "Space Grotesk"';
    ctx.fillText('OpenEngineering', wide ? 45 : 40, 60);
    ctx.font = '12px "IBM Plex Mono"';
    ctx.fillStyle = '#a45a39';
    ctx.fillText('FREE TO EXPLORE / OPEN SOURCE', wide ? 914 : 40, wide ? 60 : 93);
    const x = wide ? 30 : 0,
      y = wide ? 110 : 135,
      sw = wide ? 770 : 720,
      sh = wide ? 550 : 750;
    ctx.fillStyle = '#101719';
    ctx.fillRect(x, y, sw, sh);
    const scale = Math.min(sw / src.width, sh / src.height);
    ctx.drawImage(
      src,
      x + (sw - src.width * scale) / 2,
      y + (sh - src.height * scale) / 2,
      src.width * scale,
      src.height * scale,
    );
    const tx = wide ? 838 : 40,
      tw = wide ? 390 : 640,
      ty = wide ? 165 : 942;
    ctx.fillStyle = '#a45a39';
    ctx.font = '12px "IBM Plex Mono"';
    ctx.fillText(`${e.number} / ${e.title.toUpperCase()}`, tx, ty);
    ctx.fillStyle = '#191e20';
    ctx.font = `500 ${wide ? 43 : 44}px "Space Grotesk"`;
    const headline = seg.closing ? 'New ways to wonder.' : f.caption[0];
    const end = wrap(ctx, headline, tx, ty + 65, tw, wide ? 49 : 51);
    ctx.font = '23px "DM Sans"';
    ctx.fillStyle = '#5b6766';
    wrap(
      ctx,
      seg.closing
        ? 'Six exhibits. One shared player. Build the next moment of understanding.'
        : f.caption[1],
      tx,
      end + 29,
      tw,
      32,
    );
    ctx.font = '12px "IBM Plex Mono"';
    ctx.fillStyle = '#66716f';
    ctx.fillText('GULNOORCHEEMA.GITHUB.IO/OPENENGINEERING', wide ? 45 : 40, h - 32);
    ctx.fillStyle = '#b94720';
    ctx.fillRect(0, h - 5, w * Math.min(time / (wide ? 55 : 20), 1), 5);
  };
  useEffect(() => {
    if (ready && !running.current) paint(0);
  }, [ready, choice, active]);
  useEffect(
    () => () => {
      running.current = false;
      cancelAnimationFrame(frame.current);
      if (recorder.current?.state === 'recording') recorder.current.stop();
    },
    [],
  );
  const prepare = (value: string) => {
    const seg = recordingSegment(value, 0),
      s = recordingFrame(seg.id, 0);
    if (seg.id !== activeRef.current) {
      readyRef.current = false;
      setReady(false);
      source.current = null;
    }
    setChoice(value);
    activeRef.current = seg.id;
    setActive(seg.id);
    setSample(s);
    motion.current.phase = s.phase;
    setStatus('Ready to record');
    setElapsed(0);
  };
  async function start() {
    if (!readyRef.current || !output.current) return;
    await document.fonts.ready;
    paint(0);
    const mime = ['video/mp4;codecs=avc1.42E01E', 'video/webm;codecs=vp9', 'video/webm'].find((m) =>
      MediaRecorder.isTypeSupported(m),
    );
    if (!mime) {
      setStatus('This browser cannot record canvas video');
      return;
    }
    const stream = output.current.captureStream(30),
      rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6500000 }),
      chunks: Blob[] = [];
    recorder.current = rec;
    rec.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    rec.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: mime });
      setVideoUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(blob);
      });
      await saveMedia(blob, `openengineering-${choice}.${mime.includes('mp4') ? 'mp4' : 'webm'}`);
      setRecording(false);
      setStatus('Recording saved');
    };
    rec.onerror = () => {
      running.current = false;
      setRecording(false);
      setStatus('Recording failed');
    };
    running.current = true;
    setRecording(true);
    setStatus('Recording the actual scene');
    rec.start(250);
    let last = performance.now(),
      time = 0,
      lastUi = -1;
    const tick = (now: number) => {
      if (!running.current) return;
      const dt = Math.max(0, Math.min((now - last) / 1000, 0.06));
      last = now;
      if (readyRef.current) time += dt;
      const segment = recordingSegment(choice, time);
      if (segment.id !== activeRef.current) {
        readyRef.current = false;
        setReady(false);
        activeRef.current = segment.id;
        setActive(segment.id);
        source.current = null;
      }
      const current = recordingFrame(segment.id, segment.local);
      motion.current.phase = current.phase;
      const serialized = JSON.stringify({ ...current, phase: 0 });
      if (serialized !== lastSample.current) {
        lastSample.current = serialized;
        setSample(current);
      }
      if (readyRef.current) paint(time);
      if (Math.floor(time) !== lastUi) {
        lastUi = Math.floor(time);
        setElapsed(time);
      }
      if (time >= (isLandscape(choice) ? 55 : 20)) {
        running.current = false;
        rec.stop();
        return;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }
  async function cover() {
    if (!source.current) return;
    await document.fonts.ready;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#f3f0e8';
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = '#d84f1a';
    ctx.fillRect(54, 52, 8, 28);
    ctx.font = '500 25px "Space Grotesk"';
    ctx.fillStyle = '#282d2f';
    ctx.fillText('OpenEngineering', 77, 76);
    ctx.font = '500 45px "Space Grotesk"';
    wrap(ctx, 'Understand how machines work.', 54, 225, 520, 58);
    ctx.font = '31px "DM Sans"';
    ctx.fillStyle = '#d84f1a';
    wrap(ctx, 'Play with them in 3D.', 54, 395, 520, 42);
    ctx.font = '13px "IBM Plex Mono"';
    ctx.fillStyle = '#69736a';
    ctx.fillText('FREE TO EXPLORE  /  OPEN SOURCE', 54, 570);
    const src = source.current,
      scale = Math.min(550 / src.width, 480 / src.height);
    ctx.fillStyle = '#101719';
    ctx.fillRect(620, 110, 550, 480);
    ctx.drawImage(
      src,
      620 + (550 - src.width * scale) / 2,
      110 + (480 - src.height * scale) / 2,
      src.width * scale,
      src.height * scale,
    );
    ctx.font = '13px "IBM Plex Mono"';
    ctx.fillStyle = '#69736a';
    ctx.fillStyle = '#d0d4cf';
    ctx.fillText(exhibit.title.toUpperCase(), 645, 565);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
    if (exhibit.id === 'engine') {
      const logo = new Image();
      logo.src = `${import.meta.env.BASE_URL}favicon.svg`;
      await logo.decode();
      const icon = document.createElement('canvas');
      icon.width = 512;
      icon.height = 512;
      icon.getContext('2d')!.drawImage(logo, 0, 0, 512, 512);
      const iconBlob = await new Promise<Blob | null>((resolve) => icon.toBlob(resolve));
      if (iconBlob) await saveMedia(iconBlob, 'openengineering-icon.png');
    }
    if (blob) {
      await saveMedia(blob, `openengineering-social-${exhibit.id}.png`);
      const thumbnail = document.createElement('canvas');
      thumbnail.width = 720;
      thumbnail.height = 540;
      const tc = thumbnail.getContext('2d')!;
      if (!collection) {
        tc.fillStyle = '#101719';
        tc.fillRect(0, 0, 720, 540);
      }
      const fit = Math.min(720 / src.width, 540 / src.height);
      tc.drawImage(
        src,
        (720 - src.width * fit) / 2,
        (540 - src.height * fit) / 2,
        src.width * fit,
        src.height * fit,
      );
      const thumb = await new Promise<Blob | null>((resolve) => thumbnail.toBlob(resolve));
      if (thumb) await saveMedia(thumb, `openengineering-thumbnail-${exhibit.id}.png`);
      setStatus('Social card and exhibit image saved');
    }
  }
  return (
    <>
      <div className="studio-tools">
        <label>
          <input
            type="checkbox"
            checked={collection}
            disabled={recording}
            onChange={(e) => setCollection(e.target.checked)}
          />{' '}
          Transparent collection image
        </label>
        <label>
          Recording{' '}
          <select
            aria-label="Recording"
            value={choice}
            disabled={recording}
            onChange={(e) => prepare(e.target.value)}
          >
            {recordingChoices.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <button disabled={recording || !ready} onClick={start}>
          {recording ? `Recording ${Math.floor(elapsed)}s` : 'Record & download'}
        </button>
        <button disabled={recording || !ready} onClick={cover}>
          Save social card
        </button>
      </div>
      <p role="status">
        {status}. Keep this tab visible while recording. No microphone or screen permission is used.
      </p>
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          style={{ maxWidth: 500, width: '100%' }}
          aria-label="Recorded launch clip"
        />
      )}
      <div className="studio-grid">
        <div
          className="studio-preview"
          style={
            collection ? { aspectRatio: '4 / 3', height: 'auto', background: '#182022' } : undefined
          }
        >
          <SceneViewport
            key={`${active}-${collection}`}
            transparentStage={collection}
            reveal={collection && active === 'differential' ? ['spider'] : undefined}
            reduced={collection && active === 'differential'}
            scene={active}
            phase={sample.phase}
            motion={motion}
            explode={collection && active === 'differential' ? 0.2 : sample.explode}
            controls={sample.controls}
            stage={99}
            selected=""
            onSelect={() => {}}
            position={sample.position}
            target={sample.target}
            fov={sample.fov}
            minAspect={exhibit.presentation?.minAspect}
            quality="high"
            effects
            onError={() => {
              running.current = false;
              setStatus('3D rendering failed');
              if (recorder.current?.state === 'recording') recorder.current.stop();
            }}
            onReady={() => {
              readyRef.current = true;
              setReady(true);
            }}
            onCanvas={(canvas) => {
              source.current = canvas;
            }}
          />
        </div>
        <canvas
          ref={output}
          width={landscape ? 1280 : 720}
          height={landscape ? 720 : 1280}
          className="recording-canvas"
          aria-label="Composited recording with captions"
        />
      </div>
    </>
  );
}
