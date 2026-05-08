import { DataTable, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { cards } from '../models/cards.model';
import { Card } from '../types/card.type';
import { getLabelFromCards } from './labels.logic';

export function parseCards(symbols: string): Card[] {
  return symbols.split(',').map(symbol => {
    const card = cards.find(c => c.symbol === symbol);
    if (!card) throw new Error(`Unknown card symbol: ${symbol}`);
    return card;
  });
}

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
