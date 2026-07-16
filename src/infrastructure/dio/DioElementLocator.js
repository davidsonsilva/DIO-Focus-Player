const PLAYER_SELECTORS = [
  '[data-testid*="player" i]',
  '[class*="player" i]',
  'video',
  'iframe[allow*="fullscreen"]',
];

const SUMMARY_SELECTORS = [
  '[data-testid*="content" i]',
  '[data-testid*="lesson" i]',
  'aside',
  '[role="complementary"]',
];

// Fallback versionado a partir do layout real compartilhado em 16/07/2026.
// Essas classes são geradas pela DIO e nunca devem ser a estratégia primária.
const LEGACY_GRID_SELECTOR = '.iDHUNI';
const LEGACY_SCROLL_SELECTOR = '.bBIjVk';
const KNOWN_PLAYER_SELECTOR = '.bcgIPK';
const KNOWN_HEADER_ONE_SELECTOR = '.fljMYB';
const KNOWN_HEADER_TWO_SELECTOR = '.dtDoZu';

function firstMatch(root, selectors) {
  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (element) return element;
  }
  return null;
}

function commonAncestor(left, right) {
  if (!left || !right) return null;
  const body = left.ownerDocument?.body;
  const ancestors = new Set();
  for (let node = left; node && node !== body; node = node.parentElement) ancestors.add(node);
  for (let node = right; node && node !== body; node = node.parentElement) {
    if (ancestors.has(node)) return node;
  }
  return null;
}

function looksLikeSummary(element) {
  if (!element) return false;
  const interactiveItems = element.querySelectorAll('button, a, [role="button"]');
  return interactiveItems.length >= 2 || /aula|conteúdo|módulo|materiais/i.test(element.textContent ?? '');
}

export class DioElementLocator {
  constructor(root = document) {
    this.root = root;
  }

  locate() {
    const knownLayout = this.locateKnownLayoutFallback();
    if (knownLayout) return knownLayout;

    const structural = this.locateByPlayerStructure();
    if (structural) return structural;

    const playerLeaf = firstMatch(this.root, PLAYER_SELECTORS);
    let summary = firstMatch(this.root, SUMMARY_SELECTORS);

    if (!looksLikeSummary(summary)) {
      summary = [...this.root.querySelectorAll('section, div')]
        .filter(looksLikeSummary)
        .sort((a, b) => a.childElementCount - b.childElementCount)[0] ?? null;
    }

    if (!playerLeaf || !summary || playerLeaf === summary || summary.contains(playerLeaf)) {
      return this.locateKnownLayoutFallback();
    }
    const container = commonAncestor(playerLeaf, summary);
    if (!container || container === this.root.body) return this.locateKnownLayoutFallback();

    let player = playerLeaf;
    while (player.parentElement && player.parentElement !== container) player = player.parentElement;
    let summaryColumn = summary;
    while (summaryColumn.parentElement && summaryColumn.parentElement !== container) summaryColumn = summaryColumn.parentElement;
    if (player === summaryColumn) return this.locateKnownLayoutFallback();

    return { container, player, summary: summaryColumn };
  }

  locateByPlayerStructure() {
    const playerLeaf = this.root.querySelector('video, iframe[allow*="fullscreen"], iframe[src*="player" i]');
    if (!playerLeaf) return null;

    const view = this.root.defaultView;
    for (let container = playerLeaf.parentElement; container && container !== this.root.body; container = container.parentElement) {
      const children = [...container.children];
      if (children.length < 2 || children.length > 8) continue;

      let player = playerLeaf;
      while (player.parentElement && player.parentElement !== container) player = player.parentElement;
      const siblings = children.filter((child) => child !== player);
      if (!siblings.length) continue;

      const style = view?.getComputedStyle?.(container);
      const isLayoutContainer = style?.display === 'grid' || style?.display === 'flex';
      const summary = siblings
        .filter((child) => looksLikeSummary(child) || child.scrollHeight > child.clientHeight)
        .sort((a, b) => b.textContent.length - a.textContent.length)[0];

      if (isLayoutContainer && summary) {
        return { container, player, summary, strategy: 'player-structure' };
      }
    }
    return null;
  }

  diagnose() {
    return {
      videos: this.root.querySelectorAll('video').length,
      iframes: this.root.querySelectorAll('iframe').length,
      knownGrid: Boolean(this.root.querySelector(LEGACY_GRID_SELECTOR)),
      knownScroll: Boolean(this.root.querySelector(LEGACY_SCROLL_SELECTOR)),
      route: this.root.location?.pathname ?? '',
    };
  }

  locateKnownLayoutFallback() {
    const container = this.root.querySelector(LEGACY_GRID_SELECTOR);
    if (!container) return null;

    const directChildren = [...container.children].filter((element) => element.nodeType === 1);
    if (directChildren.length < 4) return null;

    const scrollElement = this.root.querySelector(LEGACY_SCROLL_SELECTOR);
    const playerElement = this.root.querySelector(KNOWN_PLAYER_SELECTOR);
    const headerOneElement = this.root.querySelector(KNOWN_HEADER_ONE_SELECTOR);
    const headerTwoElement = this.root.querySelector(KNOWN_HEADER_TWO_SELECTOR);
    const summary = directChildren.find((child) => child === scrollElement || child.contains(scrollElement));
    const player = directChildren.find((child) => child === playerElement || child.contains(playerElement));
    const headerOne = directChildren.find((child) => child === headerOneElement || child.contains(headerOneElement));
    const headerTwo = directChildren.find((child) => child === headerTwoElement || child.contains(headerTwoElement));
    if (!player || !summary || !headerOne || !headerTwo || new Set([player, summary, headerOne, headerTwo]).size !== 4) return null;
    return { container, player, summary, headerOne, headerTwo, strategy: 'known-layout-v2026-07' };
  }
}
