import fs from 'node:fs';
import path from 'node:path';
const root = 'node_modules',
  dest = 'public/licenses';
fs.mkdirSync(dest, { recursive: true });
const overridesRoot = 'licenses/upstream';
const overrides = JSON.parse(fs.readFileSync(path.join(overridesRoot, 'index.json'), 'utf8'));
// Remove only previously generated files; leave unrelated notices alone.
const inventoryPath = path.join(dest, 'inventory.json');
if (fs.existsSync(inventoryPath)) {
  for (const row of JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))) {
    for (const file of row.files) {
      if (path.basename(file) !== file) throw new Error('Invalid inventory filename');
      fs.rmSync(path.join(dest, file), { force: true });
    }
  }
}
const rows = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name.startsWith('.')) continue;
    const folder = path.join(dir, e.name);
    if (e.name.startsWith('@')) {
      walk(folder);
      continue;
    }
    const p = path.join(folder, 'package.json');
    if (!fs.existsSync(p)) continue;
    const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
    const files = fs
      .readdirSync(folder)
      .filter((n) => /^(license|licence|ofl|copying|notice)(\.|$)/i.test(n));
    const licenseFiles = [];
    for (const file of files) {
      if (!fs.statSync(path.join(folder, file)).isFile()) continue;
      const target = `${pkg.name.replaceAll('/', '__')}@${pkg.version}--${file}`;
      fs.copyFileSync(path.join(folder, file), path.join(dest, target));
      licenseFiles.push(target);
    }
    const override = overrides.find((o) => o.name === pkg.name && o.version === pkg.version);
    if (!licenseFiles.length && override) {
      fs.copyFileSync(path.join(overridesRoot, override.file), path.join(dest, override.file));
      licenseFiles.push(override.file);
    }
    rows.push({
      name: pkg.name,
      version: pkg.version,
      license: pkg.license || 'See package',
      files: licenseFiles,
      ...(override ? { source: override.source } : {}),
    });
    if (fs.existsSync(path.join(folder, 'node_modules'))) walk(path.join(folder, 'node_modules'));
  }
}
walk(root);
fs.writeFileSync(
  path.join(dest, 'inventory.json'),
  JSON.stringify(
    rows.sort((a, b) => a.name.localeCompare(b.name)),
    null,
    2,
  ) + '\n',
);
console.log(`Retained ${rows.length} dependency license records.`);

const missing = rows.filter((row) => !row.files.length);
if (missing.length)
  console.warn(
    `No bundled notice found for ${missing.length} installed packages; inspect inventory entries with empty files. Package license metadata is not a retained license text.`,
  );
