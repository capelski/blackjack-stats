import { CSSProperties } from 'react';
import { lose, push, Result, win } from '../models/result.model';
import { bustScore } from '../models/scores.model';

export const loseColor = '#8e2f12';
export const pushColor = '#7b5a05';
export const winColor = '#095939';

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
    ? { backgroundColor: '#f7e2db', color: loseColor }
    : result === push
    ? { backgroundColor: '#f3ebd3', color: pushColor }
    : result === win
    ? { backgroundColor: '#d9e7e1', color: winColor }
    : undefined;
};
