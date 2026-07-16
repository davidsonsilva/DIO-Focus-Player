import { DEFAULT_SETTINGS, normalizeSettings } from '../../domain/FocusSettings.js';
import { SETTINGS_KEY } from '../../domain/Status.js';

export class ChromeSettingsRepository {
  async load() {
    const stored = await chrome.storage.local.get(SETTINGS_KEY);
    return normalizeSettings(stored[SETTINGS_KEY] ?? DEFAULT_SETTINGS);
  }

  async save(settings) {
    const normalized = normalizeSettings(settings);
    await chrome.storage.local.set({ [SETTINGS_KEY]: normalized });
    return normalized;
  }

  subscribe(listener) {
    const handler = (changes, areaName) => {
      if (areaName === 'local' && changes[SETTINGS_KEY]) listener(changes[SETTINGS_KEY].newValue);
    };
    chrome.storage.onChanged.addListener(handler);
    return () => chrome.storage.onChanged.removeListener(handler);
  }
}
