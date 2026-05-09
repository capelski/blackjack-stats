import { postSplitAcesSingleCardLabel } from '../models/labels.model';
import { playerScoreLimit } from '../models/scores.model';
import { Rules } from '../types/rules.type';

export type ActionableParameters = {
  isPostDouble: boolean;
  isPostSplit: boolean;
  isPostSplitAces: boolean;
  label: string;
  score: number;
};

/** - Hands with a score of 21 or higher are not actionable
 * - After doubling, hands are not actionable
 * - When splitting aces, the casino might prevent hitting further */
export const canAction = (
  rules: Rules,
  { isPostDouble, isPostSplit, isPostSplitAces, label, score }: ActionableParameters,
): boolean => {
  return (
    score < playerScoreLimit &&
    !isPostDouble &&
    (!isPostSplit ||
      !isPostSplitAces ||
      !!rules.hitSplitAces ||
      label === postSplitAcesSingleCardLabel)
  );
};

export type DoublingParameters = {
  cardsNumber: number;
  isPostSplit: boolean;
};

export const canDouble = (
  rules: Rules,
  { cardsNumber, isPostSplit }: DoublingParameters,
): boolean => {
  return !!rules.doubling && cardsNumber === 2 && (!isPostSplit || !!rules.doublingAfterSplit);
};

export type SplittingParameters = {
  cardSymbols: string[];
  isPostSplit: boolean;
};

export const canSplit = (
  rules: Rules,
  { cardSymbols, isPostSplit }: SplittingParameters,
): boolean => {
  return (
    !!rules.splitting &&
    cardSymbols.length === 2 &&
    cardSymbols[0] === cardSymbols[1] &&
    !isPostSplit
  );
};
