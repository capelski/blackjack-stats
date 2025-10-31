import { DealerHand, PlayerHand } from '../types/hand.type';
import { blackjackLabel, bustLabel } from './labels.logic';
import { blackjackScore, bustScore } from './scores.logic';

export const dealerFinalHands: DealerHand[] = [
  { effectiveScore: 17, label: '17' },
  { effectiveScore: 18, label: '18' },
  { effectiveScore: 19, label: '19' },
  { effectiveScore: 20, label: '20' },
  { effectiveScore: 21, label: '21' },
  { effectiveScore: blackjackScore, label: blackjackLabel },
  { effectiveScore: bustScore, label: bustLabel },
];

export const getPlayerHands = (): PlayerHand[] => {
  return [
    // Final hands
    { effectiveScore: bustScore, isFinal: true, label: bustLabel, scores: [bustScore] },
    {
      effectiveScore: blackjackScore,
      isFinal: true,
      label: blackjackLabel,
      scores: [blackjackScore],
    },
    { effectiveScore: 21, isFinal: true, label: '21', scores: [21] },
    { effectiveScore: 21, isFinal: true, label: '11/21', scores: [11, 21] },
    // Actionable hands
    { effectiveScore: 20, label: '20', scores: [20] },
    { effectiveScore: 19, label: '19', scores: [19] },
    { effectiveScore: 18, label: '18', scores: [18] },
    { effectiveScore: 17, label: '17', scores: [17] },
    { effectiveScore: 16, label: '16', scores: [16] },
    { effectiveScore: 15, label: '15', scores: [15] },
    { effectiveScore: 14, label: '14', scores: [14] },
    { effectiveScore: 13, label: '13', scores: [13] },
    { effectiveScore: 12, label: '12', scores: [12] },
    { effectiveScore: 11, label: '11', scores: [11] },
    { effectiveScore: 10, label: '10', scores: [10] },
    { effectiveScore: 20, label: '10/20', scores: [10, 20] },
    { effectiveScore: 9, label: '9', scores: [9] },
    { effectiveScore: 19, label: '9/19', scores: [9, 19] },
    { effectiveScore: 8, label: '8', scores: [8] },
    { effectiveScore: 18, label: '8/18', scores: [8, 18] },
    { effectiveScore: 7, label: '7', scores: [7] },
    { effectiveScore: 17, label: '7/17', scores: [7, 17] },
    { effectiveScore: 6, label: '6', scores: [6] },
    { effectiveScore: 16, label: '6/16', scores: [6, 16] },
    { effectiveScore: 5, label: '5', scores: [5] },
    { effectiveScore: 15, label: '5/15', scores: [5, 15] },
    { effectiveScore: 4, label: '4', scores: [4] },
    { effectiveScore: 14, label: '4/14', scores: [4, 14] },
    { effectiveScore: 13, label: '3/13', scores: [3, 13] },
    { effectiveScore: 12, label: '2/12', scores: [2, 12] },
  ];
};
