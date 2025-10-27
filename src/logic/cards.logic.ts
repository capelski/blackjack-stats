export const cards = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

export const cardsNumber = cards.length;

export const cardValues = [[1, 11], [2], [3], [4], [5], [6], [7], [8], [9], [10], [10], [10], [10]];

export const cardValuesDictionary = {
  [cards[0]]: cardValues[0],
  [cards[1]]: cardValues[1],
  [cards[2]]: cardValues[2],
  [cards[3]]: cardValues[3],
  [cards[4]]: cardValues[4],
  [cards[5]]: cardValues[5],
  [cards[6]]: cardValues[6],
  [cards[7]]: cardValues[7],
  [cards[8]]: cardValues[8],
  [cards[9]]: cardValues[9],
  [cards[10]]: cardValues[10],
  [cards[11]]: cardValues[11],
  [cards[12]]: cardValues[12],
};

export const cardCombinationSeparator = ',';
export const getCardsCombinations = (_cards: typeof cards) => {
  return _cards.join(cardCombinationSeparator);
};
