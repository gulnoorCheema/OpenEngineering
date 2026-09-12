# Product Hunt submission package

Status: prepared copy and launch assets; not submitted or scheduled.

Live product: https://gulnoorcheema.github.io/OpenEngineering/
Repository: https://github.com/gulnoorCheema/OpenEngineering
Asset index: [ASSETS.md](ASSETS.md)

## Name

OpenEngineering

## Tagline — 51 characters

Understand how machines work. Play with them in 3D.

## Description — 217 characters

Take apart an engine, change a gear ratio, and see why car wheels turn at different speeds. Free, open-source 3D explanations built with GPT-6 Astra. Explore a mechanism, follow its story, or help create the next one.

## Maker comment — review before publishing

I've always loved the moment an explanation makes something click. The engine you see every day suddenly becomes a sequence of small, clever ideas.

That is why I built OpenEngineering: free interactive 3D stories for curious people. You can follow an engine from a push to a working cycle, change a gear ratio, or explore why a car's driven wheels turn at different speeds. Pause it, take it apart, and follow the part you are curious about.

I used GPT-6 Astra in Codex to help research, write, build, and check the experience. The equations are separate from the 3D scenes, and each exhibit states its sources and simplifications. Visitors do not need an AI account or an API key.

One concrete correction during the build: our first cylinder offsets did not match the stated firing order. We corrected them and added a test that checks the actual 1–3–4–2 sequence. We also made clear that the engine animation calculates motion, not combustion pressure or flywheel dynamics.

The code, original models, and explanations are open. There is also a shared player, a starter exhibit, a design guide, and an Astra brief so the next contributor can spend more time explaining a mechanism and less time rebuilding the interface.

I would love specific feedback: which moment made something click, and where did the explanation lose you? If you know a mechanism that deserves this treatment, help us make the next exhibit.

## Shoutouts

- OpenAI / GPT-6 Astra — research, development, authoring, and revision.
- ChatGPT / Codex — the development environment.
- Astro, React, Three.js / React Three Fiber — the application and rendering stack.

Choose up to three applicable topics available in the submission UI, prioritizing open source, education, and interactive 3D. Do not claim a topic exists until inspected.

## Gallery

1. Engine: a working cutaway with its story and controls.
2. Gears: the experiment and corresponding speed/torque relationship.
3. Phone: the same application at a narrow viewport.
4. Contribution kit: the project's real authoring resources and three starter opportunities.

Use actual product captures. Do not add fabricated testimonials, awards, reviewer badges, contributor counts, or traffic numbers.

## Demo

The supplied 55-second demo shows motion immediately, then the engine's causal sequence, gear-ratio experiments, differential behavior, and the contribution foundation. It records the actual scene modules with captions; the gallery shows the full application interface. See `demo-scripts.md`.

## Submission gate

Read `eligibility.md` before publishing. Launch date is September 18, 2026 at 12:01 a.m. Pacific. A prepared local package or live GitHub site is not evidence that Product Hunt accepted or scheduled a submission.
