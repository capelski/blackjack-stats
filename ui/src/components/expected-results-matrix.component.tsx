import React, { CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dealerFinalScores } from '../logic/dealer-data.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { getSortedNumericKeys, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { win } from '../models/result.model';
import { modeParamName, useSearchParamsUtils } from '../search-params-utils';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { FinalScore } from '../types/final-score.type';
import { BetMultipliersCell } from './bet-multipliers-cell.component';

const probability = 'probability';
const result = 'result';
type Mode = typeof probability | typeof result;

const getCellProps = (isHeader: boolean): CSSProperties => {
  const cellStyle: CSSProperties = {
    fontWeight: isHeader ? 'bold' : undefined,
    padding: 8,
    textAlign: 'center',
  };
  return cellStyle;
};

const getColumnsNumber = (mode: Mode): number => {
  return 1 + dealerFinalScores.length + (mode === probability ? 1 : 0);
};

type ExpectedResultsMatrixRowProps = {
  firstCell: React.ReactNode;
  dealerScoreToCell: (dealerScore: FinalScore) => { node: React.ReactNode; style?: CSSProperties };
  lastCell: React.ReactNode;
  mode: Mode;
  isHeader?: boolean;
};

const ExpectedResultsMatrixRow: React.FC<ExpectedResultsMatrixRowProps> = props => {
  const cellStyle: CSSProperties = getCellProps(!!props.isHeader);

  return (
    <tr
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getColumnsNumber(props.mode)}, 1fr)`,
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
      {props.mode === probability && <td style={cellStyle}>{props.lastCell}</td>}
    </tr>
  );
};

export const ExpectedResultsMatrix: React.FC = () => {
  const { t } = useTranslation();
  const { getParameter, toggleParameter } = useSearchParamsUtils();
  const { decimals } = useSettingsContext();
  const { strategy } = useStrategyContext();

  const [mode, setMode] = useState<Mode>(probability);

  const toggleMode = (nextMode: Mode) => {
    setMode(nextMode);
    toggleParameter(modeParamName, nextMode, probability);
  };

  useEffect(() => {
    const modeParam = getParameter(modeParamName, [probability, result]);
    if (modeParam && modeParam !== mode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(modeParam);
    }
  }, [getParameter, mode]);

  return (
    <div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr
            style={{
              display: 'grid',
              gridTemplateColumns: `1fr ${getColumnsNumber(mode) - 1}fr`,
            }}
          >
            <td style={getCellProps(true)}>{t('commons.player')}</td>
            <td style={getCellProps(true)}>{t('commons.dealer')}</td>
          </tr>

          <ExpectedResultsMatrixRow
            firstCell=""
            dealerScoreToCell={dealerScore => ({ node: effectiveScoreToLabel(dealerScore.score) })}
            lastCell={t('commons.total')}
            isHeader={true}
            mode={mode}
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

                  return mode === probability
                    ? {
                        style: resultToStyles(finalComparison.result),
                        node: (
                          <BetMultipliersCell map={finalComparison.probabilityByBetMultiplier} />
                        ),
                      }
                    : {
                        node:
                          finalComparison.result === win
                            ? '🟢'
                            : finalComparison.result === 'push'
                            ? '🟡'
                            : '🔴',
                      };
                }}
                lastCell={<BetMultipliersCell map={expectedResult.probabilityByBetMultiplier} />}
                mode={mode}
              />
            );
          })}

          {mode === probability && (
            <ExpectedResultsMatrixRow
              firstCell={t('commons.total')}
              dealerScoreToCell={dealerScore => ({
                node: toPercentage(dealerScore.probability, decimals),
              })}
              lastCell={toPercentage(strategy.expectedResults.probability, decimals)}
              mode={mode}
            />
          )}
        </tbody>
      </table>

      <select
        value={mode}
        onChange={e => toggleMode(e.target.value as typeof probability | typeof result)}
      >
        <option value={result}>{t(`commons.${result}`)}</option>
        <option value={probability}>{t(`commons.${probability}`)}</option>
      </select>
    </div>
  );
};
