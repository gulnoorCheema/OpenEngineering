# Make an exhibit

Start by running the gear exhibit, the smallest complete example. The differential uses the same manifest, player, controls, and source interface; no separate application shell was built for it.

## Local setup

Use Node 24 LTS and npm. Clone the repository, run `npm ci`, then `npm run dev`. Follow the URL printed by Astro. Run `npm test` and `npm run build` before opening a pull request. There are no credentials or environment variables required for local use.

## Create a working starting point

Run `npm run new-exhibit -- belt-drive`. This creates a manifest, a scene wrapper, and a calculation test, then registers the exhibit. Visit `/exhibits/belt-drive/`. It deliberately begins as a clearly labeled **gear starter**, with gear content inherited from `gears.ts`. Replace that content before proposing a new mechanism. Do not describe the starter as a finished belt drive.

The command refuses invalid slugs and existing files. It expects to run from the project root. It does not download assets, call an AI service, or publish anything.

## Three extension points

1. **Manifest** (`src/content/exhibits/`): identity, title, question, duration, author, sources, asset credits, limitations, controls, parts, and ordered steps. `src/lib/exhibit.ts` defines the TypeScript contract. Each chapter has a stable `id` for sharing.
2. **Scene module** (`src/components/scenes/`): receives `phase`, `controls`, `explode`, `stage`, `selected`, and `onSelect`. Build geometry from that state. Register the lazy module in `registry.ts`; only the selected scene loads. `stage = 99` means free exploration.
3. **Story steps**: one idea at a time. `body` explains what changed, `why` explains the need, and `experiment` tells the learner what to try. `camera` is a three-number position. `parts` identifies the focus. `controls` lists relevant control IDs; optional `defaults` establishes an experiment when entering a chapter.

Astro generates the exhibit route automatically from the manifest registry. The shared player supplies chapter navigation, input validation, playback, scrubbing, assembled/exploded views, camera presets, part buttons, deep explanations, and share links. A static written story and sources remain usable without JavaScript.

## Mechanics before mesh

Put equations in a pure TypeScript module. Input state must reproduce visible state independent of playback history. Angles use **degrees at the player boundary**, then convert to radians for Three.js. Keep the distinction explicit.

Test an invariant, not a copied formula. Examples: the engine's rod stays the same length; the gear pitch velocities agree; differential outputs average to carrier speed. Include backward angles and boundary cases. Do not add numerical readouts that your model does not calculate.

Exploded offsets are for inspection only. The engine moves its cylinder housing, head and flywheel while its rod and crank preserve their calculated relationship. Never change an equation merely to make a disassembled view fit.

The built-in `Readout.tsx` supplies additional compact diagrams for the three first exhibits. A new scene works without one; add a small, accessible readout when it explains something the 3D model does not. No readout should infer unsupported physical values.

## Story and sources

Use original words and original visual composition. Source each technical claim. Manufacturer documentation, university materials, and primary technical references are preferred. Credit explanatory influences without copying their scripts, layouts, illustrations, or code.

For each asset record author, source URL, license, required attribution, modifications, and files covered. No unlabeled downloaded assets. Project code is MIT; original educational content/assets are CC BY 4.0. Third-party material keeps its own compatible terms.

Use “Go deeper” for equations, exceptions, and limits. Avoid describing a kinematic animation as a measured or validated physics simulation. A reviewer badge requires a real person to review the specific revision and agree to be credited.

## Fit and interaction

Read `DESIGN.md`. The object has most of the screen; the explanation sits beside it on desktop and below it on phones. Keep motion useful and controls few. Provide a keyboard equivalent for every pointer action. Honor reduced motion; users can explicitly start animation. Don’t require hover.

Check 390 px and 1440 px widths, keyboard focus, sources, chapter sharing after an experiment, and a `?view=text` fallback. Also test genuine WebGL failure, Safari, Chrome, and real touch hardware before claiming support.

## Submit for review

Include the opening question, sources, limitations, two screenshots, and how you tested the invariant. Run tests and the production build. Researchers and writers can submit source or explanation changes without building 3D geometry; opening an issue with a concrete correction also helps.

## Optional analytics

`src/lib/analytics.ts` has a no-op default. An explicitly configured adapter may receive `exhibit_start`, `experiment_change`, `story_complete`, `share`, and `contribution_click`. `story_complete` requires visiting every chapter and pressing Finish, once per completion state. These are interaction events, not proof of comprehension. No replay or automatic capture is included. Forks send nothing by default.

## Deployment

The Pages workflow builds with `SITE_URL=https://OWNER.github.io` and `BASE_PATH=/REPOSITORY`. GitHub Actions deployment must be enabled in repository Pages settings. For a custom domain/root deployment, set the site and base appropriately. All internal links and scripts respect Astro's base. Static output in `dist/` is portable.

## Record launch media locally

Run `npm run build` with the default root base, then `npm run studio`. Open the printed `http://127.0.0.1:4323/studio/` URL. Recordings use the actual scene components and equations with caption overlays. Select each clip and press Record. Keep the tab visible for the full 20 or 55 seconds.

The local helper writes only named media files to `artifacts/captures/`, binds to loopback, checks the Host and Origin, limits upload size, and rejects arbitrary paths. It is never included in the Pages deployment. It is a development tool, not a public backend API. Stop it when finished.

For a gallery image, visit an exhibit or `/contribute/` on port 4323 with `?capture=1`, pause the scene at a useful moment, and press Save gallery PNG. Other hosts offer a normal browser download instead. Phone and desktop exports follow the current viewport. Review the saved image or video before using it in the launch.
