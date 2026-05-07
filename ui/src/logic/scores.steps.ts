import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { parseCards } from './labels.steps';
import { RulesWorld } from './rules.steps';
import { getScoresFromCards } from './scores.logic';

type ScoresWorld = RulesWorld & {
  result: number[];
};

When('getting the score of a hand with cards {string}', function(
  this: ScoresWorld,
  cardSymbols: string,
) {
  this.result = getScoresFromCards(this.rules, {
    cards: parseCards(cardSymbols),
    isPostSplit: false,
  });
});

When('getting the score of a post split hand with cards {string}', function(
  this: ScoresWorld,
  cardSymbols: string,
) {
  this.result = getScoresFromCards(this.rules, {
    cards: parseCards(cardSymbols),
    isPostSplit: true,
  });
});

Then('the returned values are {string}', function(this: ScoresWorld, expected: string) {
  const expectedValues = expected.split(',').map(Number);
  assert.deepStrictEqual(this.result, expectedValues);
});
