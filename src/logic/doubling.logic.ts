import { Doubling } from '../enums/doubling.enum';

export const canDouble = (playerScores: number[], doubling?: Doubling) => {
  return (
    doubling === Doubling.all ||
    (doubling === Doubling.nine_to_eleven &&
      playerScores.some((x) => x === 9 || x === 10 || x === 11))
  );
};
