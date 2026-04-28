import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { hit, stand } from '../models/action.model';
import { FinalScore } from '../types/final-score.type';
import { getFinalScoresList } from './final-scores-list.logic';
import { getHandsList } from './hands-list.logic';
import { effectiveScoreToLabel } from './labels.logic';
import { toPercentage } from './numbers.logic';

interface FinalScoresListWorld {
  list: FinalScore[];
}

When('getting the final scores list of a hand resolver with a stand threshold of {int}', function(
  this: FinalScoresListWorld,
  threshold: number,
) {
  const hands = getHandsList(hand => (hand.effectiveScore >= threshold ? stand : hit));
  this.list = getFinalScoresList(hands);
});

Then('the returned final scores list contains {int} elements', function(
  this: FinalScoresListWorld,
  count: number,
) {
  assert.strictEqual(this.list.length, count);
});

Then('the element {int} has score {string}, probability {string} and {string} hands', function(
  this: FinalScoresListWorld,
  index: number,
  expectedScore: string,
  expectedProbability: string,
  expectedHands: string,
) {
  const item = this.list[index - 1];

  assert.strictEqual(effectiveScoreToLabel(item.score), expectedScore);
  assert.strictEqual(toPercentage(item.probability), expectedProbability);
  assert.strictEqual(String(item.hands.length), expectedHands);
});

Then('the element {int} has cards {string}, probability {string} and {string} hands', function(
  this: FinalScoresListWorld,
  index: number,
  expectedScore: string,
  expectedProbability: string,
  expectedHands: string,
) {
  const item = this.list[index - 1];

  assert.strictEqual(effectiveScoreToLabel(item.score), expectedScore);
  assert.strictEqual(toPercentage(item.probability), expectedProbability);
  assert.strictEqual(String(item.hands.length), expectedHands);
});
