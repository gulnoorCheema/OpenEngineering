# Validation record

Recorded September 12, 2026. Update this file when new checks are completed; do not turn targets into results.

## Completed locally

- `npm test`: 10 tests pass. Coverage includes constant connecting-rod length over forward/reverse motion, the full 720° engine cycle, stroke/valve timing, the 1–3–4–2 power sequence, gear direction/pitch motion/ideal power, differential mean speed and held output, invalid inputs, manifest integrity, and chapter state restoration.
- Production build: passed Astro/TypeScript checks (zero errors, warnings, or hints) and generated ten static pages, including the recording studio. Vite reports the expected large Three.js bundle; this is not a measured phone-performance result.
- Browser interaction: engine pause, keyboard Home/Arrow scrubbing, chapter switching, one/four cylinder selection, free exploration, and differential turning direction operated in the local browser.
- Original screenshots and recordings are generated from the actual rendered application. Export status is recorded in `launch/ASSETS.md` when complete.
- Responsive layout: the in-app browser at 390 pixels showed a stacked model and explanation with no horizontal page overflow. Desktop layout was also inspected at 1440 pixels.
- Contribution-kit smoke test: in an isolated temporary copy, `npm run new-exhibit -- belt-drive` created the starter, its test passed, and the build produced the new exhibit page. This verifies the scaffold, not an unfamiliar person's experience using it.
- Initial GitHub Pages deployment passed its mechanical tests and production build. Public routes returned HTTP 200 and used the correct `/OpenEngineering/` asset prefix.
- Final local build: all ten pages generated; a static link check found no missing local `href` or `src` targets.
- Real WebGL context-loss check: the browser's `WEBGL_lose_context` extension removed the scene, and the player displayed “The story still works” with its written-story link and calculated controls retained. A normal viewport unmount no longer reports a false rendering failure.
- Media: inspected representative engine, gear, differential, contribution-card, and gallery frames. H.264 exports are 20 seconds for the three portrait clips and 55 seconds for the landscape demo. See [the asset index](../launch/ASSETS.md).

## Deployed release check

Application revision `56e5945` passed [GitHub's clean install, tests, build, and deployment](https://github.com/gulnoorCheema/OpenEngineering/actions/runs/34681362756). The live site was checked in the Codex in-app browser:

- An engine share link restored chapter seven, four cylinders, and the paused 638° moment. Keyboard Home/ArrowRight moved to 1°; Reset restored the current chapter's 420° preset and four cylinders.
- The 16-to-48 gear preset displayed 0.33× output speed and 3.00× ideal torque.
- Changing differential turn direction exchanged the 0.80× and 1.20× outputs. The held-output chapter displayed 0.00× and 2.00× around a 1.00× carrier.
- A genuine WebGL context loss on the public site displayed the readable fallback. No production JavaScript errors were observed during these checks.
- The local recording studio switched scenes without the former false context-loss message.

Native Chrome/Safari checks were blocked because the Mac was locked. The in-app browser and desktop viewport checks are not substitutes for those checks or a real touch-device test.

## Required before claiming launch readiness

- [ ] Ten observed beginner sessions; target 8/10 discover a meaningful interaction and 7/10 explain the mechanism afterward.
- [ ] One unfamiliar contributor runs setup and edits the starter without coaching.
- [ ] Independent mechanical review of the release revision.
- [ ] Safari and Chrome checks on the production build.
- [ ] Real touch-device interaction, five-second loading target, and usable 30 fps measured on a representative phone.
- [ ] Complete keyboard flow and reduced-motion behavior on native browsers.
- [x] Genuine WebGL failure, chapter share restoration, and reset on deployed application revision `56e5945`.
- [ ] Product Hunt eligibility questions resolved; working name considered against existing uses.

Use `launch/validation-worksheet.csv` for participant observations. A scripted browser check is not a beginner session or an independent contributor test. Desktop viewport emulation is not real-phone performance evidence.

## Performance measurement procedure

Use a cold production load on the chosen phone and network, record device/browser/network, and time from navigation to a usable scene. `performance.mark('exhibit-ready:<id>')` is emitted after the selected scene mounts; correlate it with visual readiness. Record several runs, not one favorable sample. Observe frame pacing while playing and manipulating the controls; the player advances state at a target 30 updates/s, which is not a measured frame-rate guarantee. Stop animations in hidden/offscreen content.

## Metrics

Analytics collection is disabled. The optional explicit-event adapter emits no requests unless deliberately configured. Interaction completions, learning observations, external contribution results, and social/launch engagement must be reported separately.
