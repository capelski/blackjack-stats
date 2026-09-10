import { Given, Then, When } from '@cucumber/cucumber';
import { surrenderLabel } from '../models/labels.model';
import { FinalComparison } from '../types/final-comparison.type';
import { FinalScore } from '../types/final-score.type';
import { dealerFinalScores } from './dealer-data.logic';
import { getFinalComparison } from './final-comparison.logic';
import {
  findFinalScore,
  getFinalScoresListForOptimalActions,
  getFinalScoresListForStandThreshold,
} from './final-scores-list.steps';
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

Given(
  'a player hand resolver with a stand threshold of {int}',
  function (this: FinalComparisonWorld, threshold: number) {
    this.playerFinalScores = getFinalScoresListForStandThreshold(this.rules, threshold);
  },
);

Given('a player hand resolver for optimal actions', function (this: FinalComparisonWorld) {
  this.playerFinalScores = getFinalScoresListForOptimalActions(this.rules);
});

Given(
  'a player hand resolver for optimal actions that surrenders {string} hands',
  function (this: FinalComparisonWorld, surrenderedLabel: string) {
    this.playerFinalScores = getFinalScoresListForOptimalActions(this.rules, surrenderedLabel);
  },
);

When(
  'getting the final comparison of a player score of {string} and a dealer score of {string}',
  function (this: FinalComparisonWorld, playerScoreLabel: string, dealerScoreLabel: string) {
    const playerScore = findFinalScore(this.playerFinalScores, playerScoreLabel, {});
    const dealerScore = findFinalScore(dealerFinalScores, dealerScoreLabel, {});

    this.comparison = getFinalComparison(playerScore, dealerScore);
  },
);

When(
  'getting the final comparison of a player score of {string} with double bet modifier and a dealer score of {string}',
  function (this: FinalComparisonWorld, playerScoreLabel: string, dealerScoreLabel: string) {
    const playerScore = findFinalScore(this.playerFinalScores, playerScoreLabel, {
      isDoubleBet: true,
    });
    const dealerScore = findFinalScore(dealerFinalScores, dealerScoreLabel, {});

    this.comparison = getFinalComparison(playerScore, dealerScore);
  },
);

When(
  'getting the final comparison of a player score of {string} with split modifier and a dealer score of {string}',
  function (this: FinalComparisonWorld, playerScoreLabel: string, dealerScoreLabel: string) {
    const playerScore = findFinalScore(this.playerFinalScores, playerScoreLabel, {
      isSplit: true,
      splitSide: 'Left',
    });
    const dealerScore = findFinalScore(dealerFinalScores, dealerScoreLabel, {});

    this.comparison = getFinalComparison(playerScore, dealerScore);
  },
);

When(
  'getting the final comparison of surrendered hands and a dealer score of {string}',
  function (this: FinalComparisonWorld, dealerScoreLabel: string) {
    const playerScore = findFinalScore(this.playerFinalScores, surrenderLabel, {
      isSurrender: true,
    });
    const dealerScore = findFinalScore(dealerFinalScores, dealerScoreLabel, {});

    this.comparison = getFinalComparison(playerScore, dealerScore);
  },
);

Then(
  'the final comparison result equals {string}',
  function (this: FinalComparisonWorld, expectedResult: string) {
    assertEqual(this.comparison.result, expectedResult, 'Final comparison result mismatch');
  },
);

Then(
  'the final comparison has probability {string}',
  function (this: FinalComparisonWorld, expectedProbability: string) {
    assertEqual(
      String(this.comparison.probability),
      expectedProbability,
      'Final comparison probability mismatch',
    );
  },
);
