import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { gears } from '../src/content/exhibits/gears';
import { exhibitRecordingFrame } from '../src/lib/recordings';

test('a new manifest has a deterministic recording with its own captions and clock rate', () => {
  const exhibit = {
    ...gears,
    id: 'belt-drive',
    question: 'A new question?',
    subtitle: 'A new explanation.',
    presentation: { clockRateControl: 'ratio' },
  };
  const start = exhibitRecordingFrame(exhibit, 0);
  const later = exhibitRecordingFrame(exhibit, 10);
  assert.deepEqual(later.caption, [exhibit.question, exhibit.subtitle]);
  assert.equal(later.phase - start.phase, 10 * gears.speed * 2);
  exhibitRecordingFrame(exhibit, 19);
  assert.deepEqual(exhibitRecordingFrame(exhibit, 0), start);
});

test('scaffold registers valid symbols, supplies preview files, and refuses collisions without edits', () => {
  const dir = mkdtempSync(join(tmpdir(), 'oe-scaffold-'));
  const files = [
    'src/content/exhibits/index.ts',
    'src/components/scenes/registry.ts',
    'public/exhibits/gears.png',
    'public/exhibits/gears.webp',
    'public/social/gears.png',
  ];
  try {
    for (const file of files) {
      mkdirSync(dirname(join(dir, file)), { recursive: true });
      copyFileSync(resolve(file), join(dir, file));
    }
    const run = (slug: string) =>
      spawnSync(process.execPath, [resolve('scripts/new-exhibit.mjs'), slug], {
        cwd: dir,
        encoding: 'utf8',
      });
    for (const slug of ['belt-drive', 'class', 'gear-3']) {
      const result = run(slug);
      assert.equal(result.status, 0, result.stderr);
      const manifest = readFileSync(join(dir, `src/content/exhibits/${slug}.ts`), 'utf8');
      const parsed = ts.transpileModule(manifest, {
        reportDiagnostics: true,
        compilerOptions: { target: ts.ScriptTarget.ESNext },
      });
      assert.deepEqual(parsed.diagnostics, []);
      assert.ok(readFileSync(join(dir, files[0]), 'utf8').includes(`from './${slug}'`));
      assert.ok(readFileSync(join(dir, files[1]), 'utf8').includes(`'${slug}'`));
      for (const [folder, ext] of [
        ['exhibits', 'png'],
        ['exhibits', 'webp'],
        ['social', 'png'],
      ]) {
        assert.deepEqual(
          readFileSync(join(dir, `public/${folder}/${slug}.${ext}`)),
          readFileSync(join(dir, `public/${folder}/gears.${ext}`)),
        );
      }
    }
    writeFileSync(join(dir, 'public/social/collision.png'), 'existing artwork');
    const before = files.map((file) => readFileSync(join(dir, file)));
    for (const slug of ['belt-drive', '../escape', 'Bad Name', 'collision'])
      assert.notEqual(run(slug).status, 0);
    assert.deepEqual(
      files.map((file) => readFileSync(join(dir, file))),
      before,
    );
    assert.equal(
      readFileSync(join(dir, 'public/social/collision.png'), 'utf8'),
      'existing artwork',
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('license regeneration preserves distinct versions, NOTICE files, and unrelated notices', () => {
  const dir = mkdtempSync(join(tmpdir(), 'oe-licenses-'));
  const put = (file: string, text: string) => {
    mkdirSync(dirname(join(dir, file)), { recursive: true });
    writeFileSync(join(dir, file), text);
  };
  try {
    put('licenses/upstream/index.json', '[]');
    put(
      'node_modules/example/package.json',
      JSON.stringify({ name: 'example', version: '1.0.0', license: 'MIT' }),
    );
    put('node_modules/example/LICENSE', 'First release notice');
    put('node_modules/example/NOTICE', 'Additional attribution');
    put(
      'node_modules/example/node_modules/example/package.json',
      JSON.stringify({ name: 'example', version: '2.0.0', license: 'MIT' }),
    );
    put('node_modules/example/node_modules/example/LICENSE', 'Second release notice');
    put('public/licenses/handwritten.txt', 'Keep me');
    put('public/licenses/obsolete.txt', 'Generated earlier');
    put('public/licenses/inventory.json', JSON.stringify([{ files: ['obsolete.txt'] }]));
    const run = () =>
      spawnSync(process.execPath, [resolve('scripts/licenses.mjs')], {
        cwd: dir,
        encoding: 'utf8',
      });
    assert.equal(run().status, 0);
    assert.equal(
      readFileSync(join(dir, 'public/licenses/example@1.0.0--LICENSE'), 'utf8'),
      'First release notice',
    );
    assert.equal(
      readFileSync(join(dir, 'public/licenses/example@2.0.0--LICENSE'), 'utf8'),
      'Second release notice',
    );
    assert.equal(
      readFileSync(join(dir, 'public/licenses/example@1.0.0--NOTICE'), 'utf8'),
      'Additional attribution',
    );
    assert.equal(readFileSync(join(dir, 'public/licenses/handwritten.txt'), 'utf8'), 'Keep me');
    assert.throws(() => readFileSync(join(dir, 'public/licenses/obsolete.txt')));
    const inventory = readFileSync(join(dir, 'public/licenses/inventory.json'), 'utf8');
    assert.equal(run().status, 0);
    assert.equal(readFileSync(join(dir, 'public/licenses/inventory.json'), 'utf8'), inventory);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('browser notice audit checks emitted code and rejects a missing notice', () => {
  const dir = mkdtempSync(join(tmpdir(), 'oe-browser-notices-'));
  const put = (file: string, text: string) => {
    mkdirSync(dirname(join(dir, file)), { recursive: true });
    writeFileSync(join(dir, file), text);
  };
  try {
    const names = [
      'react',
      '@fontsource/dm-sans',
      '@fontsource/space-grotesk',
      '@fontsource/ibm-plex-mono',
    ];
    const inventory = names.map((name, i) => ({
      name,
      version: '1.0.0',
      files: [`notice-${i}.txt`],
    }));
    for (const [i, name] of names.entries()) {
      put(`node_modules/${name}/package.json`, JSON.stringify({ name, version: '1.0.0' }));
      put(`dist/licenses/notice-${i}.txt`, `Notice for ${name}`);
    }
    put('public/licenses/inventory.json', JSON.stringify(inventory));
    put('dist/_astro/app.js', 'emitted client code');
    put('dist/draco/LICENSE', 'Decoder notice');
    put(
      'artifacts/browser-license-audit/chunks-0.json',
      JSON.stringify([
        {
          file: '_astro/app.js',
          modules: [
            { id: join(dir, 'node_modules/react/index.js'), renderedLength: 10 },
            { id: join(dir, 'node_modules/maath/index.js'), renderedLength: 0 },
          ],
        },
        {
          file: 'server-only.mjs',
          modules: [{ id: join(dir, 'node_modules/stats-gl/index.js'), renderedLength: 20 }],
        },
      ]),
    );
    const run = () =>
      spawnSync(process.execPath, [resolve('scripts/audit-browser-licenses.mjs')], {
        cwd: dir,
        encoding: 'utf8',
      });
    const ok = run();
    assert.equal(ok.status, 0, ok.stderr);
    const report = JSON.parse(
      readFileSync(join(dir, 'artifacts/browser-license-audit/report.json'), 'utf8'),
    );
    assert.deepEqual(report.excludedFromBrowserBundle, ['maath', 'stats-gl']);
    assert.equal(report.packages.length, 4);
    rmSync(join(dir, 'dist/licenses/notice-0.txt'));
    const failed = run();
    assert.notEqual(failed.status, 0);
    assert.match(failed.stderr, /Missing distributed notice/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
