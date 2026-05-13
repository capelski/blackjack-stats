import { DataTable, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { cards } from '../models/cards.model';
import { Card } from '../types/card.type';
import { Rules } from '../types/rules.type';
import { LabelFromCardsParameters, getNextLabel } from './labels.logic';
import { canSplit } from './rules.logic';
import { getScoresFromCards } from './scores.logic';

export function parseCards(symbols: string): Card[] {
  return symbols.split(',').map(symbol => {
    const card = cards.find(c => c.symbol === symbol);
    if (!card) throw new Error(`Unknown card symbol: ${symbol}`);
    return card;
  });
}

export const getLabelFromCards = (
  rules: Rules,
  { cards, isPostSplit, isPostSplitAces }: LabelFromCardsParameters,
) => {
  const scores = getScoresFromCards(rules, { cards, isPostSplit });
  return getNextLabel(rules, {
    isPostSplit,
    isPostSplitAces,
    scores,
    splitSymbol: canSplit(rules, { cardSymbols: cards.map(c => c.symbol), isPostSplit })
      ? cards[0].symbol
      : undefined,
  });
};

Then('the following label scenarios are considered', function(table: DataTable) {
  for (const row of table.hashes()) {
    const caseName = row['Case name'].trim();
    const parsedCards = parseCards(row['Cards'].trim());
    const rules = JSON.parse(row['Rules'].trim());
    const isPostSplit = row['Is post split'].trim() === 'true';
    const expectedLabel = row['Label'].trim();
    const isPostSplitAces = isPostSplit && parsedCards[0].symbol === 'A';

    const actual = getLabelFromCards(rules, {
      cards: parsedCards,
      isPostSplit,
      isPostSplitAces,
    });

    assert.strictEqual(actual, expectedLabel, `Label mismatch for case "${caseName}"`);
  }
});
