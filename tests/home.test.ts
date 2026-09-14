import test from 'node:test';
import assert from 'node:assert/strict';
import { homeMechanisms, heroPlayback, legacyEngineLink } from '../src/lib/home';
import { exhibits } from '../src/content/exhibits';
import { engine } from '../src/content/exhibits/engine';
import { readState } from '../src/lib/exhibit';
test('legacy root links preserve the complete paused engine state and hash under a project base', () => {
  const query =
    '?chapter=a-push&mode=story&phase=3737&apart=1&cylinders=4&speed=0.5&utm_source=launch';
  const link = legacyEngineLink(
    query,
    '#chapter-engine-a-push',
    '/OpenEngineering/exhibits/engine/',
  );
  assert.equal(link, '/OpenEngineering/exhibits/engine/' + query + '#chapter-engine-a-push');
  const state = readState(new URL(link!, 'https://example.com').search, engine);
  assert.equal(state.phase, 3737);
  assert.equal(state.explode, 1);
  assert.equal(state.controls.cylinders, 4);
  for (const q of ['', '?utm_source=producthunt', '?capture=1', '?ref=launch'])
    assert.equal(legacyEngineLink(q, '#collection', '/exhibits/engine/'), null);
  for (const q of ['?phase=0', '?mode=explore', '?cylinders=1'])
    assert.ok(legacyEngineLink(q, '', '/exhibits/engine/'));
});
test('homepage previews resolve distinct real exhibits without changing registry flags', () => {
  assert.deepEqual(
    homeMechanisms.map((e) => e.id),
    ['engine', 'jet-engine', 'mechanical-watch', 'sewing-machine', 'gears', 'differential'],
  );
  for (const item of homeMechanisms) assert.ok(exhibits.find((e) => e.id === item.id));
  assert.equal(new Set(homeMechanisms.map((e) => e.id)).size, 6);
});
test('hero animation requires readiness, playback intent, visibility and a healthy renderer', () => {
  assert.equal(heroPlayback(true, true, false, true), true);
  assert.equal(heroPlayback(false, true, false, true), false);
  assert.equal(heroPlayback(true, false, false, true), false);
  assert.equal(heroPlayback(true, true, true, true), false);
  assert.equal(heroPlayback(true, true, false, false), false);
});
