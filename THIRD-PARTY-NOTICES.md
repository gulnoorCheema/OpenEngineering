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

The audit recovered the Fiber 9.7.0 notice from its exact upstream release commit. The installed `maath` 0.10.8 and `stats-gl` 2.4.2 packages declare MIT but omit license text; the inspected release tree for maath and current stats-gl repository did not provide a standalone license text. Their notice provenance remains an open review item. Other empty entries include platform/build dependencies; review them when distributing those binaries. The separately retained Draco license is described below.

Sources in `SOURCES.md` are linked references and influences. Their authors do not endorse or independently validate OpenEngineering.

## Local Draco decoder

`public/draco/draco_wasm_wrapper.js` and `draco_decoder.wasm` are distributed from the installed Three.js package and implement Google Draco (Apache License 2.0). The full upstream license is retained in `public/draco/LICENSE`. Source: https://github.com/google/draco. These vendor files are an explicit exception to the project code/content licenses. No remote decoder or reflection-map request is made.
