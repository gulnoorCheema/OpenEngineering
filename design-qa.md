# Homepage design QA — September 13, 2026

**Final result: passed for the implemented homepage and local browser checks.** Real-phone performance and native Safari verification remain pending.

## Reference and evidence

- Approved combined design: [reference](docs/design/homepage-reference.png), 876 × 1796. It establishes composition and art direction; its generated machinery is not an engineering CAD source.
- Final production page: [1440 px desktop](launch/assets/openengineering-home-desktop.png), [390 px phone](launch/assets/openengineering-home-phone.png).
- Local production inspection: Codex in-app browser on the host Mac, at 1440 × 1100, 1024 × 1000, 737 × 1000 and 390 × 844. Full-page exports use CSS pixels (1×), no artificial browser frame.
- Side-by-side comparison normalized both desktop images to the reference width. Full-page comparison covered the hero, collection, and footer. Focused comparisons inspected the headline/CTA, jet framing and labels, preview bounds, collection type, and contributor invitation.

## Comparison and corrections

| Area                | Finding and final adjustment                                                                                                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout              | Dark hero, six entries in the prescribed order, fine grid separators, and ivory contributor footer retained. Fixed the inherited canvas width so the stage fills the hero.                                                   |
| Typography          | Space Grotesk and DM Sans retained. Enlarged headline, collection questions, navigation, and footer statement after comparison. No unreadable text baked into the interactive scene.                                         |
| Color               | Charcoal and ivory dominate; orange remains concentrated on actions, small indices, and combustion. Cyan identifies cool flow.                                                                                               |
| Machinery           | Original swept blades, shaped spinner, inlet lip, shell fasteners and panel details replace the prior plain jet surfaces. Corrected the fan's recessed position. Lowered excessive metallic glare.                           |
| Flow and combustion | Replaced the first patterned flame with a deterministic noise field. Separate cyan bypass routes and warm core routes remain tied to the same clock. Added readable annotation backing and hid labels during a large reveal. |
| Collection          | Transparent images come from the actual six scenes. Normalized machinery bounds, removed the differential housing for its preview, and enlarged previews and captions. Whole entries are links.                              |
| Responsive          | Three columns on desktop, two at 737/1024 px, one at 390 px. Phone introduction, model and controls stack; all navigation remains visible. No horizontal page overflow was observed.                                         |
| Export fidelity     | Fixed SVG capture's handling of auto margins within Astro islands. Final gallery margins agree with the actual browser screenshot.                                                                                           |

The live teaching assemblies are simpler and less photorealistic than the generated concept. They preserve addressable moving parts and tested mechanism relationships, and the site uses their real renders consistently. The reference's invented fine CAD details and floor reflections are not represented as physically validated geometry. This remains an explicit visual boundary, not a claim of pixel-identical artwork or an awards result.

## Interaction and reliability

- Start exploring opens the jet's first guided chapter. Free exploration, selected Fan details, reset to 40°, returning to the story, and browser Back were exercised.
- Full collection opens a separate page with six entries. All six exhibit destinations resolve; companion links mount their scenes. Header collection navigation scrolls to the featured row.
- Root engine link `?chapter=a-push&mode=story&phase=3737&apart=0&cylinders=1&speed=1#main` retains its complete query/fragment at `/exhibits/engine/`. It restores paused 137° modulo the 720° cycle. Tracking-only root visits stay on the homepage.
- Keyboard Home/End changes the reveal slider; pause freezes machinery and flow without changing the homepage URL. A settled reveal/return while paused reproduced an identical canvas image.
- Two canvas exports while the hero was offscreen were pixel-identical while playback intent remained on. Rendering also uses document visibility; native background-tab behavior is not separately benchmarked.
- The reduced-motion authoring preview starts paused and suppresses decorative flow/combustion; explicit playback remains available. OS-level preference testing on real devices remains pending.
- A genuine `WEBGL_lose_context` test removed the renderer and displayed the original poster and written-story link, with controls disabled and navigation retained. The loading poster was inspected on initial navigation.
- Fresh homepage asset diagnostics showed only `jet-engine.glb`. Collection previews are images, not six WebGL contexts.

## Performance and technical checks

- 28 tests pass, including prior mechanism invariants, asset bounds/names, legacy routing, hero playback conditions and tapered core-flow bounds.
- Astro/TypeScript reports zero errors, warnings or hints; 14 static routes build. Vite's existing large Three.js chunk notice remains.
- Local production observations: approximately 0.78–0.89 seconds to renderer readiness and 120 fps at high quality in the in-app desktop browser, localhost, without network throttling. These are desktop observations, not a cold phone-network benchmark. Phone five-second interaction and 30 fps acceptance remain unverified.
- Final homepage gallery, transparent previews, social card, jet portrait clip and refreshed collection demo were inspected. Videos are actual scene captures; the nominal 55-second demo is about 55.6 seconds including scene readiness transitions.
