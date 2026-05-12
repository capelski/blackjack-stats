import { DataTable, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { hit, stand } from '../models/action.model';
import { HandResolver } from '../types/hand-resolution.type';
import { ResolvedHand } from '../types/hand.type';
import { Rules } from '../types/rules.type';
import { getResolvedHands } from './resolved-hands.logic';
import { RulesWorld } from './rules.steps';

type ResolvedHandsWorld = RulesWorld & {
  list: ResolvedHand[];
};

const getResolvedHandsForStandThreshold = (threshold: number): ResolvedHand[] => {
  const handResolver: HandResolver = hand => (hand.effectiveScore >= threshold ? stand : hit);
  return getResolvedHands({}, handResolver).resolvedHands;
};

const getResolvedHandsForOptimalRoi = (rules: Rules = {}): ResolvedHand[] => {
  const handResolver: HandResolver = hand => hand.optimalConsequence.action;
  return getResolvedHands(rules, handResolver).resolvedHands;
};

When('getting the resolved hands of a hand resolver with a stand threshold of {int}', function(
  this: ResolvedHandsWorld,
  threshold: number,
) {
  this.list = getResolvedHandsForStandThreshold(threshold);
});

When('getting the resolved hands of a hand resolver for optimal roi', function(
  this: ResolvedHandsWorld,
) {
  this.list = getResolvedHandsForOptimalRoi(this.rules);
});

Then('{int} resolved hands are returned', function(this: ResolvedHandsWorld, count: number) {
  assert.strictEqual(this.list.length, count);
});

const assertHandWithBreakdown = (
  hand: ResolvedHand,
  label: string,
  action: string,
  table: DataTable,
) => {
  assert.strictEqual(hand.label, label);
  assert.strictEqual(hand.action, action);

  for (const row of table.hashes()) {
    const rowAction = row['Action'].trim();
    const consequence = hand.consequences[rowAction as typeof stand];

    if (!consequence) {
      throw new Error(`No consequence found for action "${rowAction}" on hand "${hand.label}"`);
    }

    assert.strictEqual(String(consequence.outcomes.win), row['Win'].trim());
    assert.strictEqual(String(consequence.outcomes.push), row['Push'].trim());
    assert.strictEqual(String(consequence.outcomes.lose), row['Lose'].trim());
    assert.strictEqual(String(consequence.edge), row['Edge'].trim());
  }
};

Then(
  'the resolved hand {int} has label {string}, action {string} and the following actions breakdown',
  function(
    this: ResolvedHandsWorld,
    index: number,
    label: string,
    action: string,
    table: DataTable,
  ) {
    assertHandWithBreakdown(this.list[index - 1], label, action, table);
  },
);

Then(
  'the resolved hand with label {string} has action {string} and the following actions breakdown',
  function(this: ResolvedHandsWorld, label: string, action: string, table: DataTable) {
    const hand = this.list.find(h => h.label === label);
    if (!hand) {
      throw new Error(`Could not find resolved hand with label "${label}"`);
    }
    assertHandWithBreakdown(hand, label, action, table);
  },
);
