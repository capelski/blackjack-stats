import React, { CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dealerFinalScores, dealerFinalScoresByFirstCard } from '../logic/dealer-data.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { sortedCardSymbols } from '../models/cards.model';
import { useSettingsContext } from '../settings.context';
import { FinalScore, FinalScoresGroup } from '../types/final-score.type';

const hands = 'hands';
const absoluteProbability = 'absoluteProbability';
const relativeProbability = 'relativeProbability';
const modes = [hands, absoluteProbability, relativeProbability] as const;
type Mode = typeof modes[number];

const getCellValue = (
  mode: Mode,
  finalScore: FinalScore,
  finalScoresGroup: FinalScoresGroup,
  decimals: number,
): string => {
  if (mode === hands) {
    return String(finalScore.hands.length);
  }
  if (mode === absoluteProbability) {
    return toPercentage(finalScore.probability, decimals);
  }
  return toPercentage(finalScore.probability / finalScoresGroup.probability, decimals);
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

export const DealerCardPage: React.FC = () => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const sortedDealerFinalScores = dealerFinalScores.map(finalScore => finalScore.score);

  const [mode, setMode] = useState<Mode>(hands);

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
                    {finalScore ? getCellValue(mode, finalScore, finalScoresGroup, decimals) : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <select value={mode} onChange={e => setMode(e.target.value as Mode)}>
        {modes.map(modeOption => (
          <option key={modeOption} value={modeOption}>
            {t(`dealerCard.modes.${modeOption}`)}
          </option>
        ))}
      </select>
    </div>
  );
};
