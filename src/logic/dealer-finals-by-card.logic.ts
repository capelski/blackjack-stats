import { FinalScoresByDealerCard, FinalScoresMap } from '../types/final-scores.type';
import { cardsNumber } from './cards.logic';
import { dealerHandResolver } from './dealer-finals.logic';
import { getFinalScores } from './final-scores.logic';
import { getNumericKeys } from './numbers.logic';

export type DealerFinalsByCardOptions = {
  useCardLevelProbabilities?: boolean;
};

export const getDealerFinalsByCard = (options: DealerFinalsByCardOptions = {}) => {
  const { finalScores: finalScoresByDealerCard } = getFinalScores<FinalScoresByDealerCard>(
    dealerHandResolver,
    {
      groupByFirstCard: true,
    },
  );

  const result = options.useCardLevelProbabilities
    ? Object.keys(finalScoresByDealerCard).reduce<FinalScoresByDealerCard>(
        (byCardsReduced, dealerCard) => {
          const finalScoresMap = finalScoresByDealerCard[dealerCard];
          return {
            ...byCardsReduced,
            [dealerCard]: getNumericKeys(finalScoresMap).reduce<FinalScoresMap>(
              (finalScoresReduced, finalScore) => {
                return {
                  ...finalScoresReduced,
                  [finalScore]: {
                    combinations: finalScoresMap[finalScore].combinations,
                    probability: finalScoresMap[finalScore].probability * cardsNumber,
                  },
                };
              },
              {},
            ),
          };
        },
        {},
      )
    : finalScoresByDealerCard;

  return result;
};
