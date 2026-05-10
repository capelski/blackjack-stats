import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { stand } from '../models/action.model';
import { blackjackScore } from '../models/scores.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import {
  getDoubleConsequence,
  getHitConsequenceCore,
  getStandConsequence,
} from './consequence.logic';
import { effectiveScoreToLabel } from './labels.logic';
import { parseScore } from './result.steps';

interface ConsequenceWorld {
  consequence: Consequence;
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
  const standBetMultiplier = getBetMultiplier(1, {
    isBlackjack: score === blackjackScore,
  });
  this.consequence = getStandConsequence(score, standBetMultiplier);
});

Given('getting the consequences of hitting with this list of next consequences', function(
  this: ConsequenceWorld,
  table: DataTable,
) {
  const nextConsequences = table.hashes().map<Consequence>(row => ({
    action: stand,
    finalProbabilities: parseFinalProbabilities(row['FinalProbabilities'].trim()),
    outcomes: parseOutcomes(row['Outcomes'].trim()),
    edge: parseFloat(row['Edge'].trim()),
  }));
  this.consequence = getHitConsequenceCore(nextConsequences);
});

When('getting the consequences of doubling with a score of {string}', function(
  this: ConsequenceWorld,
  scoreLabel: string,
) {
  const score = parseScore(scoreLabel);
  this.consequence = getDoubleConsequence({}, [score], 1);
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
  const actual = `win=${this.consequence.outcomes.win},push=${this.consequence.outcomes.push},lose=${this.consequence.outcomes.lose}`;
  assert.strictEqual(actual, expected);
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
