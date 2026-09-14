// Run after the instrumented production build, via npm run audit:licenses.
import fs from 'node:fs';
import path from 'node:path';
const directory = 'artifacts/browser-license-audit';
const inventory = JSON.parse(fs.readFileSync('public/licenses/inventory.json', 'utf8'));
const packages = new Map();
const checkedChunks = new Set();
for (const file of fs.readdirSync(directory).filter((name) => /^chunks-\d+\.json$/.test(name))) {
  for (const chunk of JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'))) {
    // Astro also emits build-time server chunks, which are not in the static delivery.
    if (!fs.existsSync(path.join('dist', chunk.file))) continue;
    checkedChunks.add(chunk.file);
    for (const module of chunk.modules) {
      if (typeof module.renderedLength !== 'number')
        throw new Error('Bundler module accounting changed');
      if (module.renderedLength === 0) continue;
      const marker = '/node_modules/';
      const at = module.id.lastIndexOf(marker);
      if (at < 0) continue;
      const name = module.id.slice(at + marker.length).match(/^(@[^/]+\/[^/]+|[^/]+)/)?.[0];
      if (!name) throw new Error(`Cannot identify module package: ${module.id}`);
      const folder = module.id.slice(0, at + marker.length) + name;
      const pkg = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'));
      packages.set(`${pkg.name}@${pkg.version}`, { name: pkg.name, version: pkg.version });
    }
  }
}
if (!checkedChunks.size || ![...packages.values()].some((p) => p.name === 'react')) {
  throw new Error('No complete browser module report found; run the instrumented build first');
}
// Font binaries are copied from CSS rather than represented as JavaScript modules.
for (const name of [
  '@fontsource/dm-sans',
  '@fontsource/space-grotesk',
  '@fontsource/ibm-plex-mono',
]) {
  const pkg = JSON.parse(fs.readFileSync(`node_modules/${name}/package.json`, 'utf8'));
  packages.set(`${name}@${pkg.version}`, { name, version: pkg.version });
}
const rows = [...packages.values()]
  .sort((a, b) => `${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`))
  .map((pkg) => {
    const record = inventory.find((r) => r.name === pkg.name && r.version === pkg.version);
    if (!record?.files.length)
      throw new Error(`Missing retained notice for distributed package ${pkg.name}@${pkg.version}`);
    for (const file of record.files) {
      if (path.basename(file) !== file || !fs.existsSync(path.join('dist/licenses', file))) {
        throw new Error(`Missing distributed notice: ${file}`);
      }
    }
    return record;
  });
if (!fs.existsSync('dist/draco/LICENSE')) throw new Error('Missing local Draco license');
const excluded = ['maath', 'stats-gl'].filter((name) => !rows.some((r) => r.name === name));
const report = {
  scope:
    'JavaScript modules retained in emitted static chunks, three self-hosted font families, and the local Draco decoder. Not a legal opinion or audit of separately redistributed node_modules.',
  chunks: [...checkedChunks].sort(),
  packages: rows,
  decoderNotice: 'draco/LICENSE',
  excludedFromBrowserBundle: excluded,
};
fs.writeFileSync(path.join(directory, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(
  `Verified notices for ${rows.length} browser/font packages and Draco across ${checkedChunks.size} emitted chunks. Excluded from browser bundle: ${excluded.join(', ') || '(none)'}.`,
);
