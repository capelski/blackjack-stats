import { getDealerFinals } from '../logic/dealer-finals.logic';
import { actionableLabels } from '../logic/labels.logic';
import { getMarkdownTable } from '../logic/markdown.logic';
import { getPlayerScoreStrategy } from '../logic/player-score-strategy.logic';

const dealerFinals = getDealerFinals();
const playerScoreStrategy = getPlayerScoreStrategy(dealerFinals);

const strategyHeaders = ['Score', 'Decision'];
const strategyRows = actionableLabels.map((playerScoreLabel) => {
  return [playerScoreLabel, playerScoreStrategy[playerScoreLabel].action];
});
const strategyTable = getMarkdownTable(strategyHeaders, strategyRows);

console.log(strategyTable);
