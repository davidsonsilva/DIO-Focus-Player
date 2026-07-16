import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('regra de ocultação do sumário vence a regra que o exibe', async () => {
  const css = await readFile(new URL('../src/presentation/content/focus-mode.css', import.meta.url), 'utf8');
  const visibleRule = css.indexOf('> .dio-focus-player-summary {');
  const hiddenRule = css.indexOf('> .dio-focus-player-summary.dio-focus-player-summary-hidden {');

  assert.notEqual(visibleRule, -1);
  assert.notEqual(hiddenRule, -1);
  assert.ok(hiddenRule > visibleRule, 'a regra de ocultação deve vir depois da regra visível');
  assert.match(css.slice(hiddenRule), /display:\s*none\s*!important/);
});
