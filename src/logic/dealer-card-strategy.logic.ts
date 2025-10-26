import { Action } from '../enums/action.enum';
import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { PlayerDecision } from '../types/player-decision.type';
import { cards } from './cards.logic';
import { getDealerFinalsByCard } from './dealer-finals-by-card.logic';
import { getStandDecision } from './decisions.logic';
import { blackjackLabel, bustLabel, getScoresLabel } from './labels.logic';
import { getHitOutcomes, getStandOutcomes } from './outcomes.logic';
import { blackjackScore, bustScore, getHighestScore, playerActionableScores } from './scores';

export const getDealerCardStrategy = () => {
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

      const stand = getStandOutcomes(dealerProbabilities, getHighestScore(playerScores));
      const hit = getHitOutcomes(
        playerScores,
        (nextScoresLabel) => dealerCardStrategy[nextScoresLabel][dealerCard],
      );
      const playerDecision: PlayerDecision = {
        stand,
        hit,
        decision: stand.lose < hit.lose ? Action.stand : Action.hit,
      };

      dealerCardStrategy[scoresLabel] = dealerCardStrategy[scoresLabel] || {};
      dealerCardStrategy[scoresLabel][dealerCard] = playerDecision;
    });
  });

  return dealerCardStrategy;
};
