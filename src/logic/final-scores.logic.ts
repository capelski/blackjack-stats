import { SearchMode } from '../enums/search-mode.enum';
import { CardsCombination, HandResolver } from '../types/cards-combination.type';
import { FinalProbabilities } from '../types/final-probabilities.type';
import { FinalScoresByDealerCard, FinalScoresMap } from '../types/final-scores.type';
import { createNextCardsCombination, createOneCardCombination } from './cards-combination.logic';
import { cards, cardsNumber, getCardsCombinations } from './cards.logic';
import { getNumericKeys } from './numbers.logic';

export const getFinalProbabilities = (finalScores: FinalScoresMap): FinalProbabilities => {
  return getNumericKeys(finalScores).reduce<FinalProbabilities>((reduced, key) => {
    reduced[key] = finalScores[key].probability;
    return reduced;
  }, {});
};

/** List of combinations that behaves like
 * - a queue, when searchMode is breadth-first
 * - a stack, when searchMode is depth-first
 */
class CombinationsList {
  protected list: CardsCombination[];

  constructor(public searchMode: SearchMode, initialState: CardsCombination[] = []) {
    this.list = initialState;
  }

  get length(): number {
    return this.list.length;
  }

  addCombination(combination: CardsCombination) {
    if (this.searchMode === SearchMode.depthFirst) {
      this.list.unshift(combination);
    } else {
      this.list.push(combination);
    }
  }

  extractCombination(): CardsCombination | undefined {
    return this.list.shift();
  }
}

export type FinalScoresOptions = {
  collectCombinations?: boolean;
  groupByFirstCard?: boolean;
  searchMode?: SearchMode;
};

export const getFinalScores = <T extends FinalScoresByDealerCard | FinalScoresMap>(
  handResolver: HandResolver,
  options: FinalScoresOptions = {},
): {
  allCombinations: CardsCombination[];
  finalScores: T;
} => {
  const collectCombinations = options.collectCombinations ?? false;
  const groupByFirstCard = options.groupByFirstCard ?? false;
  const searchMode = options.searchMode ?? SearchMode.breadthFirst;

  const allCombinations: CardsCombination[] = [];
  const combinationsList = new CombinationsList(searchMode, cards.map(createOneCardCombination));
  const sortedCards = searchMode === SearchMode.depthFirst ? [...cards].reverse() : cards;

  const finalScores = groupByFirstCard
    ? cards.reduce<FinalScoresByDealerCard>((reduced, card) => {
        return {
          ...reduced,
          [card]: {},
        };
      }, {})
    : <FinalScoresMap>{};

  while (combinationsList.length > 0) {
    const hand = combinationsList.extractCombination()!;

    if (collectCombinations) {
      // Store all the combinations along the way, final or not
      allCombinations.push(hand);

      if (hand.isFinalHand) {
        continue;
      }
    }

    sortedCards.map(card => {
      const nextHand = createNextCardsCombination(handResolver, hand, card);

      if (!nextHand.isFinalHand || collectCombinations) {
        combinationsList.addCombination(nextHand);
      }

      if (nextHand.considerFinalScore) {
        const applicableFinalScores = groupByFirstCard
          ? (<FinalScoresByDealerCard>finalScores)[nextHand.cards[0]]
          : <FinalScoresMap>finalScores;
        registerFinalScore(applicableFinalScores, nextHand);
      }
    });
  }

  return { allCombinations, finalScores: finalScores as T };
};

const registerFinalScore = (finalScores: FinalScoresMap, hand: CardsCombination) => {
  if (!finalScores[hand.effectiveScore]) {
    finalScores[hand.effectiveScore] = {
      combinations: [],
      probability: 0,
    };
  }

  const nextCombination = getCardsCombinations(hand.cards);
  finalScores[hand.effectiveScore].combinations.push(nextCombination);

  const combinationProbability = 1 / Math.pow(cardsNumber, hand.cards.length);
  finalScores[hand.effectiveScore].probability += combinationProbability;
};
