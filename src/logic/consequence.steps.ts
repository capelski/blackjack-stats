import { DataTable, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';
import { stand } from '../models/action.model';
import { Result } from '../models/result.model';
import { Consequence, FinalProbabilities } from '../types/consequence.type';
import { EdgeContribution } from '../types/edge-contribution.type';
import { getAbstractHands } from './abstract-hands.logic';
import {
  getStandConsequence,
  getSurrenderConsequence,
  mergeFutureConsequences,
} from './consequence.logic';
import { dealerFinalScores } from './dealer-data.logic';
import { effectiveScoreToLabel, labelToEffectiveScore } from './labels.logic';

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

export const formatProbabilityByBetMultiplier = (
  edgeContributions: EdgeContribution[],
  result: Result,
): string => {
  return edgeContributions
    .filter((contribution) => contribution.result === result)
    .map((contribution) => `${contribution.betMultiplier}=${contribution.probability}`)
    .join(',');
};

When(
  'merging the following future consequences',
  function (this: ConsequenceWorld, table: DataTable) {
    this.futureConsequences = table.hashes().map<Consequence>((row) => ({
      action: stand,
      edge: parseFloat(row['Edge'].trim()),
      finalProbabilities: parseFinalProbabilities(row['FinalProbabilities'].trim()),
    }));
    this.consequence = mergeFutureConsequences(this.futureConsequences) as Consequence;
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
  'the consequence edge equals {string}',
  function (this: ConsequenceWorld, expectedEdge: string) {
    assert.strictEqual(String(this.consequence.edge), expectedEdge);
  },
);
