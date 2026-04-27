import { Then, When } from '@cucumber/cucumber';
import { blackjackLabel, bustLabel } from '../models/labels.model';
import { Result } from '../models/result.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import { getResult } from './result.logic';

let playerScore: number;
let dealerScore: number;
let result: Result;

/**
 * Parse score string from feature file to numeric value
 * - "BJ" -> 21.5 (blackjack)
 * - "22+" -> 22 (bust)
 * - Regular numbers -> those numbers
 */
export const parseScore = (scoreString: string): number => {
  if (scoreString === blackjackLabel) {
    return blackjackScore;
  }
  if (scoreString === bustLabel) {
    return bustScore;
  }
  return parseInt(scoreString, 10);
};

When(
  'resolving a player score of {string} against a dealer score of {string}',
  (playerScoreStr: string, dealerScoreStr: string) => {
    playerScore = parseScore(playerScoreStr);
    dealerScore = parseScore(dealerScoreStr);
    result = getResult(playerScore, dealerScore);
  },
);

Then('result is {string}', (expectedResult: string) => {
  if (result !== expectedResult) {
    throw new Error(`Expected result to be "${expectedResult}", but got "${result}"`);
  }
});
