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
