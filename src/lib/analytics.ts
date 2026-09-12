// No network request, cookie, replay or automatic capture is enabled by default.
export type EventName =
  'exhibit_start' | 'experiment_change' | 'story_complete' | 'share' | 'contribution_click';
export type AnalyticsAdapter = (
  event: EventName,
  properties: { exhibit?: string; control?: string; destination?: string },
) => void;
let adapter: AnalyticsAdapter | undefined;
export function setAnalyticsAdapter(next?: AnalyticsAdapter) {
  adapter = next;
}
export function track(event: EventName, properties: Parameters<AnalyticsAdapter>[1]) {
  try {
    adapter?.(event, properties);
  } catch {
    /* Metrics must never interrupt learning. */
  }
}
