import { getDealerFinals } from '../logic/dealer-finals';
import { getSortedApplicableLabels } from '../logic/labels';
import { getPlayerScoreStrategy } from '../logic/strategy';

/**
 * Produces the following table
 *
 * Score,Decision
 * 2/12,Demanar
 * 3/13,Demanar
 * 4/14,Demanar
 * 5/15,Demanar
 * 6/16,Demanar
 * 7/17,Demanar
 * 8/18,Passar
 * 9/19,Passar
 * 10/20,Passar
 * 4,Demanar
 * 5,Demanar
 * 6,Demanar
 * 7,Demanar
 * 8,Demanar
 * 9,Demanar
 * 10,Demanar
 * 11,Demanar
 * 12,Demanar
 * 13,Demanar
 * 14,Demanar
 * 15,Demanar
 * 16,Passar
 * 17,Passar
 * 18,Passar
 * 19,Passar
 * 20,Passar
 */

const dealerFinals = getDealerFinals();

const playerScoreStrategy = getPlayerScoreStrategy(dealerFinals);

const csv = [['Score', 'Decision'].join(',')];
getSortedApplicableLabels(Object.keys(playerScoreStrategy)).forEach((playerScoreLabel) => {
  csv.push(
    [
      playerScoreLabel,
      playerScoreStrategy[playerScoreLabel].decision === 'stand' ? 'Passar' : 'Demanar',
    ].join(','),
  );
});

console.log(csv.join('\n'));
