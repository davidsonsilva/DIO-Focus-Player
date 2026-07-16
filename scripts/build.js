import { build } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'popup'), { recursive: true });

await Promise.all([
  build({
    entryPoints: [path.join(root, 'src/bootstrap/content.js')],
    outfile: path.join(dist, 'content.js'),
    bundle: true,
    format: 'iife',
    target: 'chrome120',
    minify: false,
  }),
  build({
    entryPoints: [path.join(root, 'src/bootstrap/popup.js')],
    outfile: path.join(dist, 'popup/popup.js'),
    bundle: true,
    format: 'iife',
    target: 'chrome120',
    minify: false,
  }),
  build({
    entryPoints: [path.join(root, 'src/bootstrap/service-worker.js')],
    outfile: path.join(dist, 'service-worker.js'),
    bundle: true,
    format: 'iife',
    target: 'chrome120',
    minify: false,
  }),
]);

await Promise.all([
  cp(path.join(root, 'manifest.json'), path.join(dist, 'manifest.json')),
  cp(path.join(root, 'src/presentation/content/focus-mode.css'), path.join(dist, 'focus-mode.css')),
  cp(path.join(root, 'src/presentation/popup/popup.html'), path.join(dist, 'popup/popup.html')),
  cp(path.join(root, 'src/presentation/popup/popup.css'), path.join(dist, 'popup/popup.css')),
  cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true }),
]);

console.log(`Extensão criada em ${dist}`);
