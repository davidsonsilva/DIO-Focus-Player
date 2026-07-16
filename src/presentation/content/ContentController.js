export class ContentController {
  constructor({ evaluateFocusMode, observer, settingsRepository, pageLayout }) {
    this.evaluateFocusMode = evaluateFocusMode;
    this.observer = observer;
    this.settingsRepository = settingsRepository;
    this.pageLayout = pageLayout;
    this.disposers = [];
    this.running = false;
    this.contextInvalidated = false;
  }

  async refresh() {
    if (this.running || this.contextInvalidated) return;
    this.running = true;
    try {
      await this.evaluateFocusMode.execute();
    } catch (error) {
      if (String(error?.message ?? error).includes('Extension context invalidated')) {
        this.contextInvalidated = true;
        this.disposePageObservers();
        return;
      }
      console.warn('[DIO Focus Player] Não foi possível atualizar o layout.', error);
    } finally {
      this.running = false;
    }
  }

  start() {
    this.refresh();
    this.disposers.push(this.observer.subscribe(() => this.refresh()));
    this.disposers.push(this.settingsRepository.subscribe(() => this.refresh()));
    const messageHandler = (message, _sender, sendResponse) => {
      if (message?.type === 'DIO_FOCUS_REFRESH') {
        this.refresh().then(() => sendResponse({ ok: !this.contextInvalidated }));
      }
      return true;
    };
    chrome.runtime.onMessage.addListener(messageHandler);
    this.disposers.push(() => {
      try { chrome.runtime.onMessage.removeListener(messageHandler); } catch { /* contexto recarregado */ }
    });
  }

  stop() {
    this.disposePageObservers();
    this.pageLayout.restoreOriginalLayout();
  }

  disposePageObservers() {
    for (const dispose of this.disposers.splice(0)) dispose();
  }
}
