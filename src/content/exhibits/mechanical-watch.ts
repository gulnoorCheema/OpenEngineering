import type { Exhibit } from '../../lib/exhibit';
export const mechanical_watch: Exhibit = {
  id: 'mechanical-watch',
  scene: 'mechanical-watch',
  number: '06',
  featured: true,
  title: 'The mechanical watch',
  subtitle: 'A spring supplies the power. A tiny rhythm keeps the time.',
  question: 'How does a spring keep time?',
  duration: '4 min',
  author: 'OpenEngineering contributors',
  period: 360,
  speed: 72,
  presentation: {
    minAspect: 0.85,
    cameras: {
      overview: [2, 3, 9],
      front: [0, 0, 9],
      rear: [-3, 3, -8],
    },
    target: [0, 0, 0],
    fov: 33,
    clockRateControl: 'rate',
  },
  controls: [
    {
      id: 'rate',
      label: 'Balance frequency \u00b7 fixed gear train',
      kind: 'select',
      default: 1,
      options: [
        {
          label: '3 Hz \u00b7 6 beats/s',
          value: 0.75,
        },
        {
          label: '4 Hz \u00b7 8 beats/s',
          value: 1.0,
        },
        {
          label: '5 Hz \u00b7 10 beats/s',
          value: 1.25,
        },
      ],
    },
    {
      id: 'speed',
      label: 'Inspection playback speed',
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
      id: 'mainspring',
      name: 'Mainspring and crown',
      description: 'The wound spring supplies energy; this exhibit does not model its depletion.',
    },
    {
      id: 'train',
      name: 'Compound gear train',
      description: 'Large wheels drive smaller pinions on successive shafts.',
    },
    {
      id: 'escapement',
      name: 'Lever escapement',
      description: 'The escape wheel and pallet fork alternately lock and release the train.',
    },
    {
      id: 'balance',
      name: 'Balance and hairspring',
      description:
        'Inertia and restoring torque produce oscillation, sustained by impulses from the escapement.',
    },
    {
      id: 'hands',
      name: 'Hands and motion works',
      description: 'Count the regulated motion using fixed gear ratios.',
    },
    {
      id: 'plate',
      name: 'Plate and bridges',
      description: 'Hold the shafts and bearings in place.',
    },
  ],
  steps: [
    {
      id: 'store-energy',
      title: 'A spring is the power source.',
      label: '01 / FIND THE RHYTHM',
      body: 'Turn the crown and a mechanism winds the mainspring inside its barrel. As the spring unwinds, it supplies torque to the gear train.',
      why: 'The watch needs a store of energy that can travel with you. A tightly coiled strip of spring steel fits inside a small movement.',
      experiment: 'Select the mainspring barrel. Look for the coiled strip behind its cutaway rim.',
      deeper:
        'The scene shows the energy path, not measured spring torque, winding, or depletion. The prescribed motion repeats without calculating a power reserve.',
      parts: ['mainspring'],
      phase: 0,
      controls: ['speed'],
      camera: [2, 3, 9],
      presentation: {
        target: [0, 0, 0],
        reveal: ['all'],
      },
    },
    {
      id: 'pass-the-power',
      title: 'A train of tiny gears.',
      label: '02 / FIND THE RHYTHM',
      body: 'Each large wheel drives a small pinion on the next shaft. A second wheel shares that shaft and passes the motion onward.',
      why: 'The compound ratios turn the slow unwinding of the barrel into faster motion near the escapement. The shafts carry different rates through the movement.',
      experiment:
        'Take the movement apart. Follow a large wheel to the smaller pinion on the next shaft.',
      deeper:
        'The visible train uses 80:10, 75:10 and 96:6 contacts. Tooth outlines are illustrative; pitch spacing and angular ratios are calculated.',
      parts: ['train'],
      phase: 60,
      controls: ['speed'],
      camera: [2, 3, 9],
      presentation: {
        target: [0, 0, 0],
        reveal: ['all'],
      },
    },
    {
      id: 'hold-the-wheel',
      title: 'Keeping time begins with stopping.',
      label: '03 / FIND THE RHYTHM',
      body: 'An escape-wheel tooth rests against one of the pallet stones. The gear train cannot simply run freely, even though the mainspring supplies torque.',
      why: 'Without regulation, the spring would unwind too quickly and unevenly for useful timekeeping. The pallet fork controls the releases.',
      experiment:
        'Pause on a Hold stage. Look at the escape wheel beside the two red pallet stones.',
      deeper:
        'This is a schematic conventional lever escapement. Contact timing is prescribed; friction, impacts, drop and manufacturing tolerances are not solved.',
      parts: ['escapement'],
      phase: 35,
      controls: ['speed'],
      camera: [1.3, 1.5, 6],
      presentation: {
        target: [0.58, 0.45, 0.5],
        reveal: ['escapement'],
      },
    },
    {
      id: 'release-a-beat',
      title: 'One beat releases a little motion.',
      label: '04 / FIND THE RHYTHM',
      body: 'As the balance swings through its center, the lever moves. One pallet releases; the escape wheel advances and is caught on the other pallet.',
      why: 'The same interaction gives the balance an impulse to replace energy lost during real operation. Holding and releasing connects the power source to the regulator.',
      experiment:
        'Jump between Release and Hold. Notice that the escape wheel advances in steps, not continuous rotation.',
      deeper:
        'One complete balance oscillation has two beats. This 15-tooth teaching escape wheel advances one tooth over that complete oscillation.',
      parts: ['escapement', 'balance'],
      phase: 95,
      controls: ['speed'],
      camera: [1.3, 1.5, 6],
      presentation: {
        target: [0.58, 0.45, 0.5],
        reveal: ['escapement'],
      },
    },
    {
      id: 'the-balance',
      title: 'The hairspring brings it back.',
      label: '05 / FIND THE RHYTHM',
      body: 'The balance has inertia. Its hairspring supplies a restoring torque as the balance turns away from its resting position. Together they oscillate back and forth.',
      why: 'The escapement sustains that oscillation while the balance controls the rhythm of release. They exchange energy and timing information.',
      experiment:
        'Compare 3, 4 and 5 Hz. Count two beats in each complete back-and-forth oscillation.',
      deeper:
        'For an ideal torsional oscillator, frequency depends on stiffness and rotational inertia. Changing frequency here is a comparison parameter, not a simulation of a specific regulating screw or adjustment.',
      parts: ['balance'],
      phase: 180,
      controls: ['rate', 'speed'],
      camera: [1.3, 1.5, 6],
      presentation: {
        target: [0.58, 0.45, 0.5],
        reveal: ['escapement'],
      },
    },
    {
      id: 'count-the-beats',
      title: 'The hands count that rhythm.',
      label: '06 / FIND THE RHYTHM',
      body: 'The gear train turns repeated releases into motion of the seconds, minute and hour hands. Its fixed ratios are calibrated to a 4 Hz balance in this example.',
      why: 'Change the balance rate without changing those ratios and the hands run slow or fast. More beats in the same real time means more advance through the same train.',
      experiment:
        'Set 3 Hz, then 5 Hz. Compare 0.75\u00d7 and 1.25\u00d7 hand rates with the 4 Hz baseline.',
      deeper:
        'The animation is slowed for inspection. The fixed train makes the fourth wheel turn once per 60 simulated seconds at 4 Hz; center and hour motion follow 60:1 and 12:1 reductions. No real-world accuracy is predicted.',
      parts: ['hands'],
      phase: 270,
      controls: ['rate', 'speed'],
      camera: [2, 3, 9],
      presentation: {
        target: [0, 0, 0],
        reveal: ['all'],
      },
    },
  ],
  sources: [
    {
      title: 'Grand Seiko \u2014 Mechanical movement: mechanism',
      url: 'https://www.grand-seiko.com/uk-en/collections/movement/mechanical',
      note: 'General mainspring, train, balance and escapement principles; this is not a model of a Grand Seiko calibre.',
    },
  ],
  limitations:
    'Unbranded, idealized hand-wound movement with a prescribed conventional lever escapement. Tooth shapes and contact geometry are teaching approximations. No force, friction, accuracy, power-reserve or spring-depletion simulation. Frequency presets hold the gear train fixed. No automatic winding, date or complications. Motion is slowed for inspection.',
  assetCredits:
    'Original Blender movement, deterministic hairspring and educational text by OpenEngineering contributors, CC BY 4.0. Editable source and scripts/build-exhibit-models.py included. No branded calibre or copied CAD.',
};
