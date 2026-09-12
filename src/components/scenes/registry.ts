import { lazy } from 'react';
export const scenes = {
  'mechanical-watch': lazy(() => import('./MechanicalWatchScene')),
  'jet-engine': lazy(() => import('./JetEngineScene')),
  'sewing-machine': lazy(() => import('./SewingMachineScene')),
  engine: lazy(() => import('./EngineModel')),
  gears: lazy(() => import('./GearScene')),
  differential: lazy(() => import('./DifferentialScene')),
};
