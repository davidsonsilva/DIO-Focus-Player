export function decideLayout({ settings, compatibility, availableWidth, isApplied }) {
  if (!compatibility.compatible || compatibility.reason !== 'ready') {
    return isApplied ? 'disable' : 'no-change';
  }
  if (!settings.enabled) return isApplied ? 'disable' : 'no-change';

  const shouldEnable = settings.enabled;

  if (shouldEnable === isApplied) return 'no-change';
  return shouldEnable ? 'enable' : 'disable';
}
