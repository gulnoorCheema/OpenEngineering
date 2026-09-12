import type { Exhibit } from '../../lib/exhibit';
export const jet_engine: Exhibit = {
  id: 'jet-engine',
  scene: 'jet-engine',
  number: '05',
  featured: true,
  title: 'The jet engine',
  subtitle: 'A river of air. A fire inside. A way to fly.',
  question: 'How does moving air move an airplane?',
  duration: '4 min',
  author: 'OpenEngineering contributors',
  period: 720,
  speed: 80,
  presentation: {
    minAspect: 1.15,
    cameras: {
      overview: [-5, 3.3, 11],
      front: [-10, 0.3, 1.5],
      rear: [9, 2, 5],
    },
    target: [0, 0, 0],
    fov: 36,
  },
  controls: [
    {
      id: 'bypass',
      label: 'Bypass / core mass flow',
      kind: 'select',
      default: 5,
      options: [
        {
          label: '2:1',
          value: 2,
        },
        {
          label: '5:1',
          value: 5,
        },
        {
          label: '10:1',
          value: 10,
        },
      ],
    },
    {
      id: 'flow',
      label: 'Follow the air',
      kind: 'select',
      default: 0,
      options: [
        {
          label: 'Both streams',
          value: 0,
        },
        {
          label: 'Core only',
          value: 1,
        },
        {
          label: 'Bypass only',
          value: 2,
        },
      ],
    },
    {
      id: 'speed',
      label: 'Playback speed',
      kind: 'select',
      default: 1,
      options: [
        {
          label: 'Slow \u00b7 \u00bd\u00d7',
          value: 0.5,
        },
        {
          label: 'Normal \u00b7 1\u00d7',
          value: 1,
        },
      ],
    },
  ],
  parts: [
    {
      id: 'fan',
      name: 'Fan',
      description: 'Accelerates the incoming air and is connected to the low-pressure turbine.',
    },
    {
      id: 'compressor',
      name: 'Core compressor',
      description: 'Rotating blade rows supply work to the core airflow.',
    },
    {
      id: 'stators',
      name: 'Fixed stator vanes',
      description: 'Redirect airflow between spinning rows without rotating themselves.',
    },
    {
      id: 'combustor',
      name: 'Combustion chamber',
      description: 'Adds heat through continuous combustion in steady operation.',
    },
    {
      id: 'turbines',
      name: 'Turbines',
      description: 'Extract shaft work from the hot gas.',
    },
    {
      id: 'shafts',
      name: 'Concentric shafts',
      description: 'Connect each spool\u2019s turbine to the rotating parts it drives.',
    },
    {
      id: 'bypass',
      name: 'Bypass duct',
      description: 'Carries air around, rather than through, the hot core.',
    },
    {
      id: 'nozzle',
      name: 'Core nozzle',
      description: 'Guides the exhaust leaving the engine.',
    },
  ],
  steps: [
    {
      id: 'move-air',
      title: 'Push air back. Move forward.',
      label: '01 / FOLLOW THE AIR',
      body: 'An engine accelerates air toward the rear. The reaction supplies a forward force on the airplane. The large front fan moves a great deal of that air.',
      why: 'Thrust comes from changing the momentum of the air. A visible flame is not required at the exhaust.',
      experiment:
        'Select the fan, then rotate to its front. Follow the cyan air entering the engine.',
      deeper:
        'This teaching model shows flow direction and linked shafts, not a prediction of force. A real thrust calculation also needs mass flow, velocities and pressure terms.',
      parts: ['fan'],
      phase: 40,
      controls: ['flow', 'speed'],
      camera: [-5, 3.3, 11],
      presentation: {
        target: [0.15, 0, 0],
        reveal: ['all'],
      },
      defaults: {
        flow: 0,
      },
    },
    {
      id: 'compress-the-core',
      title: 'A smaller stream takes the inside route.',
      label: '02 / FOLLOW THE AIR',
      body: 'Some air enters the core. Alternating rows of rotating compressor blades and fixed stator vanes prepare it for combustion.',
      why: 'The compressor raises pressure. Stators redirect the flow between rotor rows; they do not spin with the shaft.',
      experiment:
        'Select Core only. Compare a spinning blade row with the fixed row immediately behind it.',
      deeper:
        'The number and shape of the compressor stages are simplified. The flow traces do not calculate pressure, density, or individual blade aerodynamics.',
      parts: ['compressor', 'stators'],
      phase: 100,
      controls: ['flow', 'speed'],
      camera: [-5, 3.3, 11],
      presentation: {
        target: [0.15, 0, 0],
        reveal: ['all'],
      },
      defaults: {
        flow: 1,
      },
    },
    {
      id: 'add-heat',
      title: 'A contained, continuous fire.',
      label: '03 / FOLLOW THE AIR',
      body: 'Fuel burns in the combustion chamber. The heated gas continues toward the turbines. During steady running, combustion is continuous.',
      why: 'The hot gas carries energy that the turbines can extract. The flame is held in the combustor rather than pulsing like a piston engine.',
      experiment:
        'Pause at two different angles. The combustor stays lit: there is no repeating spark-plug stroke.',
      deeper:
        'Fuel injectors, cooling passages and flame stabilization are represented only schematically. No startup sequence, temperature or combustion chemistry is simulated.',
      parts: ['combustor'],
      phase: 160,
      controls: ['flow', 'speed'],
      camera: [-0.5, 2, 9],
      presentation: {
        target: [0.15, 0, 0],
        reveal: ['all'],
      },
      defaults: {
        flow: 1,
      },
    },
    {
      id: 'turn-the-turbines',
      title: 'The exhaust does work on its way out.',
      label: '04 / FOLLOW THE AIR',
      body: 'Hot gas turns turbine blades before leaving the core nozzle. The turbines draw energy from that stream to drive machinery farther forward.',
      why: 'A turbine and a compressor do different jobs: one extracts shaft work from the gas, while the other supplies work to it.',
      experiment:
        'Select the turbines. Trace their shared axes back toward the compressor and fan.',
      deeper:
        'Blade profiles and rotor speeds are illustrative. The scene does not solve the thermodynamic cycle or predict how much work each stage extracts.',
      parts: ['turbines', 'nozzle'],
      phase: 220,
      controls: ['flow', 'speed'],
      camera: [-0.5, 2, 9],
      presentation: {
        target: [0.15, 0, 0],
        reveal: ['all'],
      },
      defaults: {
        flow: 1,
      },
    },
    {
      id: 'two-shafts',
      title: 'Two shafts, one inside the other.',
      label: '05 / FOLLOW THE AIR',
      body: 'One shaft links the high-pressure turbine to the core compressor. Another passes through it, linking the low-pressure turbine and the fan.',
      why: 'The two spools can turn at different speeds. Each shaft keeps its own connected parts synchronized.',
      experiment:
        'Take the engine apart. Follow the thinner central shaft, then compare the speeds of the two spools.',
      deeper:
        'This is an unbranded two-spool layout. The illustrated 2:1 spool-speed ratio is chosen for legibility; it is not a real engine specification.',
      parts: ['shafts'],
      phase: 280,
      controls: ['flow', 'speed'],
      camera: [-0.5, 2, 9],
      presentation: {
        target: [0.15, 0, 0],
        reveal: ['shafts'],
      },
      defaults: {
        flow: 1,
      },
    },
    {
      id: 'the-bypass',
      title: 'Most of this air misses the fire.',
      label: '06 / FOLLOW THE AIR',
      body: 'The rest of the fan\u2019s airflow travels around the core through the bypass duct. It does not pass through the combustion chamber. Both streams contribute to the engine\u2019s thrust.',
      why: 'Bypass ratio compares the mass flow around the core with the mass flow through it. It is not the ratio of their thrust contributions.',
      experiment:
        'Compare 2:1, 5:1 and 10:1. Read the two mass-flow shares and trace the larger stream around the core.',
      deeper:
        'For bypass ratio B, core share is 1/(1+B), and bypass share is B/(1+B). These are ideal flow comparisons in one schematic geometry, not three calibrated engine designs.',
      parts: ['bypass', 'fan'],
      phase: 320,
      controls: ['bypass', 'flow', 'speed'],
      camera: [-5, 3.3, 11],
      presentation: {
        target: [0.15, 0, 0],
        reveal: ['all'],
      },
      defaults: {
        flow: 0,
      },
    },
  ],
  sources: [
    {
      title: 'NASA Glenn \u2014 Turbofan engine',
      url: 'https://www.grc.nasa.gov/www/k-12/airplane/aturbf.html',
    },
  ],
  limitations:
    'Schematic two-spool turbofan with illustrative blade profiles, 2:1 spool speeds and qualitative flow traces. Bypass presets change mass-flow shares in the same geometry; they do not predict thrust shares, fuel efficiency, temperature, pressure or actual operating speeds. No afterburner or startup simulation.',
  assetCredits:
    'Original Blender assembly, flow paths and educational prose by OpenEngineering contributors, CC BY 4.0. Editable sources and scripts/build-exhibit-models.py included. No manufacturer CAD.',
};
