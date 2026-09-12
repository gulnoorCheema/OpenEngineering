# Scene and animation rules

Read [the root AGENTS.md](../../../AGENTS.md) first. These additional rules apply to this scene directory. They also provide the implementation reference when a task changes shared rendering or Blender assets elsewhere.

## Integration

- Follow `SceneProps` in `src/lib/exhibit.ts` and the optional clock/quality types in `src/lib/presentation.ts`. Register a scene lazily in `registry.ts`; do not eagerly load every exhibit.
- Reuse `MechanicalPart` from `Assets.tsx`, shared primitives, and the lighting, local HDR, camera transitions and quality controls in `SceneViewport.tsx`.
- `stage = 99` is free exploration. Support optional `reveal` metadata without requiring existing manifests to add it. Keep selection IDs aligned with the manifest's parts and provide `onSelect` behavior.
- The recording studio uses these same scenes. Do not create a more detailed separate renderer solely for promotional media.

## Motion and effects

- Read `motion?.current.phase ?? phase` inside `useFrame`. Continuous transforms and shader uniforms belong in the render loop; React owns interface changes and throttled readouts.
- Derive visible state from phase and controls. Do not use wall-clock time, unseeded randomness or accumulated particles for mechanism-dependent effects. Pause must freeze them; backward scrubbing must leave no history.
- Keep pure kinematics in `src/lib/mechanics.ts` or an exhibit-specific module in `src/lib/`, and phase-driven effect calculations separate from rendering. Preserve moving pivots and rod/gear relationships. Exploded offsets are presentation only.
- Update the material's live uniforms, not a stale object captured during render. Avoid allocations of vectors, geometry or materials per frame. Dispose privately owned resources without disposing cached GLTF geometry shared by other instances.
- Engine gas is clipped to the chamber wall, head and current piston crown. Intake/exhaust follow their open ports; the spark stays at the plug electrodes; the flame starts there. Hide these effects when the head is removed or exploded. These are illustrative cues, not thermodynamic simulation.
- Respect `quality`, `effects` and `reduced`. Lower effect samples, particles, resolution and shadows before removing explanation or controls. Do not introduce external runtime downloads.

## Asset changes

Read [the artwork guide](../../../assets/source/README.md) before changing `scripts/build-models.py` or generated assets. Run the export from the repository root with Blender 5.2:

```sh
blender --background --python scripts/build-models.py
```

Use the installed Blender executable's path if it is not on PATH. The generator writes the canonical `.blend` sources, compressed GLB and local HDR. Treat the generator as the reproducible definition; a manual source edit must also be represented there or documented with a reproducible export path. Never silently lose a manual edit by regenerating.

Semantic node names and origins form a runtime contract. Coordinates deliberately use Y up and `export_yup=False`. Keep original material distinctions, bevels and cutaways; use selected parts/flow for educational color. Do not turn illustrative tooth profiles into a claim of manufacturing accuracy.

## Check the result

Run tests and the production build. Inspect slow playback and paused intake, compression, ignition, power and exhaust when changing the engine. Check reverse phase, one/four cylinders, explosion, selection and low-effects behavior. Check gear contact/direction and opposing differential spiders when changing those scenes. Use independent invariants, including boundary and reverse cases.

Compare actual model renders at desktop, tablet and phone widths; frame the principal engine around 65–75% of scene height without clipping. If changed artwork invalidates thumbnails, share cards or demo footage, regenerate the affected outputs through the shared studio and inspect the exported files.
