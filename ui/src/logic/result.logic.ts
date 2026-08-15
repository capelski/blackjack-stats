import { CSSProperties } from 'react';
import { lose, push, Result, surrender, win } from '../models/result.model';
import { bustScore, surrenderScore } from '../models/scores.model';

export const loseColor = '#8e2f12';
export const pushColor = '#7b5a05';
export const surrenderColor = '#3f4d5c';
export const winColor = '#095939';

export const getResult = (playerScore: number, dealerScore: number): Result => {
  return playerScore === surrenderScore
    ? surrender
    : playerScore === bustScore
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
    : result === surrender
    ? { backgroundColor: '#e2e6eb', color: surrenderColor }
    : result === win
    ? { backgroundColor: '#d9e7e1', color: winColor }
    : undefined;
};
