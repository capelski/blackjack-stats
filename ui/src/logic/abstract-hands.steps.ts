import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { AbstractHand } from '../types/hand.type';
import { getAbstractHands } from './abstract-hands.logic';

interface AbstractHandsWorld {
  list: AbstractHand[];
}

const actionable = 'actionable';
const nonActionable = 'non-actionable';

When('getting the abstract hands', function(this: AbstractHandsWorld) {
  this.list = getAbstractHands({});
});

Then('{int} abstract hands are returned', function(this: AbstractHandsWorld, count: number) {
  assert.strictEqual(this.list.length, count);
});

Then('the abstract hand {int} has label {string}, scores {string} and is actionable', function(
  this: AbstractHandsWorld,
  index: number,
  expectedLabel: string,
  expectedScores: string,
) {
  assertAbstractHand(this.list[index - 1], expectedLabel, expectedScores, actionable);
});

Then('the abstract hand {int} has label {string}, scores {string} and is not actionable', function(
  this: AbstractHandsWorld,
  index: number,
  expectedLabel: string,
  expectedScores: string,
) {
  assertAbstractHand(this.list[index - 1], expectedLabel, expectedScores, nonActionable);
});

Then('there is an actionable abstract hand with label {string} and scores {string}', function(
  this: AbstractHandsWorld,
  expectedLabel: string,
  expectedScores: string,
) {
  const abstractHand = this.list.find(
    item => item.label === expectedLabel && item.scores.join(',') === expectedScores,
  );

  assert.ok(abstractHand, `Expected to find abstract hand ${expectedLabel} (${expectedScores})`);
  assertAbstractHand(abstractHand, expectedLabel, expectedScores, actionable);
});

Then('there is a non-actionable abstract hand with label {string} and scores {string}', function(
  this: AbstractHandsWorld,
  expectedLabel: string,
  expectedScores: string,
) {
  const abstractHand = this.list.find(
    item => item.label === expectedLabel && item.scores.join(',') === expectedScores,
  );

  assert.ok(abstractHand, `Expected to find abstract hand ${expectedLabel} (${expectedScores})`);
  assertAbstractHand(abstractHand, expectedLabel, expectedScores, nonActionable);
});

const assertAbstractHand = (
  abstractHand: AbstractHand | undefined,
  expectedLabel: string,
  expectedScores: string,
  actionability: string,
) => {
  assert.ok(abstractHand, 'Expected abstract hand to exist');
  assert.strictEqual(abstractHand!.label, expectedLabel);
  assert.strictEqual(abstractHand!.scores.join(','), expectedScores);
  assert.strictEqual(abstractHand!.isActionable ? actionable : nonActionable, actionability);
};
