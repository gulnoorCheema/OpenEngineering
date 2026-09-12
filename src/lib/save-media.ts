export async function saveMedia(blob: Blob, name: string) {
  // Explicit local authoring mode, served by scripts/capture-server.mjs.
  if (location.origin === 'http://127.0.0.1:4323') {
    const response = await fetch(`/__capture/${name}`, {
      method: 'POST',
      headers: { 'x-openengineering-capture': 'local', 'content-type': blob.type },
      body: blob,
    });
    if (!response.ok) throw new Error('Local capture could not be saved');
    return 'Saved to artifacts/captures';
  }
  const url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return 'Download prepared';
}
