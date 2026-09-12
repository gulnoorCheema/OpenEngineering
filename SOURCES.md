# Sources, influences, and model boundaries

Reviewed September 12, 2026. References support the stated concepts; inclusion is not endorsement or a claim of external review.

## Engine

- NASA Glenn, [Internal Combustion Engine Stages](https://www.grc.nasa.gov/www/k-12/airplane/engstage.html), last updated May 13, 2021. Supports the intake, compression, combustion/power, and exhaust sequence. NASA's six thermodynamic stages should not be confused with four piston strokes.
- Bartosz Ciechanowski, [Internal Combustion Engine](https://ciechanow.ski/internal-combustion-engine/), April 29, 2021. Influence on first-principles explanation; reference for slider-crank geometry, camshaft speed, flywheel purpose, and multiple cylinders. No prose, model assets, or source code copied.

Boundary: ideal slider-crank kinematics, prescribed crank speed, idealized valve opening within each stroke. No real valve overlap, combustion/fluid dynamics, ignition advance, friction, heat transfer, or calculated output horsepower. Gas colors indicate stroke, not measured temperature or pressure. The flywheel carries the same prescribed angular motion as the crank; its smoothing role is explained but not dynamically simulated. Four-cylinder phasing uses firing order 1–3–4–2.

## Gears

- Bartosz Ciechanowski, [Gears](https://ciechanow.ski/gears/), February 12, 2020. Supports the inverse speed ratio, ideal torque ratio, equal pitch, and change of rotation direction for external gears.
- KHK, [Gear Technical Reference](https://khkgears.net/gear-knowledge/gear-technical-reference/calculation-gear-dimensions/). Further reading for gear geometry and terminology.

Boundary: ideal external spur gears with no losses or inertia. Angular speed ratio is −N_driver/N_driven. Torque-magnitude ratio is N_driven/N_driver. Tooth shapes are simplified explanatory geometry, not manufacturing-ready involute profiles. Preset pairs retain a common tooth module; gear spacing updates with pitch radii.

## Differential

- Eaton, [Differentials and traction control solutions](https://www.eaton.com/us/en-us/products/differentials-traction-control.html). Supports allowing different driven-wheel speeds through turns.
- MIT 2.972, [How a Differential Works](https://web.mit.edu/2.972/www/reports/differential/differential.html). Further reading on the gearing and purpose.
- MathWorks, [Differential](https://www.mathworks.com/help/sdl/ref/differential.html). Supports the ideal equal-side-gear kinematic constraint.

Boundary: ideal symmetric open differential with equal side gears, prescribed input speed, no tire-slip or traction dynamics. Wheel speeds sum to twice carrier speed. Turn radius models only an axle following concentric circular paths (track width 1.6 m); it is not a full steering or vehicle dynamics model. Holding one output on a bench is distinct from locking a differential. Bevel-tooth geometry is schematic. Unequal speeds do not imply unequal torque; no “all torque goes to one wheel” claim is made.

## Educational and creative influences

- [PhET, About](https://phet.colorado.edu/en/about): visible cause and effect, immediate feedback, and independent exploration. This project's effectiveness has not been established by PhET or a learning study.
- [Explorable Explanations](https://explorabl.es/): learning through play and inspectable models.
- David Macaulay's _The Way Things Work_: an influence on the project's curiosity and educational purpose. The book is not reproduced or adapted page by page.
- [Branch Education](https://branch.education/), [Mechanical Library](https://mechanical-library.org/), [PC Anatomy](https://github.com/brickshow/pc-anatomy), and [vistep](https://vistep.ai/en/): competitive and creative references, not code or asset sources.

## Attribution

Project direction: gulnoorCheema. Software, original explanatory text, and procedural models: OpenEngineering contributors, developed with GPT-6 Astra in Codex. Dependency authors retain credit as listed in `THIRD-PARTY-NOTICES.md`.
