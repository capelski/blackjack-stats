import { Given, Then, When } from '@cucumber/cucumber';
import { FinalComparison } from '../types/final-comparison.type';
import { FinalScore } from '../types/final-score.type';
import { dealerFinalScores } from './dealer-data.logic';
import { getFinalComparison } from './final-comparison.logic';
import { getProbabilityByBetMultiplier } from './final-scores-list.logic';
import {
  formatProbabilityByBetMultiplier,
  getFinalScoresListForOptimalActions,
  getFinalScoresListForStandThreshold,
} from './final-scores-list.steps';
import { parseScore } from './result.steps';
import { RulesWorld } from './rules.steps';

type FinalComparisonWorld = RulesWorld & {
  comparison: FinalComparison;
  playerFinalScores: FinalScore[];
};

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

Given('a player hand resolver with a stand threshold of {int}', function(
  this: FinalComparisonWorld,
  threshold: number,
) {
  this.playerFinalScores = getFinalScoresListForStandThreshold(this.rules, threshold);
});

Given('a player hand resolver for optimal actions', function(this: FinalComparisonWorld) {
  this.playerFinalScores = getFinalScoresListForOptimalActions(this.rules);
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

Then('the final comparison outcomes equal {string}', function(
  this: FinalComparisonWorld,
  expected: string,
) {
  const formattedWin = formatProbabilityByBetMultiplier(
    this.comparison.outcomesByBetMultiplier.win,
  );
  const formattedPush = formatProbabilityByBetMultiplier(
    this.comparison.outcomesByBetMultiplier.push,
  );
  const formattedLose = formatProbabilityByBetMultiplier(
    this.comparison.outcomesByBetMultiplier.lose,
  );
  const actual = `win: ${formattedWin} / push: ${formattedPush} / lose: ${formattedLose}`;
  assertEqual(actual, expected, 'Final comparison outcomes mismatch');
});
