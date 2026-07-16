export const DEFAULT_SETTINGS = Object.freeze({
  enabled: false,
  hideHeaderLevel1: false,
  hideHeaderLevel2: false,
});

export function normalizeSettings(candidate = {}) {
  return Object.freeze({
    enabled: typeof candidate.enabled === 'boolean' ? candidate.enabled : DEFAULT_SETTINGS.enabled,
    hideHeaderLevel1: typeof candidate.hideHeaderLevel1 === 'boolean'
      ? candidate.hideHeaderLevel1
      : DEFAULT_SETTINGS.hideHeaderLevel1,
    hideHeaderLevel2: typeof candidate.hideHeaderLevel2 === 'boolean'
      ? candidate.hideHeaderLevel2
      : DEFAULT_SETTINGS.hideHeaderLevel2,
  });
}
