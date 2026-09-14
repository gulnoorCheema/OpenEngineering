# Launch assets

These files come from the implemented application and its scene modules. No third-party footage or fabricated usage claims are included. Review the files before posting.

## Video

| File                                                                        | Format                       | What it shows                                                           |
| --------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------- |
| [openengineering-demo.mp4](assets/openengineering-demo.mp4)                 | 1280 × 720, about 55 seconds | Engine, gear experiments, differential, and the contribution foundation |
| [openengineering-engine.mp4](assets/openengineering-engine.mp4)             | 720 × 1280, about 20 seconds | A push becomes rotation, then four cylinders share the work             |
| [openengineering-gears.mp4](assets/openengineering-gears.mp4)               | 720 × 1280, about 20 seconds | Tooth-count presets trade speed for ideal torque                        |
| [openengineering-differential.mp4](assets/openengineering-differential.mp4) | 720 × 1280, about 20 seconds | Different wheel paths and the held-output bench experiment              |

The new collection adds [sewing machine](assets/openengineering-sewing-machine.mp4), [jet engine](assets/openengineering-jet-engine.mp4), and [mechanical watch](assets/openengineering-mechanical-watch.mp4) portrait clips (720 × 1280, 20 seconds each), plus a separate [New ways to wonder demo](assets/openengineering-new-collection.mp4) (1280 × 720, 55 seconds). The original four videos remain available.

The clips are silent, with visible captions. They are recorded from the same Three.js scene components and deterministic calculations as the exhibits, with captions composed by the recording studio. The final demo card describes the actual contributor tools. Raw WebM exports remain local in `artifacts/captures/`; MP4 copies are encoded with H.264, yuv420p, and fast-start metadata for broad playback support.

## Gallery and icon

1. [Desktop engine](assets/openengineering-engine-desktop.png): the working cutaway, chapter text, controls, and part buttons.
2. [Gear experiment](assets/openengineering-gears-desktop.png): the 16-to-48 preset and corresponding ideal ratios.
3. [Phone layout](assets/openengineering-engine-phone.png): the introductory 390-pixel-wide composition. This demonstrates layout, not real-device performance.
4. [Contribution kit](assets/openengineering-contribution-kit-desktop.png): the actual contributor page.
5. [512-pixel icon](assets/openengineering-icon.png): the project's original vector mark rendered to PNG.

The exhibit gallery images capture the introductory viewport, preserving the model, navigation and editorial treatment. The contributor image captures the complete page. No fake browser chrome, reviews, awards, or user counts have been added.

## Link previews

Plain original model renders in `public/exhibits/` supply the collection thumbnails. The cinematic revision replaces the original schematic previews.

`public/social/engine.png`, `gears.png`, and `differential.png` are 1200 × 630 share cards rendered from the actual scenes. Exhibit pages select the corresponding card in Open Graph metadata. Individual chapter links restore the scene state, while their preview card identifies the exhibit.

## Reproduce

See the recording section of [the authoring guide](../docs/AUTHORING.md). Use `npm run build` followed by `npm run studio`. The loopback-only helper saves files into `artifacts/captures/`; it is not deployed. Keep the recording tab visible until it finishes. Inspect representative frames, especially at each transition, before replacing a release asset.

Product Hunt and social posts remain unsubmitted. The local package is not evidence of acceptance, scheduling, or promotion.

## New collection gallery

- Sewing machine: [desktop](assets/openengineering-sewing-machine-desktop.png), [phone layout](assets/openengineering-sewing-machine-phone.png).
- Jet engine: [desktop](assets/openengineering-jet-engine-desktop.png), [phone layout](assets/openengineering-jet-engine-phone.png).
- Mechanical watch: [desktop](assets/openengineering-mechanical-watch-desktop.png), [phone layout](assets/openengineering-mechanical-watch-phone.png).

Matching `sewing-machine.png`, `jet-engine.png`, and `mechanical-watch.png` images in `public/exhibits/` and `public/social/` come from the shared renderer. These are original simplified teaching assemblies, with no real-performance or reviewer claims.

## Cinematic homepage refresh — September 13

- [Homepage desktop](assets/openengineering-home-desktop.png) and [phone layout](assets/openengineering-home-phone.png) show the actual discovery page.
- `public/social/home.png` is the homepage's 1200 × 630 share card, composed from the live jet renderer and product typography.
- `public/home/jet-poster.webp` and `jet-poster-phone.webp` retain separate desktop/phone compositions for loading and WebGL fallback.
- Six optimized transparent `public/exhibits/*.webp` previews are exported through the studio and prepared with `scripts/prepare-home-media.py`.
- Jet portrait footage, the new-collection demo, jet social card, and desktop/phone jet gallery images have been refreshed for the upgraded shared scene. The original collection demo remains unchanged. The collection recording runs about 55.6 seconds including readiness transitions.

See [design QA](../design-qa.md) for reviewed images and remaining hardware checks. Publishing the application and repository does not submit Product Hunt material or send outreach.
