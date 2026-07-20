import { Given, Then, When } from '@cucumber/cucumber';
import { FinalComparison } from '../types/final-comparison.type';
import { FinalScore } from '../types/final-score.type';
import { OutcomesByBetMultiplierMap } from '../types/outcomes.type';
import { dealerFinalScores } from './dealer-data.logic';
import { getFinalComparison } from './final-comparison.logic';
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

export const formatOutcomesByBetMultiplier = (outcomes: OutcomesByBetMultiplierMap): string => {
  const formattedWin = formatProbabilityByBetMultiplier(outcomes.win);
  const formattedPush = formatProbabilityByBetMultiplier(outcomes.push);
  const formattedLose = formatProbabilityByBetMultiplier(outcomes.lose);

  return `win: ${formattedWin} / push: ${formattedPush} / lose: ${formattedLose}`;
};

export const parseOutcomesByBetMultiplier = (
  outcomesString: string,
): OutcomesByBetMultiplierMap => {
  const outcomes: OutcomesByBetMultiplierMap = {
    win: {},
    push: {},
    lose: {},
  };

  const outcomeParts = outcomesString.split('/').map(part => part.trim());

  for (const part of outcomeParts) {
    const [outcomeType, multipliersString] = part.split(':').map(p => p.trim());
    const multipliers = multipliersString.split(',').map(m => m.trim());

    for (const multiplier of multipliers) {
      const [betMultiplier, probability] = multiplier.split('=').map(p => p.trim());
      outcomes[outcomeType as keyof OutcomesByBetMultiplierMap][
        parseFloat(betMultiplier)
      ] = parseFloat(probability);
    }
  }

  return outcomes;
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

    this.comparison = getFinalComparison(playerScore, dealerScore);
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
