import test from 'node:test';
import assert from 'node:assert/strict';
import { decideLayout } from '../src/domain/LayoutPolicy.js';
import { DEFAULT_SETTINGS } from '../src/domain/FocusSettings.js';

const ready = { compatible: true, reason: 'ready' };
const enabledSettings = { ...DEFAULT_SETTINGS, enabled: true };

test('ativa quando o usuário liga o modo foco', () => {
  assert.equal(decideLayout({ settings: enabledSettings, compatibility: ready, availableWidth: 900, isApplied: false }), 'enable');
});

test('não reaplica a decisão quando já está ativo', () => {
  assert.equal(decideLayout({ settings: enabledSettings, compatibility: ready, availableWidth: 1600, isApplied: true }), 'no-change');
});

test('restaura quando a página deixa de ser compatível', () => {
  assert.equal(decideLayout({ settings: enabledSettings, compatibility: { compatible: false, reason: 'unsupported' }, availableWidth: 900, isApplied: true }), 'disable');
});

test('desativado restaura um layout aplicado', () => {
  assert.equal(decideLayout({ settings: { ...DEFAULT_SETTINGS, enabled: false }, compatibility: ready, availableWidth: 900, isApplied: true }), 'disable');
});
