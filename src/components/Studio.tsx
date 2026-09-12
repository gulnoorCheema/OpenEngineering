import { useEffect, useRef, useState } from 'react';
import { exhibits as collection } from '../content/exhibits';
const exhibits = ['engine', 'gears', 'differential'].map((id) =>
  collection.find((e) => e.id === id)!,
);
import { defaultControls, type Controls, type Vec3 } from '../lib/exhibit';
import SceneViewport from './SceneViewport';
import { saveMedia } from '../lib/save-media';
const scripts = {
  engine: [
    ['How does a push become rotation?', 'Burning fuel pushes the piston.'],
    ['One end travels in a line.', 'The other follows a circle.'],
    ['Four strokes make a cycle.', 'Intake. Compression. Power. Exhaust.'],
    ['Spread the power strokes.', 'Four cylinders. One crankshaft.'],
  ],
  gears: [
    ['Make it stronger.', 'Watch what happens to speed.'],
    ['16 teeth drive 32.', 'The output turns at half the speed.'],
    ['16 teeth drive 48.', '3× ideal torque. ⅓ the speed.'],
    ['Try the opposite.', 'More speed means less ideal torque.'],
  ],
  differential: [
    ['One engine. Two wheels.', 'Why do they turn differently?'],
    ['The outside path is longer.', 'The outside wheel must turn faster.'],
    ['Small gears allow a difference.', 'Left slows down. Right speeds up.'],
    ['Hold one output on a bench.', 'The other turns at twice the carrier speed.'],
  ],
};
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
  const [choice, setChoice] = useState('engine'),
    [recording, setRecording] = useState(false),
    [elapsed, setElapsed] = useState(0),
    [index, setIndex] = useState(0),
    [phase, setPhase] = useState(420),
    [controls, setControls] = useState<Controls>(defaultControls(exhibits[0])),
    [explode, setExplode] = useState(0),
    [status, setStatus] = useState('Ready to record'),
    [ready, setReady] = useState(false),
    [videoUrl, setVideoUrl] = useState('');
  const source = useRef<HTMLCanvasElement | null>(null),
    output = useRef<HTMLCanvasElement>(null),
    running = useRef(false),
    recorder = useRef<MediaRecorder | null>(null),
    frame = useRef(0),
    data = useRef({ index: 0, seconds: 0, choice: 'engine' });
  const exhibit = exhibits[index],
    landscape = choice === 'demo';
  const position: Vec3 =
    exhibit.scene === 'engine' ? [6, 4, 11] : exhibit.scene === 'gears' ? [1, 3.5, 12] : [6, 4, 11];
  useEffect(
    () => () => {
      running.current = false;
      cancelAnimationFrame(frame.current);
      if (recorder.current?.state === 'recording') recorder.current.stop();
    },
    [],
  );
  const prepare = (value: string) => {
    setChoice(value);
    const i = value === 'demo' ? 0 : exhibits.findIndex((e) => e.id === value);
    if (i !== index) setReady(false);
    setIndex(i);
    setControls(defaultControls(exhibits[i]));
    setPhase(420);
    setStatus('Ready to record');
  };
  function renderFrame() {
    const canvas = output.current!,
      ctx = canvas.getContext('2d')!,
      w = canvas.width,
      h = canvas.height;
    const { index: i, seconds: t, choice: c } = data.current;
    const wide = c === 'demo',
      section = wide ? (t < 20 ? 0 : t < 35 ? 1 : t < 47 ? 2 : 3) : Math.min(3, Math.floor(t / 5));
    const script = wide
      ? scripts[exhibits[i].id as keyof typeof scripts][
          i === 0
            ? Math.min(3, Math.floor(t / 5))
            : i === 1
              ? Math.min(3, Math.floor((t - 20) / 3.75))
              : Math.min(3, Math.floor((t - 35) / 3))
        ]
      : scripts[c as keyof typeof scripts][section];
    ctx.fillStyle = '#f7f5f0';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#d84f1a';
    ctx.fillRect(45, 43, 9, 28);
    ctx.fillStyle = '#282d2f';
    ctx.font = '500 23px "Space Grotesk"';
    ctx.fillText('OpenEngineering', 68, 65);
    ctx.font = '12px "IBM Plex Mono"';
    ctx.fillStyle = '#727970';
    ctx.fillText('FREE TO EXPLORE  /  OPEN SOURCE', 45, h - 40);
    if (wide && section === 3) {
      ctx.fillStyle = '#282d2f';
      ctx.font = '500 49px "Space Grotesk"';
      wrap(ctx, 'Help build the next “aha”.', 65, 210, w - 130, 65);
      ctx.font = '25px "DM Sans"';
      wrap(ctx, 'Three working exhibits. One shared player.', 65, 320, w - 130, 42);
      ctx.fillStyle = '#edf0e5';
      ctx.fillRect(65, 390, w - 130, 145);
      ctx.font = '20px "IBM Plex Mono"';
      ctx.fillStyle = '#42604e';
      ctx.fillText('npm run new-exhibit -- your-idea', 95, 445);
      ctx.fillText('Sources. Design rules. Tests. Your curiosity.', 95, 495);
      ctx.fillStyle = '#d84f1a';
      ctx.font = '25px "DM Sans"';
      ctx.fillText('github.com/gulnoorCheema/OpenEngineering', 65, 605);
      return;
    }
    const top = wide ? 122 : 255,
      sceneH = wide ? 400 : 590;
    if (source.current) {
      const sw = source.current.width,
        sh = source.current.height;
      ctx.fillStyle = '#efeee8';
      ctx.fillRect(0, top, w, sceneH);
      const scale = Math.min(w / sw, sceneH / sh);
      ctx.drawImage(
        source.current,
        (w - sw * scale) / 2,
        top + (sceneH - sh * scale) / 2,
        sw * scale,
        sh * scale,
      );
    }
    ctx.fillStyle = '#282d2f';
    ctx.font = `500 ${wide ? 38 : 39}px "Space Grotesk"`;
    wrap(ctx, script[0], 45, wide ? 575 : 143, w - 90, 50);
    ctx.font = `${wide ? 25 : 26}px "DM Sans"`;
    ctx.fillStyle = '#606b62';
    wrap(ctx, script[1], 45, wide ? 628 : 930, w - 90, 39);
    ctx.font = '13px "IBM Plex Mono"';
    ctx.fillStyle = '#d84f1a';
    ctx.fillText(
      exhibits[i].id === 'engine'
        ? 'A SIMPLIFIED FOUR-STROKE MODEL'
        : exhibits[i].id === 'gears'
          ? 'IDEAL RATIOS · LOSSES IGNORED'
          : 'IDEAL OPEN DIFFERENTIAL',
      45,
      wide ? 100 : 235,
    );
  }
  async function start() {
    if (!ready || recording) return;
    if (!window.MediaRecorder) {
      setStatus('Recording needs a browser with MediaRecorder support.');
      return;
    }
    await document.fonts.ready;
    setRecording(true);
    setStatus('Recording the live scene');
    running.current = true;
    const duration = choice === 'demo' ? 55 : 20;
    const c = output.current!;
    c.width = choice === 'demo' ? 1280 : 720;
    c.height = choice === 'demo' ? 720 : 1280;
    const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/mp4'].find((m) =>
      MediaRecorder.isTypeSupported(m),
    );
    if (!mime) {
      setRecording(false);
      setStatus('No supported video codec. Try Chrome.');
      return;
    }
    const stream = c.captureStream(30),
      chunks: Blob[] = [];
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
    recorder.current = rec;
    rec.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    rec.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: mime });
      const url = URL.createObjectURL(blob);
      let saveStatus = 'Recording saved';
      try {
        await saveMedia(blob, `openengineering-${choice}.${mime.includes('mp4') ? 'mp4' : 'webm'}`);
      } catch {
        saveStatus = 'Save failed — use the video preview to download';
      }
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoUrl(url);
      setRecording(false);
      setStatus(saveStatus);
    };
    rec.start();
    let firstFrame: number | undefined;
    const tick = (now: number) => {
      firstFrame ??= now;
      const t = Math.min(Math.max(0, (now - firstFrame) / 1000), duration);
      setElapsed(t);
      const i =
        choice === 'demo'
          ? t < 20
            ? 0
            : t < 35
              ? 1
              : 2
          : exhibits.findIndex((e) => e.id === choice);
      const rawLocal = choice === 'demo' ? t - (i === 0 ? 0 : i === 1 ? 20 : 35) : t;
      const local =
        choice === 'demo' ? rawLocal * (i === 0 ? 1 : i === 1 ? 20 / 15 : 20 / 12) : rawLocal;
      setIndex(i);
      setPhase(local * 84 + 420);
      let ctr = defaultControls(exhibits[i]);
      if (i === 0) ctr.cylinders = local >= 15 ? 4 : 1;
      if (i === 1) ctr.ratio = local < 5 ? 1 : local < 10 ? 2 : local < 15 ? 3 : 0.5;
      if (i === 2) {
        ctr.direction = local < 5 ? 0 : 1;
        ctr.radius = local < 10 ? 5 : 2;
        ctr.held = local >= 15 ? 1 : 0;
      }
      setControls(ctr);
      setExplode(i === 2 && local >= 15 ? 0.45 : 0);
      data.current = { index: i, seconds: t, choice };
      renderFrame();
      if (t >= duration || !running.current) {
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
    ctx.fillStyle = '#f7f5f0';
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
    ctx.fillStyle = '#efeee8';
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
      setStatus('Social card saved');
    }
  }
  return (
    <>
      <div className="studio-tools">
        <label>
          Recording{' '}
          <select value={choice} disabled={recording} onChange={(e) => prepare(e.target.value)}>
            <option value="engine">Engine · 20s portrait</option>
            <option value="gears">Gears · 20s portrait</option>
            <option value="differential">Differential · 20s portrait</option>
            <option value="demo">Product demo · 55s landscape</option>
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
      <div>
        {videoUrl && (
          <video
            src={videoUrl}
            controls
            style={{ maxWidth: 500, width: '100%' }}
            aria-label="Recorded launch clip"
          />
        )}
      </div>
      <div className="studio-grid">
        <div className="studio-preview">
          <SceneViewport
            key={exhibit.id}
            scene={exhibit.scene}
            phase={phase}
            explode={explode}
            controls={controls}
            stage={99}
            selected=""
            onSelect={() => {}}
            position={position}
            onError={() => setStatus('3D rendering failed')}
            onReady={() => setReady(true)}
            onCanvas={(canvas) => (source.current = canvas)}
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
