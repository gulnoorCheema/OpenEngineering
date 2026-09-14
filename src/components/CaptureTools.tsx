import { useEffect, useState } from 'react';
import { saveMedia } from '../lib/save-media';
export default function CaptureTools() {
  const [enabled, setEnabled] = useState(false),
    [status, setStatus] = useState('Save gallery PNG'),
    [preview, setPreview] = useState(''),
    [metrics, setMetrics] = useState('Measuring renderer…'),
    [models, setModels] = useState('');
  useEffect(() => {
    setEnabled(new URLSearchParams(location.search).has('capture'));
    const report = (event: Event) => {
      const d = (event as CustomEvent).detail;
      setMetrics(`${d.fps} fps · ready ${(d.readyMs / 1000).toFixed(2)}s · ${d.quality}`);
      setModels(
        performance
          .getEntriesByType('resource')
          .map((r) => r.name)
          .filter((name) => name.includes('/models/') && name.endsWith('.glb'))
          .map((name) => name.split('/').pop())
          .join(', '),
      );
    };
    window.addEventListener('oe-render-metrics', report);
    return () => window.removeEventListener('oe-render-metrics', report);
  }, []);
  if (!enabled) return null;
  async function capture() {
    setStatus('Rendering…');
    const restore: (() => void)[] = [];
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(requestAnimationFrame);
      await document.fonts.ready;
      const node = document.querySelector<HTMLElement>(
        '.showcase-page, .exhibit-wrap, .editorial',
      )!;
      // Resolve logical auto margins before SVG foreignObject cloning. The live
      // browser lays out Astro's display:contents islands correctly; SVG does not.
      node.querySelectorAll<HTMLElement>('.home-container').forEach((container) => {
        const previous = container.getAttribute('style');
        const box = container.getBoundingClientRect();
        const parent = container.parentElement!.getBoundingClientRect();
        container.style.width = `${box.width}px`;
        container.style.marginInline = `${box.left - parent.left}px`;
        restore.push(() =>
          previous === null
            ? container.removeAttribute('style')
            : container.setAttribute('style', previous),
        );
      });
      const { toBlob } = await import('html-to-image');
      const height = node.classList.contains('exhibit-wrap')
        ? Math.min(innerHeight - 72, 1200)
        : node.scrollHeight;
      const blob = await toBlob(node, {
        width: innerWidth,
        height,
        pixelRatio: node.classList.contains('showcase-page') ? 1 : 1.5,
        backgroundColor: '#f7f5f0',
        cacheBust: false,
        filter: (el) =>
          !(
            el instanceof HTMLElement &&
            (el.classList.contains('capture-tools') || el.tagName === 'NOSCRIPT')
          ),
        style: { margin: '0', height: `${height}px`, maxHeight: `${height}px`, overflow: 'hidden' },
      });
      if (!blob) throw new Error('Empty capture');
      await saveMedia(
        blob,
        `openengineering-${node.classList.contains('showcase-page') ? 'home' : node.dataset.exhibit || 'contribution-kit'}-${innerWidth < 761 ? 'phone' : 'desktop'}.png`,
      );
      setPreview(URL.createObjectURL(blob));
      setStatus('PNG ready');
    } catch (e) {
      setStatus('Capture failed — try Chrome');
      console.error(e);
    } finally {
      restore.forEach((reset) => reset());
    }
  }
  function testFallback() {
    const canvas = document.querySelector<HTMLCanvasElement>('.scene-canvas canvas');
    const gl = canvas?.getContext('webgl2');
    const extension = gl?.getExtension('WEBGL_lose_context');
    if (extension) extension.loseContext();
    else setStatus('Context-loss testing is unavailable here');
  }
  async function heroPoster() {
    const source = document.querySelector<HTMLCanvasElement>('.hero-machine canvas');
    if (!source) return;
    const blob = await new Promise<Blob | null>((resolve) => source.toBlob(resolve));
    if (blob) {
      await saveMedia(blob, `openengineering-hero-${innerWidth <= 760 ? 'phone' : 'desktop'}.png`);
      setStatus('Hero poster saved');
    }
  }
  async function homeShare() {
    const source = document.querySelector<HTMLCanvasElement>('.hero-machine canvas');
    if (!source) return;
    await document.fonts.ready;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#101719';
    ctx.fillRect(0, 0, 1200, 630);
    const width = 1000,
      height = (source.height * width) / source.width;
    ctx.drawImage(source, 200, 630 - height, width, height);
    const shade = ctx.createLinearGradient(0, 0, 720, 0);
    shade.addColorStop(0, '#101719');
    shade.addColorStop(0.5, '#101719f5');
    shade.addColorStop(1, '#10171900');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = '#f3f0e9';
    ctx.font = '500 23px "Space Grotesk"';
    ctx.fillText('OpenEngineering', 50, 64);
    ctx.font = '600 61px "Space Grotesk"';
    ['See what makes', 'the world move.'].forEach((line, index) =>
      ctx.fillText(line, 50, 185 + index * 67),
    );
    ctx.font = '24px "DM Sans"';
    ctx.fillText('Understand machines in 3D.', 50, 320);
    ctx.fillText('Free to explore. Open to build on.', 50, 355);
    ctx.fillStyle = '#ed8150';
    ctx.font = '500 16px "DM Sans"';
    ctx.fillText('OPEN CODE. OPEN MODELS. OPEN TO EVERYONE.', 50, 569);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
    if (blob) {
      await saveMedia(blob, 'openengineering-social-home.png');
      setStatus('Share card saved');
    }
  }
  return (
    <div className="capture-tools">
      <button onClick={capture}>{status}</button>
      {document.querySelector('.home-hero') && (
        <button onClick={heroPoster}>Save hero poster</button>
      )}
      {document.querySelector('.home-hero') && (
        <button onClick={homeShare}>Save homepage share card</button>
      )}
      <button onClick={testFallback}>Test WebGL fallback</button>
      <button onClick={() => window.dispatchEvent(new Event('oe-preview-reduced-motion'))}>
        Preview reduced motion
      </button>
      <output aria-label="Renderer measurement">{metrics}</output>
      <output aria-label="Loaded model assets">{models}</output>
      {preview && (
        <details>
          <summary>Preview / save image</summary>
          <a href={preview} download="openengineering-gallery.png">
            <img
              src={preview}
              alt="Exported gallery capture"
              style={{ width: 180, maxHeight: 260, objectFit: 'contain', display: 'block' }}
            />
          </a>
        </details>
      )}
    </div>
  );
}
