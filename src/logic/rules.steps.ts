import { Before, Given } from '@cucumber/cucumber';
import { doublingAll } from '../models/doubling.model';
import { Rules } from '../types/rules.type';

export type RulesWorld = {
  rules: Rules;
};

Before(function(this: RulesWorld) {
  this.rules = {};
});

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

// Then('the following actionable scenarios are considered', function(table: DataTable) {
//   for (const row of table.hashes()) {
//     const score = parseFloat(row['Score'].trim());
//     const rules: Rules = JSON.parse(row['Rules'].trim());
//     const isPostDouble = row['Is post double'].trim() === 'true';
//     const isPostSplit = row['Is post split'].trim() === 'true';
//     const isPostSplitAces = row['Is post split aces'].trim() === 'true';

//     const expected = row['Result'].trim() === 'true';

//     const actual = canAction(rules, { isPostDouble, isPostSplit, isPostSplitAces, score });
//     assert.strictEqual(
//       actual,
//       expected,
//       `canAction failed for score=${score}, rules=${row['Rules']}, isPostDouble=${isPostDouble}, isPostSplit=${isPostSplit}`,
//     );
//   }
// });

// Then('the following doubling scenarios are considered', function(table: DataTable) {
//   for (const row of table.hashes()) {
//     const cardsNumber = parseInt(row['Card numbers'].trim(), 10);
//     const rules: Rules = JSON.parse(row['Rules'].trim());
//     const isPostSplit = row['Is post split'].trim() === 'true';
//     const scores = row['Scores']
//       .trim()
//       .split(softScoresSeparator)
//       .map(parseFloat);
//     const expected = row['Result'].trim() === 'true';

//     const actual = canDouble(rules, { cardsNumber, isPostSplit, scores });
//     assert.strictEqual(
//       actual,
//       expected,
//       `canDouble failed for cardsNumber=${cardsNumber}, scores=${scores}, rules=${row['Rules']}, isPostSplit=${isPostSplit}`,
//     );
//   }
// });

// Then('the following splitting scenarios are considered', function(table: DataTable) {
//   for (const row of table.hashes()) {
//     const cards = row['Cards'].trim().split(',');
//     const rules: Rules = JSON.parse(row['Rules'].trim());
//     const isPostSplit = row['Is post split'].trim() === 'true';
//     const expected = row['Result'].trim() === 'true';

//     const actual = canSplit(rules, { cardSymbols: cards, isPostSplit });
//     assert.strictEqual(
//       actual,
//       expected,
//       `canSplit failed for cards=${row['Cards']}, rules=${row['Rules']}, isPostSplit=${isPostSplit}`,
//     );
//   }
// });
