# Validation record

## Homepage release — September 13

The cinematic discovery homepage has 28 passing tests and a successful 14-page production build. The new collection page and all six exhibit destinations were checked. Legacy root engine state redirects preserve query and fragment and restore paused cycle state; tracking-only visits remain on the homepage. The live jet's pause/reveal, reduced-motion preview, genuine context loss and offscreen suspension were exercised. Only the jet GLB loaded on a fresh homepage.

See [the complete design QA](../design-qa.md) for production screenshots, comparison iterations, keyboard/Back checks, media review and measurement conditions. Local desktop readiness was approximately 0.78–0.89 seconds, with a 120 fps high-quality sample. These are host-Mac / in-app-browser / localhost observations, not real-phone performance. Native Safari, real touch hardware, OS-level reduced-motion checks and cold phone-network targets remain pending.

Recorded September 12, 2026. Update this file when new checks are completed; do not turn targets into results.

## New collection revision — September 12

- Added sewing machine, jet engine, and mechanical watch through the existing manifest/scene registry. The engine homepage and original three exhibit IDs remain. Counts and collection cards derive from the six-entry registry.
- `npm test`: 24 tests passed, including the existing mechanical suite. New checks cover needle-clear feed, exact stitch spacing, hook/loop alignment and backward phase; jet mass-flow partition, separate passage bounds, connected shafts and stationary stators; watch beats, alternating releases, train ratios, hand rates and hairspring anchoring. Asset checks verify separate compressed GLBs, semantic nodes and finite bounds. Recording checks include all six scenes, both demos and a negative initial timestamp regression. These tests do not establish real thread dynamics or manufacturing geometry.
- Production build passed Astro/TypeScript checking and generated 13 static pages. Each new GLB is under 1 MB. Separate lazy scene imports and explicit per-scene model paths preserve the original engine asset default.
- In-app browser checks: 390 px sewing/watch layouts, 737 px jet/watch layouts, 1024 px sewing/watch layouts and 1440 px scene compositions. The phone layout had no horizontal page overflow. These are desktop viewport checks, not touch-hardware certification.
- Exercised 4 mm sewing feed and stage seeking, 10:1 jet bypass (9.1% core / 90.9% bypass), 3 Hz watch (6 beats/s, 0.75× hand rate), part selection, keyboard reverse scrubbing, reset, story/free switching and browser Back. A watch chapter link restored its exact paused phase and control values.
- The reduced-motion preview retained explicit controls. Deliberate `WEBGL_lose_context` on the sewing scene displayed the readable fallback with calculated controls and written chapters intact; reload restored the model.
- Original Blender sources and their generated GLBs were exported with the committed script. Reviewed actual portrait frames for all three mechanisms, the combined demo’s jet/watch/closing frames, share cards and exported galleries. New clips are H.264/yuv420p at 30 fps: three 20-second portraits and one 55-second landscape demo; the original demo remains. A production static-target check found no missing local href/src destinations.

Real-phone five-second interaction / 30 fps targets, native Safari testing, independent mechanical review, beginner comprehension sessions and the unfamiliar-contributor test remain **pending**. Prior release checks below are historical evidence, not new measurements for this collection.

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

Use a cold production load on the chosen phone and network, record device/browser/network, and time from navigation to a usable scene. `performance.mark('exhibit-ready:<id>')` is emitted after the selected scene mounts; correlate it with visual readiness. Record several runs, not one favorable sample. Observe frame pacing while playing and manipulating the controls; the renderer advances on its frame clock and UI readouts sample at 10 Hz, which is not a measured frame-rate guarantee. Stop animations in hidden/offscreen content.

## Metrics

Analytics collection is disabled. The optional explicit-event adapter emits no requests unless deliberately configured. Interaction completions, learning observations, external contribution results, and social/launch engagement must be reported separately.

## Cinematic redesign verification — September 12

This section supersedes the earlier renderer/layout observations above.

- 14 automated tests pass, adding phase-pure effects, chamber/piston bounds across all four cylinders and reverse scrubbing, and named GLB-node/compression checks. Astro reports zero errors, warnings or hints; the ten-page static build succeeds.
- Inspected the engine at 1440 × 1000, 737 × 1000, 1024 × 900 and 390 × 844. The intermediate-width view keeps the large vertical stage; phones keep the stage above the editorial story and expose an explicit rotate control.
- Inspected paused intake, ignition and power states; fixed the live shader-uniform reference when power initially retained cyan intake coloring. Source geometry now exposes the intake/exhaust passages. Pure-function checks cover exhaust gating and effect bounds at every sampled phase.
- Native Chrome exercised keyboard Home/ArrowRight scrubbing (1°), chapter-seven navigation with four cylinders, story/free mode switching and browser Back. A long smooth page-scroll race initially landed on chapter six; explicit navigation now seeks the page immediately while the camera transitions independently. The subsequent chapter-seven URL and four-cylinder state remained stable.
- The in-app browser verified 16-to-48 ratios (0.33× output, 3.00× ideal torque), reversed differential direction (1.20× / 0.80×) and held output (0.00× / 2.00×).
- Chrome's authoring reduced-motion preview starts paused, suppresses gas/bloom and camera travel, and retains the explicit Play control. This tests the same renderer branch used by the OS preference; it is not a change to the system preference.
- A genuine Chrome `WEBGL_lose_context` test displayed “The story still works.” and retained the written explanation.
- Production renderer observations after moving the readiness probe inside the asset boundary: the in-app browser at 1440 × 1000 reported 0.83 s to the rendered model and 120 fps at high quality; at 390 × 844 it reported 0.80 s and 120 fps at low quality. These are desktop GPU/loopback observations with previously loaded assets, not a cold mobile-network or real-phone performance result. An earlier native Chrome sample ran at 46 fps at high quality; its earlier readiness probe was replaced, so its load timing is not used. The authoring panel exposes local measurements via `?capture=1`; no results are transmitted.
- Native Safari could not be inspected because the Mac was locked and automatic unlock failed. Real touch hardware, OS-level reduced-motion verification, and the representative-phone five-second / 30 fps target remain pending.

The app's mechanism transforms now advance in the R3F render loop; React readouts update at 10 Hz. That update cadence is not a frame-rate guarantee. Auto quality reduces effects after sustained sub-27-fps windows. No human reviewer badge or beginner-study result has been added.

The final differential review corrected the common pitch-cone placement and opposing spider directions. A new test compares tangential motion at the side/spider contact in forward, reverse, straight and held-output cases, in addition to the existing mean-speed invariant.
