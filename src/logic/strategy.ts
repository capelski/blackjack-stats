import { DealerFinals, DealerFinalsByCard } from '../types/dealer-finals';
import { PlayerDecision } from '../types/player-decision';
import { StrategyDealerCard } from '../types/strategy-dealer-card';
import { StrategyPlayerScore } from '../types/strategy-player-score';
import { blackjackLabel, bustLabel, getScoresLabel } from './labels';
import { getHitOutcomes, getStandOutcomes } from './outcomes';
import { blackjackScore, bustScore, getHighestScore, playerActionableScores } from './scores';

const getFixedDecision = (
  playerScore: number,
  dealerProbabilities: DealerFinals['probabilities'],
): PlayerDecision => {
  return {
    stand: getStandOutcomes(dealerProbabilities, playerScore),
    hit: undefined!,
    decision: 'stand',
  };
};

export const getPlayerScoreStrategy = (dealerFinals: DealerFinals) => {
  const playerScoreStrategy: StrategyPlayerScore = {
    [bustLabel]: getFixedDecision(bustScore, dealerFinals.probabilities),
    [blackjackLabel]: getFixedDecision(blackjackScore, dealerFinals.probabilities),
    21: getFixedDecision(21, dealerFinals.probabilities),
    '11/21': getFixedDecision(21, dealerFinals.probabilities),
  };

  playerActionableScores.forEach((playerScores) => {
    const scoresLabel = getScoresLabel(playerScores);

    const stand = getStandOutcomes(dealerFinals.probabilities, getHighestScore(playerScores));
    const hit = getHitOutcomes(
      playerScores,
      (nextScoresLabel) => playerScoreStrategy[nextScoresLabel],
    );
    const playerDecision: PlayerDecision = {
      stand,
      hit,
      decision: stand.lose < hit.lose ? 'stand' : 'hit',
    };

    playerScoreStrategy[scoresLabel] = playerScoreStrategy[scoresLabel] || {};
    playerScoreStrategy[scoresLabel] = playerDecision;
  });

  return playerScoreStrategy;
};

export const getDealerCardStrategy = (dealerFinalsByCard: DealerFinalsByCard) => {
  const dealerCardStrategy: StrategyDealerCard = {
    [bustLabel]: {},
    [blackjackLabel]: {},
    21: {},
    '11/21': {},
  };

  Object.keys(dealerFinalsByCard).forEach((dealerCardKey) => {
    const dealerProbabilities = dealerFinalsByCard[dealerCardKey].probabilities;

    dealerCardStrategy[bustLabel][dealerCardKey] = getFixedDecision(bustScore, dealerProbabilities);
    dealerCardStrategy[blackjackLabel][dealerCardKey] = getFixedDecision(
      blackjackScore,
      dealerProbabilities,
    );
    dealerCardStrategy[21][dealerCardKey] = getFixedDecision(21, dealerProbabilities);
    dealerCardStrategy['11/21'][dealerCardKey] = getFixedDecision(21, dealerProbabilities);

    playerActionableScores.forEach((playerScores) => {
      const scoresLabel = getScoresLabel(playerScores);

      const stand = getStandOutcomes(dealerProbabilities, getHighestScore(playerScores));
      const hit = getHitOutcomes(
        playerScores,
        (nextScoresLabel) => dealerCardStrategy[nextScoresLabel][dealerCardKey],
      );
      const playerDecision: PlayerDecision = {
        stand,
        hit,
        decision: stand.lose < hit.lose ? 'stand' : 'hit',
      };

      dealerCardStrategy[scoresLabel] = dealerCardStrategy[scoresLabel] || {};
      dealerCardStrategy[scoresLabel][dealerCardKey] = playerDecision;
    });
  });

  return dealerCardStrategy;
};
