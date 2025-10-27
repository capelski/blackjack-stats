import { actionableLabels } from '../logic/labels.logic';
import { getPlayerScoreStrategy } from '../logic/player-score-strategy.logic';
import { getTable } from '../logic/table.logic';

const playerScoreStrategy = getPlayerScoreStrategy();

const strategyHeaders = ['Score', 'Decision'];
const strategyRows = actionableLabels.map((playerScoreLabel) => {
  return [playerScoreLabel, playerScoreStrategy[playerScoreLabel].action];
});
const strategyTable = getTable(strategyHeaders, strategyRows);

console.log(strategyTable);
