import { STATUS_KEY } from '../../domain/Status.js';

export class PopupController {
  constructor({ settingsRepository, documentObject = document }) {
    this.repository = settingsRepository;
    this.document = documentObject;
  }

  async start() {
    const settings = await this.repository.load();
    this.renderSettings(settings);
    await this.renderStatus();
    this.bindEvents();
  }

  renderSettings(settings) {
    this.document.querySelector('#enabled').checked = settings.enabled;
    const headerOneCheckbox = this.document.querySelector('#hideHeaderLevel1');
    const headerTwoCheckbox = this.document.querySelector('#hideHeaderLevel2');
    const summaryCheckbox = this.document.querySelector('#hideSummary');
    headerOneCheckbox.checked = settings.hideHeaderLevel1;
    headerTwoCheckbox.checked = settings.hideHeaderLevel2;
    summaryCheckbox.checked = settings.hideSummary;
    headerOneCheckbox.disabled = !settings.enabled;
    headerTwoCheckbox.disabled = !settings.enabled;
    summaryCheckbox.disabled = !settings.enabled;
  }

  async renderStatus() {
    const tabContext = await this.getActiveTabContext();
    const element = this.document.querySelector('#status');
    if (tabContext.state === 'login-required') {
      element.textContent = 'Faça login na DIO para acessar e adaptar a aula.';
      element.dataset.state = 'unsupported';
      return;
    }
    if (tabContext.state === 'outside-dio') {
      element.textContent = 'Abra uma aula da DIO para usar o modo foco.';
      element.dataset.state = 'unsupported';
      return;
    }
    const { [STATUS_KEY]: status } = await chrome.storage.local.get(STATUS_KEY);
    if (!status) {
      element.textContent = 'Atualize a aula após recarregar a extensão.';
      element.dataset.state = 'ready';
    } else if (!status.compatible) {
      if (status.reason === 'loading') {
        element.textContent = 'A página da aula ainda está carregando.';
      } else {
        const diagnostic = status.diagnostics;
        element.textContent = diagnostic
          ? `Aula não reconhecida (vídeos: ${diagnostic.videos}, iframes: ${diagnostic.iframes}).`
          : 'Esta página não é uma aula compatível.';
      }
      element.dataset.state = 'unsupported';
    } else {
      element.textContent = status.applied ? 'Modo foco ativo nesta aula.' : 'Aula reconhecida. Layout original ativo.';
      element.dataset.state = status.applied ? 'active' : 'ready';
    }
  }

  async getActiveTabContext() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let url;
    try { url = new URL(tab?.url ?? ''); } catch { return { state: 'outside-dio', tab }; }
    if (url.hostname === 'auth.dio.me') return { state: 'login-required', tab };
    if (url.hostname !== 'web.dio.me') return { state: 'outside-dio', tab };
    return { state: 'dio', tab };
  }

  bindEvents() {
    const form = this.document.querySelector('#settings-form');
    form.addEventListener('change', async () => {
      const settings = await this.repository.save({
        enabled: this.document.querySelector('#enabled').checked,
        hideHeaderLevel1: this.document.querySelector('#hideHeaderLevel1').checked,
        hideHeaderLevel2: this.document.querySelector('#hideHeaderLevel2').checked,
        hideSummary: this.document.querySelector('#hideSummary').checked,
      });
      this.renderSettings(settings);
      await this.refreshActiveTab();
    });
  }

  async sendToActiveTab(message) {
    const { tab, state } = await this.getActiveTabContext();
    if (state !== 'dio') return null;
    if (!tab?.id) return null;
    try { return await chrome.tabs.sendMessage(tab.id, message); } catch { return null; }
  }

  async refreshActiveTab() {
    await this.sendToActiveTab({ type: 'DIO_FOCUS_REFRESH' });
    await this.renderStatus();
  }
}
