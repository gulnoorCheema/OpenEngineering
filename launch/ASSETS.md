# Launch assets

These files come from the implemented application and its scene modules. No third-party footage or fabricated usage claims are included. Review the files before posting.

## Video

| File                                                                        | Format                       | What it shows                                                           |
| --------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------- |
| [openengineering-demo.mp4](assets/openengineering-demo.mp4)                 | 1280 × 720, about 55 seconds | Engine, gear experiments, differential, and the contribution foundation |
| [openengineering-engine.mp4](assets/openengineering-engine.mp4)             | 720 × 1280, about 20 seconds | A push becomes rotation, then four cylinders share the work             |
| [openengineering-gears.mp4](assets/openengineering-gears.mp4)               | 720 × 1280, about 20 seconds | Tooth-count presets trade speed for ideal torque                        |
| [openengineering-differential.mp4](assets/openengineering-differential.mp4) | 720 × 1280, about 20 seconds | Different wheel paths and the held-output bench experiment              |

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
