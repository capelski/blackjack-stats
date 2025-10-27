import { cards } from '../logic/cards.logic';
import { getDealerCardStrategy } from '../logic/dealer-card-strategy.logic';
import { actionableLabels, getAbbreviatedAction } from '../logic/labels.logic';
import { getTable } from '../logic/table.logic';

const dealerCardStrategy = getDealerCardStrategy();

const strategyHeaders = ['', ...cards];
const strategyRows = actionableLabels.map((playerScoreLabel) => {
  const decisions = cards.map((dealerCard) => {
    return getAbbreviatedAction(dealerCardStrategy[playerScoreLabel][dealerCard].action);
  });
  return [playerScoreLabel, ...decisions];
});
const strategyTable = getTable(strategyHeaders, strategyRows);

console.log(strategyTable);
