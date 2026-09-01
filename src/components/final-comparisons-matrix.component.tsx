import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { getBetMultiplierLabel } from '../logic/bet-multiplier.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { push, surrender, win } from '../models/result.model';
import { matrixModeParamName, useSearchParamsUtils } from '../search-params-utils';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { FinalScore, FinalScoreBase } from '../types/final-score.type';

const probability = 'probability';
const result = 'result';
type MatrixMode = typeof probability | typeof result;
const modes: MatrixMode[] = [probability, result];

const getCellProps = (isHeader: boolean): CSSProperties => {
  const cellStyle: CSSProperties = {
    fontWeight: isHeader ? 'bold' : undefined,
    padding: 8,
    textAlign: 'center',
  };
  return cellStyle;
};

const getColumnsNumber = (
  mode: MatrixMode,
  dealerScoresCount: number,
  displayBetMultiplier: boolean,
): { dealerColumns: number; playerColumns: number; totalColumns: number } => {
  const playerColumns = 1 + +displayBetMultiplier;
  const totalColumns = playerColumns + dealerScoresCount + (mode === probability ? 1 : 0);
  const dealerColumns = totalColumns - playerColumns;

  return { dealerColumns, playerColumns, totalColumns };
};

/** The result of a comparison doesn't depend on the bet multiplier;
 * each score is only listed once in the result matrix */
const getApplicableScores = (mode: MatrixMode, finalScores: FinalScore[]): FinalScore[] => {
  return mode === probability
    ? finalScores
    : finalScores.filter(
        (finalScore, index) =>
          finalScores.findIndex((item) => item.score === finalScore.score) === index,
      );
};

type FinalComparisonsMatrixRowProps = {
  betMultiplier: string;
  columnsNumber: number;
  displayBetMultiplier: boolean;
  dealerScores: FinalScoreBase[];
  dealerScoreToCell: (dealerScore: FinalScoreBase) => {
    node: React.ReactNode;
    style?: CSSProperties;
  };
  hideScore?: boolean;
  isHeader?: boolean;
  mode: MatrixMode;
  score: string;
  total: string;
};

const FinalComparisonsMatrixRow: React.FC<FinalComparisonsMatrixRowProps> = (props) => {
  const cellStyle: CSSProperties = getCellProps(!!props.isHeader);

  return (
    <tr
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columnsNumber}, 1fr)`,
      }}
    >
      <td style={cellStyle}>{!props.hideScore && props.score}</td>

      {props.displayBetMultiplier && <td style={cellStyle}>{props.betMultiplier}</td>}

      {props.dealerScores.map((dealerScore) => {
        const { node, style } = props.dealerScoreToCell(dealerScore);
        return (
          <td style={{ ...cellStyle, ...style }} key={dealerScore.id}>
            {node}
          </td>
        );
      })}

      {props.mode === probability && <td style={cellStyle}>{props.total}</td>}
    </tr>
  );
};

export const FinalComparisonsMatrix: React.FC = () => {
  const { t } = useTranslation();
  const { useUrlState } = useSearchParamsUtils();
  const { decimals } = useSettingsContext();
  const { showBetMultiplier, strategy } = useStrategyContext();

  const [mode, toggleMode] = useUrlState(matrixModeParamName, probability, modes);

  const displayBetMultiplier = mode === probability && showBetMultiplier;
  const playerScores = getApplicableScores(mode, strategy.finalScores);
  const { dealerColumns, playerColumns, totalColumns } = getColumnsNumber(
    mode,
    strategy.dealerScores.length,
    displayBetMultiplier,
  );

  return (
    <div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr
            style={{
              display: 'grid',
              gridTemplateColumns: `${playerColumns}fr ${dealerColumns}fr`,
            }}
          >
            <td style={getCellProps(true)}>{t('commons.player')}</td>
            <td style={getCellProps(true)}>{t('commons.dealer')}</td>
          </tr>

          <FinalComparisonsMatrixRow
            betMultiplier={t('commons.betMultiplier')}
            columnsNumber={totalColumns}
            dealerScores={strategy.dealerScores}
            dealerScoreToCell={(dealerScore) => ({
              node: effectiveScoreToLabel(dealerScore.score),
            })}
            displayBetMultiplier={displayBetMultiplier}
            isHeader={true}
            mode={mode}
            score={t('commons.score')}
            total={t('commons.total')}
          />
        </thead>

        <tbody>
          {playerScores.map((playerScore, index) => {
            const expectedResult = strategy.expectedResults.breakdown[playerScore.id];
            const isSameAsPrevious =
              index > 0 && playerScores[index - 1].score === playerScore.score;

            return (
              <FinalComparisonsMatrixRow
                betMultiplier={getBetMultiplierLabel(playerScore.betMultiplier)}
                columnsNumber={totalColumns}
                dealerScores={strategy.dealerScores}
                dealerScoreToCell={(dealerScore) => {
                  const finalComparison = expectedResult.finalComparisons[dealerScore.id];

                  return mode === probability
                    ? {
                        style: resultToStyles(finalComparison.result),
                        node: toPercentage(finalComparison.probability, decimals),
                      }
                    : {
                        node:
                          finalComparison.result === win
                            ? '🟢'
                            : finalComparison.result === push
                              ? '🟡'
                              : finalComparison.result === surrender
                                ? '🏳️'
                                : '🔴',
                      };
                }}
                displayBetMultiplier={displayBetMultiplier}
                hideScore={isSameAsPrevious}
                key={playerScore.id}
                mode={mode}
                score={effectiveScoreToLabel(playerScore.score)}
                total={toPercentage(playerScore.probability, decimals)}
              />
            );
          })}

          {mode === probability && (
            <FinalComparisonsMatrixRow
              betMultiplier=""
              columnsNumber={totalColumns}
              dealerScores={strategy.dealerScores}
              dealerScoreToCell={(dealerScore) => ({
                node: toPercentage(dealerScore.probability, decimals),
              })}
              displayBetMultiplier={displayBetMultiplier}
              mode={mode}
              score={t('commons.total')}
              total={toPercentage(strategy.expectedResults.probability, decimals)}
            />
          )}
        </tbody>
      </table>

      <select value={mode} onChange={(e) => toggleMode(e.target.value as MatrixMode)}>
        <option value={result}>{t(`commons.${result}`)}</option>
        <option value={probability}>{t(`commons.${probability}`)}</option>
      </select>
    </div>
  );
};
