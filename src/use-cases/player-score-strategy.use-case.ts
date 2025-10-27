import { actionableLabels } from '../logic/labels.logic';
import { getMarkdownTable } from '../logic/markdown.logic';
import { getPlayerScoreStrategy } from '../logic/player-score-strategy.logic';

const playerScoreStrategy = getPlayerScoreStrategy();

const strategyHeaders = ['Score', 'Decision'];
const strategyRows = actionableLabels.map((playerScoreLabel) => {
  return [playerScoreLabel, playerScoreStrategy[playerScoreLabel].action];
});
const strategyTable = getMarkdownTable(strategyHeaders, strategyRows);

console.log(strategyTable);
