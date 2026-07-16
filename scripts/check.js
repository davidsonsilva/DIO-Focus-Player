import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));

const errors = [];
if (manifest.manifest_version !== 3) errors.push('manifest_version deve ser 3');
if (manifest.permissions.some((permission) => !['storage', 'activeTab'].includes(permission))) {
  errors.push('manifest contém permissão não aprovada');
}
if (manifest.host_permissions) errors.push('host_permissions global não deve ser usado');
if (manifest.content_scripts?.[0]?.matches?.join() !== 'https://web.dio.me/*') {
  errors.push('content script deve estar restrito a https://web.dio.me/*');
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : fullPath;
  }))).flat();
}

for (const file of await walk(path.join(root, 'src'))) {
  if (!file.endsWith('.js')) continue;
  const source = await readFile(file, 'utf8');
  if (/\beval\s*\(|\bnew\s+Function\s*\(/.test(source)) errors.push(`código dinâmico proibido em ${file}`);
  if (/https?:\/\//.test(source)) errors.push(`URL remota inesperada em ${file}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Verificações estáticas aprovadas.');
}
