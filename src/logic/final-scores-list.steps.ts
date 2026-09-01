import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { FinalScore, FinalScoresByFirstCard } from '../types/final-score.type';
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

/** Finds a single final score by its score label, optionally narrowed by its bet multiplier */
export const findFinalScore = (
  finalScores: FinalScore[],
  scoreLabel: string,
  betMultiplier?: number,
): FinalScore => {
  const score = labelToEffectiveScore(scoreLabel);
  const matches = finalScores.filter(
    item =>
      item.score === score && (betMultiplier === undefined || item.betMultiplier === betMultiplier),
  );

  if (matches.length !== 1) {
    throw new Error(
      `Expected a single final score for label "${scoreLabel}"${
        betMultiplier === undefined ? '' : ` and bet multiplier ${betMultiplier}`
      }, got ${matches.length}`,
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

export const formatProbabilityByBetMultiplier = (values: BetMultiplierMap): string => {
  return Object.keys(values)
    .map(parseFloat)
    .sort((a, b) => a - b)
    .map(multiplier => `${multiplier}=${values[multiplier]}`)
    .join(',');
};

When(
  'getting the final score {string} with bet multiplier {float} of a hand resolver with a stand threshold of {int}',
  function(
    this: FinalScoresListWorld,
    scoreLabel: string,
    betMultiplier: number,
    threshold: number,
  ) {
    this.list = getFinalScoresListForStandThreshold(this.rules, threshold);
    this.currentFinalScore = findFinalScore(this.list, scoreLabel, betMultiplier);
  },
);

When(
  'getting the final score {string} with bet multiplier {float} of a hand resolver for optimal actions',
  function(this: FinalScoresListWorld, scoreLabel: string, betMultiplier: number) {
    this.list = getFinalScoresListForOptimalActions(this.rules);
    this.currentFinalScore = findFinalScore(this.list, scoreLabel, betMultiplier);
  },
);

When('getting the final scores list of a hand resolver with a stand threshold of {int}', function(
  this: FinalScoresListWorld,
  threshold: number,
) {
  this.list = getFinalScoresListForStandThreshold(this.rules, threshold);
});

When('getting the final scores list of a hand resolver for optimal actions', function(
  this: FinalScoresListWorld,
) {
  this.list = getFinalScoresListForOptimalActions(this.rules);
});

When(
  'getting the final scores list of a hand resolver for optimal actions that surrenders {string} hands',
  function(this: FinalScoresListWorld, surrenderedLabel: string) {
    this.list = getFinalScoresListForOptimalActions(this.rules, surrenderedLabel);
  },
);

When(
  'getting the final scores by first card of a hand resolver with a stand threshold of {int}',
  function(this: FinalScoresListWorld, threshold: number) {
    this.map = getFinalScoresByFirstCardForStandThreshold(this.rules, threshold);
  },
);

Then('the returned final scores list contains {int} elements', function(
  this: FinalScoresListWorld,
  count: number,
) {
  assert.strictEqual(this.list.length, count);
});

Then(
  'the final score {int} has score {string}, bet multiplier {float}, probability {string} and {string} hands',
  function(
    this: FinalScoresListWorld,
    index: number,
    expectedScore: string,
    expectedBetMultiplier: number,
    expectedProbability: string,
    expectedHands: string,
  ) {
    const item = this.list[index - 1];

    assert.strictEqual(effectiveScoreToLabel(item.score), expectedScore);
    assert.strictEqual(item.betMultiplier, expectedBetMultiplier);
    assert.strictEqual(String(item.probability), expectedProbability);
    assert.strictEqual(String(item.hands.length), expectedHands);
    assert.strictEqual(item.id, getFinalScoreId(item.score, item.betMultiplier));
  },
);

Then('the returned final scores map contains {int} elements', function(
  this: FinalScoresListWorld,
  count: number,
) {
  assert.strictEqual(Object.keys(this.map).length, count);
});

Then('the final scores group {string} has an accumulated probability of {string}', function(
  this: FinalScoresListWorld,
  cardSymbol: string,
  expectedProbability: string,
) {
  const finalScoresGroup = this.map[cardSymbol];

  if (!finalScoresGroup) {
    throw new Error(`Could not find final scores group for card "${cardSymbol}"`);
  }

  assert.strictEqual(String(finalScoresGroup.probability), expectedProbability);
});

Then(
  'the final score {string} with bet multiplier {float} of the final scores group {string} has probability {string} and {string} hands',
  function(
    this: FinalScoresListWorld,
    scoreLabel: string,
    betMultiplier: number,
    cardSymbol: string,
    expectedProbability: string,
    expectedHands: string,
  ) {
    const finalScoresGroup = this.map[cardSymbol];

    if (!finalScoresGroup) {
      throw new Error(`Could not find final scores group for card "${cardSymbol}"`);
    }

    const finalScoreId = getFinalScoreId(labelToEffectiveScore(scoreLabel), betMultiplier);
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

Then('the final score probability is {string}', function(
  this: FinalScoresListWorld,
  expectedProbability: string,
) {
  assert.strictEqual(String(this.currentFinalScore.probability), expectedProbability);
});
