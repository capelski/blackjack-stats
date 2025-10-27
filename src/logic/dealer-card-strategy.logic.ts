import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { ActionsOutcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getAction } from './actions.logic';
import { cards } from './cards.logic';
import { getDealerFinalsByCard } from './dealer-finals-by-card.logic';
import { getStandDecision } from './decisions.logic';
import { canDouble } from './doubling.logic';
import { blackjackLabel, bustLabel, getScoresLabel } from './labels.logic';
import { getDoubleOutcomes, getHitOutcomes, getStandOutcomes } from './outcomes.logic';
import { blackjackScore, bustScore, getHighestScore, playerActionableScores } from './scores';

export const getDealerCardStrategy = (options: StrategyOptions = {}) => {
  const dealerFinalsByCard = getDealerFinalsByCard();
  const dealerCardStrategy: DealerCardStrategy = {
    [bustLabel]: {},
    [blackjackLabel]: {},
    21: {},
    '11/21': {},
  };

  cards.forEach((dealerCard) => {
    const dealerProbabilities = dealerFinalsByCard[dealerCard].probabilities;

    dealerCardStrategy[bustLabel][dealerCard] = getStandDecision(bustScore, dealerProbabilities);
    dealerCardStrategy[blackjackLabel][dealerCard] = getStandDecision(
      blackjackScore,
      dealerProbabilities,
    );
    dealerCardStrategy[21][dealerCard] = getStandDecision(21, dealerProbabilities);
    dealerCardStrategy['11/21'][dealerCard] = getStandDecision(21, dealerProbabilities);

    playerActionableScores.forEach((playerScores) => {
      const scoresLabel = getScoresLabel(playerScores);

      const outcomes: ActionsOutcomes = {
        double: getDoubleOutcomes(
          playerScores,
          (nextScoresLabel) => dealerCardStrategy[nextScoresLabel][dealerCard].outcomes.stand,
        ),
        hit: getHitOutcomes(
          playerScores,
          (nextScoresLabel) => dealerCardStrategy[nextScoresLabel][dealerCard],
        ),
        stand: getStandOutcomes(dealerProbabilities, getHighestScore(playerScores)),
      };

      const playerDecision: PlayerDecision = {
        action: getAction(outcomes, { canDouble: canDouble(playerScores, options.doubling) }),
        outcomes,
      };

      dealerCardStrategy[scoresLabel] = dealerCardStrategy[scoresLabel] || {};
      dealerCardStrategy[scoresLabel][dealerCard] = playerDecision;
    });
  });

  return dealerCardStrategy;
};
