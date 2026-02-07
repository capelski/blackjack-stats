import { CombinationsByFinalScore } from '../types/cards-combination.type';
import { FinalScoresMap } from '../types/final-scores.type';
import { PlayerHand } from '../types/hand.type';
import { ConsequencesByPlayerScore } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { ConsequencesByInitialPairs, StrategySummary } from '../types/strategy-summary.type';
import { getPlayerHandsSorted } from './hands.logic';
import { createOutcomes, mergeOutcomes, multiplyOutcomes } from './outcomes.logic';
import { getFinalScoresSummaries } from './player-finals-summary.logic';

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

  const finalScoresSummaries = getFinalScoresSummaries(
    consequences,
    dealerFinalScores,
    playerFinalScores,
  );
  // const weightedOutcomes = Object.values(finalScoresSummaries).map(x =>
  //   multiplyOutcomes(x.outcomes, x.probability),
  // );

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
