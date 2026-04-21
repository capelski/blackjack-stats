import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { hit, stand } from '../models/action.model';
import { HandExtended } from '../types/hand.type';
import { getCombinationsList } from './combinations-list.logic';

interface CombinationsListWorld {
  list: HandExtended[];
}

When('getting the combinations list of a hand resolver with a stand threshold of {int}', function(
  this: CombinationsListWorld,
  threshold: number,
) {
  this.list = getCombinationsList(hand => (hand.effectiveScore >= threshold ? stand : hit));
});

Then('the returned list contains {int} elements', function(
  this: CombinationsListWorld,
  count: number,
) {
  assert.strictEqual(this.list.length, count);
});

Then('the element {int} has cards {string}', function(
  this: CombinationsListWorld,
  index: number,
  expected: string,
) {
  assert.strictEqual(this.list[index - 1].cards.map(c => c.symbol).join(','), expected);
});
