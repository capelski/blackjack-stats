export const cardValues = {
  A: [1, 11],
  2: [2],
  3: [3],
  4: [4],
  5: [5],
  6: [6],
  7: [7],
  8: [8],
  9: [9],
  10: [10],
  J: [10],
  Q: [10],
  K: [10],
};

export const cards = Object.keys(cardValues) as (keyof typeof cardValues)[];

export const cardsNumber = Object.values(cardValues).length;

export const sortByCard = (a: string, b: string) => {
  return a === 'A' ? -1 : b === 'A' ? 1 : 0;
};
