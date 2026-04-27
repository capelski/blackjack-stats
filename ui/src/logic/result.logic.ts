import { CSSProperties } from 'react';
import { lose, push, Result, win } from '../models/result.model';
import { bustScore } from '../models/scores.model';

export const getResult = (playerScore: number, dealerScore: number): Result => {
  return playerScore === bustScore
    ? lose
    : dealerScore === bustScore
    ? win
    : playerScore > dealerScore
    ? win
    : playerScore < dealerScore
    ? lose
    : push;
};

export const resultToStyles = (result: Result): CSSProperties | undefined => {
  return result === lose
    ? { backgroundColor: 'rgba(214, 111, 72, 0.2)', color: '#8e2f12' }
    : result === push
    ? { backgroundColor: 'rgba(209, 176, 80, 0.25)', color: '#7b5a05' }
    : result === win
    ? { backgroundColor: 'rgba(15, 125, 81, 0.18)', color: '#095939' }
    : undefined;
};
