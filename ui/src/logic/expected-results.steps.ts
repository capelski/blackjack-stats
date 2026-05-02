import { Given, Then, When } from '@cucumber/cucumber';
import { ExpectedResult, ExpectedResults } from '../types/expected-result.type';
import { FinalScore } from '../types/final-score.type';
import { Outcomes } from '../types/outcomes.type';
import { getExpectedResult, getExpectedResults } from './expected-results.logic';
import { getProbabilityByBetMultiplier } from './final-scores-list.logic';
import {
  getFinalScoresListForOptimalRoi,
  getFinalScoresListForStandThreshold,
} from './final-scores-list.steps';
import { parseScore } from './result.steps';

interface ExpectedResultsWorld {
  playerFinalScores: FinalScore[];
  selectedExpectedResult?: ExpectedResult;
  computedExpectedResults?: ExpectedResults;
  currentOutcomes?: Outcomes;
  currentProbability?: number;
  currentEdge?: number;
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

  return finalScore;
};

const setCurrentExpectedResult = (
  world: ExpectedResultsWorld,
  probability: number,
  outcomes: Outcomes,
  edge: number,
): void => {
  world.currentProbability = probability;
  world.currentOutcomes = outcomes;
  world.currentEdge = edge;
};

Given('a player hand resolver with a stand threshold of {int}', function(
  this: ExpectedResultsWorld,
  threshold: number,
) {
  this.playerFinalScores = getFinalScoresListForStandThreshold(threshold);
});

Given('a player hand resolver for optimal roi', function(this: ExpectedResultsWorld) {
  this.playerFinalScores = getFinalScoresListForOptimalRoi();
});

When('getting the expected result of a player score of {string}', function(
  this: ExpectedResultsWorld,
  playerScoreLabel: string,
) {
  const playerFinalScore = findFinalScore(this.playerFinalScores, playerScoreLabel);
  const probabilityByBetMultiplier = getProbabilityByBetMultiplier(playerFinalScore);
  this.selectedExpectedResult = getExpectedResult(playerFinalScore, probabilityByBetMultiplier);

  setCurrentExpectedResult(
    this,
    this.selectedExpectedResult.probability,
    this.selectedExpectedResult.outcomes,
    this.selectedExpectedResult.edge,
  );
});

When('getting the overall expected results', function(this: ExpectedResultsWorld) {
  this.computedExpectedResults = getExpectedResults(this.playerFinalScores);

  setCurrentExpectedResult(
    this,
    this.computedExpectedResults.probability,
    this.computedExpectedResults.outcomes,
    this.computedExpectedResults.edge,
  );
});

Then('the expected result score equals {string}', function(
  this: ExpectedResultsWorld,
  expectedScoreLabel: string,
) {
  if (!this.selectedExpectedResult) {
    throw new Error('No selected expected result is available');
  }

  assertEqual(
    String(this.selectedExpectedResult.score),
    String(parseScore(expectedScoreLabel)),
    'Expected result score mismatch',
  );
});

Then('the expected result probability equals {string}', function(
  this: ExpectedResultsWorld,
  expectedProbability: string,
) {
  if (this.currentProbability === undefined) {
    throw new Error('No expected result probability is available');
  }

  assertEqual(
    String(this.currentProbability),
    expectedProbability,
    'Expected result probability mismatch',
  );
});

Then('the expected result outcomes equal win={string}, push={string} and lose ={string}', function(
  this: ExpectedResultsWorld,
  expectedWin: string,
  expectedPush: string,
  expectedLose: string,
) {
  if (!this.currentOutcomes) {
    throw new Error('No expected result outcomes are available');
  }

  assertEqual(String(this.currentOutcomes.win), expectedWin, 'Expected result win mismatch');
  assertEqual(String(this.currentOutcomes.push), expectedPush, 'Expected result push mismatch');
  assertEqual(String(this.currentOutcomes.lose), expectedLose, 'Expected result lose mismatch');
});

Then('the expected result edge equals {string}', function(
  this: ExpectedResultsWorld,
  expectedEdge: string,
) {
  if (this.currentEdge === undefined) {
    throw new Error('No expected result edge is available');
  }

  assertEqual(String(this.currentEdge), expectedEdge, 'Expected result edge mismatch');
});
