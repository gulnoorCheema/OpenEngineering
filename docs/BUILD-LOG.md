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

## Reusable prompt material

`ASTRA-BRIEF.md` contains a reusable authoring brief and suggested future prompts. Those examples are **templates**, not claimed verbatim historical prompts or evidence of an independent review.

## Evidence and pending work

The repository history, executable tests, static build, scene recordings, and `VALIDATION.md` provide inspectable evidence. Human beginner sessions, an unfamiliar contributor's setup test, and independent mechanical review are still pending. No fabricated reviewers, testimonials, study results, or performance guarantees are included.
