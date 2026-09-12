# Build log — September 12, 2026

This is a factual account of the build, not a transcript of prompts that were never run.

## Actual brief

The maintainer asked Astra in Codex to implement the supplied OpenEngineering plan: three interactive exhibits, a shared player, original explanations, a warm technical design, a public contribution foundation, and a September 18 launch package. Earlier research and the supplied social screenshots informed that plan.

## What Astra did

- Authored Astro/React/TypeScript code and original procedural Three.js models.
- Separated the engine, gear, and differential equations from rendering.
- Wrote the original story manifests, limitations, sources, and contributor documents.
- Used the browser to inspect rendering and operate the controls; ran local mechanics and build checks.
- Prepared launch copy, outreach drafts, a recording studio, and actual scene exports.

No runtime AI was added to the product. Visitors need no account or API key. No third-party book pages, videos, or model assets were copied.

## Corrections and tradeoffs

1. **Peer dependency mismatch:** React 19.3 did not satisfy the installed React Three Fiber range. The project uses React 19.2 with a lockfile; the conflict was resolved without forcing dependency installation.
2. **Kinematics versus dynamics:** the engine prescribes a crank angle. It does not solve combustion pressure, flywheel acceleration, or output power. The explanation and readouts were written to match that boundary.
3. **Four-cylinder phasing:** the first offset array would have produced a 1–2–4–3 sequence while the text said 1–3–4–2. The corrected offsets are tested by observing which cylinder reaches its power stroke at successive 180° intervals.
4. **Rendering compatibility:** a shadow helper produced an incorrect gray plane and repeated Three.js warnings. It was replaced with standard percentage-filtered shadows and a transparent shadow receiver.
5. **URL restoration:** chapter defaults, including four cylinders and the held differential output, must restore from a direct link. Shared experiment values override those defaults only when valid.
6. **Accessible range names:** numeric outputs and sliders share a visual label, but each range also needs an explicit accessible name.
7. **Recording and failure handling:** the demo exposed a false failure message when R3F intentionally disposed an old WebGL context. The context-loss listener now cleans up with its viewport. A deliberate context-loss test still activates the readable fallback, and reloading restores the scene.

## Reusable prompt material

`ASTRA-BRIEF.md` contains a reusable authoring brief and suggested future prompts. Those examples are **templates**, not claimed verbatim historical prompts or evidence of an independent review.

## Evidence and pending work

The repository history, executable tests, static build, scene recordings, and `VALIDATION.md` provide inspectable evidence. Human beginner sessions, an unfamiliar contributor's setup test, and independent mechanical review are still pending. No fabricated reviewers, testimonials, study results, or performance guarantees are included.

## Contribution-kit check

An isolated copy generated a fourth gear-starter exhibit, passed all eleven tests (the ten project checks plus its example), and built its static page. This caught an initial test assumption about collection array positions; tests now select exhibits by stable IDs. This automated setup check does not replace a test with an unfamiliar contributor.

## Cinematic redesign

The maintainer requested light editorial pages, dark 3D scenes and scroll-driven stories with an immediate free lab. Astra implemented that brief in the existing Astro application, preserving the mechanics and chapter IDs.

- Created 23 original named parts with Blender 5.2, including beveled piston lands, a shaped rod, counterweights, cutaway head/passages, ceramic plug, helical springs, gears, bearings and a carrier. Committed editable part-library and assembled-engine sources with a reproducible script.
- Exported a Draco-compressed GLB (under 0.5 MB) and generated a small local HDR reflection map. An overly dense Bezier spring was reduced to a sampled polyline before export.
- Replaced per-frame UI updates with a shared render-loop clock and throttled readouts. Camera and assembly transitions are independent of the crank angle.
- Added phase-derived gas, intake/exhaust flow and ignition. A live-uniform reference corrected a shader that initially stayed cyan through the power stroke. The gas proxy uses front faces so the opaque rear chamber wall cannot discard it. Effects are suppressed during disassembly.
- Added native scroll chapter activation, phone rotation opt-in, meaningful low-effects mode, staged reveals and keyboard part inspection. A narrow two-column breakpoint corrected a tiny intermediate-width model.
- Applied the same lighting to the companion exhibits and recording studio. Added original model thumbnails and refreshed media from the actual renderer.

The machine meshes and flame are teaching illustrations. The existing equations still determine all kinematics; this revision adds no pressure, temperature, efficiency or manufacturing claims.

A later visual check caught interpolated normals crossing the gear lightening bores. The gear material uses flat face normals so the planar web remains flat instead of appearing melted.

The final differential close-up revealed gaps between the bevel gears and exposed the need for opposite spider rotation about the same carrier-local axis. Their pitch cones now meet at a common apex, and a tangential-motion test checks both spiders against the side gear across forward/reverse and held-output states. The mean-speed behavior is unchanged.

The engine's radial cam profile was aligned with the ideal sinusoidal valve lift, replacing a decorative two-circle lobe. Its quarter-turn active region and separate exhaust offset follow the two-turn engine cycle. It remains an illustrative radial follower, not a manufacturing cam profile.
