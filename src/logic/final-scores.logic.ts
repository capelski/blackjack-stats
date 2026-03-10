import { SearchMode } from '../enums/search-mode.enum';
import { CardsCombination, HandResolver } from '../types/cards-combination.type';
import { FinalProbabilities } from '../types/final-probabilities.type';
import {
  CombinationsByFinalScore,
  FinalScore,
  FinalScoresByDealerCard,
  FinalScoresByInitialPairMap,
  FinalScoresMap,
} from '../types/final-scores.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { createNextCardsCombination, createOneCardCombination } from './cards-combination.logic';
import { cards, getCardsCombinations } from './cards.logic';
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

class FinalScoresSet {
  public combinationsByFinalScore: CombinationsByFinalScore;
  public finalScores: FinalScoresByDealerCard | FinalScoresMap;
  public finalScoresByInitialPairMap: FinalScoresByInitialPairMap;

  constructor(public groupFinalScoresByFirstCard = false) {
    this.combinationsByFinalScore = {};
    this.finalScores = groupFinalScoresByFirstCard
      ? cards.reduce<FinalScoresByDealerCard>((reduced, card) => {
          const map: FinalScoresMap = {};
          return {
            ...reduced,
            [card]: map,
          };
        }, {})
      : <FinalScoresMap>{};
    this.finalScoresByInitialPairMap = {};
  }

  createFinalScore(score: number): FinalScore {
    return {
      combinations: 0,
      probability: 0,
      score,
    };
  }

  increaseFinalScore(finalScore: FinalScore, hand: CardsCombination) {
    finalScore.probability += hand.probability;
  }

  registerFinalScore(hand: CardsCombination) {
    const applicableFinalScores = this.groupFinalScoresByFirstCard
      ? (<FinalScoresByDealerCard>this.finalScores)[hand.cards[0]]
      : <FinalScoresMap>this.finalScores;

    if (!applicableFinalScores[hand.effectiveScore]) {
      applicableFinalScores[hand.effectiveScore] = this.createFinalScore(hand.effectiveScore);
    }

    this.increaseFinalScore(applicableFinalScores[hand.effectiveScore], hand);

    if (!hand.isPostSplit) {
      const combinationSymbols = getCardsCombinations(hand.symbols);
      applicableFinalScores[hand.effectiveScore].combinations += 1;

      if (!this.combinationsByFinalScore[hand.effectiveScore]) {
        this.combinationsByFinalScore[hand.effectiveScore] = [];
      }

      this.combinationsByFinalScore[hand.effectiveScore].push(combinationSymbols);
    }

    this.registerFinalScoreByInitialPair(hand);
  }

  registerFinalScoreByInitialPair(hand: CardsCombination) {
    if (!this.finalScoresByInitialPairMap[hand.initialPair.label]) {
      this.finalScoresByInitialPairMap[hand.initialPair.label] = {
        action: hand.initialPair.action,
        finalScores: {},
        initialPairScore: hand.initialPair.score,
        probability: 0,
      };
    }
    const fs = this.finalScoresByInitialPairMap[hand.initialPair.label];

    if (fs.action !== hand.initialPair.action) {
      throw new Error(
        `Inconsistent action for initial pair ${hand.initialPair.label}: ${fs.action} vs ${hand.initialPair.action}`,
      );
    }

    if (!fs.finalScores[hand.effectiveScore]) {
      fs.finalScores[hand.effectiveScore] = this.createFinalScore(hand.effectiveScore);
    }

    fs.probability += hand.probability;
    this.increaseFinalScore(fs.finalScores[hand.effectiveScore], hand);
  }
}

export type FinalScoresOptions = {
  collectCombinations?: boolean;
  groupFinalScoresByFirstCard?: boolean;
  searchMode?: SearchMode;
  strategyOptions?: StrategyOptions;
};

export const getFinalScores = <
  TFinalScores extends FinalScoresMap | FinalScoresByDealerCard = FinalScoresMap
>(
  handResolver: HandResolver,
  options: FinalScoresOptions = {},
): {
  combinations: CardsCombination[];
  combinationsByFinalScore: CombinationsByFinalScore;
  finalScores: TFinalScores;
  finalScoresByInitialPairMap: FinalScoresByInitialPairMap;
} => {
  const collectCombinations = options.collectCombinations ?? false;
  const groupFinalScoresByFirstCard = options.groupFinalScoresByFirstCard ?? false;
  const searchMode = options.searchMode ?? SearchMode.breadthFirst;
  const strategyOptions = options.strategyOptions ?? {};

  const combinations: CardsCombination[] = [];

  const combinationsList = new CombinationsList(searchMode, cards.map(createOneCardCombination));
  const sortedCards = searchMode === SearchMode.depthFirst ? [...cards].reverse() : cards;

  const finalScoresSet = new FinalScoresSet(groupFinalScoresByFirstCard);

  while (combinationsList.length > 0) {
    const hand = combinationsList.extractCombination()!;

    if (collectCombinations) {
      // Store all the combinations along the way, final or not
      combinations.push(hand);

      if (hand.isFinal) {
        continue;
      }
    }

    sortedCards.map(card => {
      const nextHand = createNextCardsCombination(handResolver, hand, card, strategyOptions);

      if (!nextHand.isFinal || collectCombinations) {
        combinationsList.addCombination(nextHand);
      }

      if (nextHand.isFinal) {
        finalScoresSet.registerFinalScore(nextHand);
      }
    });
  }

  return {
    combinations,
    combinationsByFinalScore: finalScoresSet.combinationsByFinalScore,
    finalScores: finalScoresSet.finalScores as TFinalScores,
    finalScoresByInitialPairMap: finalScoresSet.finalScoresByInitialPairMap,
  };
};
