import { Result } from '../enums/result.enum';
import { Consequence, ConsequencesByPlayerScore } from '../types/consequence.type';
import { FinalScore, FinalScoresMap } from '../types/final-scores.type';
import {
  DealerFinalsSummaryMap,
  DealerFinalSummary,
  PlayerFinalsSummaryMap,
  PlayerFinalSummary,
} from '../types/strategy-summary.type';
import { getNumericKeys } from './numbers.logic';
import { computeOutcomes, createOutcomes, mergeOutcomes, multiplyOutcomes } from './outcomes.logic';
import { getResult } from './result.logic';

const adjustPlayerFinalScores = (
  playerFinalsSummaryMap: PlayerFinalsSummaryMap,
  playerFinalScores?: FinalScoresMap,
) => {
  const weightedSummaryMap = getNumericKeys(playerFinalsSummaryMap).reduce<PlayerFinalsSummaryMap>(
    (reduced, finalScore) => {
      const playerFinalSummary = playerFinalsSummaryMap[finalScore];
      const betMultiplier = playerFinalSummary.probability
        ? playerFinalSummary.betMultiplier / playerFinalSummary.probability
        : 0;
      const outcomes = playerFinalSummary.probability
        ? multiplyOutcomes(playerFinalSummary.outcomes, 1 / playerFinalSummary.probability)
        : playerFinalSummary.outcomes;
      computeOutcomes(outcomes, betMultiplier);

      const weightedPlayerFinalSummary: PlayerFinalSummary = {
        combinations: playerFinalScores?.[finalScore]?.combinations.length || 0,
        betMultiplier: betMultiplier,
        dealerFinals: playerFinalSummary.dealerFinals,
        outcomes,
        probability: playerFinalScores?.[finalScore]?.probability || 0,
      };

      return {
        ...reduced,
        [finalScore]: weightedPlayerFinalSummary,
      };
    },
    {},
  );

  return weightedSummaryMap;
};

export const createPlayerFinalsSummary = (): PlayerFinalSummary => {
  return {
    betMultiplier: 0,
    combinations: 0,
    dealerFinals: {},
    outcomes: createOutcomes(),
    probability: 0,
  };
};

const getDealerFinalSummary = (
  playerScore: number,
  dealerFinalScore: FinalScore,
  betMultiplier: number,
): DealerFinalSummary => {
  const { probability, score } = dealerFinalScore;
  const result = getResult(playerScore, score);

  const outcomes = createOutcomes();
  outcomes.win = result === Result.win ? 1 : 0;
  outcomes.push = result === Result.push ? 1 : 0;
  outcomes.lose = result === Result.lose ? 1 : 0;
  computeOutcomes(outcomes, betMultiplier);

  const dealerFinalSummary: DealerFinalSummary = {
    outcomes,
    probability,
    result,
  };

  return dealerFinalSummary;
};

export const getPlayerFinalSummary = (
  playerScore: number,
  consequence: Consequence,
  dealerFinalScores: FinalScoresMap,
): PlayerFinalSummary => {
  /** Each consequence contributes differently to the final player score probability.
   * Multiply each consequence's contribution by its probability and adjust to the
   * total probability at the end of the aggregation
   */
  const consequenceProbability =
    (consequence.initialProbability || 0) * consequence.finalProbabilities[playerScore];

  const dealerFinalsSummary = getNumericKeys(dealerFinalScores).reduce<DealerFinalsSummaryMap>(
    (dealerScoresReduced, dealerScore) => {
      return {
        ...dealerScoresReduced,
        [dealerScore]: getDealerFinalSummary(
          playerScore,
          dealerFinalScores[dealerScore],
          consequence.outcomes.betMultiplier,
        ),
      };
    },
    {},
  );

  const aggregatedOutcomes = Object.values(dealerFinalsSummary).reduce(
    (reduced, dealerFinalSummary) => {
      return mergeOutcomes([
        reduced,
        multiplyOutcomes(
          dealerFinalSummary.outcomes,
          dealerFinalSummary.probability * consequenceProbability,
        ),
      ]);
    },
    createOutcomes(),
  );

  const playerFinalSummary: PlayerFinalSummary = {
    betMultiplier: consequence.outcomes.betMultiplier * consequenceProbability,
    combinations: 0, // Populated at the end of the aggregation
    dealerFinals: dealerFinalsSummary,
    outcomes: aggregatedOutcomes,
    probability: consequenceProbability,
  };

  return playerFinalSummary;
};

export const getFinalScoresSummaries = (
  consequences: ConsequencesByPlayerScore,
  dealerFinalScores: FinalScoresMap,
  playerFinalScores?: FinalScoresMap,
): PlayerFinalsSummaryMap => {
  const playerFinalsSummaryMap = Object.keys(consequences).reduce<PlayerFinalsSummaryMap>(
    (consequencesReduced, playerScoreLabel) => {
      const consequence = consequences[playerScoreLabel];
      const finalScores = getNumericKeys(consequence.finalProbabilities);

      return finalScores.reduce<PlayerFinalsSummaryMap>((playerScoresReduced, playerScore) => {
        if (!playerScoresReduced[playerScore]) {
          playerScoresReduced[playerScore] = createPlayerFinalsSummary();
        }

        const partialPlayerFinalSummary = getPlayerFinalSummary(
          playerScore,
          consequence,
          dealerFinalScores,
        );

        return {
          ...playerScoresReduced,
          [playerScore]: mergePlayerFinalsSummaries(
            partialPlayerFinalSummary,
            playerScoresReduced[playerScore],
          ),
        };
      }, consequencesReduced);
    },
    {},
  );

  const adjustedSummaryMap = adjustPlayerFinalScores(playerFinalsSummaryMap, playerFinalScores);

  return adjustedSummaryMap;
};

export const mergePlayerFinalsSummaries = (
  a: PlayerFinalSummary,
  b: PlayerFinalSummary,
): PlayerFinalSummary => {
  return {
    betMultiplier: a.betMultiplier + b.betMultiplier,
    combinations: a.combinations,
    dealerFinals: a.dealerFinals,
    outcomes: mergeOutcomes([a.outcomes, b.outcomes]),
    probability: a.probability + b.probability,
  };
};
