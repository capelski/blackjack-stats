import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { getBetMultiplierLabel } from '../logic/bet-multiplier.logic';
import { getSortedNumericKeys, toDecimal, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { lose, push, Result, surrender, win } from '../models/result.model';
import { useSettingsContext } from '../settings.context';
import { ExpectedResults } from '../types/expected-result.type';
import { ExpectedResultsSummaryModal } from './expected-results-summary-modal.component';

/** Sign of the contribution of each result to the overall edge */
const resultEdgeSign: Record<Result, number> = {
  [win]: 1,
  [push]: 0,
  [lose]: -1,
  [surrender]: -1,
};

const cellStyle: CSSProperties = {
  padding: 8,
  textAlign: 'center',
};

type ExpectedResultsSummaryProps = {
  expectedResults: Pick<ExpectedResults, 'edge' | 'outcomesByBetMultiplier'>;
  isSurrenderingEnabled: boolean;
};

export const ExpectedResultsSummary: React.FC<ExpectedResultsSummaryProps> = (props) => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { expectedResults, isSurrenderingEnabled } = props;

  const results: Result[] = [win, push, lose];
  if (isSurrenderingEnabled) {
    results.push(surrender);
  }

  return (
    <table className="expected-summary" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th style={cellStyle}>{t('commons.result')}</th>
          <th style={cellStyle}>{t('commons.betMultiplier')}</th>
          <th style={cellStyle}>{t('commons.probability')}</th>
          <th style={cellStyle}>{t('commons.potVariation')}</th>
        </tr>
      </thead>

      <tbody>
        {results.map((result) => {
          const map = expectedResults.outcomesByBetMultiplier[result];
          const betMultipliers = getSortedNumericKeys(map).filter(
            (betMultiplier) => map[betMultiplier] > 0,
          );
          const resultStyle = { ...cellStyle, ...resultToStyles(result) };

          if (betMultipliers.length === 0) {
            return (
              <tr key={result}>
                <td style={resultStyle}>{t(`commons.${result}`)}</td>
                <td style={resultStyle}>-</td>
                <td style={resultStyle}>-</td>
                <td style={resultStyle}>-</td>
              </tr>
            );
          }

          // Pushes return no money, so their bet multipliers are grouped into a single row
          const rows =
            result === push
              ? [
                  {
                    betMultiplier: 0,
                    probability: betMultipliers.reduce(
                      (acc, betMultiplier) => acc + map[betMultiplier],
                      0,
                    ),
                  },
                ]
              : betMultipliers.map((betMultiplier) => ({
                  betMultiplier,
                  probability: map[betMultiplier],
                }));

          return rows.map(({ betMultiplier, probability }, index) => {
            const signedBetMultiplier = betMultiplier * resultEdgeSign[result];

            return (
              <tr key={`${result}-${betMultiplier}`}>
                {index === 0 && (
                  <td style={resultStyle} rowSpan={rows.length}>
                    {t(`commons.${result}`)}
                  </td>
                )}
                <td style={resultStyle}>{getBetMultiplierLabel(signedBetMultiplier)}</td>
                <td style={resultStyle}>{toPercentage(probability, decimals)}</td>
                <td style={resultStyle}>
                  {signedBetMultiplier > 0 && '+'}
                  {toPercentage(probability * signedBetMultiplier, decimals)}{' '}
                  {t('commons.bet').toLowerCase()}
                </td>
              </tr>
            );
          });
        })}
      </tbody>

      <tfoot>
        <tr>
          <td style={{ ...cellStyle, fontWeight: 'bold' }}>{t('commons.edge')}</td>
          <td style={cellStyle}></td>
          <td style={cellStyle}></td>
          <td style={{ ...cellStyle, fontWeight: 'bold' }}>
            {toPercentage(expectedResults.edge, decimals)} {t('commons.bet').toLowerCase()}
            <br />
            <i style={{ fontWeight: 'normal' }}>
              {t('expectedResults.xRounds', {
                rounds: toDecimal(1 / -expectedResults.edge, decimals),
              })}
            </i>
            <ExpectedResultsSummaryModal edge={expectedResults.edge} />
          </td>
        </tr>
      </tfoot>
    </table>
  );
};
