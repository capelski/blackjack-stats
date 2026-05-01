import { Given, Then, When } from '@cucumber/cucumber';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { FinalComparison } from '../types/final-comparison.type';
import { FinalScore } from '../types/final-score.type';
import { dealerFinalScores } from './dealer-data.logic';
import { getFinalComparison } from './final-comparison.logic';
import { getFinalScoresList, getProbabilityByBetMultiplier } from './final-scores-list.logic';
import { getMaterialHandsForStandThreshold } from './material-hands.steps';
import { parseScore } from './result.steps';

interface FinalComparisonWorld {
  comparison: FinalComparison;
  playerFinalScores: FinalScore[];
}

const assertEqual = (actual: unknown, expected: unknown, message: string): void => {
  if (actual !== expected) {
    throw new Error(`${message}: expected "${expected}", got "${actual}"`);
  }
};

const findFinalScore = (finalScores: FinalScore[], scoreLabel: string): FinalScore => {
  const score = parseScore(scoreLabel);
  const finalScore = finalScores.find(item => item.score === score);

  if (!finalScore) {
    throw new Error(`Could not find final score for label "${scoreLabel}"`);
  }

  return finalScore!;
};

const formatProbabilityByBetMultiplier = (values: BetMultiplierMap): string => {
  return Object.keys(values)
    .map(parseFloat)
    .sort((a, b) => a - b)
    .map(multiplier => `${multiplier}=${values[multiplier]}`)
    .join(',');
};

Given('a player hand resolver with a stand threshold of {int}', function(
  this: FinalComparisonWorld,
  threshold: number,
) {
  const materialHands = getMaterialHandsForStandThreshold(threshold);
  this.playerFinalScores = getFinalScoresList(materialHands);
});

When(
  'getting the final comparison of a player score of {string} and a dealer score of {string}',
  function(this: FinalComparisonWorld, playerScoreLabel: string, dealerScoreLabel: string) {
    const playerScore = findFinalScore(this.playerFinalScores, playerScoreLabel);
    const dealerScore = findFinalScore(dealerFinalScores, dealerScoreLabel);

    const probabilityByBetMultiplier = getProbabilityByBetMultiplier(playerScore);

    this.comparison = getFinalComparison(playerScore, dealerScore, probabilityByBetMultiplier);
  },
);

Then('the final comparison result equals {string}', function(
  this: FinalComparisonWorld,
  expectedResult: string,
) {
  assertEqual(this.comparison.result, expectedResult, 'Final comparison result mismatch');
});

Then('the final comparison probability equals {string}', function(
  this: FinalComparisonWorld,
  expectedProbability: string,
) {
  assertEqual(
    String(this.comparison.probability),
    expectedProbability,
    'Final comparison probability mismatch',
  );
});

Then('the final comparison probability by bet multiplier equals {string}', function(
  this: FinalComparisonWorld,
  expected: string,
) {
  assertEqual(
    formatProbabilityByBetMultiplier(this.comparison.probabilityByBetMultiplier),
    expected,
    'Final comparison probability by bet multiplier mismatch',
  );
});

Then('the final comparison outcomes equal win={string}, push={string} and lose ={string}', function(
  this: FinalComparisonWorld,
  expectedWin: string,
  expectedPush: string,
  expectedLose: string,
) {
  assertEqual(String(this.comparison.outcomes.win), expectedWin, 'Win outcome mismatch');
  assertEqual(String(this.comparison.outcomes.push), expectedPush, 'Push outcome mismatch');
  assertEqual(String(this.comparison.outcomes.lose), expectedLose, 'Lose outcome mismatch');
});

Then('the final comparison edge equals {string}', function(
  this: FinalComparisonWorld,
  expectedEdge: string,
) {
  assertEqual(String(this.comparison.edge), expectedEdge, 'Final comparison edge mismatch');
});
