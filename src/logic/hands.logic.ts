import { DealerHand, PlayerHand, PlayerHandSeed } from '../types/hand.type';
import { blackjackLabel, bustLabel, softScoresSeparator } from './labels.logic';
import { blackjackScore, bustScore, getEffectiveScore, playerScoreLimit } from './scores.logic';

export const dealerFinalHands: DealerHand[] = [
  { effectiveScore: 17, label: '17' },
  { effectiveScore: 18, label: '18' },
  { effectiveScore: 19, label: '19' },
  { effectiveScore: 20, label: '20' },
  { effectiveScore: 21, label: '21' },
  { effectiveScore: blackjackScore, label: blackjackLabel },
  { effectiveScore: bustScore, label: bustLabel },
];

export const getPlayerHands = (splitting?: boolean): PlayerHand[] => {
  const playerHandSeeds: PlayerHandSeed[] = [
    // Final hands
    {
      canBeInitialHand: false,
      isVirtualHand: true,
      label: bustLabel,
      scores: [bustScore],
      sortIndex: -1,
    },
    {
      canBeInitialHand: true,
      label: blackjackLabel,
      scores: [blackjackScore],
      sortIndex: 122,
    },
    {
      canBeInitialHand: false,
      label: '21',
      scores: [21],
      sortIndex: 121,
    },
    {
      canBeInitialHand: false,
      label: '11/21',
      scores: [11, 21],
      sortIndex: 211,
    },
    // Actionable hands
    { canBeInitialHand: true, label: '20', scores: [20], sortIndex: 120 },
    { canBeInitialHand: true, label: '19', scores: [19], sortIndex: 119 },
    { canBeInitialHand: true, label: '18', scores: [18], sortIndex: 118 },
    { canBeInitialHand: true, label: '17', scores: [17], sortIndex: 117 },
    { canBeInitialHand: true, label: '16', scores: [16], sortIndex: 116 },
    { canBeInitialHand: true, label: '15', scores: [15], sortIndex: 115 },
    { canBeInitialHand: true, label: '14', scores: [14], sortIndex: 114 },
    { canBeInitialHand: true, label: '13', scores: [13], sortIndex: 113 },
    { canBeInitialHand: true, label: '12', scores: [12], sortIndex: 112 },
    { canBeInitialHand: true, label: '11', scores: [11], sortIndex: 111 },
    { canBeInitialHand: true, label: '10', scores: [10], sortIndex: 110 },
    {
      canBeInitialHand: true,
      label: `10${softScoresSeparator}20`,
      scores: [10, 20],
      sortIndex: 210,
    },
    { canBeInitialHand: true, label: '9', scores: [9], sortIndex: 109 },
    {
      canBeInitialHand: true,
      label: `9${softScoresSeparator}19`,
      scores: [9, 19],
      sortIndex: 209,
    },
    { canBeInitialHand: true, label: '8', scores: [8], sortIndex: 108 },
    {
      canBeInitialHand: true,
      label: `8${softScoresSeparator}18`,
      scores: [8, 18],
      sortIndex: 208,
    },
    { canBeInitialHand: true, label: '7', scores: [7], sortIndex: 107 },
    {
      canBeInitialHand: true,
      label: `7${softScoresSeparator}17`,
      scores: [7, 17],
      sortIndex: 207,
    },
    { canBeInitialHand: true, label: '6', scores: [6], sortIndex: 106 },
    {
      canBeInitialHand: true,
      label: `6${softScoresSeparator}16`,
      scores: [6, 16],
      sortIndex: 206,
    },
    { canBeInitialHand: true, label: '5', scores: [5], sortIndex: 105 },
    {
      canBeInitialHand: true,
      label: `5${softScoresSeparator}15`,
      scores: [5, 15],
      sortIndex: 205,
    },
    {
      canBeInitialHand: true,
      isVirtualHand: splitting,
      label: '4',
      scores: [4],
      sortIndex: 104,
    },
    {
      canBeInitialHand: true,
      label: `4${softScoresSeparator}14`,
      scores: [4, 14],
      sortIndex: 204,
    },
    {
      canBeInitialHand: true,
      label: `3${softScoresSeparator}13`,
      scores: [3, 13],
      sortIndex: 203,
    },
    {
      canBeInitialHand: true,
      isVirtualHand: splitting,
      label: `2${softScoresSeparator}12`,
      scores: [2, 12],
      sortIndex: 202,
    },
    ...(splitting
      ? [
          {
            canBeInitialHand: false,
            isVirtualHand: true,
            label: '3',
            sortIndex: -1,
            scores: [3],
          },
          {
            canBeInitialHand: false,
            isVirtualHand: true,
            label: '2',
            sortIndex: -1,
            scores: [2],
          },
          {
            canBeInitialHand: false,
            isVirtualHand: true,
            label: 'A',
            sortIndex: -1,
            scores: [1, 11],
          },
          {
            canBeInitialHand: true,
            label: 'A,A',
            scores: [2, 12],
            sortIndex: 301,
            splitLabel: 'A',
          },
          {
            canBeInitialHand: true,
            label: '2,2',
            scores: [4],
            sortIndex: 302,
            splitLabel: '2',
          },
          {
            canBeInitialHand: true,
            label: '3,3',
            scores: [6],
            sortIndex: 303,
            splitLabel: '3',
          },
          {
            canBeInitialHand: true,
            label: '4,4',
            scores: [8],
            sortIndex: 304,
            splitLabel: '4',
          },
          {
            canBeInitialHand: true,
            label: '5,5',
            scores: [10],
            sortIndex: 305,
            splitLabel: '5',
          },
          {
            canBeInitialHand: true,
            label: '6,6',
            scores: [12],
            sortIndex: 306,
            splitLabel: '6',
          },
          {
            canBeInitialHand: true,
            label: '7,7',
            scores: [14],
            sortIndex: 307,
            splitLabel: '7',
          },
          {
            canBeInitialHand: true,
            label: '8,8',
            scores: [16],
            sortIndex: 308,
            splitLabel: '8',
          },
          {
            canBeInitialHand: true,
            label: '9,9',
            scores: [18],
            sortIndex: 309,
            splitLabel: '9',
          },
          {
            canBeInitialHand: true,
            label: '10,10',
            scores: [20],
            sortIndex: 310,
            splitLabel: '10',
          },
          {
            canBeInitialHand: true,
            label: 'J,J',
            scores: [20],
            sortIndex: 311,
            splitLabel: '10',
          },
          {
            canBeInitialHand: true,
            label: 'Q,Q',
            scores: [20],
            sortIndex: 312,
            splitLabel: '10',
          },
          {
            canBeInitialHand: true,
            label: 'K,K',
            scores: [20],
            sortIndex: 313,
            splitLabel: '10',
          },
        ]
      : []),
  ];

  return playerHandSeeds.map<PlayerHand>(handSeed => {
    const effectiveScore = getEffectiveScore(handSeed.scores);
    return {
      ...handSeed,
      effectiveScore,
      isFinal: effectiveScore >= playerScoreLimit,
    };
  });
};
