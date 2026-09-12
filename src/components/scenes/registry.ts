import { lazy } from 'react';
export const scenes = {
  engine: lazy(() => import('./EngineModel')),
  gears: lazy(() => import('./GearScene')),
  differential: lazy(() => import('./DifferentialScene')),
};
