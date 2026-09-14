# Design system

## Direction

Light editorial pages, dark cinematic machinery. Lead with “Every machine has a story.” The model establishes curiosity before the explanation. A broad dark stage sits beside an ivory narrative without a rounded card around the experience.

`src/styles/cinematic.css` extends the shared base in `global.css`.

| Role                    | Value                                   |
| ----------------------- | --------------------------------------- |
| Paper                   | #f3f0e9                                 |
| Ink                     | #191e20                                 |
| Stage                   | #101719                                 |
| Fine rules              | #d7d5cc                                 |
| Editorial accent        | #b94720                                 |
| Stage highlight         | #ff8a51                                 |
| Intake cue              | Cyan                                    |
| Display / body / labels | Space Grotesk / DM Sans / IBM Plex Mono |

Display typography is large and tightly spaced. Reading copy keeps comfortable line spacing and a short measure. Small technical labels provide context; essential explanations never rely on labels floating over the model. Orange/cyan markers supplement names and motion rather than replacing them.

## Composition and control

- Above 700 px, the sticky stage occupies 56–62% of the width, depending on available space. Narrow desktop/tablet layouts retain a substantial vertical model view.
- At 700 px and below, the stage sticks above the story at 42svh with a 380 px minimum including playback controls. Touch scroll remains native. “Rotate model” explicitly enables drag manipulation.
- The story and free lab are available immediately. Native scrolling changes the chapter and composition while playback owns a separate crank clock.
- Chapter buttons seek teaching positions. Shared links restore a paused exact phase. Returning from the lab restores the current chapter; entering the lab preserves the phase and experiment controls.
- A pointer drag owns the camera until the next chapter or preset. Camera and assembly transitions settle in about 700 ms. Reduced motion starts paused, removes decorative effects and camera travel, and permits explicit playback/scrubbing.
- Keep all interactions keyboard-accessible. The story includes part buttons as an alternative to clicking the model.

## Machinery

Use original Blender parts, separately addressable at moving pivots. Keep distinct cast aluminum, steel, iron, ceramic and rubber surfaces. Use bevels, local studio reflections, selective orange highlights and restrained bloom. Frame the primary engine at approximately 65–75% of the scene height without cropping.

The intake/exhaust passages are open cutaways. Gas volume is bounded by the current piston crown and chamber top; flow and ignition derive only from cycle phase. Do not accumulate particle histories. Hide effects when the head is exploded or removed. Reverse scrubbing must restore the same image. These are illustrative effects, not pressure, temperature or combustion calculations.

Low effects uses fewer samples, fewer particles, lower render resolution and smaller shadows. Auto chooses low for phone widths and drops quality if the renderer sustains less than 27 fps. Reduced-motion preferences also disable bloom and gas effects. Use actual model renders for collection thumbnails and social cards.

## Acceptance

Inspect 390, 737, 1024 and 1440 px widths; keyboard interaction; chapter links; back navigation; free/story switching; and genuine WebGL failure. Record actual device and network for performance claims. A desktop browser at phone dimensions is a layout check, not a real-phone benchmark.

## Discovery homepage

The approved target is [the combined homepage concept](design/homepage-reference.png). This is an AI-generated design reference, not a screenshot of the product or a calibrated machine. Original concept artwork is CC BY 4.0. Implement machinery with the original shared 3D assets, never as a substitute raster animation.

The root homepage uses a charcoal hero, graphite collection and ivory contribution footer. Orange is limited to actions, small accents and combustion. Keep Space Grotesk headings and DM Sans reading text, generous negative space and fine collection dividers. Preserve the quieter ivory shell on the exhibit and supporting pages.

The featured hero is the live jet. Its phase runs independently from the reveal slider; pause freezes phase-dependent flow and machinery. Slider input never writes URL state. The main CTA opens the jet story. Reduced motion starts paused with decorative effects off. The hero suspends rendering outside the viewport and in a hidden tab. Keep the static poster and readable links available when WebGL fails.

`src/lib/home.ts` defines the homepage's six curated IDs and short display copy independently of manifest `featured` flags. `/collection/` appends any additional registered exhibits. Use the existing base-aware path helper. Old root URLs with engine state redirect to the engine route with query and fragment intact; tracking-only URLs stay on the homepage.

`SceneViewport` accepts optional `presentation` (`exhibit` by default, or `showcase`), `active` (default true), `transparentStage` (default false), and anchored `annotations`. Existing manifests and scene interfaces remain compatible. Showcase uses the same mechanism and flow renderer, with a composition and floor suited to the homepage.

Render collection previews through the studio's **Transparent collection image** setting. Export PNG, then encode the same pixels as WebP under `public/exhibits/<id>.webp`. Preserve the alpha channel. Use the original scene, not an AI reconstruction. The home poster is captured with **Save hero poster** in `?capture=1` authoring mode at desktop and phone widths. Keep typography as HTML, not baked into these images.

At 1440px the collection has three columns; intermediate widths use two; phones use one. Phone copy, model and controls stack with native scrolling. Keep all navigation visible, avoiding inherited exhibit header rules that hide links at small widths. Compare screenshots at 390, 737, 1024 and 1440px, and record any real-device performance gaps.
