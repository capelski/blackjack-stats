import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { HandIdentity } from '../types/hand-identity.type';
import { getHandIdentities } from './hand-identities.logic';

interface HandIdentitiesWorld {
  list: HandIdentity[];
}

const actionable = 'actionable';
const nonActionable = 'non-actionable';

When('getting the hand identities', function(this: HandIdentitiesWorld) {
  this.list = getHandIdentities({});
});

Then('the returned hand identities list contains {int} elements', function(
  this: HandIdentitiesWorld,
  count: number,
) {
  assert.strictEqual(this.list.length, count);
});

Then('the hand identity {int} has label {string}, scores {string} and is actionable', function(
  this: HandIdentitiesWorld,
  index: number,
  expectedLabel: string,
  expectedScores: string,
) {
  assertHandIdentity(this.list[index - 1], expectedLabel, expectedScores, actionable);
});

Then('the hand identity {int} has label {string}, scores {string} and is not actionable', function(
  this: HandIdentitiesWorld,
  index: number,
  expectedLabel: string,
  expectedScores: string,
) {
  assertHandIdentity(this.list[index - 1], expectedLabel, expectedScores, nonActionable);
});

Then('there is an actionable hand identity with label {string} and scores {string}', function(
  this: HandIdentitiesWorld,
  expectedLabel: string,
  expectedScores: string,
) {
  const handIdentity = this.list.find(
    item => item.label === expectedLabel && item.scores.join(',') === expectedScores,
  );

  assert.ok(handIdentity, `Expected to find hand identity ${expectedLabel} (${expectedScores})`);
  assertHandIdentity(handIdentity, expectedLabel, expectedScores, actionable);
});

Then('there is a non-actionable hand identity with label {string} and scores {string}', function(
  this: HandIdentitiesWorld,
  expectedLabel: string,
  expectedScores: string,
) {
  const handIdentity = this.list.find(
    item => item.label === expectedLabel && item.scores.join(',') === expectedScores,
  );

  assert.ok(handIdentity, `Expected to find hand identity ${expectedLabel} (${expectedScores})`);
  assertHandIdentity(handIdentity, expectedLabel, expectedScores, nonActionable);
});

const assertHandIdentity = (
  handIdentity: HandIdentity | undefined,
  expectedLabel: string,
  expectedScores: string,
  actionability: string,
) => {
  assert.ok(handIdentity, 'Expected hand identity to exist');
  assert.strictEqual(handIdentity!.label, expectedLabel);
  assert.strictEqual(handIdentity!.scores.join(','), expectedScores);
  assert.strictEqual(
    handIdentity!.isNonActionable ? 'non-actionable' : 'actionable',
    actionability,
  );
};
