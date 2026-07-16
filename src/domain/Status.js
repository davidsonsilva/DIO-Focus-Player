export const STATUS_KEY = 'dioFocusStatus';
export const SETTINGS_KEY = 'dioFocusSettings';

export function createStatus({ compatibility, applied, availableWidth }) {
  return {
    compatible: compatibility.compatible,
    reason: compatibility.reason,
    applied,
    availableWidth: Math.round(availableWidth || 0),
    diagnostics: compatibility.diagnostics ?? null,
    strategy: compatibility.strategy ?? null,
    updatedAt: Date.now(),
  };
}
