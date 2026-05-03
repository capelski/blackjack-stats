import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { stand } from '../models/action.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { getHitConsequenceCore, getStandConsequence } from './consequence.logic';
import { effectiveScoreToLabel } from './labels.logic';
import { parseScore } from './result.steps';

interface ConsequenceWorld {
  consequence: Consequence;
  nextConsequences: Consequence[];
}

const formatFinalProbabilities = (finalProbabilities: FinalProbabilities): string => {
  return Object.keys(finalProbabilities)
    .map(parseFloat)
    .sort((a, b) => a - b)
    .map(score => `${effectiveScoreToLabel(score)}=${finalProbabilities[score]}`)
    .join(',');
};

When('getting the consequences of standing with a score of {string}', function(
  this: ConsequenceWorld,
  scoreLabel: string,
) {
  const score = parseScore(scoreLabel);
  this.consequence = getStandConsequence(score);
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

Then('the consequence outcomes equal win={string}, push={string} and lose ={string}', function(
  this: ConsequenceWorld,
  expectedWin: string,
  expectedPush: string,
  expectedLose: string,
) {
  assert.strictEqual(String(this.consequence.outcomes.win), expectedWin);
  assert.strictEqual(String(this.consequence.outcomes.push), expectedPush);
  assert.strictEqual(String(this.consequence.outcomes.lose), expectedLose);
});

Then('the consequence edge equals {string}', function(
  this: ConsequenceWorld,
  expectedEdge: string,
) {
  assert.strictEqual(String(this.consequence.edge), expectedEdge);
});

const parseFinalProbabilities = (value: string): FinalProbabilities => {
  return Object.fromEntries(
    value.split(',').map(entry => {
      const [scoreLabel, probability] = entry.split('=');
      return [parseScore(scoreLabel.trim()), parseFloat(probability)];
    }),
  );
};

const parseOutcomes = (value: string) => {
  const entries = Object.fromEntries(
    value.split(',').map(entry => {
      const [key, val] = entry.split('=');
      return [key.trim(), parseFloat(val)];
    }),
  );
  return { win: entries['win'], push: entries['push'], lose: entries['lose'] };
};

Given('the following list of next consequences', function(
  this: ConsequenceWorld,
  table: DataTable,
) {
  this.nextConsequences = table.hashes().map(row => ({
    action: stand,
    finalProbabilities: parseFinalProbabilities(row['FinalProbabilities'].trim()),
    outcomes: parseOutcomes(row['Outcomes'].trim()),
    edge: parseFloat(row['Edge'].trim()),
  }));
});

When('getting the consequences of hitting', function(this: ConsequenceWorld) {
  this.consequence = getHitConsequenceCore(this.nextConsequences);
});
