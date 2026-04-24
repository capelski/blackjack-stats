import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { hit, stand } from '../models/action.model';
import { HandExtended } from '../types/hand.type';
import { getHandsList } from './hands-list.logic';
import { toPercentage } from './numbers.logic';

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

Then(
  'the element {int} has cards {string}, score {string}, probability {string} and action {string}',
  function(
    this: HandsListWorld,
    index: number,
    expectedCards: string,
    expectedScore: string,
    expectedProbability: string,
    expectedAction: string,
  ) {
    const hand = this.list[index - 1];

    assert.strictEqual(hand.cards.map(c => c.symbol).join(','), expectedCards);
    assert.strictEqual(hand.label, expectedScore);
    assert.strictEqual(toPercentage(hand.probability), expectedProbability);
    assert.strictEqual(hand.action, expectedAction);
  },
);
