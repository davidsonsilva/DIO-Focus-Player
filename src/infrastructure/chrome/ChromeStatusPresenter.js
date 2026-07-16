import { STATUS_KEY } from '../../domain/Status.js';

export class ChromeStatusPresenter {
  async show(status) {
    await chrome.storage.local.set({ [STATUS_KEY]: status });
  }
}
