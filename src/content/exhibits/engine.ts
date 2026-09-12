import type { Exhibit } from '../../lib/exhibit';
export const engine: Exhibit = {
  id: 'engine',
  number: '01',
  scene: 'engine',
  title: 'The four-stroke engine',
  subtitle: 'A little fire. A lot of ingenuity. Let’s see what makes it turn.',
  question: 'How does burning fuel turn a wheel?',
  duration: '4 min',
  author: 'OpenEngineering contributors',
  period: 720,
  speed: 72,
  controls: [
    {
      id: 'cylinders',
      label: 'Number of cylinders',
      kind: 'select',
      default: 1,
      options: [
        { label: 'One cylinder', value: 1 },
        { label: 'Four cylinders', value: 4 },
      ],
    },
    {
      id: 'speed',
      label: 'Playback speed',
      kind: 'select',
      default: 1,
      options: [
        { label: 'Slow · ½×', value: 0.5 },
        { label: 'Normal · 1×', value: 1 },
        { label: 'Fast · 2×', value: 2 },
      ],
    },
  ],
  parts: [
    {
      id: 'piston',
      name: 'Piston',
      description:
        'The silver piston slides inside the cylinder. Gas pressure acts on its top face; the connecting rod carries that force toward the crank.',
    },
    {
      id: 'cylinder',
      name: 'Cylinder',
      description:
        'A close-fitting bore guides the piston. We have cut away its front wall so you can see the motion inside.',
    },
    {
      id: 'crankshaft',
      name: 'Rod & crank',
      description:
        'The rod keeps a fixed length while its ends follow different paths: a line at the piston, a circle at the crank pin.',
    },
    {
      id: 'valves',
      name: 'Valves & camshaft',
      description:
        'The blue passage admits fresh mixture; the copper passage releases exhaust. A four-stroke camshaft turns once for every two crankshaft turns.',
    },
    {
      id: 'flywheel',
      name: 'Flywheel',
      description:
        'A rotating mass stores kinetic energy and gives some back between power strokes. This animation prescribes speed; it does not calculate that energy.',
    },
  ],
  steps: [
    {
      id: 'a-push',
      label: 'THE BIG IDEA',
      title: 'How does fire become motion?',
      body: 'Burning fuel heats the gas inside an engine. The gas expands and pushes on the silver piston. That push is the start of a journey from heat to motion.',
      why: 'Follow the crankshaft: the engine has found a way to turn a straight push into a circle.',
      experiment:
        'Pause, then drag the cycle slider through the orange power stroke. Watch the space above the piston grow.',
      deeper:
        'Combustion raises the temperature and pressure of the gas. Pressure acts on the piston face. Gas flow, spark and flame are illustrative visual cues tied to the cycle, not calculated pressure, temperature or fluid fields.',
      parts: ['piston'],
      controls: ['speed'],
      phase: 420,
      camera: [5.1, 3.3, 8.1],
    },
    {
      id: 'contain-it',
      label: '01 / GIVE THE PUSH A PATH',
      title: 'A push needs somewhere to go.',
      body: 'An uncontained burst spreads in every direction. A cylinder holds the gas around a sliding piston, directing its useful push along one path.',
      why: 'The piston must move while its rings help seal the gap around its edge. Now we have useful motion, but only in a straight line.',
      experiment:
        'Take the assembly apart. Find the piston rings, then put it back together and scrub the piston between its two extremes.',
      deeper:
        'This is a cutaway of a simplified cylinder. Real piston rings also manage oil and transfer heat. Gaps, lubrication, friction and thermal expansion are omitted.',
      parts: ['piston', 'cylinder'],
      controls: ['speed'],
      phase: 450,
      camera: [3.2, 2.5, 8.7],
    },
    {
      id: 'make-a-circle',
      label: '02 / CHANGE THE MOTION',
      presentation: {
        target: [0, 0, 0],
        fov: 34,
        reveal: ['piston', 'crankshaft'],
        annotation: { text: 'A LINE BECOMES A CIRCLE', anchor: [-1.3, 0.3, 0] },
      },
      title: 'Turn a line into a circle.',
      body: 'Add a connecting rod. Its top end follows the piston up and down; its bottom end follows an offset pin around the crankshaft.',
      why: 'The rod leans as the crank turns, so both ends can follow their own paths without changing its length.',
      experiment:
        'Pause at 90°, then scrub backward to 0°. The rod tilts, but the distance between its pins stays the same.',
      deeper:
        'With crank radius r, rod length l and crank angle θ, piston position is r cos θ + √(l² − r² sin² θ). This is a kinematic relationship, not a force or torque calculation.',
      parts: ['crankshaft', 'piston'],
      controls: ['speed'],
      phase: 90,
      camera: [1.5, 1.4, 9.4],
    },
    {
      id: 'repeat-it',
      label: '03 / MAKE IT REPEAT',
      title: 'One useful push. Four strokes.',
      body: 'First, draw in fresh mixture. Next, squeeze it. Ignite it for the power stroke, then push the spent gas out. The piston travels down, up, down, up.',
      why: 'Only one of these four strokes supplies combustion power. A complete cycle takes two turns of the crankshaft: 720°.',
      experiment:
        'Tap each stroke below the model. Notice which valve opens and whether the piston is rising or falling.',
      deeper:
        'We show an idealized spark-ignition four-stroke cycle. Ignition starts at 360°. Real engines typically ignite earlier, and their valve events overlap stroke boundaries.',
      parts: ['valves', 'piston'],
      controls: ['speed'],
      phase: 45,
      camera: [5.1, 3.3, 8.1],
    },
    {
      id: 'keep-time',
      label: '04 / COORDINATE THE PARTS',
      presentation: {
        target: [0, 1.45, 0],
        fov: 31,
        annotation: { text: 'HALF THE CRANKSHAFT SPEED', anchor: [-1.6, 2.7, 0] },
      },
      title: 'The valves need a clock.',
      body: 'The valve below the blue passage opens for fresh mixture. The valve below the copper passage opens for spent gas. Both stay closed during compression and most of the power stroke.',
      why: 'The camshaft coordinates these events. It turns at half the crankshaft’s speed, bringing each valve event around once per 720° cycle.',
      experiment:
        'Use slow playback. Follow the camshaft’s white marker while the crank completes two full turns.',
      deeper:
        'Cam lobes and lift are schematic. Lift follows a smooth sine during the relevant stroke; no rocker linkage, timing belt, realistic cam profile or valve overlap is simulated.',
      parts: ['valves'],
      controls: ['speed'],
      phase: 45,
      camera: [4.0, 4.4, 7.7],
      defaults: { speed: 0.5 },
    },
    {
      id: 'carry-momentum',
      label: '05 / BRIDGE THE GAPS',
      title: 'Keep some motion in reserve.',
      body: 'An engine still needs to move between its power strokes. A flywheel stores energy as it speeds up, then returns some as it slows down.',
      why: 'Rotational inertia helps the crank pass through the other strokes. A real engine’s speed fluctuates; the animation stays at the playback speed you choose.',
      experiment:
        'Select the flywheel, then rotate to the rear view. Find the heavy disk connected to the crankshaft.',
      deeper:
        'Rotational kinetic energy is ½Iω². A heavier rim increases moment of inertia I. This exhibit does not solve dynamics, so removing a visual part would not realistically stop or accelerate the model.',
      parts: ['flywheel'],
      controls: ['speed'],
      phase: 240,
      camera: [-5.4, 2.6, -8.6],
    },
    {
      id: 'share-the-work',
      label: '06 / SPREAD THE PUSHES',
      title: 'More cylinders. Fewer gaps.',
      body: 'Connect four cylinders to one crankshaft and stagger their cycles. As one finishes a power stroke, another starts. The individual pushes are spread more evenly.',
      why: 'This example uses firing order 1–3–4–2, with a power stroke beginning every 180°. One piston alone supplies a power stroke only once every 720°.',
      experiment:
        'Switch between one and four cylinders. The colored strips show which cylinder is on its power stroke at this instant.',
      deeper:
        'Four cylinders do not guarantee constant torque or perfect balance. We show phase relationships and geometry, not combustion pressure, vibration or measured power.',
      parts: ['piston', 'crankshaft'],
      controls: ['cylinders', 'speed'],
      phase: 420,
      camera: [7.8, 4.2, 10.8],
      defaults: { cylinders: 4 },
    },
  ],
  sources: [
    {
      title: 'NASA Glenn — Four-stroke engine stages',
      url: 'https://www.grc.nasa.gov/www/k-12/airplane/engstage.html',
    },
    {
      title: 'Bartosz Ciechanowski — Internal combustion engine',
      url: 'https://ciechanow.ski/internal-combustion-engine/',
      note: 'An influence on explanatory clarity; all text and geometry here are original.',
    },
  ],
  limitations:
    'A simplified spark-ignition teaching model. Motion and valve timing are prescribed; no combustion, pressure, friction, torque, efficiency or flywheel dynamics are calculated. Front walls are deliberately removed. Cam geometry is schematic.',
  assetCredits:
    'Original Blender geometry, procedural effects and educational text by OpenEngineering contributors. Editable models and export scripts are included; no third-party model assets.',
};
