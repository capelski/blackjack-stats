import { CombinationsByFinalScore } from '../types/cards-combination.type';
import { FinalScoresMap } from '../types/final-scores.type';
import { PlayerHand } from '../types/hand.type';
import { ConsequencesByPlayerScore } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import {
  ConsequencesByInitialPairs,
  PlayerFinalsSummaryMap,
  StrategySummary,
} from '../types/strategy-summary.type';
import { getPlayerHandsSorted } from './hands.logic';
import { getNumericKeys } from './numbers.logic';
import { createOutcomes, mergeOutcomes, multiplyOutcomes } from './outcomes.logic';

export const createStrategySummary = (): StrategySummary => {
  return {
    combinations: {
      number: 0,
      probability: 0,
    },
    finalScoresSummaries: {},
    consequencesByInitialPairs: {},
    outcomes: createOutcomes(),
  };
};

export const getConsequencesByInitialPairs = (
  decisions: ConsequencesByPlayerScore,
  playerHands: PlayerHand[],
) => {
  return playerHands.reduce<ConsequencesByInitialPairs>((reduced, playerHand) => {
    const consequence = decisions[playerHand.label];
    return {
      ...reduced,
      [playerHand.label]: consequence,
    };
  }, {});
};

const getFinalScoresSummaries = (playerFinalScores?: FinalScoresMap): PlayerFinalsSummaryMap => {
  return getNumericKeys(playerFinalScores || {}).reduce((reduced, finalScore) => {
    return {
      ...reduced,
      [finalScore]: {
        betMultiplier: 0,
        combinations: playerFinalScores?.[finalScore].combinations || [],
        dealerFinals: {},
        outcomes: createOutcomes(),
        probability: playerFinalScores?.[finalScore].probability || 0,
      },
    };
  }, {});
};

export const getStrategySummary = (
  consequences: ConsequencesByPlayerScore,
  dealerFinalScores: FinalScoresMap,
  options: StrategyOptions = {},
  playerFinalScores?: FinalScoresMap,
  combinations?: CombinationsByFinalScore,
): StrategySummary => {
  const playerHands = getPlayerHandsSorted(options.splitting);

  const consequencesByInitialPairs = getConsequencesByInitialPairs(consequences, playerHands);

  const weightedOutcomes = playerHands.map(playerHand => {
    const { outcomes } = consequences[playerHand.label];
    return multiplyOutcomes(outcomes, playerHand.initialProbability);
  });
  const mergedOutcomes = mergeOutcomes(weightedOutcomes);

  const finalScoresSummaries = getFinalScoresSummaries(playerFinalScores);

  return {
    combinations: {
      number: Object.values(combinations || {}).flat().length,
      probability: Object.values(playerFinalScores || {}).reduce(
        (sum, pf) => sum + (pf.probability || 0),
        0,
      ),
    },
    finalScoresSummaries,
    consequencesByInitialPairs,
    outcomes: mergedOutcomes,
  };
};
