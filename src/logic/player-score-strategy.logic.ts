import { ActionsOutcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { PlayerScoreStrategy } from '../types/player-score-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getAction } from './actions.logic';
import { getDealerFinals } from './dealer-finals.logic';
import { getStandDecision } from './decisions.logic';
import { canDouble } from './doubling.logic';
import { blackjackLabel, bustLabel, getScoresLabel } from './labels.logic';
import { getDoubleOutcomes, getHitOutcomes, getStandOutcomes } from './outcomes.logic';
import { blackjackScore, bustScore, getHighestScore, playerActionableScores } from './scores';

export const getPlayerScoreStrategy = (options: StrategyOptions = {}) => {
  const dealerFinals = getDealerFinals();

  const playerScoreStrategy: PlayerScoreStrategy = {
    [bustLabel]: getStandDecision(bustScore, dealerFinals.probabilities),
    [blackjackLabel]: getStandDecision(blackjackScore, dealerFinals.probabilities),
    21: getStandDecision(21, dealerFinals.probabilities),
    '11/21': getStandDecision(21, dealerFinals.probabilities),
  };

  playerActionableScores.forEach((playerScores) => {
    const scoresLabel = getScoresLabel(playerScores);

    const outcomes: ActionsOutcomes = {
      double: getDoubleOutcomes(
        playerScores,
        (nextScoresLabel) => playerScoreStrategy[nextScoresLabel].outcomes.stand,
      ),
      hit: getHitOutcomes(playerScores, (nextScoresLabel) => playerScoreStrategy[nextScoresLabel]),
      stand: getStandOutcomes(dealerFinals.probabilities, getHighestScore(playerScores)),
    };

    const playerDecision: PlayerDecision = {
      action: getAction(outcomes, { canDouble: canDouble(playerScores, options.doubling) }),
      outcomes,
    };

    playerScoreStrategy[scoresLabel] = playerScoreStrategy[scoresLabel] || {};
    playerScoreStrategy[scoresLabel] = playerDecision;
  });

  return playerScoreStrategy;
};
