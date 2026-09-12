import fs from 'node:fs';
import path from 'node:path';
const root = 'node_modules',
  dest = 'public/licenses';
fs.mkdirSync(dest, { recursive: true });
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
      .filter((n) => /^(license|licence|ofl|copying)(\.|$)/i.test(n));
    const licenseFiles = [];
    for (const file of files) {
      if (!fs.statSync(path.join(folder, file)).isFile()) continue;
      const target = `${pkg.name.replaceAll('/', '__')}--${file}`;
      fs.copyFileSync(path.join(folder, file), path.join(dest, target));
      licenseFiles.push(target);
    }
    rows.push({
      name: pkg.name,
      version: pkg.version,
      license: pkg.license || 'See package',
      files: licenseFiles,
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
