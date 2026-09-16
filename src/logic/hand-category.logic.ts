import {
  HandCategory,
  SplitCategory,
  oneSplitPairAfterAces,
  splitCategories,
} from '../models/hand-category.model';

/** Category of the two card hands resulting of a split */
export const getPostSplitCategory = (isAcesSplit: boolean, splitCount: number): HandCategory => {
  return isPostAcesSplit(isAcesSplit, splitCount)
    ? oneSplitPairAfterAces
    : getSplitCategory(splitCount);
};

/** Category of the hands that have been split the given number of times */
export const getSplitCategory = (splitCount: number): SplitCategory => {
  const category = splitCategories[splitCount - 1];

  if (!category) {
    throw new Error(`There is no hand category for hands split ${splitCount} times`);
  }

  return category;
};

/** Number of times the hands of a category have been split. Post A-split hands are reachable after
 * any number of splits, but the only one that can be split again is the pair of aces of the first
 * split, so that is the split count they report */
export const getSplitCount = (category: HandCategory): number => {
  return category === oneSplitPairAfterAces
    ? 1
    : splitCategories.indexOf(category as SplitCategory) + 1;
};
export const isPostAcesSplit = (isAcesSplit: boolean, splitCount: number) => {
  return isAcesSplit && splitCount === 1;
};

export const isSplitCategory = (category: HandCategory): category is SplitCategory => {
  return splitCategories.includes(category as SplitCategory);
};
