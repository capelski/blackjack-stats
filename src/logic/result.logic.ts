import { Result } from '../enums/result.enum';
import { bustScore } from './scores.logic';

export const getResult = (playerScore: number, dealerScore: number) => {
  return playerScore === bustScore
    ? Result.lose
    : dealerScore === bustScore
    ? Result.win
    : playerScore > dealerScore
    ? Result.win
    : playerScore < dealerScore
    ? Result.lose
    : Result.push;
};
