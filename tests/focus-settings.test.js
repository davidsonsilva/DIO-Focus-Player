import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SETTINGS, normalizeSettings } from '../src/domain/FocusSettings.js';

test('aplica defaults para entrada ausente', () => {
  assert.deepEqual(normalizeSettings(), DEFAULT_SETTINGS);
  assert.equal(DEFAULT_SETTINGS.enabled, false);
});

test('aceita somente as quatro configurações do núcleo', () => {
  assert.deepEqual(normalizeSettings({
    enabled: true,
    hideHeaderLevel1: true,
    hideHeaderLevel2: false,
    hideSummary: true,
    activationMode: 'manual',
    breakpointPx: 901,
    summaryCollapsed: true,
  }), {
    enabled: true,
    hideHeaderLevel1: true,
    hideHeaderLevel2: false,
    hideSummary: true,
  });
});

test('valores inválidos voltam aos defaults', () => {
  assert.deepEqual(normalizeSettings({ enabled: 'yes', hideHeaderLevel1: 1, hideHeaderLevel2: null, hideSummary: 'yes' }), {
    enabled: false,
    hideHeaderLevel1: false, hideHeaderLevel2: false, hideSummary: false,
  });
});

test('desligar o modo foco preserva as opções dependentes', () => {
  assert.deepEqual(normalizeSettings({
    enabled: false,
    hideHeaderLevel1: true,
    hideHeaderLevel2: true,
    hideSummary: true,
  }), {
    enabled: false,
    hideHeaderLevel1: true,
    hideHeaderLevel2: true,
    hideSummary: true,
  });
});
