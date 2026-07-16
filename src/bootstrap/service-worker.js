import { SETTINGS_KEY, STATUS_KEY } from '../domain/Status.js';

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.remove([SETTINGS_KEY, STATUS_KEY]);
});
