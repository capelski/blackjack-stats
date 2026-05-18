import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { hit, stand } from '../models/action.model';
import { HandResolver } from '../types/hand-resolution.type';
import { MaterialHand } from '../types/material-hand.type';
import { Rules } from '../types/rules.type';
import { getMaterialHands } from './material-hands.logic';
import { getResolvedHands } from './resolved-hands.logic';
import { RulesWorld } from './rules.steps';

type MaterialHandsWorld = RulesWorld & {
  list: MaterialHand[];
};

export const getMaterialHandsForStandThreshold = (rules: Rules, threshold: number) => {
  const handResolver: HandResolver = hand => (hand.effectiveScore >= threshold ? stand : hit);
  const { handResolutionMap } = getResolvedHands(rules, handResolver);
  return getMaterialHands(rules, handResolutionMap);
};

export const getMaterialHandsForOptimalActions = (rules: Rules) => {
  const handResolver: HandResolver = hand => hand.optimalConsequence.action;
  const { handResolutionMap } = getResolvedHands(rules, handResolver);
  return getMaterialHands(rules, handResolutionMap);
};

When('getting the material hands of a hand resolver with a stand threshold of {int}', function(
  this: MaterialHandsWorld,
  threshold: number,
) {
  this.list = getMaterialHandsForStandThreshold(this.rules, threshold);
});

When('getting the material hands of a hand resolver for optimal actions', function(
  this: MaterialHandsWorld,
) {
  this.list = getMaterialHandsForOptimalActions(this.rules);
});

Then('{int} material hands are returned', function(this: MaterialHandsWorld, count: number) {
  assert.strictEqual(this.list.length, count);
});

Then(
  'the material hand {int} has cards {string}, score {string}, probability {string} and action {string}',
  function(
    this: MaterialHandsWorld,
    index: number,
    expectedCards: string,
    expectedScore: string,
    expectedProbability: string,
    expectedAction: string,
  ) {
    const hand = this.list[index - 1];

    assert.strictEqual(hand.cards.map(c => c.symbol).join(','), expectedCards);
    assert.strictEqual(hand.label, expectedScore);
    assert.strictEqual(String(hand.probability), expectedProbability);
    assert.strictEqual(hand.action, expectedAction);
  },
);

Then(
  'there is a material hand with cards {string}, probability {string} and action {string}',
  function(
    this: MaterialHandsWorld,
    expectedCards: string,
    expectedProbability: string,
    expectedAction: string,
  ) {
    const hand = this.list.find(
      h =>
        h.cards.map(c => c.symbol).join(',') === expectedCards &&
        String(h.probability) === expectedProbability &&
        h.action === expectedAction,
    );
    assert.ok(
      hand,
      `No material hand found with cards "${expectedCards}", probability "${expectedProbability}" and action "${expectedAction}"`,
    );
  },
);

Then(
  'there is a material hand with cards {string}, probability {string}, action {string} and bet multiplier {string}',
  function(
    this: MaterialHandsWorld,
    expectedCards: string,
    expectedProbability: string,
    expectedAction: string,
    expectedBetMultiplier: string,
  ) {
    const hand = this.list.find(
      h =>
        h.cards.map(c => c.symbol).join(',') === expectedCards &&
        String(h.probability) === expectedProbability &&
        h.action === expectedAction &&
        String(h.betMultiplier) === expectedBetMultiplier,
    );
    assert.ok(
      hand,
      `No material hand found with cards "${expectedCards}", probability "${expectedProbability}", action "${expectedAction}" and bet multiplier "${expectedBetMultiplier}"`,
    );
  },
);

Then(
  'there is a material post split hand with cards {string}, probability {string}, action {string} and bet multiplier {string}',
  function(
    this: MaterialHandsWorld,
    expectedCards: string,
    expectedProbability: string,
    expectedAction: string,
    expectedBetMultiplier: string,
  ) {
    const hand = this.list.find(
      h =>
        h.isPostSplit &&
        h.cards.map(c => c.symbol).join(',') === expectedCards &&
        String(h.probability) === expectedProbability &&
        h.action === expectedAction &&
        String(h.betMultiplier) === expectedBetMultiplier,
    );
    assert.ok(
      hand,
      `No material post split hand found with cards "${expectedCards}", probability "${expectedProbability}", action "${expectedAction}" and bet multiplier "${expectedBetMultiplier}"`,
    );
  },
);
