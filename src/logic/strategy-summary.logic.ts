import { CombinationsByFinalScore } from '../types/cards-combination.type';
import { ConsequencesByPlayerScore } from '../types/consequence.type';
import { FinalScoresMap } from '../types/final-scores.type';
import { StrategySummary } from '../types/strategy-summary.type';
import { createOutcomes, mergeOutcomes, multiplyOutcomes } from './outcomes.logic';
import { getFinalScoresSummaries } from './player-finals-summary.logic';

export const createStrategySummary = (): StrategySummary => {
  return {
    combinations: {
      number: 0,
      probability: 0,
    },
    finalScoresSummaries: {},
    initialPairsConsequences: {},
    outcomes: createOutcomes(),
  };
};

export const getStrategySummary = (
  consequences: ConsequencesByPlayerScore,
  dealerFinalScores: FinalScoresMap,
  playerFinalScores?: FinalScoresMap,
  combinations?: CombinationsByFinalScore,
): StrategySummary => {
  const finalScoresSummaries = getFinalScoresSummaries(
    consequences,
    dealerFinalScores,
    playerFinalScores,
  );

  const weightedOutcomes = Object.values(finalScoresSummaries).map(x =>
    multiplyOutcomes(x.outcomes, x.probability),
  );

  const mergedOutcomes = mergeOutcomes(weightedOutcomes);

  return {
    combinations: {
      number: Object.values(combinations || {})
        .map(x => x.filter(c => !c.isPostSplit))
        .flat().length,
      probability: Object.values(playerFinalScores || {}).reduce(
        (sum, pf) => sum + (pf.probability || 0),
        0,
      ),
    },
    finalScoresSummaries,
    initialPairsConsequences: consequences,
    outcomes: mergedOutcomes,
  };
};
