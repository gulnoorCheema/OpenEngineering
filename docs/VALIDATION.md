# Validation record

Recorded September 12, 2026. Update this file when new checks are completed; do not turn targets into results.

## Completed locally

- `npm test`: 10 tests pass. Coverage includes constant connecting-rod length over forward/reverse motion, the full 720° engine cycle, stroke/valve timing, the 1–3–4–2 power sequence, gear direction/pitch motion/ideal power, differential mean speed and held output, invalid inputs, manifest integrity, and chapter state restoration.
- Initial production build: passed Astro/TypeScript checks and generated all nine initial public pages. Final build is rerun after launch tooling and documentation changes.
- Browser interaction: engine pause, keyboard Home/Arrow scrubbing, chapter switching, one/four cylinder selection, free exploration, and differential turning direction operated in the local browser.
- Original screenshots and recordings are generated from the actual rendered application. Export status is recorded in `launch/ASSETS.md` when complete.

## Required before claiming launch readiness

- [ ] Ten observed beginner sessions; target 8/10 discover a meaningful interaction and 7/10 explain the mechanism afterward.
- [ ] One unfamiliar contributor runs setup and edits the starter without coaching.
- [ ] Independent mechanical review of the release revision.
- [ ] Safari and Chrome checks on the production build.
- [ ] Real touch-device interaction, five-second loading target, and usable 30 fps measured on a representative phone.
- [ ] Keyboard flow, reduced-motion behavior, genuine WebGL failure, chapter share restoration, and reset on production.
- [ ] Product Hunt eligibility questions resolved; working name considered against existing uses.

Use `launch/validation-worksheet.csv` for participant observations. A scripted browser check is not a beginner session or an independent contributor test. Desktop viewport emulation is not real-phone performance evidence.

## Performance measurement procedure

Use a cold production load on the chosen phone and network, record device/browser/network, and time from navigation to a usable scene. `performance.mark('exhibit-ready:<id>')` is emitted after the selected scene mounts; correlate it with visual readiness. Record several runs, not one favorable sample. Observe frame pacing while playing and manipulating the controls; the player advances state at a target 30 updates/s, which is not a measured frame-rate guarantee. Stop animations in hidden/offscreen content.

## Metrics

Analytics collection is disabled. The optional explicit-event adapter emits no requests unless deliberately configured. Interaction completions, learning observations, external contribution results, and social/launch engagement must be reported separately.
