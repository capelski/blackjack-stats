import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { Result } from '../models/result.model';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { FinalScore, FinalScoresByFirstCard } from '../types/final-score.type';
import { HandModifiers } from '../types/hand-modifiers.type';
import { OutcomesWithBetMultiplier } from '../types/outcomes.type';
import { Rules } from '../types/rules.type';
import {
  getFinalScoreId,
  getFinalScoresByFirstCard,
  getFinalScoresList,
} from './final-scores-list.logic';
import { effectiveScoreToLabel, labelToEffectiveScore } from './labels.logic';
import {
  getMaterialHandsForOptimalActions,
  getMaterialHandsForStandThreshold,
} from './material-hands.steps';
import { RulesWorld } from './rules.steps';

type FinalScoresListWorld = RulesWorld & {
  list: FinalScore[];
  map: FinalScoresByFirstCard;
  currentFinalScore: FinalScore;
};

/** Finds a single final score by its score label, optionally narrowed by the hand modifiers */
export const findFinalScore = (
  finalScores: FinalScore[],
  scoreLabel: string,
  modifiers: HandModifiers,
): FinalScore => {
  const score = labelToEffectiveScore(scoreLabel);
  const serializedModifiers = JSON.stringify(modifiers);
  const matches = finalScores.filter(
    (item) =>
      item.score === score &&
      !!modifiers.isDoubleBet === !!item.modifiers.isDoubleBet &&
      !!modifiers.isSplit === !!item.modifiers.isSplit &&
      !!modifiers.isSurrender === !!item.modifiers.isSurrender,
  );

  if (matches.length !== 1) {
    throw new Error(
      `Expected a single final score for label "${scoreLabel}" and modifiers "${serializedModifiers}", got ${matches.length}`,
    );
  }

  return matches[0];
};

export const getFinalScoresListForStandThreshold = (rules: Rules, threshold: number) => {
  const hands = getMaterialHandsForStandThreshold(rules, threshold);
  return getFinalScoresList(hands);
};

export const getFinalScoresByFirstCardForStandThreshold = (rules: Rules, threshold: number) => {
  const hands = getMaterialHandsForStandThreshold(rules, threshold);
  return getFinalScoresByFirstCard(hands);
};

export const getFinalScoresListForOptimalActions = (rules: Rules, surrenderLabel?: string) => {
  const hands = getMaterialHandsForOptimalActions(rules, surrenderLabel);
  return getFinalScoresList(hands);
};

export const formatProbabilityByBetMultiplier = (
  outcomesWithBetMultipliers: OutcomesWithBetMultiplier[],
  result: Result,
): string => {
  const probabilitiesByBetMultiplier = outcomesWithBetMultipliers.reduce<BetMultiplierMap>(
    (acc, entry) => {
      acc[entry.betMultiplier] = entry.outcomes[result];
      return acc;
    },
    {},
  );

  return Object.keys(probabilitiesByBetMultiplier)
    .map(parseFloat)
    .sort((a, b) => a - b)
    .map((multiplier) => `${multiplier}=${probabilitiesByBetMultiplier[multiplier]}`)
    .join(',');
};

Given(
  'the final scores for a hand resolver with a stand threshold of {int}',
  function (this: FinalScoresListWorld, threshold: number) {
    this.list = getFinalScoresListForStandThreshold(this.rules, threshold);
  },
);

Given(
  'the final scores by first card of a hand resolver with a stand threshold of {int}',
  function (this: FinalScoresListWorld, threshold: number) {
    this.map = getFinalScoresByFirstCardForStandThreshold(this.rules, threshold);
  },
);

Given(
  'the final scores for an optimal actions hand resolver',
  function (this: FinalScoresListWorld) {
    this.list = getFinalScoresListForOptimalActions(this.rules);
  },
);

Given(
  'the final scores for an optimal actions hand resolver that surrenders {string} hands',
  function (this: FinalScoresListWorld, surrenderedLabel: string) {
    this.list = getFinalScoresListForOptimalActions(this.rules, surrenderedLabel);
  },
);

When('getting the final score {string}', function (this: FinalScoresListWorld, scoreLabel: string) {
  this.currentFinalScore = findFinalScore(this.list, scoreLabel, {});
});

When(
  'getting the final score {string} and double bet modifier',
  function (this: FinalScoresListWorld, scoreLabel: string) {
    this.currentFinalScore = findFinalScore(this.list, scoreLabel, { isDoubleBet: true });
  },
);

When(
  'getting the final score {string} and split modifier',
  function (this: FinalScoresListWorld, scoreLabel: string) {
    this.currentFinalScore = findFinalScore(this.list, scoreLabel, {
      isSplit: true,
      splitSide: 'Left',
    });
  },
);

Then(
  'the final scores list contains {int} elements',
  function (this: FinalScoresListWorld, count: number) {
    assert.strictEqual(this.list.length, count);
  },
);

Then(
  'the final score probability is {string}',
  function (this: FinalScoresListWorld, expectedProbability: string) {
    assert.strictEqual(String(this.currentFinalScore.probability), expectedProbability);
  },
);

Then(
  'the final score {int} has id {string}, score {string}, probability {string} and {string} hands',
  function (
    this: FinalScoresListWorld,
    index: number,
    expectedId: string,
    expectedScore: string,
    expectedProbability: string,
    expectedHands: string,
  ) {
    const item = this.list[index - 1];

    assert.strictEqual(item.id, expectedId);
    assert.strictEqual(effectiveScoreToLabel(item.score), expectedScore);
    assert.strictEqual(String(item.probability), expectedProbability);
    assert.strictEqual(String(item.hands.length), expectedHands);
  },
);

Then(
  'the final scores map contains {int} elements',
  function (this: FinalScoresListWorld, count: number) {
    assert.strictEqual(Object.keys(this.map).length, count);
  },
);

Then(
  'the final scores group {string} has an accumulated probability of {string}',
  function (this: FinalScoresListWorld, cardSymbol: string, expectedProbability: string) {
    const finalScoresGroup = this.map[cardSymbol];

    if (!finalScoresGroup) {
      throw new Error(`Could not find final scores group for card "${cardSymbol}"`);
    }

    assert.strictEqual(String(finalScoresGroup.probability), expectedProbability);
  },
);

Then(
  'the final score {string} of the final scores group {string} has probability {string} and {string} hands',
  function (
    this: FinalScoresListWorld,
    scoreLabel: string,
    cardSymbol: string,
    expectedProbability: string,
    expectedHands: string,
  ) {
    const finalScoresGroup = this.map[cardSymbol];

    if (!finalScoresGroup) {
      throw new Error(`Could not find final scores group for card "${cardSymbol}"`);
    }

    const finalScoreId = getFinalScoreId(labelToEffectiveScore(scoreLabel), {});
    const finalScore = finalScoresGroup.finalScores[finalScoreId];

    if (!finalScore) {
      throw new Error(
        `Could not find final score "${finalScoreId}" in the final scores group "${cardSymbol}"`,
      );
    }

    assert.strictEqual(String(finalScore.probability), expectedProbability);
    assert.strictEqual(String(finalScore.hands.length), expectedHands);
  },
);
