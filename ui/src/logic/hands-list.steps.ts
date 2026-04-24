import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { hit, stand } from '../models/action.model';
import { HandExtended } from '../types/hand.type';
import { getHandsList } from './hands-list.logic';

interface HandsListWorld {
  list: HandExtended[];
}

When('getting the hands list of a hand resolver with a stand threshold of {int}', function(
  this: HandsListWorld,
  threshold: number,
) {
  this.list = getHandsList(hand => (hand.effectiveScore >= threshold ? stand : hit));
});

Then('the returned list contains {int} elements', function(this: HandsListWorld, count: number) {
  assert.strictEqual(this.list.length, count);
});

Then('the element {int} has cards {string}', function(
  this: HandsListWorld,
  index: number,
  expected: string,
) {
  assert.strictEqual(this.list[index - 1].cards.map(c => c.symbol).join(','), expected);
});
