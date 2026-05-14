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
    ? { backgroundColor: '#f7e2db', color: '#8e2f12' }
    : result === push
    ? { backgroundColor: '#f3ebd3', color: '#7b5a05' }
    : result === win
    ? { backgroundColor: '#d9e7e1', color: '#095939' }
    : undefined;
};
