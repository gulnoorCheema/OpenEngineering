#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
const id = process.argv[2];
if (!id || !/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(id)) {
  console.error('Usage: npm run new-exhibit -- belt-drive (lowercase slug)');
  process.exit(1);
}
const symbol = id.replaceAll('-', '_'),
  title = id
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
const manifest = `src/content/exhibits/${id}.ts`,
  scene = `src/components/scenes/${title.replaceAll(' ', '')}Scene.tsx`,
  calculation = `tests/${id}.test.ts`;
const index = 'src/content/exhibits/index.ts',
  registry = 'src/components/scenes/registry.ts';
if ([manifest, scene, calculation].some(existsSync)) {
  console.error('An exhibit or file with this name already exists. No files changed.');
  process.exit(1);
}
const oldIndex = readFileSync(index, 'utf8'),
  oldRegistry = readFileSync(registry, 'utf8');
if (
  !oldIndex.includes('export const exhibits = [') ||
  !oldRegistry.includes('export const scenes = {')
)
  throw new Error('Registry format changed; register the exhibit manually. No files changed.');
const files = {
  [manifest]: `// Starter: replace the inherited gear story with your own researched explanation.\nimport { gears } from './gears';\nimport type { Exhibit } from '../../lib/exhibit';\nexport const ${symbol}: Exhibit = { ...gears, id: '${id}', scene: '${id}', number: 'NEW', title: '${title} — gear starter', author: 'Your name', subtitle: 'A working gear example, ready for your mechanism.' };\n`,
  [scene]: `// Start here, then replace geometry and import your pure calculations.\nimport GearScene from './GearScene';\nimport type { SceneProps } from '../../lib/exhibit';\nexport default function ${title.replaceAll(' ', '')}Scene(props: SceneProps) { return <GearScene {...props}/>; }\n`,
  [calculation]: `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { gearKinematics } from '../src/lib/mechanics.ts';\n// Replace with an independent invariant for your own mechanism.\ntest('${id}: sample gear contact conserves pitch motion',()=>{\n const k=gearKinematics(90,16,32);\n assert.ok(Math.abs(k.inputAngle*16+k.outputAngle*32)<1e-9);\n});\n`,
  [index]:
    `import { ${symbol} } from './${id}';\n` +
    oldIndex.replace('export const exhibits = [', `export const exhibits = [${symbol}, `),
  [registry]: oldRegistry.replace(
    'export const scenes = {',
    `export const scenes = {\n '${id}': lazy(() => import('./${title.replaceAll(' ', '')}Scene')),`,
  ),
};
for (const [file, contents] of Object.entries(files)) {
  mkdirSync(dirname(resolve(file)), { recursive: true });
  writeFileSync(file, contents);
}
console.log(
  `Created ${id}. Open /exhibits/${id}/ after npm run dev. Read docs/AUTHORING.md before replacing the gear example.`,
);
