# Product Hunt submission package

Status: updated September 14, 2026 for the six-exhibit release. Prepared for the maintainer to review and submit; not submitted or scheduled.

Live product: https://gulnoorcheema.github.io/OpenEngineering/
Repository: https://github.com/gulnoorCheema/OpenEngineering
Asset index: [ASSETS.md](ASSETS.md)

## Name

OpenEngineering

## Tagline

Explore machines in 3D. Free and open source.

## Description

Get inside six machines, from jet engines to mechanical watches. Follow a 3D story, change a control, and see why it works. Free to explore, with open code, original models, and explanations you can reuse. Built with GPT-6 Astra.

## Maker comment

I've always loved the moment an explanation makes something click. A machine you've seen a hundred times suddenly makes sense when you can see what's happening inside.

I wanted more people to have that experience, so I built OpenEngineering: a free, open-source place to understand machines through interactive 3D stories.

Start with a jet engine and follow the air through it. Look underneath a sewing machine to see how two threads form a stitch. Slow down a mechanical watch to watch its escapement release. There are six exhibits to explore, including a four-stroke engine, gear ratios, and a car differential. Each has a guided story, controls you can experiment with, and sources explaining the model's limits. No sign-up or API key is needed.

The open part matters to me. The code is MIT-licensed. The original explanations, editable Blender models, and artwork are CC BY 4.0, so you can reuse and adapt them with credit. You can run the site yourself, improve an explanation, or build the next exhibit. Third-party dependencies keep their own licenses.

To make contributing practical, the repo includes a shared 3D player, a working gear starter, design rules, calculation tests, and AGENTS.md instructions you can give your coding agent. Writers and researchers can help with explanations and sources too.

I used GPT-6 Astra in Codex to help research, write, build, and check the project. It also needed correction. Our first engine cylinder offsets didn't match the stated firing order; we fixed them and added a test for the 1–3–4–2 sequence. These are simplified teaching models, and the equations and limitations are there to inspect alongside the visuals.

Try a mechanism and tell me which part clicked, or where the explanation lost you. If you can make one of the stories clearer, I'd love your contribution.

## Shoutouts

- OpenAI / GPT-6 Astra: research, development, authoring, and revision.
- ChatGPT / Codex: the development environment.
- Astro, React, Three.js / React Three Fiber: the application and rendering stack.

Choose up to three applicable topics available in the submission UI, prioritizing open source, education, and interactive 3D. Verify the available topics in that UI.

## Gallery order and captions

1. [Homepage desktop](assets/openengineering-home-desktop.png): “Six machines. Get inside and see what makes them work.”
2. [Jet engine desktop](assets/openengineering-jet-engine-desktop.png): “Follow the air. Change the bypass ratio. See where each stream goes.”
3. [Mechanical watch phone](assets/openengineering-mechanical-watch-phone.png): “Slow down the mechanism and follow its story on your phone.”
4. [Contribution kit](assets/openengineering-contribution-kit-desktop.png): “Open code, editable models, and a starter for the next contributor.”

Use the [512-pixel icon](assets/openengineering-icon.png) as the thumbnail. Review each final export before uploading, particularly the contribution screenshot against the current page. Phone imagery demonstrates layout; it does not establish real-device performance. Do not add testimonials, awards, reviewer badges, contributor counts, or traffic numbers that have not been earned and verified.

## Demo

Use [New ways to wonder](assets/openengineering-new-collection.mp4), approximately 55 seconds, as the primary demo. It shows the sewing machine, jet engine, mechanical watch, and contribution closing card, using the actual scene renderer. The gallery and description establish that the full product includes six exhibits.

Keep [the original collection demo](assets/openengineering-demo.mp4) as a secondary clip for the engine, gear experiments, and differential. All six portrait clips are available in the asset index. The supplied files are local exports, not hosted video URLs; use the submission UI's supported upload or video-link flow without inventing a hosted link.

## Submission checks

The maintainer confirmed on September 14 that runtime AI calls are not required for this challenge. See [eligibility notes](eligibility.md) for the source of that confirmation and the remaining submission-flow checks.

Target September 18, 2026 at 12:01 a.m. Pacific, verifying the actual scheduled date/time in Product Hunt. Confirm any challenge enrollment and prize conditions in the authenticated flow. A live website and prepared package do not establish that Product Hunt accepted or scheduled the entry. Invite people to try the product and leave specific feedback; do not ask for upvotes.
