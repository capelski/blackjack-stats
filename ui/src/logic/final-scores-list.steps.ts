import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { FinalScore } from '../types/final-score.type';
import { getFinalScoresList, getProbabilityByBetMultiplier } from './final-scores-list.logic';
import { effectiveScoreToLabel } from './labels.logic';
import {
  getMaterialHandsForOptimalRoi,
  getMaterialHandsForStandThreshold,
} from './material-hands.steps';
import { parseScore } from './result.steps';

interface FinalScoresListWorld {
  list: FinalScore[];
  currentFinalScore: FinalScore;
  probabilityByBetMultiplier: BetMultiplierMap;
}

export const getFinalScoresListForStandThreshold = (threshold: number) => {
  const hands = getMaterialHandsForStandThreshold(threshold);
  return getFinalScoresList(hands);
};

export const getFinalScoresListForOptimalRoi = () => {
  const hands = getMaterialHandsForOptimalRoi();
  return getFinalScoresList(hands);
};

const formatProbabilityByBetMultiplier = (values: BetMultiplierMap): string => {
  return Object.keys(values)
    .map(parseFloat)
    .sort((a, b) => a - b)
    .map(multiplier => `${multiplier}=${values[multiplier]}`)
    .join(',');
};

When('getting the final scores list of a hand resolver with a stand threshold of {int}', function(
  this: FinalScoresListWorld,
  threshold: number,
) {
  this.list = getFinalScoresListForStandThreshold(threshold);
});

When('getting the final scores list of a hand resolver for optimal roi', function(
  this: FinalScoresListWorld,
) {
  this.list = getFinalScoresListForOptimalRoi();
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

Given('the final score {string} of a hand resolver with a stand threshold of {int}', function(
  this: FinalScoresListWorld,
  scoreLabel: string,
  threshold: number,
) {
  const hands = getMaterialHandsForStandThreshold(threshold);
  this.list = getFinalScoresList(hands);
  const score = parseScore(scoreLabel);
  const finalScore = this.list.find(item => item.score === score);

  if (!finalScore) {
    throw new Error(`Could not find final score for label "${scoreLabel}"`);
  }

  this.currentFinalScore = finalScore;
});

When('getting the probability by bet multiplier', function(this: FinalScoresListWorld) {
  this.probabilityByBetMultiplier = getProbabilityByBetMultiplier(this.currentFinalScore);
});

Then('the returned probabilities are {string}', function(
  this: FinalScoresListWorld,
  expected: string,
) {
  assert.strictEqual(formatProbabilityByBetMultiplier(this.probabilityByBetMultiplier), expected);
});
