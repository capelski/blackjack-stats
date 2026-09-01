import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { dealerFinalScores, dealerFinalScoresByFirstCard } from '../logic/dealer-data.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { sortedCardSymbols } from '../models/cards.model';
import { dealerCardModeParamName, useSearchParamsUtils } from '../search-params-utils';
import { useSettingsContext } from '../settings.context';
import { FinalScore, FinalScoresGroup } from '../types/final-score.type';

const hands = 'hands';
const absoluteProbability = 'absolute';
const relativeProbability = 'relative';
type DealerCardTableMode = typeof hands | typeof absoluteProbability | typeof relativeProbability;
const modes: DealerCardTableMode[] = [hands, absoluteProbability, relativeProbability];

const getCellValue = (
  mode: DealerCardTableMode,
  finalScore: FinalScore,
  finalScoresGroup: FinalScoresGroup,
  decimals: number,
): string => {
  if (mode === hands) {
    return String(finalScore.hands.length);
  }
  if (mode === absoluteProbability) {
    return toPercentage(finalScore.probability * finalScoresGroup.probability, decimals);
  }
  return toPercentage(finalScore.probability, decimals);
};

const getCellStyle = (isHeader: boolean): CSSProperties => ({
  fontWeight: isHeader ? 'bold' : undefined,
  padding: 8,
  textAlign: 'center',
});

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${1 + sortedCardSymbols.length}, 1fr)`,
};

export const DealerFinalScoresMatrix: React.FC = () => {
  const { t } = useTranslation();
  const { useUrlState } = useSearchParamsUtils();
  const { decimals } = useSettingsContext();

  const [mode, toggleMode] = useUrlState(dealerCardModeParamName, relativeProbability, modes);

  return (
    <div>
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
          {dealerFinalScores.map(dealerFinalScore => (
            <tr key={dealerFinalScore.id} style={rowStyle}>
              <td style={getCellStyle(true)}>{effectiveScoreToLabel(dealerFinalScore.score)}</td>
              {sortedCardSymbols.map(cardSymbol => {
                const finalScoresGroup = dealerFinalScoresByFirstCard[cardSymbol];
                const finalScore = finalScoresGroup.finalScores[dealerFinalScore.id];

                return (
                  <td key={cardSymbol} style={getCellStyle(false)}>
                    {finalScore ? getCellValue(mode, finalScore, finalScoresGroup, decimals) : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <select value={mode} onChange={e => toggleMode(e.target.value as DealerCardTableMode)}>
        {modes.map(modeOption => (
          <option key={modeOption} value={modeOption}>
            {t(`dealerCard.modes.${modeOption}`)}
          </option>
        ))}
      </select>
    </div>
  );
};
