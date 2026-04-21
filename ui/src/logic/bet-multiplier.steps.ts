import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { getBetMultiplier } from './bet-multiplier.logic';

interface BetMultiplierWorld {
  result: number;
}

When('getting the bet multiplier', function(this: BetMultiplierWorld) {
  this.result = getBetMultiplier();
});

When('getting the bet multiplier for a blackjack hand', function(this: BetMultiplierWorld) {
  this.result = getBetMultiplier({ isBlackjack: true });
});

When('getting the bet multiplier for a hand that doubled the bet', function(
  this: BetMultiplierWorld,
) {
  this.result = getBetMultiplier({ isDoubleBet: true });
});

Then('the returned value is {float}', function(this: BetMultiplierWorld, expected: number) {
  assert.strictEqual(this.result, expected);
});
