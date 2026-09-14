/** Homepage curation is independent of an exhibit's collection/featured flag. */
export const homeMechanisms = [
  { id: 'engine', title: 'Four-stroke engine', question: 'How does a push become rotation?' },
  { id: 'jet-engine', title: 'Jet engine', question: 'How does air move an airplane?' },
  { id: 'mechanical-watch', title: 'Mechanical watch', question: 'How does a spring keep time?' },
  { id: 'sewing-machine', title: 'Sewing machine', question: 'How does a needle leave a stitch?' },
  { id: 'gears', title: 'Gear ratios', question: 'Why does stronger mean slower?' },
  { id: 'differential', title: 'Car differential', question: 'Why can wheels turn differently?' },
] as const;

export function legacyEngineLink(search: string, hash: string, destination: string) {
  const query = new URLSearchParams(search);
  const stateKeys = ['chapter', 'mode', 'phase', 'apart', 'cylinders', 'speed'];
  return stateKeys.some((key) => query.has(key)) ? `${destination}${search}${hash}` : null;
}

export function heroPlayback(playing: boolean, ready: boolean, failed: boolean, visible: boolean) {
  return playing && ready && !failed && visible;
}
