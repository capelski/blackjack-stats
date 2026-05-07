import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { cards } from '../models/cards.model';
import { Card } from '../types/card.type';
import { getLabelFromCards } from './labels.logic';
import { RulesWorld } from './rules.steps';

type LabelsWorld = RulesWorld & {
  result: string;
};

export function parseCards(symbols: string): Card[] {
  return symbols.split(',').map(symbol => {
    const card = cards.find(c => c.symbol === symbol);
    if (!card) throw new Error(`Unknown card symbol: ${symbol}`);
    return card;
  });
}

When('getting the label of a hand with cards {string}', function(
  this: LabelsWorld,
  cardSymbols: string,
) {
  this.result = getLabelFromCards(this.rules, {
    cards: parseCards(cardSymbols),
    isPostSplit: false,
  });
});

When('getting the label of a post split hand with cards {string}', function(
  this: LabelsWorld,
  cardSymbols: string,
) {
  this.result = getLabelFromCards(this.rules, {
    cards: parseCards(cardSymbols),
    isPostSplit: true,
  });
});

Then('the returned value is {string}', function(this: LabelsWorld, expected: string) {
  assert.strictEqual(this.result, expected);
});
