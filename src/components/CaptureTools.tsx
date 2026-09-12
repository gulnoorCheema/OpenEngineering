import { useEffect, useState } from 'react';
import { saveMedia } from '../lib/save-media';
export default function CaptureTools() {
  const [enabled, setEnabled] = useState(false),
    [status, setStatus] = useState('Save gallery PNG'),
    [preview, setPreview] = useState(''),
    [metrics, setMetrics] = useState('Measuring renderer…');
  useEffect(() => {
    setEnabled(new URLSearchParams(location.search).has('capture'));
    const report = (event: Event) => {
      const d = (event as CustomEvent).detail;
      setMetrics(`${d.fps} fps · ready ${(d.readyMs / 1000).toFixed(2)}s · ${d.quality}`);
    };
    window.addEventListener('oe-render-metrics', report);
    return () => window.removeEventListener('oe-render-metrics', report);
  }, []);
  if (!enabled) return null;
  async function capture() {
    setStatus('Rendering…');
    try {
      await document.fonts.ready;
      const node = document.querySelector<HTMLElement>('.exhibit-wrap, .editorial')!;
      const { toBlob } = await import('html-to-image');
      const height = node.classList.contains('exhibit-wrap')
        ? Math.min(innerHeight - 72, 1200)
        : node.scrollHeight;
      const blob = await toBlob(node, {
        height,
        pixelRatio: 1.5,
        backgroundColor: '#f7f5f0',
        cacheBust: false,
        style: { margin: '0', height: `${height}px`, maxHeight: `${height}px`, overflow: 'hidden' },
      });
      if (!blob) throw new Error('Empty capture');
      await saveMedia(
        blob,
        `openengineering-${node.dataset.exhibit || 'contribution-kit'}-${innerWidth < 761 ? 'phone' : 'desktop'}.png`,
      );
      setPreview(URL.createObjectURL(blob));
      setStatus('PNG ready');
    } catch (e) {
      setStatus('Capture failed — try Chrome');
      console.error(e);
    }
  }
  function testFallback() {
    const canvas = document.querySelector<HTMLCanvasElement>('.scene-canvas canvas');
    const gl = canvas?.getContext('webgl2');
    const extension = gl?.getExtension('WEBGL_lose_context');
    if (extension) extension.loseContext();
    else setStatus('Context-loss testing is unavailable here');
  }
  return (
    <div className="capture-tools">
      <button onClick={capture}>{status}</button>
      <button onClick={testFallback}>Test WebGL fallback</button>
      <button onClick={() => window.dispatchEvent(new Event('oe-preview-reduced-motion'))}>
        Preview reduced motion
      </button>
      <output aria-label="Renderer measurement">{metrics}</output>
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
