import { getInitialPairs } from '../logic/initial-pairs.logic';
import { initialPairLabels } from '../logic/labels.logic';
import { getMarkdownTable } from '../logic/markdown.logic';
import { toPercentage } from '../logic/percentages.logic';

const initialPairs = getInitialPairs();

const headers = ['Score', 'Probability'];
const rows = initialPairLabels.map((key) => {
  return [key, toPercentage(initialPairs[key])];
});
const initialPairsTable = getMarkdownTable(headers, rows);

console.log(initialPairsTable);
