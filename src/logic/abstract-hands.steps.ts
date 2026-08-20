import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { HandCategory } from '../models/hand-category.model';
import { AbstractHand } from '../types/abstract-hand.type';
import { getAbstractHands } from './abstract-hands.logic';
import { RulesWorld } from './rules.steps';

type AbstractHandsWorld = RulesWorld & {
  list: AbstractHand[];
};

When('getting the abstract hands', function(this: AbstractHandsWorld) {
  this.list = getAbstractHands(this.rules);
});

Then('{int} abstract hands are returned', function(this: AbstractHandsWorld, count: number) {
  assert.strictEqual(this.list.length, count);
});

Then('there are {int} abstract hands with category {string}', function(
  this: AbstractHandsWorld,
  count: number,
  category: HandCategory,
) {
  const actual = this.list.filter(x => x.category === category).length;
  assert.strictEqual(actual, count);
});

Then('there is an abstract hand with label {string}', function(
  this: AbstractHandsWorld,
  expectedLabel: string,
) {
  const hand = this.list.find(x => x.label === expectedLabel);
  assert.ok(hand, `Expected to find abstract hand with label "${expectedLabel}"`);
});

Then('there is no abstract hand with label {string}', function(
  this: AbstractHandsWorld,
  expectedLabel: string,
) {
  const hand = this.list.find(x => x.label === expectedLabel);
  assert.strictEqual(hand, undefined, `Expected no abstract hand with label "${expectedLabel}"`);
});
