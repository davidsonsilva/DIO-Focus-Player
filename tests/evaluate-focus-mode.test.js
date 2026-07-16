import test from 'node:test';
import assert from 'node:assert/strict';
import { EvaluateFocusMode } from '../src/application/EvaluateFocusMode.js';
import { DEFAULT_SETTINGS } from '../src/domain/FocusSettings.js';

test('aplica modo foco e publica o estado', async () => {
  let applied = false;
  let published;
  const pageLayout = {
    inspect: () => ({ compatible: true, reason: 'ready' }),
    getAvailableWidth: () => 800,
    isFocusLayoutApplied: () => applied,
    applyFocusLayout: () => { applied = true; },
    restoreOriginalLayout: () => { applied = false; },
  };
  const useCase = new EvaluateFocusMode({
    pageLayout,
    settingsRepository: { load: async () => ({ ...DEFAULT_SETTINGS, enabled: true }) },
    statusPresenter: { show: async (status) => { published = status; } },
  });

  const result = await useCase.execute();
  assert.equal(result.decision, 'enable');
  assert.equal(applied, true);
  assert.equal(published.applied, true);
  assert.equal(published.availableWidth, 800);
});

test('sincroniza preferências mesmo quando o modo foco já está correto', async () => {
  let applications = 0;
  const pageLayout = {
    inspect: () => ({ compatible: true, reason: 'ready' }),
    getAvailableWidth: () => 800,
    isFocusLayoutApplied: () => true,
    applyFocusLayout: () => { applications += 1; },
    restoreOriginalLayout: () => {},
  };
  const useCase = new EvaluateFocusMode({
    pageLayout,
    settingsRepository: { load: async () => ({ ...DEFAULT_SETTINGS, enabled: true }) },
    statusPresenter: { show: async () => {} },
  });
  assert.equal((await useCase.execute()).decision, 'no-change');
  assert.equal(applications, 1);
});
