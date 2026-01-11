import { FinalProbabilities } from '../types/final-scores.type';
import { Outcomes } from '../types/outcomes.type';
import { dealerFinalHands } from './hands.logic';
import { toPercentage } from './percentages.logic';
import { bustScore } from './scores.logic';

export type MultiplierOptions = {
  isDoubleBet?: boolean;
  isBlackjack?: boolean;
};

export const computeReturns = (win: number, lose: number, betMultiplier: number) => {
  return (win - lose) * betMultiplier;
};

export const createOutcomes = (): Outcomes => {
  return {
    lose: 0,
    push: 0,
    win: 0,
    betMultiplier: 1,
    returns: 0,
  };
};

export const getBetMultiplier = (options: MultiplierOptions = {}): number => {
  return options.isBlackjack ? 1.5 : options.isDoubleBet ? 2 : 1;
};

export const getLoseProbability = (
  dealerProbabilities: FinalProbabilities,
  playerScore: number,
) => {
  return playerScore === bustScore
    ? 1
    : dealerFinalHands
        .filter(
          ({ effectiveScore }) =>
            effectiveScore !== bustScore && dealerProbabilities[effectiveScore],
        )
        .reduce((reduced, { effectiveScore }) => {
          return reduced + (effectiveScore > playerScore ? dealerProbabilities[effectiveScore] : 0);
        }, 0);
};

export const getPushProbability = (
  dealerProbabilities: FinalProbabilities,
  playerScore: number,
) => {
  return playerScore === bustScore ? 0 : dealerProbabilities[playerScore] || 0;
};

export const getWinProbability = (dealerProbabilities: FinalProbabilities, playerScore: number) => {
  const bustProbability = dealerProbabilities[bustScore] || 0;
  return playerScore === bustScore
    ? 0
    : dealerFinalHands
        .filter(
          ({ effectiveScore }) =>
            effectiveScore !== bustScore && dealerProbabilities[effectiveScore],
        )
        .reduce((reduced, { effectiveScore }) => {
          return reduced + (effectiveScore < playerScore ? dealerProbabilities[effectiveScore] : 0);
        }, 0) + bustProbability;
};

export const getOutcomesLabels = () => {
  return ['Win', 'Push', 'Lose', 'Returns'];
};

export const increaseOutcomes = (target: Outcomes, addition: Outcomes, weight: number) => {
  target.lose += addition.lose * weight;
  target.push += addition.push * weight;
  target.win += addition.win * weight;
};

export const mergeOutcomes = (outcomesList: Outcomes[]): Outcomes => {
  return outcomesList.reduce<Outcomes>((reduced, outcomes) => {
    return {
      lose: reduced.lose + outcomes.lose,
      push: reduced.push + outcomes.push,
      win: reduced.win + outcomes.win,
      betMultiplier: reduced.betMultiplier + outcomes.betMultiplier, // Correct ¿?
      returns: reduced.returns + outcomes.returns,
    };
  }, createOutcomes());
};

export const reduceOutcomes = (a: Outcomes, b: Outcomes): Outcomes => {
  return {
    lose: a.lose + b.lose,
    push: a.push + b.push,
    win: a.win + b.win,
    betMultiplier: a.betMultiplier + b.betMultiplier, // Correct ¿?
    returns: a.returns + b.returns,
  };
};

export const multiplyOutcomes = (outcomes: Outcomes, factor: number): Outcomes => {
  return {
    lose: outcomes.lose * factor,
    push: outcomes.push * factor,
    win: outcomes.win * factor,
    betMultiplier: outcomes.betMultiplier * factor,
    returns: outcomes.returns * factor,
  };
};

export const outcomesToValues = (outcomes: Outcomes) => {
  return [
    toPercentage(outcomes.win),
    toPercentage(outcomes.push),
    toPercentage(outcomes.lose),
    toPercentage(outcomes.returns),
  ];
};
