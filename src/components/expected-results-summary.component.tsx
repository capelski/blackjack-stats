import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { getBetMultiplierLabel } from '../logic/bet-multiplier.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
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
  expectedResults: Pick<ExpectedResults, 'edge' | 'edgeContributions'>;
  isSurrenderingEnabled: boolean;
};

export const ExpectedResultsSummary: React.FC<ExpectedResultsSummaryProps> = (props) => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { expectedResults } = props;

  const edgeContributions = expectedResults.edgeContributions.filter(
    (contribution) => contribution.probability > 0,
  );

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
        {edgeContributions.map((contribution, index) => {
          const resultStyle = { ...cellStyle, ...resultToStyles(contribution.result) };
          const isSameAsPrevious =
            index > 0 && contribution.result === edgeContributions[index - 1].result;

          const signedBetMultiplier =
            contribution.betMultiplier * resultEdgeSign[contribution.result];

          return (
            <tr key={index}>
              <td style={resultStyle}>
                {!isSameAsPrevious && t(`commons.${contribution.result}`)}
              </td>
              <td style={resultStyle}>{getBetMultiplierLabel(signedBetMultiplier)}</td>
              <td style={resultStyle}>{toPercentage(contribution.probability, decimals)}</td>
              <td style={resultStyle}>
                {signedBetMultiplier > 0 && '+'}
                {toPercentage(contribution.probability * signedBetMultiplier, decimals)}{' '}
                {t('commons.bet').toLowerCase()}
              </td>
            </tr>
          );
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
