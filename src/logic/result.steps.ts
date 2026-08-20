import { Then, When } from '@cucumber/cucumber';
import { Result } from '../models/result.model';
import { surrenderScore } from '../models/scores.model';
import { labelToEffectiveScore } from './labels.logic';
import { getResult } from './result.logic';

let playerScore: number;
let dealerScore: number;
let result: Result;

When(
  'resolving a player score of {string} against a dealer score of {string}',
  (playerScoreLabel: string, dealerScoreLabel: string) => {
    playerScore = labelToEffectiveScore(playerScoreLabel);
    dealerScore = labelToEffectiveScore(dealerScoreLabel);
    result = getResult(playerScore, dealerScore);
  },
);

When('resolving a surrendered player score', () => {
  result = getResult(surrenderScore, -1);
});

Then('result is {string}', (expectedResult: string) => {
  if (result !== expectedResult) {
    throw new Error(`Expected result to be "${expectedResult}", but got "${result}"`);
  }
});
