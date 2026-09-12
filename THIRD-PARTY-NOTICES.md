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

Fonts are self-hosted through Fontsource. Copyright and license texts supplied by the packages are retained in `public/licenses/` so they ship with the site. The generated dependency license inventory covers installed transitive packages and must be regenerated after dependency changes with `npm run licenses`.

Sources in `SOURCES.md` are linked references and influences. Their authors do not endorse or independently validate OpenEngineering.

## Local Draco decoder

`public/draco/draco_wasm_wrapper.js` and `draco_decoder.wasm` are distributed from the installed Three.js package and implement Google Draco (Apache License 2.0). The full upstream license is retained in `public/draco/LICENSE`. Source: https://github.com/google/draco. These vendor files are an explicit exception to the project code/content licenses. No remote decoder or reflection-map request is made.
