import test from 'node:test';
import assert from 'node:assert/strict';
import { DioElementLocator } from '../src/infrastructure/dio/DioElementLocator.js';

function element(name) {
  return {
    name,
    nodeType: 1,
    children: [],
    contains(candidate) { return this === candidate || this.children.includes(candidate); },
    querySelector(selector) { return selector.includes('video') && this.name === 'player' ? { name: 'video' } : null; },
    querySelectorAll() { return this.name === 'summary' ? [{}, {}] : []; },
  };
}

test('lab recognizes the outer columns and keeps progress separate from lesson tabs', () => {
  const container = element('row');
  const player = element('lesson-content');
  const summary = element('track-lessons');
  const headerOne = element('card-header');
  const headerTwo = element('desktop');
  const tabs = element('nav');
  const content = element('tab-content');
  container.querySelector = (selector) => ({
    ':scope > .lesson-content': player, ':scope > .track-lessons': summary,
  })[selector] ?? null;
  player.querySelector = (selector) => ({
    'video, iframe': element('iframe'), '.lesson-video > .card-header': headerOne,
  })[selector] ?? null;
  summary.querySelector = (selector) => ({
    ':scope > .desktop': headerTwo, ':scope > .nav': tabs, ':scope > .tab-content': content,
  })[selector] ?? null;
  const locator = new DioElementLocator({
    querySelector: (selector) => selector === '.lab-container > .row' ? container : null,
  });
  assert.deepEqual(locator.locate(), {
    container, player, summary, headerOne, headerTwo, summaryItems: [tabs, content], strategy: 'lab-layout',
  });
  player.querySelector = () => null;
  assert.equal(locator.locateLabLayout(), null);
});

test('usa fallback conhecido somente quando o grid real está presente', () => {
  const player = element('player');
  const summary = element('summary');
  const scroll = element('scroll');
  summary.children.push(scroll);
  const container = element('container');
  const header = element('header');
  const controls = element('controls');
  container.children.push(header, controls, player, summary);
  const root = {
    querySelector(selector) {
      if (selector === '.iDHUNI') return container;
      if (selector === '.bBIjVk') return scroll;
      if (selector === '.bcgIPK') return player;
      if (selector === '.fljMYB') return header;
      if (selector === '.dtDoZu') return controls;
      return null;
    },
  };

  const result = new DioElementLocator(root).locateKnownLayoutFallback();
  assert.equal(result.container, container);
  assert.equal(result.player, player);
  assert.equal(result.summary, summary);
  assert.equal(result.headerOne, header);
  assert.equal(result.headerTwo, controls);
  assert.equal(result.strategy, 'known-layout-v2026-07');
});

test('fallback falha com segurança sem duas colunas', () => {
  const container = element('container');
  container.children.push(element('only-child'));
  const root = { querySelector: (selector) => selector === '.iDHUNI' ? container : null };
  assert.equal(new DioElementLocator(root).locateKnownLayoutFallback(), null);
});

test('reconhece o iframe do YouTube mesmo sem atributos opcionais', () => {
  const body = element('body');
  const container = element('container');
  const player = element('player');
  const iframe = element('iframe');
  const summary = element('summary');
  body.children.push(container);
  container.parentElement = body;
  container.children.push(player, summary);
  player.parentElement = container;
  player.children.push(iframe);
  iframe.parentElement = player;
  summary.parentElement = container;
  iframe.ownerDocument = { body };
  summary.ownerDocument = { body };

  const root = {
    body,
    querySelector(selector) {
      if (selector === 'iframe[src*="youtube.com/embed/" i]') return iframe;
      if (selector === '[data-testid*="content" i]') return summary;
      return null;
    },
    querySelectorAll: () => [],
  };

  const result = new DioElementLocator(root).locate();
  assert.equal(result.container, container);
  assert.equal(result.player, player);
  assert.equal(result.summary, summary);
});

test('usa a lista de aulas para localizar o grid externo do player', () => {
  const html = element('html');
  const body = element('body');
  const container = element('outer-layout');
  const playerColumn = element('player-column');
  const internalPlayer = element('internal-player');
  const iframe = element('iframe');
  const summaryColumn = element('summary-column');
  const list = element('lesson-list');
  const lessonItem = element('lesson-item');

  body.parentElement = html;
  container.parentElement = body;
  playerColumn.parentElement = container;
  summaryColumn.parentElement = container;
  internalPlayer.parentElement = playerColumn;
  iframe.parentElement = internalPlayer;
  list.parentElement = summaryColumn;
  lessonItem.parentElement = list;
  body.children.push(container);
  container.children.push(playerColumn, summaryColumn);
  playerColumn.children.push(internalPlayer);
  internalPlayer.children.push(iframe);
  summaryColumn.children.push(list);
  list.children.push(lessonItem);
  iframe.ownerDocument = { body };
  list.ownerDocument = { body };
  lessonItem.closest = (selector) => selector === 'ul' ? list : null;
  summaryColumn.closest = () => null;

  let decorated = false;
  const root = {
    body,
    querySelector(selector) {
      if (selector === '[class*="player" i]' && decorated) return html;
      if (selector === 'iframe[src*="youtube.com/embed/" i]') return iframe;
      if (selector === '[id^="content-item-"]') return lessonItem;
      return null;
    },
    querySelectorAll: () => [],
  };

  const locator = new DioElementLocator(root);
  const result = locator.locate();
  assert.equal(result.container, container);
  assert.equal(result.player, playerColumn);
  assert.equal(result.summary, summaryColumn);
  assert.equal(result.strategy, 'lesson-structure');
  // A second evaluation sees html.dio-focus-player-active from the first pass.
  decorated = true;
  assert.deepEqual(locator.locate(), result);

  const headerOne = element('lesson-header');
  const headerTwo = element('progress-header');
  container.children.unshift(headerOne, headerTwo);
  const withHeaders = locator.locate();
  assert.equal(withHeaders.headerOne, headerOne);
  assert.equal(withHeaders.headerTwo, headerTwo);
  container.children.push(element('unrelated-widget'));
  assert.equal(locator.locate().headerOne, undefined);
});
