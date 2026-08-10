import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { dealerFinalScores, dealerFinalScoresByFirstCard } from '../logic/dealer-data.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { sortedCardSymbols } from '../models/cards.model';
import { useSettingsContext } from '../settings.context';

const getCellStyle = (isHeader: boolean): CSSProperties => ({
  fontWeight: isHeader ? 'bold' : undefined,
  padding: 8,
  textAlign: 'center',
});

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${1 + sortedCardSymbols.length}, 1fr)`,
};

export const DealerCardPage: React.FC = () => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const sortedDealerFinalScores = dealerFinalScores.map(finalScore => finalScore.score);

  return (
    <div>
      <h1>{t('titles.dealerCard')}</h1>

      <table style={{ width: '100%' }}>
        <thead>
          <tr style={rowStyle}>
            <td style={getCellStyle(true)}>{t('commons.score')}</td>
            {sortedCardSymbols.map(cardSymbol => (
              <td key={cardSymbol} style={getCellStyle(true)}>
                {cardSymbol}
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedDealerFinalScores.map(dealerFinalScoreKey => (
            <tr key={dealerFinalScoreKey} style={rowStyle}>
              <td style={getCellStyle(true)}>
                {effectiveScoreToLabel(Number(dealerFinalScoreKey))}
              </td>
              {sortedCardSymbols.map(cardSymbol => {
                const finalScoresGroup = dealerFinalScoresByFirstCard[cardSymbol];
                const finalScore = finalScoresGroup.finalScores[dealerFinalScoreKey];

                return (
                  <td key={cardSymbol} style={getCellStyle(false)}>
                    {finalScore ? (
                      <React.Fragment>
                        <div>{t('dealerCard.hands', { hands: finalScore.hands.length })}</div>
                        <div>{toPercentage(finalScore.probability, decimals)}</div>
                      </React.Fragment>
                    ) : (
                      '-'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
