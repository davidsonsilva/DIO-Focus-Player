const ROOT_CLASS = 'dio-focus-player-active';
const CONTAINER_CLASS = 'dio-focus-player-layout';
const PLAYER_CLASS = 'dio-focus-player-video';
const SUMMARY_CLASS = 'dio-focus-player-summary';
const SUMMARY_HIDDEN_CLASS = 'dio-focus-player-summary-hidden';
const HEADER_ONE_CLASS = 'dio-focus-player-header-one';
const HEADER_TWO_CLASS = 'dio-focus-player-header-two';
const HIDDEN_CLASS = 'dio-focus-player-hidden';

export class DioPageLayoutAdapter {
  constructor({ locator, root = document }) {
    this.locator = locator;
    this.root = root;
    this.elements = null;
  }

  inspect() {
    this.elements = this.locator.locate();
    if (this.elements) return { compatible: true, reason: 'ready', strategy: this.elements.strategy ?? 'semantic' };
    const stillLoading = this.root.readyState !== 'complete' || !this.root.body;
    return { compatible: false, reason: stillLoading ? 'loading' : 'unsupported', diagnostics: this.locator.diagnose() };
  }

  getAvailableWidth() {
    const container = this.elements?.container;
    return container?.getBoundingClientRect().width || this.root.documentElement?.clientWidth || 0;
  }

  isFocusLayoutApplied() {
    return this.root.documentElement?.classList.contains(ROOT_CLASS) ?? false;
  }

  applyFocusLayout(settings) {
    if (!this.elements) return;
    this.clearElementDecorations();
    const { container, player, summary } = this.elements;
    this.root.documentElement.classList.add(ROOT_CLASS);
    container.classList.add(CONTAINER_CLASS);
    container.dataset.dioFocusStrategy = this.elements.strategy ?? 'semantic';
    if (this.elements.strategy === 'known-layout-v2026-07') {
      const { headerOne, headerTwo } = this.elements;
      headerOne?.classList.add(HEADER_ONE_CLASS);
      headerTwo?.classList.add(HEADER_TWO_CLASS);
      headerOne?.classList.remove(HIDDEN_CLASS);
      headerTwo?.classList.remove(HIDDEN_CLASS);
      headerOne?.classList.toggle(HIDDEN_CLASS, settings.hideHeaderLevel1);
      headerTwo?.classList.toggle(HIDDEN_CLASS, settings.hideHeaderLevel2);
      container.dataset.dioFocusHiddenHeaders = `${Number(settings.hideHeaderLevel1)}${Number(settings.hideHeaderLevel2)}`;
    }
    player?.classList.add(PLAYER_CLASS);
    summary?.classList.add(SUMMARY_CLASS);
    summary?.classList.toggle(SUMMARY_HIDDEN_CLASS, settings.hideSummary);
  }

  restoreOriginalLayout() {
    this.root.documentElement?.classList.remove(ROOT_CLASS);
    this.clearElementDecorations();
  }

  clearElementDecorations() {
    for (const className of [CONTAINER_CLASS, PLAYER_CLASS, SUMMARY_CLASS, SUMMARY_HIDDEN_CLASS, HEADER_ONE_CLASS, HEADER_TWO_CLASS, HIDDEN_CLASS]) {
      for (const element of this.root.querySelectorAll(`.${className}`)) element.classList.remove(className);
    }
    for (const element of this.root.querySelectorAll('[data-dio-focus-strategy]')) {
      delete element.dataset.dioFocusStrategy;
    }
  }

}
