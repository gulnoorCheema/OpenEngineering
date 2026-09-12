import { useEffect, useState } from 'react';
import { saveMedia } from '../lib/save-media';
export default function CaptureTools() {
  const [enabled, setEnabled] = useState(false),
    [status, setStatus] = useState('Save gallery PNG'),
    [preview, setPreview] = useState('');
  useEffect(() => setEnabled(new URLSearchParams(location.search).has('capture')), []);
  if (!enabled) return null;
  async function capture() {
    setStatus('Rendering…');
    try {
      await document.fonts.ready;
      const node = document.querySelector<HTMLElement>('.exhibit-wrap, .editorial')!;
      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(node, {
        pixelRatio: 1.5,
        backgroundColor: '#f7f5f0',
        cacheBust: false,
        style: { margin: '0' },
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
