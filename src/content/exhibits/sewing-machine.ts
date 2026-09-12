import type { Exhibit } from '../../lib/exhibit';
export const sewing_machine: Exhibit = {
  id: 'sewing-machine',
  scene: 'sewing-machine',
  number: '04',
  featured: true,
  title: 'The sewing machine',
  subtitle: 'Two threads. One wonderfully clever loop.',
  question: 'How does a needle leave a stitch behind?',
  duration: '3 min',
  author: 'OpenEngineering contributors',
  period: 360,
  speed: 72,
  presentation: {
    minAspect: 0.75,
    cameras: {
      overview: [4.2, 2.5, 9.5],
      front: [0, 0.6, 10],
      rear: [-3, 1, -9],
    },
    target: [0, 0.4, 0],
    fov: 34,
  },
  controls: [
    {
      id: 'length',
      label: 'Stitch length',
      kind: 'select',
      default: 2,
      options: [
        {
          label: '1 mm',
          value: 1,
        },
        {
          label: '2 mm',
          value: 2,
        },
        {
          label: '4 mm',
          value: 4,
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
      id: 'needle',
      name: 'Needle',
      description: 'Its eye carries the upper thread down through the cloth.',
    },
    {
      id: 'hook',
      name: 'Oscillating hook',
      description: 'Catches the needle loop and carries it around the bobbin case.',
    },
    {
      id: 'bobbin',
      name: 'Bobbin and case',
      description: 'Supply and hold the lower thread; the upper loop travels around the case.',
    },
    {
      id: 'takeup',
      name: 'Take-up lever',
      description: 'Draws back slack to tighten the interlock.',
    },
    {
      id: 'feed',
      name: 'Feed dogs and presser foot',
      description: 'Move the cloth when the needle is clear, then return below the plate.',
    },
    {
      id: 'upper-thread',
      name: 'Upper thread',
      description:
        'Orange traces the thread from the spool, through the needle and around the lower thread.',
    },
    {
      id: 'frame',
      name: 'Frame and handwheel',
      description: 'Support the coordinated mechanism.',
    },
  ],
  steps: [
    {
      id: 'through-the-cloth',
      title: 'A needle carries a loop.',
      label: '01 / FOLLOW THE THREAD',
      body: 'The needle carries the orange upper thread down through the cloth. Its eye is near the pointed end, so the whole needle does not need to pass through.',
      why: 'A sewing machine needs to leave thread behind while bringing the needle back. That takes a second thread and a hidden mechanism.',
      experiment: 'Pause and drag the cycle slider. Find the needle eye just above the point.',
      deeper:
        'The animation follows an idealized oscillating-hook lockstitch. The needle, feed and hook share a prescribed cycle.',
      parts: ['needle'],
      phase: 100,
      controls: ['speed'],
      camera: [4.2, 2.5, 9.5],
      presentation: {
        target: [0, 0.4, 0],
        reveal: ['all'],
      },
    },
    {
      id: 'make-a-loop',
      title: 'Coming back makes a loop.',
      label: '02 / FOLLOW THE THREAD',
      body: 'As the needle begins to rise, the cloth holds back part of the thread. A small loop opens beside the needle, just below the fabric.',
      why: 'That brief loop gives the hook something to catch. The needle\u2019s scarf provides clearance near the hook.',
      experiment:
        'Choose Loop below the model. Follow the orange thread on the rising side of the needle.',
      deeper:
        'Real loop formation depends on thread, cloth friction, needle shape and tension. Here the curve is staged explicitly, rather than calculated from those forces.',
      parts: ['needle', 'upper-thread'],
      phase: 195,
      controls: ['speed'],
      camera: [2, 0.5, 7],
      presentation: {
        target: [-0.25, -0.25, 0],
        reveal: ['stitch-zone'],
      },
    },
    {
      id: 'catch-the-loop',
      title: 'A hook arrives at the right moment.',
      label: '03 / FOLLOW THE THREAD',
      body: 'The pointed hook passes the needle and catches its loop. The hook oscillates: it sweeps around, then returns for the next stitch.',
      why: 'The hook must meet the loop after the needle reverses. Arrive too early or late in a real machine and a stitch can be missed.',
      experiment:
        'Scrub slowly past the bottom of the needle\u2019s stroke. Watch the hook sweep through the loop.',
      deeper:
        'This is an oscillating-hook mechanism, not the continuously rotating hook used in some other lockstitch machines.',
      parts: ['hook'],
      phase: 225,
      controls: ['speed'],
      camera: [2, 0.5, 7],
      presentation: {
        target: [-0.25, -0.25, 0],
        reveal: ['stitch-zone'],
      },
    },
    {
      id: 'around-the-bobbin',
      title: 'The second thread stays underneath.',
      label: '04 / FOLLOW THE THREAD',
      body: 'The hook spreads the orange loop around the bobbin case. The bobbin supplies the cyan lower thread. The upper thread passes around it before the loop is pulled closed.',
      why: 'Two threads can interlock even though neither spool passes through the cloth. The small clearances around the case let the upper loop travel.',
      experiment:
        'Select Around bobbin and rotate the model. Trace the orange loop around the case, not through its metal.',
      deeper:
        'Thread thickness and clearances are enlarged for inspection. The two paths illustrate the topology of an interlock, not a validated thread-dynamics simulation.',
      parts: ['hook', 'bobbin'],
      phase: 275,
      controls: ['speed'],
      camera: [2, 0.5, 7],
      presentation: {
        target: [-0.25, -0.25, 0],
        reveal: ['stitch-zone'],
      },
    },
    {
      id: 'draw-it-tight',
      title: 'Take back the slack.',
      label: '05 / FOLLOW THE THREAD',
      body: 'The take-up lever rises, drawing the upper thread back. The loop slips free of the hook and tightens around the lower thread inside the fabric.',
      why: 'Controlled tension brings the interlock into the material instead of leaving a loose loop underneath.',
      experiment: 'Select Tighten. Follow the upper thread back toward the moving take-up lever.',
      deeper:
        'The visible stitch is an interlock, not a separate overhand knot. Real tension balance varies with fabric and thread. This exhibit does not calculate tension.',
      parts: ['takeup', 'upper-thread'],
      phase: 302,
      controls: ['speed'],
      camera: [2, 0.5, 7],
      presentation: {
        target: [-0.25, -0.25, 0],
        reveal: ['stitch-zone'],
      },
    },
    {
      id: 'move-the-cloth',
      title: 'One stitch. Then a small step.',
      label: '06 / FOLLOW THE THREAD',
      body: 'Once the needle is clear, the feed dogs rise, grip the cloth and move it forward. They drop below the plate to return without dragging the fabric backward.',
      why: 'The feed distance sets the space between stitches. The presser foot holds the cloth against the feed and plate.',
      experiment:
        'Compare 1, 2 and 4 mm. Watch the completed stitch spacing change while the needle keeps the same stroke.',
      deeper:
        'A full drive-shaft turn produces one modeled stitch. Scene scale is 0.16 teaching units per millimetre of feed. The moving strip is reconstructed from phase; no history is accumulated.',
      parts: ['feed'],
      phase: 330,
      controls: ['length', 'speed'],
      camera: [4.2, 2.5, 9.5],
      presentation: {
        target: [0, 0.4, 0],
        reveal: ['all'],
      },
    },
  ],
  sources: [
    {
      title: 'Henderson Sewing \u2014 How a sewing machine works',
      url: 'https://www.hendersonsewing.com/images/Getting_started_how_sewing_machines_work.pdf',
      note: 'Oscillating hook, stitch formation, feed and thread control.',
    },
  ],
  limitations:
    'Idealized oscillating-hook lockstitch with prescribed timing and staged thread curves. No cloth, friction, tension, needle deflection or motor-load simulation. Clearances and thread thickness are enlarged. The finite stitch strip repeats for display.',
  assetCredits:
    'Original Blender model, thread geometry and prose by OpenEngineering contributors; CC BY 4.0. Reproducible export: scripts/build-exhibit-models.py. No manufacturer CAD or copied illustrations.',
};
