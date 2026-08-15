import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useDealerCardContext } from '../dealer-card.context';
import { dealerFinalScoresByFirstCard } from '../logic/dealer-data.logic';
import { toPercentage } from '../logic/numbers.logic';
import { sortedCardSymbols } from '../models/cards.model';
import { lose, push, surrender, win } from '../models/result.model';
import { useSearchParamsUtils } from '../search-params-utils';
import { useSettingsContext } from '../settings.context';
import { BetMultipliersCell } from './bet-multipliers-cell.component';

const getCellStyle = (isHeader = false): CSSProperties => ({
  fontWeight: isHeader ? 'bold' : undefined,
  padding: 8,
  textAlign: 'center',
});

export const DealerCardBreakdownList: React.FC = () => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { rules, strategy } = useDealerCardContext();
  const { navigateWithSearch } = useSearchParamsUtils();

  const surrenderingEnabled = !!rules.surrendering;

  const rowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${7 + +surrenderingEnabled}, 1fr)`,
  };

  return (
    strategy && (
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={rowStyle}>
            <td style={getCellStyle(true)}>{t('titles.dealerCard')}</td>
            <td style={getCellStyle(true)}>{t('commons.probability')}</td>
            <td style={getCellStyle(true)}>{t(`commons.win`)}</td>
            <td style={getCellStyle(true)}>{t(`commons.push`)}</td>
            <td style={getCellStyle(true)}>{t(`commons.lose`)}</td>
            {surrenderingEnabled && <td style={getCellStyle(true)}>{t(`commons.surrender`)}</td>}
            <td style={getCellStyle(true)}>{t('commons.edge')}</td>
            <td style={getCellStyle(true)}></td>
          </tr>
        </thead>

        <tbody>
          {sortedCardSymbols.map(cardSymbol => {
            const cardStrategy = strategy.breakdown[cardSymbol];
            const probability = dealerFinalScoresByFirstCard[cardSymbol]?.probability ?? 0;

            if (!cardStrategy) {
              return null;
            }

            const { edge, outcomesByBetMultiplier } = cardStrategy.expectedResults;

            return (
              <tr key={cardSymbol} style={rowStyle}>
                <td style={getCellStyle(true)}>{cardSymbol}</td>
                <td style={getCellStyle()}>{toPercentage(probability, decimals)}</td>
                <td style={getCellStyle()}>
                  <BetMultipliersCell map={outcomesByBetMultiplier[win]} />
                </td>
                <td style={getCellStyle()}>
                  <BetMultipliersCell map={outcomesByBetMultiplier[push]} />
                </td>
                <td style={getCellStyle()}>
                  <BetMultipliersCell map={outcomesByBetMultiplier[lose]} />
                </td>
                {surrenderingEnabled && (
                  <td style={getCellStyle()}>
                    <BetMultipliersCell map={outcomesByBetMultiplier[surrender]} />
                  </td>
                )}
                <td style={getCellStyle()}>{toPercentage(edge, decimals)}</td>
                <td style={getCellStyle()}>
                  <button
                    onClick={() => {
                      navigateWithSearch(cardSymbol);
                    }}
                  >
                    {t('dealerCard.details')}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )
  );
};
