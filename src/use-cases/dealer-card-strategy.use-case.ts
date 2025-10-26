import { cards } from '../logic/cards.logic';
import { getDealerCardStrategy } from '../logic/dealer-card-strategy.logic';
import { actionableLabels, getAbbreviatedAction } from '../logic/labels.logic';
import { getMarkdownTable } from '../logic/markdown.logic';

const dealerCardStrategy = getDealerCardStrategy();

const strategyHeaders = ['', ...cards];
const strategyRows = actionableLabels.map((playerScoreLabel) => {
  const decisions = cards.map((dealerCard) => {
    return getAbbreviatedAction(dealerCardStrategy[playerScoreLabel][dealerCard].action);
  });
  return [playerScoreLabel, ...decisions];
});
const strategyTable = getMarkdownTable(strategyHeaders, strategyRows);

console.log(strategyTable);
