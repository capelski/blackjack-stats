import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { FinalScore } from '../types/final-score.type';
import { Rules } from '../types/rules.type';
import { getFinalScoresList } from './final-scores-list.logic';
import { effectiveScoreToLabel } from './labels.logic';
import {
  getMaterialHandsForOptimalActions,
  getMaterialHandsForStandThreshold,
} from './material-hands.steps';
import { parseScore } from './result.steps';
import { RulesWorld } from './rules.steps';

type FinalScoresListWorld = RulesWorld & {
  list: FinalScore[];
  currentFinalScore: FinalScore;
  probabilityByBetMultiplier: BetMultiplierMap;
};

export const getFinalScoresListForStandThreshold = (rules: Rules, threshold: number) => {
  const hands = getMaterialHandsForStandThreshold(rules, threshold);
  return getFinalScoresList(hands);
};

export const getFinalScoresListForOptimalActions = (rules: Rules) => {
  const hands = getMaterialHandsForOptimalActions(rules);
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
  'getting the final score {string} of a hand resolver with a stand threshold of {int}',
  function(this: FinalScoresListWorld, scoreLabel: string, threshold: number) {
    const hands = getMaterialHandsForStandThreshold(this.rules, threshold);
    this.list = getFinalScoresList(hands);
    const score = parseScore(scoreLabel);
    const finalScore = this.list.find(item => item.score === score);

    if (!finalScore) {
      throw new Error(`Could not find final score for label "${scoreLabel}"`);
    }

    this.currentFinalScore = finalScore;
  },
);

When('getting the final score {string} of a hand resolver for optimal actions', function(
  this: FinalScoresListWorld,
  scoreLabel: string,
) {
  this.list = getFinalScoresListForOptimalActions(this.rules);
  const score = parseScore(scoreLabel);
  const finalScore = this.list.find(item => item.score === score);

  if (!finalScore) {
    throw new Error(`Could not find final score for label "${scoreLabel}"`);
  }

  this.currentFinalScore = finalScore;
});

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

Then('the returned final scores list contains {int} elements', function(
  this: FinalScoresListWorld,
  count: number,
) {
  assert.strictEqual(this.list.length, count);
});

Then('the final score {int} has score {string}, probability {string} and {string} hands', function(
  this: FinalScoresListWorld,
  index: number,
  expectedScore: string,
  expectedProbability: string,
  expectedHands: string,
) {
  const item = this.list[index - 1];

  assert.strictEqual(effectiveScoreToLabel(item.score), expectedScore);
  assert.strictEqual(String(item.probability), expectedProbability);
  assert.strictEqual(String(item.hands.length), expectedHands);
});

Then('the final score {int} has cards {string}, probability {string} and {string} hands', function(
  this: FinalScoresListWorld,
  index: number,
  expectedScore: string,
  expectedProbability: string,
  expectedHands: string,
) {
  const item = this.list[index - 1];

  assert.strictEqual(effectiveScoreToLabel(item.score), expectedScore);
  assert.strictEqual(String(item.probability), expectedProbability);
  assert.strictEqual(String(item.hands.length), expectedHands);
});

Then('the final score probabilities by bet multiplier are {string}', function(
  this: FinalScoresListWorld,
  expected: string,
) {
  assert.strictEqual(
    formatProbabilityByBetMultiplier(this.currentFinalScore.probabilityByBetMultiplier),
    expected,
  );
});
