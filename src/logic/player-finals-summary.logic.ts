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
  playerFinalScores?: FinalScoresMap,
): PlayerFinalSummary => {
  const probability = playerFinalScores?.[playerScore]?.probability || 0;
  const consequenceProbability = probability
    ? ((consequence.initialProbability || 0) * consequence.finalProbabilities[playerScore]) /
      probability
    : 0;

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
    combinations: playerFinalScores?.[playerScore]?.combinations.length || 0,
    dealerFinals: dealerFinalsSummary,
    outcomes: aggregatedOutcomes,
    probability: playerFinalScores?.[playerScore]?.probability || 0,
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
          playerFinalScores,
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

  return playerFinalsSummaryMap;
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
    probability: a.probability,
  };
};
