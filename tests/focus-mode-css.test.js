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

test('player semântico mantém proporção quando seus filhos são absolutos', async () => {
  const css = await readFile(new URL('../src/presentation/content/focus-mode.css', import.meta.url), 'utf8');
  const rule = css.match(/\.dio-focus-player-layout:not\(\[data-dio-focus-strategy="known-layout-v2026-07"\]\) \.dio-focus-player-video \{([^}]*)\}/);
  assert.ok(rule, 'regra do player semântico deve existir');
  assert.match(rule[1], /height:\s*auto\s*!important/);
  assert.match(rule[1], /aspect-ratio:\s*16\s*\/\s*9\s*!important/);
});
