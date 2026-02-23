import { CardsCombination } from '../types/cards-combination.type';
import { ConsequencesByPlayerScore } from '../types/consequence.type';
import { FinalScoresMap } from '../types/final-scores.type';
import { StrategySummary } from '../types/strategy-summary.type';
import { createOutcomes, reduceOutcomes } from './outcomes.logic';
import { getFinalScoresSummaries } from './player-finals-summary.logic';
import { createResults, reduceResults } from './results.logic';

export const createStrategySummary = (): StrategySummary => {
  return {
    combinations: {
      number: 0,
      probability: 0,
    },
    finalScoresSummaries: {},
    initialPairsConsequences: {},
    outcomes: createOutcomes(),
    results: createResults(),
  };
};

export const getStrategySummary = (
  consequences: ConsequencesByPlayerScore,
  dealerFinalScores: FinalScoresMap,
  playerFinalScores?: FinalScoresMap,
  combinationsTree?: CardsCombination[],
): StrategySummary => {
  const finalScoresSummaries = getFinalScoresSummaries(
    consequences,
    dealerFinalScores,
    playerFinalScores,
  );

  const outcomes = reduceOutcomes(Object.values(finalScoresSummaries));
  const results = reduceResults(Object.values(finalScoresSummaries));

  return {
    combinations: {
      number: Object.values(playerFinalScores || {}).reduce((sum, x) => sum + x.combinations, 0),
      probability: Object.values(playerFinalScores || {}).reduce(
        (sum, pf) => sum + (pf.probability || 0),
        0,
      ),
      tree: combinationsTree,
    },
    finalScoresSummaries,
    initialPairsConsequences: consequences,
    outcomes,
    results,
  };
};
