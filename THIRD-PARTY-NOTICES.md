# Third-party notices

The original code is MIT; original educational content and assets are CC BY 4.0 as described in `CONTENT-LICENSE.md`. Dependencies keep their own licenses. This repository contains no imported third-party 3D models, stock photos, book illustrations, or video clips.

| Dependency             | Use                                      | License                   |
| ---------------------- | ---------------------------------------- | ------------------------- |
| Astro / @astrojs/react | Static application and React integration | MIT                       |
| React / React DOM      | Interactive player                       | MIT                       |
| Three.js               | WebGL rendering                          | MIT                       |
| @react-three/fiber     | React rendering integration              | MIT                       |
| @react-three/drei      | Orbit controls                           | MIT                       |
| Lucide                 | Interface icons                          | ISC                       |
| html-to-image          | User-triggered gallery export            | MIT                       |
| DM Sans                | Body typography                          | SIL Open Font License 1.1 |
| Space Grotesk          | Display typography                       | SIL Open Font License 1.1 |
| IBM Plex Mono          | Technical labels                         | SIL Open Font License 1.1 |

Fonts are self-hosted through Fontsource. Copyright and license texts supplied by the packages are retained in `public/licenses/` so they ship with the site. The generated dependency license inventory covers packages installed on the generating machine, including development tools; it is not a cross-platform SBOM or proof that every listed dependency ships in the browser. Regenerate it after dependency changes with `npm run licenses`. Filenames include package versions, and supplied NOTICE files are retained. Missing texts are reported as empty `files` entries and require investigation; package license metadata alone is not a retained notice. Version-specific upstream supplements live in `licenses/upstream/` with their exact source URLs. Do not substitute a current repository license for an older release without checking its history.

The audit recovered the Fiber 9.7.0 notice from its exact upstream release commit. The installed `maath` 0.10.8 and `stats-gl` 2.4.2 packages declare MIT but omit standalone license text in the inspected sources. A September 14 production module audit confirmed that neither is retained in the emitted browser JavaScript. They are installed through Drei but are not part of this site's distributed browser code. Their release-specific notice provenance still needs review if you redistribute `node_modules` or start using those modules; no replacement notice has been invented.

Run `npm run audit:licenses` to rebuild with module accounting and verify notices against the JavaScript chunks actually present in `dist/`, the three self-hosted font families, and the local Draco decoder. CI runs this check before publishing. It fails when a retained package/version lacks a distributed notice. The local report is `artifacts/browser-license-audit/report.json`; it does not contain an independent legal assessment. Other empty inventory entries include installed platform/build packages and remain relevant when distributing those binaries.

Sources in `SOURCES.md` are linked references and influences. Their authors do not endorse or independently validate OpenEngineering.

## Local Draco decoder

`public/draco/draco_wasm_wrapper.js` and `draco_decoder.wasm` are distributed from the installed Three.js package and implement Google Draco (Apache License 2.0). The full upstream license is retained in `public/draco/LICENSE`. Source: https://github.com/google/draco. These vendor files are an explicit exception to the project code/content licenses. No remote decoder or reflection-map request is made.
