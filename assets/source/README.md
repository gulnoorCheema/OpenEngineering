# Original mechanical artwork

Author: OpenEngineering contributors, created with Astra and Blender on September 12, 2026.
License: CC BY 4.0; see `../../CONTENT-LICENSE.md`. These are original teaching models, not licensed manufacturer CAD or production drawings.

- `mechanical-parts.blend`: editable library, arranged on a grid. Semantic names and origins match the exported nodes.
- `engine-assembly.blend`: assembled engine at 430°, with individually editable parts. The hidden library is retained.
- `../../public/models/mechanical-parts.glb`: compressed render library, all parts at their mechanical pivots. The runtime assembles and animates it.
- `../../public/environments/studio.hdr`: original, generated studio light panels for reflections.

Rebuild with Blender 5.2 (including its bundled glTF exporter):

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/build-models.py
```

Or replace the executable with your platform's `blender` command. Run from the repository root. The script regenerates both sources, GLB, and HDR. Browser scene coordinates deliberately use Y as up; the exporter uses `export_yup=False` to retain these pivots. The source uses Y as the mechanism's vertical direction even inside Blender.

The scene units are convenient teaching units. The rod has length 2.08 and crank radius 0.72. Gear pitch radii use 0.0475 × tooth count. The bevel teeth, valve actuation and cutaways illustrate relationships; they are not manufacturing profiles. Blender's source files include no downloaded textures or models. Gas and ignition are calculated in the renderer, not baked into the asset.

The 16-tooth side gears and 12-tooth spiders use pitch radii 0.76 and 0.57. Their common-apex cone lengths and 62% inner radius determine the assembly centers (`0.81 ×` the opposing pitch radius). The tooth faces are illustrative rather than generated manufacturing profiles. The opposing spider angles are tested separately from the output mean speed.

## New ways to wonder

`sewing-machine.blend`, `jet-engine.blend`, and `mechanical-watch.blend` are separate editable part libraries. Each exports to the matching file in `public/models/`. Semantic pivots are preserved; the scene assembles the parts. A visitor loads only the selected assembly. Regenerate all three from the repository root:

```sh
blender --background --python scripts/build-exhibit-models.py
```

Use the same installed Blender 5.2 executable as above. The generator contains original beveled meshes, cutaways, shafts, teeth, thread spools, and watch components. It does not change the original engine library or reflection asset. Runtime thread curves, flow traces, and hairspring deformation are phase-derived, not baked simulations.

The sewing model uses 0.16 scene units per millimetre of stitch length. Jet core and bypass ducts keep the same schematic geometry for every flow-ratio preset. The watch uses a 15-tooth escape wheel and compound tooth pairs 6:96, 10:75, 10:80, and 10:60, with separate 12:36 and 10:40 motion works. These preserve ratios while using illustrative tooth profiles. Sources and exported models are original CC BY 4.0 artwork; the generator is MIT code.

## Cinematic homepage jet revision

The jet library now uses original cambered and swept blade surfaces, a tapered spinner, an inlet lip, panel bands and fasteners. Flow ribbons and a contained annular combustion effect remain deterministic runtime illustrations. They do not model aerodynamics or thermodynamics. The same GLB and runtime scene serve the homepage, exhibit and studio.

To regenerate only this model, without rewriting the sewing or watch sources:

```sh
blender --background --python scripts/build-exhibit-models.py -- --only jet-engine
```

Omit `--only` to export all three libraries. `public/exhibits/*.webp` and `public/home/*` are original browser renders of these CC BY 4.0 teaching assets. Retain editable sources and the reproducible generator whenever changing the geometry.
