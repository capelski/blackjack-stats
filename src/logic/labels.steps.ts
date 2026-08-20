import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { double, hit, split } from '../models/action.model';
import { cards } from '../models/cards.model';
import { AbstractHand } from '../types/abstract-hand.type';
import { getAbstractHands } from './abstract-hands.logic';
import { getNextHandLabel } from './labels.logic';
import { RulesWorld } from './rules.steps';

type LabelsWorld = RulesWorld & {
  currentLabel?: string;
  list: AbstractHand[];
  nextLabel?: string;
};

Given('the hand label {string}', function(this: LabelsWorld, currentLabel: string) {
  this.list = getAbstractHands(this.rules);
  this.currentLabel = currentLabel;
});

When('hitting with next card {string}', function(this: LabelsWorld, cardSymbol: string) {
  const nextCard = cards.find(c => c.symbol === cardSymbol);
  assert.ok(nextCard, `Unknown card symbol "${cardSymbol}"`);
  assert.ok(this.currentLabel, 'Current abstract hand label has not been set');

  this.nextLabel = getNextHandLabel(this.list, this.rules, this.currentLabel!, hit, nextCard!);
});

When('doubling with next card {string}', function(this: LabelsWorld, cardSymbol: string) {
  const nextCard = cards.find(c => c.symbol === cardSymbol);
  assert.ok(nextCard, `Unknown card symbol "${cardSymbol}"`);
  assert.ok(this.currentLabel, 'Current abstract hand label has not been set');

  this.nextLabel = getNextHandLabel(this.list, this.rules, this.currentLabel!, double, nextCard!);
});

When('splitting with next card {string}', function(this: LabelsWorld, cardSymbol: string) {
  const nextCard = cards.find(c => c.symbol === cardSymbol);
  assert.ok(nextCard, `Unknown card symbol "${cardSymbol}"`);
  assert.ok(this.currentLabel, 'Current abstract hand label has not been set');

  this.nextLabel = getNextHandLabel(this.list, this.rules, this.currentLabel!, split, nextCard!);
});

Then('the next hand label is {string}', function(this: LabelsWorld, expectedLabel: string) {
  assert.strictEqual(this.nextLabel, expectedLabel);
});
