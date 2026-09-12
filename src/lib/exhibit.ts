import type { MotionRef, Quality } from './presentation';
export type Vec3 = [number, number, number];
export type Controls = Record<string, number>;
export interface Source {
  title: string;
  url: string;
  note?: string;
}
export interface Control {
  id: string;
  label: string;
  kind: 'range' | 'select';
  default: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: number }[];
}
export interface StoryStep {
  id: string;
  title: string;
  label: string;
  body: string;
  why: string;
  experiment: string;
  deeper: string;
  parts: string[];
  controls: string[];
  phase: number;
  camera: Vec3;
  defaults?: Controls;
  presentation?: {
    target?: Vec3;
    fov?: number;
    reveal?: string[];
    annotation?: { text: string; anchor: Vec3 };
  };
}
export interface Exhibit {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  question: string;
  duration: string;
  author: string;
  scene: string;
  period: number;
  speed: number;
  controls: Control[];
  parts: { id: string; name: string; description: string }[];
  steps: StoryStep[];
  sources: Source[];
  limitations: string;
  assetCredits: string;
}
export interface SceneProps {
  motion?: MotionRef;
  quality?: Quality;
  effects?: boolean;
  reduced?: boolean;
  reveal?: string[];
  phase: number;
  explode: number;
  controls: Controls;
  stage: number;
  selected: string;
  onSelect: (id: string) => void;
}
export const defaultControls = (exhibit: Exhibit): Controls =>
  Object.fromEntries(exhibit.controls.map((c) => [c.id, c.default]));
export function readState(query: string, exhibit: Exhibit) {
  const params = new URLSearchParams(query);
  const requested = exhibit.steps.findIndex((s) => s.id === params.get('chapter'));
  const controls = {
    ...defaultControls(exhibit),
    ...exhibit.steps[Math.max(0, requested)].defaults,
  };
  for (const c of exhibit.controls) {
    if (!params.has(c.id)) continue;
    const v = Number(params.get(c.id));
    if (!Number.isFinite(v)) continue;
    if (c.kind === 'select') {
      if (c.options?.some((o) => o.value === v)) controls[c.id] = v;
    } else
      controls[c.id] = Math.min(
        c.max!,
        Math.max(c.min!, Math.round(v / (c.step || 1)) * (c.step || 1)),
      );
  }
  const phase = Number(params.get('phase'));
  return {
    step: Math.max(0, requested),
    mode: params.get('mode') === 'explore' ? ('explore' as const) : ('story' as const),
    controls,
    phase:
      params.has('phase') && Number.isFinite(phase)
        ? Math.min(1000000, Math.max(0, phase))
        : exhibit.steps[Math.max(0, requested)].phase,
    explode: params.get('apart') === '1' ? 1 : 0,
  };
}
export function shareQuery(
  exhibit: Exhibit,
  step: number,
  mode: string,
  phase: number,
  explode: number,
  controls: Controls,
) {
  const q = new URLSearchParams({
    chapter: exhibit.steps[step].id,
    mode,
    phase: String(Math.round(phase)),
    apart: String(explode),
  });
  for (const c of exhibit.controls) q.set(c.id, String(controls[c.id]));
  return q.toString();
}
