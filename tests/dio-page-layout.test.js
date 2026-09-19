import test from 'node:test';
import assert from 'node:assert/strict';
import { DioPageLayoutAdapter } from '../src/infrastructure/dio/DioPageLayoutAdapter.js';

for (const strategy of ['lesson-structure', 'lab-layout']) {
test(`${strategy} hides only selected elements and restores them`, () => {
  const element = () => {
    const classes = new Set();
    return {
      dataset: {},
      classList: {
        add: (name) => classes.add(name),
        remove: (name) => classes.delete(name),
        contains: (name) => classes.has(name),
        toggle: (name, on) => on ? classes.add(name) : classes.delete(name),
      },
    };
  };
  const elements = {
    container: element(), player: element(), summary: element(),
    headerOne: element(), headerTwo: element(), strategy,
    ...(strategy === 'lab-layout' ? { summaryItems: [element(), element()] } : {}),
  };
  const nodes = Object.values(elements).flat().filter((value) => value.classList);
  const root = {
    documentElement: element(),
    querySelectorAll(selector) {
      return nodes.filter((node) => selector.startsWith('.')
        ? node.classList.contains(selector.slice(1))
        : node.dataset.dioFocusStrategy !== undefined);
    },
  };
  const adapter = new DioPageLayoutAdapter({ root, locator: { locate: () => elements } });
  for (const bits of ['000', '100', '010', '001', '110', '101', '011', '111', '000']) {
    adapter.inspect();
    adapter.applyFocusLayout({
      hideHeaderLevel1: bits[0] === '1', hideHeaderLevel2: bits[1] === '1', hideSummary: bits[2] === '1',
    });
    assert.equal(elements.headerOne.classList.contains('dio-focus-player-hidden'), bits[0] === '1');
    assert.equal(elements.headerTwo.classList.contains('dio-focus-player-hidden'), bits[1] === '1');
    assert.equal(elements.summary.classList.contains('dio-focus-player-summary-hidden'),
      bits[2] === '1' && (strategy !== 'lab-layout' || bits[1] === '1'));
    for (const item of elements.summaryItems ?? []) {
      assert.equal(item.classList.contains('dio-focus-player-hidden'), bits[2] === '1');
    }
    assert.equal(elements.container.dataset.dioFocusHiddenHeaders, bits.slice(0, 2));
  }
  adapter.restoreOriginalLayout();
  assert.equal(root.documentElement.classList.contains('dio-focus-player-active'), false);
  assert.deepEqual(elements.container.dataset, {});
  assert.ok(nodes.every((node) => !node.classList.contains('dio-focus-player-hidden')));
});
}
