import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { double, hit, stand } from '../models/action.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { getAbstractHands } from './abstract-hands.logic';
import {
  getStandConsequence,
  getSurrenderConsequence,
  mergeFutureConsequences,
} from './consequence.logic';
import {
  formatOutcomesByBetMultiplier,
  parseOutcomesByBetMultiplier,
} from './final-comparison.steps';
import { effectiveScoreToLabel } from './labels.logic';
import { parseScore } from './result.steps';

interface ConsequenceWorld {
  consequence: Consequence;
  futureConsequences: Consequence[];
}

const parseFinalProbabilities = (value: string): FinalProbabilities => {
  return Object.fromEntries(
    value.split(',').map(entry => {
      const [scoreLabel, probability] = entry.split('=');
      return [parseScore(scoreLabel.trim()), parseFloat(probability)];
    }),
  );
};

const formatFinalProbabilities = (finalProbabilities: FinalProbabilities): string => {
  return Object.keys(finalProbabilities)
    .map(parseFloat)
    .sort((a, b) => a - b)
    .map(score => `${effectiveScoreToLabel(score)}=${finalProbabilities[score]}`)
    .join(',');
};

Given('the following list of future consequences', function(
  this: ConsequenceWorld,
  table: DataTable,
) {
  this.futureConsequences = table.hashes().map<Consequence>(row => ({
    action: stand,
    finalProbabilities: parseFinalProbabilities(row['FinalProbabilities'].trim()),
    outcomesByBetMultiplier: parseOutcomesByBetMultiplier(row['Outcomes'].trim()),
    edge: parseFloat(row['Edge'].trim()),
  }));
});

When('getting the consequences of standing with {string} hand', function(
  this: ConsequenceWorld,
  label: string,
) {
  const abstractHands = getAbstractHands({});
  const abstractHand = abstractHands.find(x => x.label === label)!;
  this.consequence = getStandConsequence(abstractHand);
});

When('getting the consequences of hitting', function(this: ConsequenceWorld) {
  this.consequence = mergeFutureConsequences(this.futureConsequences, hit);
});

When('getting the consequences of doubling or splitting', function(this: ConsequenceWorld) {
  this.consequence = mergeFutureConsequences(this.futureConsequences, double, 2);
});

When('getting the consequences of surrendering with {string} hand', function(
  this: ConsequenceWorld,
  label: string,
) {
  const abstractHands = getAbstractHands({});
  const abstractHand = abstractHands.find(x => x.label === label)!;
  this.consequence = getSurrenderConsequence(abstractHand);
});

Then('the consequence action equals {string}', function(
  this: ConsequenceWorld,
  expectedAction: string,
) {
  assert.strictEqual(this.consequence.action, expectedAction);
});

Then('the consequence final probabilities equal {string}', function(
  this: ConsequenceWorld,
  expected: string,
) {
  assert.strictEqual(formatFinalProbabilities(this.consequence.finalProbabilities), expected);
});

Then('the consequence outcomes equals {string}', function(
  this: ConsequenceWorld,
  expected: string,
) {
  const actual = formatOutcomesByBetMultiplier(this.consequence.outcomesByBetMultiplier);
  assert.strictEqual(actual, expected);
});

Then('the consequence edge equals {string}', function(
  this: ConsequenceWorld,
  expectedEdge: string,
) {
  assert.strictEqual(String(this.consequence.edge), expectedEdge);
});
