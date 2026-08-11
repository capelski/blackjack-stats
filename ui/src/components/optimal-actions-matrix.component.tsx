import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { getActionableHands } from '../logic/abstract-hands.logic';
import { sortedCardSymbols } from '../models/cards.model';
import { StrategyByFirstCard } from '../types/strategy.type';

const getCellStyle = (isHeader: boolean): CSSProperties => ({
  fontWeight: isHeader ? 'bold' : undefined,
  padding: 8,
  textAlign: 'center',
});

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${1 + sortedCardSymbols.length}, 1fr)`,
};

export type OptimalActionsMatrixProps = {
  strategy: StrategyByFirstCard;
};

export const OptimalActionsMatrix: React.FC<OptimalActionsMatrixProps> = props => {
  const { t } = useTranslation();

  /** The player hands do not depend on the dealer card, so any breakdown entry can define the rows */
  const [firstBreakdown] = Object.values(props.strategy.breakdown);
  const playerHands = firstBreakdown ? getActionableHands(firstBreakdown.resolvedHandsList) : [];

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr style={rowStyle}>
          <td style={getCellStyle(true)}>{t('commons.hand')}</td>
          {sortedCardSymbols.map(cardSymbol => (
            <td key={cardSymbol} style={getCellStyle(true)}>
              {cardSymbol}
            </td>
          ))}
        </tr>
      </thead>

      <tbody>
        {playerHands.map(playerHand => (
          <tr key={playerHand.label} style={rowStyle}>
            <td style={getCellStyle(true)}>{playerHand.label}</td>
            {sortedCardSymbols.map(cardSymbol => {
              const resolvedHand =
                props.strategy.breakdown[cardSymbol]?.resolvedHandsMap[playerHand.label];

              return (
                <td key={cardSymbol} style={getCellStyle(false)}>
                  {resolvedHand ? t(`actions.${resolvedHand.action}`) : '-'}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
