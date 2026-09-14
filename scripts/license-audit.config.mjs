// A production build with module accounting; no rendering or optimization changes.
import config from '../astro.config.mjs';
import fs from 'node:fs';
import path from 'node:path';
const directory = 'artifacts/browser-license-audit';
fs.mkdirSync(directory, { recursive: true });
for (const file of fs.readdirSync(directory)) {
  if (/^chunks-\d+\.json$/.test(file)) fs.rmSync(path.join(directory, file));
}
let sequence = 0;
export default {
  ...config,
  vite: {
    ...config.vite,
    plugins: [
      ...(config.vite?.plugins || []),
      {
        name: 'openengineering-license-accounting',
        generateBundle(_options, bundle) {
          const chunks = Object.values(bundle)
            .filter((item) => item.type === 'chunk')
            .map((chunk) => ({
              file: chunk.fileName,
              modules: Object.entries(chunk.modules).map(([id, info]) => ({
                id,
                renderedLength: info.renderedLength,
              })),
            }));
          fs.writeFileSync(
            path.join(directory, `chunks-${sequence++}.json`),
            JSON.stringify(chunks),
          );
        },
      },
    ],
  },
};
