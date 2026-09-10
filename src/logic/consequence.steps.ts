import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { double, hit, stand } from '../models/action.model';
import { Result, sortedResults } from '../models/result.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { EdgeContribution } from '../types/outcomes.type';
import { getAbstractHands } from './abstract-hands.logic';
import {
  getStandConsequence,
  getSurrenderConsequence,
  mergeFutureConsequences,
} from './consequence.logic';
import { dealerFinalScores } from './dealer-data.logic';
import { formatProbabilityByBetMultiplier } from './expected-results.steps';
import { effectiveScoreToLabel, labelToEffectiveScore } from './labels.logic';
import { getEdgeContribution } from './outcomes.logic';

interface ConsequenceWorld {
  consequence: Consequence;
  futureConsequences: Consequence[];
}

const parseFinalProbabilities = (value: string): FinalProbabilities => {
  return Object.fromEntries(
    value.split(',').map((entry) => {
      const [scoreLabel, probability] = entry.split('=');
      return [labelToEffectiveScore(scoreLabel.trim()), parseFloat(probability)];
    }),
  );
};

const formatFinalProbabilities = (finalProbabilities: FinalProbabilities): string => {
  return Object.keys(finalProbabilities)
    .map(parseFloat)
    .sort((a, b) => a - b)
    .map((score) => `${effectiveScoreToLabel(score)}=${finalProbabilities[score]}`)
    .join(',');
};

const formatOutcomesByBetMultiplier = (edgeContributions: EdgeContribution[]): string => {
  return sortedResults
    .filter((result) => edgeContributions.some((contribution) => contribution.result === result))
    .map((result) => `${result}: ${formatProbabilityByBetMultiplier(edgeContributions, result)}`)
    .join(' / ');
};

const parseOutcomesByBetMultiplier = (outcomesString: string): EdgeContribution[] => {
  const edgeContributions: EdgeContribution[] = [];

  const outcomeParts = outcomesString.split('/').map((part) => part.trim());

  for (const part of outcomeParts) {
    const [outcomeType, multipliersString] = part.split(':').map((p) => p.trim());
    const multipliers = multipliersString.split(',').map((m) => m.trim());

    for (const multiplier of multipliers) {
      const [betMultiplier, probability] = multiplier.split('=').map((p) => p.trim());
      const contribution = getEdgeContribution(
        edgeContributions,
        parseFloat(betMultiplier),
        outcomeType as Result,
      );
      contribution.probability = parseFloat(probability);
    }
  }

  return edgeContributions;
};

Given(
  'the following list of future consequences',
  function (this: ConsequenceWorld, table: DataTable) {
    this.futureConsequences = table.hashes().map<Consequence>((row) => ({
      action: stand,
      finalProbabilities: parseFinalProbabilities(row['FinalProbabilities'].trim()),
      edgeContributions: parseOutcomesByBetMultiplier(row['Outcomes'].trim()),
      edge: parseFloat(row['Edge'].trim()),
    }));
  },
);

When(
  'getting the consequences of standing with {string} hand',
  function (this: ConsequenceWorld, label: string) {
    const abstractHands = getAbstractHands({});
    const abstractHand = abstractHands.find((x) => x.label === label)!;
    this.consequence = getStandConsequence(abstractHand, dealerFinalScores);
  },
);

When('getting the consequences of hitting', function (this: ConsequenceWorld) {
  this.consequence = mergeFutureConsequences(this.futureConsequences, hit);
});

When('getting the consequences of doubling or splitting', function (this: ConsequenceWorld) {
  this.consequence = mergeFutureConsequences(this.futureConsequences, double);
});

When('getting the consequences of surrendering', function (this: ConsequenceWorld) {
  this.consequence = getSurrenderConsequence();
});

Then(
  'the consequence action equals {string}',
  function (this: ConsequenceWorld, expectedAction: string) {
    assert.strictEqual(this.consequence.action, expectedAction);
  },
);

Then(
  'the consequence final probabilities equal {string}',
  function (this: ConsequenceWorld, expected: string) {
    assert.strictEqual(formatFinalProbabilities(this.consequence.finalProbabilities), expected);
  },
);

Then(
  'the consequence outcomes equals {string}',
  function (this: ConsequenceWorld, expected: string) {
    const actual = formatOutcomesByBetMultiplier(this.consequence.edgeContributions);
    assert.strictEqual(actual, expected);
  },
);

Then(
  'the consequence edge equals {string}',
  function (this: ConsequenceWorld, expectedEdge: string) {
    assert.strictEqual(String(this.consequence.edge), expectedEdge);
  },
);
