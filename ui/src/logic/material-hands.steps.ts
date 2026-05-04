import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { hit, stand } from '../models/action.model';
import { HandResolver } from '../types/hand-resolution.type';
import { MaterialHand } from '../types/hand.type';
import { Rules } from '../types/rules.type';
import { getMaterialHands } from './material-hands.logic';
import { getResolvedHands } from './resolved-hands.logic';

interface MaterialHandsWorld {
  list: MaterialHand[];
}

export const getMaterialHandsForStandThreshold = (threshold: number) => {
  const handResolver: HandResolver = hand => (hand.effectiveScore >= threshold ? stand : hit);
  const { handResolutionMap } = getResolvedHands(handResolver, {});
  return getMaterialHands(handResolutionMap);
};

export const getMaterialHandsForOptimalRoi = (rules: Rules = {}) => {
  const handResolver: HandResolver = hand => hand.optimalConsequence.action;
  const { handResolutionMap } = getResolvedHands(handResolver, rules);
  return getMaterialHands(handResolutionMap);
};

When('getting the material hands of a hand resolver with a stand threshold of {int}', function(
  this: MaterialHandsWorld,
  threshold: number,
) {
  this.list = getMaterialHandsForStandThreshold(threshold);
});

When('getting the material hands of a hand resolver for optimal roi', function(
  this: MaterialHandsWorld,
) {
  this.list = getMaterialHandsForOptimalRoi();
});

When(
  'getting the material hands of a hand resolver for optimal roi with doubling enabled',
  function(this: MaterialHandsWorld) {
    this.list = getMaterialHandsForOptimalRoi({ doubling: true });
  },
);

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
