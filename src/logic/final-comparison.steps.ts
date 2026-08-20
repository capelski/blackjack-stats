import { Given, Then, When } from '@cucumber/cucumber';
import { surrenderLabel } from '../models/labels.model';
import { lose, push, surrender, win } from '../models/result.model';
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
import { labelToEffectiveScore } from './labels.logic';
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
  const score = labelToEffectiveScore(scoreLabel);
  const finalScore = finalScores.find(item => item.score === score);

  if (!finalScore) {
    throw new Error(`Could not find final score for label "${scoreLabel}"`);
  }

  return finalScore!;
};

const formattedOutcomeResults: (keyof OutcomesByBetMultiplierMap)[] = [win, push, lose, surrender];

export const formatOutcomesByBetMultiplier = (outcomes: OutcomesByBetMultiplierMap): string => {
  return formattedOutcomeResults
    .filter(result => Object.keys(outcomes[result]).length > 0)
    .map(result => `${result}: ${formatProbabilityByBetMultiplier(outcomes[result])}`)
    .join(' / ');
};

export const parseOutcomesByBetMultiplier = (
  outcomesString: string,
): OutcomesByBetMultiplierMap => {
  const outcomes: OutcomesByBetMultiplierMap = {
    win: {},
    push: {},
    lose: {},
    surrender: {},
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

Given('a player hand resolver for optimal actions that surrenders {string} hands', function(
  this: FinalComparisonWorld,
  surrenderedLabel: string,
) {
  this.playerFinalScores = getFinalScoresListForOptimalActions(this.rules, surrenderedLabel);
});

When(
  'getting the final comparison of a player score of {string} and a dealer score of {string}',
  function(this: FinalComparisonWorld, playerScoreLabel: string, dealerScoreLabel: string) {
    const playerScore = findFinalScore(this.playerFinalScores, playerScoreLabel);
    const dealerScore = findFinalScore(dealerFinalScores, dealerScoreLabel);

    this.comparison = getFinalComparison(playerScore, dealerScore);
  },
);

When('getting the final comparison of surrendered hands and a dealer score of {string}', function(
  this: FinalComparisonWorld,
  dealerScoreLabel: string,
) {
  const playerScore = findFinalScore(this.playerFinalScores, surrenderLabel);
  const dealerScore = findFinalScore(dealerFinalScores, dealerScoreLabel);

  this.comparison = getFinalComparison(playerScore, dealerScore);
});

Then('the final comparison result equals {string}', function(
  this: FinalComparisonWorld,
  expectedResult: string,
) {
  assertEqual(this.comparison.result, expectedResult, 'Final comparison result mismatch');
});

Then('the final comparison probabilities by bet multiplier are {string}', function(
  this: FinalComparisonWorld,
  expectedProbability: string,
) {
  assertEqual(
    formatProbabilityByBetMultiplier(this.comparison.probabilityByBetMultiplier),
    expectedProbability,
    'Final comparison probability mismatch',
  );
});
