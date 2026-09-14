# OpenEngineering

**Understand how machines work. Play with them in 3D.**

A free, open-source collection of interactive mechanical explanations, built with GPT-6 Astra. Scroll through an illustrated story or enter the free lab immediately. Original machined 3D assemblies, cutaway gas flow and phase-driven combustion make the hidden motion visible.

## Explore

**[Open the live exhibits](https://gulnoorcheema.github.io/OpenEngineering/)** · [Watch the demo](launch/assets/openengineering-demo.mp4)

- **The sewing machine:** follow an upper-thread loop around a bobbin, then change the stitch spacing.
- **The jet engine:** follow two streams through a turbofan and compare bypass mass-flow ratios.
- **The mechanical watch:** inspect an alternating escapement and change the balance rhythm.
- **The four-stroke engine:** follow expanding gas through a piston, connecting rod, crank, valves, and a complete 720-degree cycle.
- **Gear ratios:** trade speed for turning force and watch the relationship change.
- **The differential:** see how two driven wheels turn at different speeds while their average follows the input.

These are simplified teaching models. The explanations, equations, and limitations are available inside each exhibit. They are not manufacturing drawings or performance predictions.

## Run locally

Use Node.js 24 LTS and npm (`nvm use` reads the included `.nvmrc` if you use nvm). Fork the repository first if you plan to submit a pull request, then clone your fork. To try the upstream project:

```sh
git clone https://github.com/gulnoorCheema/OpenEngineering.git
cd OpenEngineering
npm ci
npm run dev
```

Open the local address printed by Astro. No account, API key, or hosted database is required.

```sh
npm test
npm run build
npm run preview
```

The production build is in `dist/`. GitHub Actions runs mechanical tests, type checking, and the build before publishing to GitHub Pages. Set `SITE_URL` and `BASE_PATH` when deploying under a different domain or repository path.

## Make the next exhibit

```sh
npm run new-exhibit -- your-mechanism
```

Start with [the exhibit authoring guide](docs/AUTHORING.md), [the design system](docs/DESIGN.md), and [the Astra brief](docs/ASTRA-BRIEF.md). The gear exhibit is the smallest complete example. The scaffold registers a working gear starter with inherited gear explanations, credits, preview images, and a sample test. Replace the sample author, story, model, images, and test before proposing a finished mechanism. The studio supplies a default recording until you add your own shot direction.

Contributions can be explanations, technical references, accessibility fixes, translations, models, or code. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [starter opportunities](docs/GOOD-FIRST-ISSUES.md).

**Working with an agent?** Give it the repository and [AGENTS.md](AGENTS.md). That file covers setup, project rules, task-specific instructions, and verification. [Copy the contributor starter prompt](CONTRIBUTING.md#work-with-an-agent) to give it a concrete task.

## How it is built

Astro serves static pages. React and React Three Fiber render the selected interactive scene. TypeScript functions implement the mechanical relationships independently of rendering. There is no AI call during a visitor's session.

Editable Blender sources and the reproducible export command are documented in [the artwork guide](assets/source/README.md).

The [build log](docs/BUILD-LOG.md) records what Astra helped produce and what has actually been checked. The [validation record](docs/VALIDATION.md) distinguishes automated/browser checks from external mechanical review and beginner testing.

## Sources and credits

This project is inspired by the curiosity of _The Way Things Work_, Bartosz Ciechanowski's interactive essays, and the explorable-explanations community. Text, code, Blender models and the studio reflection map were authored for this project. No third-party book pages, model assets, screenshots, or videos are incorporated.

Technical sources include NASA Glenn's four-stroke explanation, Eaton's differential introduction, and the gear-ratio relationships documented by Ciechanowski. See [SOURCES.md](SOURCES.md) for links, scope, and limitations.

This independent project is not affiliated with The Open University, whose OpenEngineering Laboratory is a separate educational service, or with OpenAI or Product Hunt. Astra is credited as a development tool.

## License

- Project code and developer documentation: [MIT](LICENSE).
- Original exhibit prose, Blender sources, models, environment and exported illustrations: [CC BY 4.0](CONTENT-LICENSE.md).
- Dependencies and fonts retain their own licenses; see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Launch materials

The `launch/` directory contains the Product Hunt copy, demo scripts, outreach drafts, eligibility notes, and a validation worksheet. Future launch targets are goals, not reported achievements. External outreach and the Product Hunt submission require the maintainer's review of the finished materials.
