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
  };
}

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
