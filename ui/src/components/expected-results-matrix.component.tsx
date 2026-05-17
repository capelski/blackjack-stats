import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { dealerFinalScores } from '../logic/dealer-data.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { getSortedNumericKeys, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { useStrategyContext } from '../strategy.context';
import { FinalScore } from '../types/final-score.type';
import { BetMultipliersCell } from './bet-multipliers-cell.component';

type ExpectedResultsMatrixRowProps = {
  firstCell: React.ReactNode;
  dealerScoreToCell: (dealerScore: FinalScore) => { node: React.ReactNode; style?: CSSProperties };
  lastCell: React.ReactNode;
  isHeader?: boolean;
};

const ExpectedResultsMatrixRow: React.FC<ExpectedResultsMatrixRowProps> = props => {
  const cellStyle: CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : undefined,
    padding: 8,
    textAlign: 'center',
  };

  return (
    <tr
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${dealerFinalScores.length + 2}, 1fr)`,
      }}
    >
      <td style={cellStyle}>{props.firstCell}</td>
      {dealerFinalScores.map(dealerScore => {
        const { node, style } = props.dealerScoreToCell(dealerScore);
        return (
          <td style={{ ...cellStyle, ...style }} key={dealerScore.score}>
            {node}
          </td>
        );
      })}
      <td style={cellStyle}>{props.lastCell}</td>
    </tr>
  );
};

export const ExpectedResultsMatrix: React.FC = () => {
  const { t } = useTranslation();
  const { strategy } = useStrategyContext();

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <ExpectedResultsMatrixRow
          firstCell={`${t('commons.player')} \\ ${t('commons.dealer')}`}
          dealerScoreToCell={dealerScore => ({ node: effectiveScoreToLabel(dealerScore.score) })}
          lastCell={t('commons.total')}
          isHeader={true}
        />
      </thead>

      <tbody>
        {getSortedNumericKeys(strategy.expectedResults.breakdown).map(playerScore => {
          const expectedResult = strategy.expectedResults.breakdown[playerScore];

          return (
            <ExpectedResultsMatrixRow
              key={playerScore}
              firstCell={effectiveScoreToLabel(playerScore)}
              dealerScoreToCell={dealerScore => {
                const finalComparison = expectedResult.finalComparisons[dealerScore.score];

                return {
                  style: resultToStyles(finalComparison.result),
                  node: (
                    <BetMultipliersCell
                      betMultiplierMap={expectedResult.probabilityByBetMultiplier}
                      transform={value => toPercentage(value * finalComparison.probability)}
                    />
                  ),
                };
              }}
              lastCell={
                <BetMultipliersCell
                  betMultiplierMap={expectedResult.probabilityByBetMultiplier}
                  transform={value => toPercentage(value * expectedResult.probability)}
                />
              }
            />
          );
        })}

        <ExpectedResultsMatrixRow
          firstCell={t('commons.total')}
          dealerScoreToCell={dealerScore => ({ node: toPercentage(dealerScore.probability) })}
          lastCell={toPercentage(strategy.expectedResults.probability)}
        />
      </tbody>
    </table>
  );
};
