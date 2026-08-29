import { Before, DataTable, Given, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { doublingAll } from '../models/doubling.model';
import { HandCategory, threeOrMoreCards } from '../models/hand-category.model';
import { softScoresSeparator, splitScoresSeparator } from '../models/labels.model';
import { Rules } from '../types/rules.type';
import { canAction, canDouble, canSplit } from './rules.logic';

export type RulesWorld = {
  rules: Rules;
};

Before(function(this: RulesWorld) {
  this.rules = {};
});

/** Cell value used when the column is irrelevant for the scenario */
const emptyCell = '-';

/** Category used by the rows that do not depend on the hand category */
const irrelevantCategory = threeOrMoreCards;

const parseCategory = (value: string): HandCategory => {
  const trimmed = value.trim();
  return trimmed === emptyCell ? irrelevantCategory : (trimmed as HandCategory);
};

const parseBoolean = (value: string): boolean => value.trim() === 'true';

const parseCards = (value: string): string[] => value.trim().split(splitScoresSeparator);

const parseScores = (value: string): number[] => {
  const trimmed = value.trim();
  return trimmed === emptyCell ? [] : trimmed.split(softScoresSeparator).map(Number);
};

Given('doubling is allowed', function(this: RulesWorld) {
  this.rules.doubling = doublingAll;
});

Given('splitting is allowed', function(this: RulesWorld) {
  this.rules.splitting = true;
});

Given('surrendering is allowed', function(this: RulesWorld) {
  this.rules.surrendering = true;
});

Given('hitting split aces is allowed', function(this: RulesWorld) {
  this.rules.hitSplitAces = true;
});

Given('blackjack after split is allowed', function(this: RulesWorld) {
  this.rules.blackjackAfterSplit = true;
});

Given('doubling after splitting is allowed', function(this: RulesWorld) {
  this.rules.doublingAfterSplit = true;
});

Then('the following actionable scenarios are considered', function(table: DataTable) {
  for (const row of table.hashes()) {
    const category = parseCategory(row['Category']);
    const effectiveScore = parseFloat(row['Score'].trim());
    const rules: Rules = JSON.parse(row['Rules'].trim());
    const expected = parseBoolean(row['Result']);

    const actual = canAction(rules, { category, effectiveScore });
    assert.strictEqual(
      actual,
      expected,
      `canAction failed for score=${effectiveScore}, category="${category}", rules=${row['Rules'].trim()}`,
    );
  }
});

Then('the following doubling scenarios are considered', function(table: DataTable) {
  for (const row of table.hashes()) {
    const category = parseCategory(row['Category']);
    const scores = parseScores(row['Score']);
    const rules: Rules = JSON.parse(row['Rules'].trim());
    const expected = parseBoolean(row['Result']);

    const actual = canDouble(rules, { category, scores });
    assert.strictEqual(
      actual,
      expected,
      `canDouble failed for category="${category}", scores=${scores.join(softScoresSeparator)}, rules=${row['Rules'].trim()}`,
    );
  }
});

Then('the following splitting scenarios are considered', function(table: DataTable) {
  for (const row of table.hashes()) {
    const cardSymbols = parseCards(row['Cards']);
    const isPostSplit = parseBoolean(row['Is post split']);
    const rules: Rules = JSON.parse(row['Rules'].trim());
    const expected = parseBoolean(row['Result']);

    const actual = canSplit(rules, cardSymbols, isPostSplit);
    assert.strictEqual(
      actual,
      expected,
      `canSplit failed for cards=${row['Cards'].trim()}, isPostSplit=${isPostSplit}, rules=${row['Rules'].trim()}`,
    );
  }
});
