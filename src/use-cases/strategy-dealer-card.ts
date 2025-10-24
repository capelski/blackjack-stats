import { sortByCard } from '../logic/cards';
import { getDealerFinalsByCard } from '../logic/dealer-finals';
import { getSortedApplicableLabels } from '../logic/labels';
import { getDealerCardStrategy } from '../logic/strategy';

/**
 * Produces the following table
 *
 * ,A,2,3,4,5,6,7,8,9,10,J,Q,K
 * 2/12,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 3/13,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 4/14,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 5/15,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 6/16,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 7/17,D,D,D,D,D,D,P,D,D,D,D,D,D
 * 8/18,P,P,P,P,P,P,P,P,D,D,D,D,D
 * 9/19,P,P,P,P,P,P,P,P,P,P,P,P,P
 * 10/20,P,P,P,P,P,P,P,P,P,P,P,P,P
 * 4,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 5,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 6,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 7,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 8,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 9,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 10,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 11,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 12,D,D,D,D,D,D,D,D,D,D,D,D,D
 * 13,D,D,D,P,P,P,D,D,D,D,D,D,D
 * 14,D,P,P,P,P,P,D,D,D,D,D,D,D
 * 15,D,P,P,P,P,P,D,D,D,D,D,D,D
 * 16,D,P,P,P,P,P,D,D,D,D,D,D,D
 * 17,P,P,P,P,P,P,P,P,P,P,P,P,P
 * 18,P,P,P,P,P,P,P,P,P,P,P,P,P
 * 19,P,P,P,P,P,P,P,P,P,P,P,P,P
 * 20,P,P,P,P,P,P,P,P,P,P,P,P,P
 */

const dealerFinalsByCard = getDealerFinalsByCard();

const dealerCardStrategy = getDealerCardStrategy(dealerFinalsByCard);

const dealerSortedKeys = Object.keys(dealerFinalsByCard).sort(sortByCard);
const csv = [['', ...dealerSortedKeys].join(',')];
getSortedApplicableLabels(Object.keys(dealerCardStrategy)).forEach((playerScoreLabel) => {
  const decisions = dealerSortedKeys.map((dealerCardKey) => {
    return dealerCardStrategy[playerScoreLabel][dealerCardKey].decision === 'stand' ? 'P' : 'D';
  });
  csv.push([playerScoreLabel, decisions].join(','));
});

console.log(csv.join('\n'));
