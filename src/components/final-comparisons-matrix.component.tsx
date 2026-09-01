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

/** Number of columns displayed before the dealer scores */
const getPlayerColumnsNumber = (mode: MatrixMode, showBetMultiplier: boolean): number => {
  return 1 + (mode === probability && showBetMultiplier ? 1 : 0);
};

const getColumnsNumber = (
  mode: MatrixMode,
  dealerScoresCount: number,
  showBetMultiplier: boolean,
): number => {
  return (
    getPlayerColumnsNumber(mode, showBetMultiplier) +
    dealerScoresCount +
    (mode === probability ? 1 : 0)
  );
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
  const { showBetMultiplier } = useStrategyContext();
  const cellStyle: CSSProperties = getCellProps(!!props.isHeader);
  const displayBetMultiplier = props.mode === probability && showBetMultiplier;

  return (
    <tr
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getColumnsNumber(
          props.mode,
          props.dealerScores.length,
          showBetMultiplier,
        )}, 1fr)`,
      }}
    >
      <td style={cellStyle}>{!props.hideScore && props.score}</td>

      {displayBetMultiplier && <td style={cellStyle}>{props.betMultiplier}</td>}

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

  const playerScores = getApplicableScores(mode, strategy.finalScores);
  const playerColumnsNumber = getPlayerColumnsNumber(mode, showBetMultiplier);
  const columnsNumber = getColumnsNumber(mode, strategy.dealerScores.length, showBetMultiplier);

  return (
    <div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr
            style={{
              display: 'grid',
              gridTemplateColumns: `${playerColumnsNumber}fr ${
                columnsNumber - playerColumnsNumber
              }fr`,
            }}
          >
            <td style={getCellProps(true)}>{t('commons.player')}</td>
            <td style={getCellProps(true)}>{t('commons.dealer')}</td>
          </tr>

          <FinalComparisonsMatrixRow
            betMultiplier={t('commons.betMultiplier')}
            dealerScores={strategy.dealerScores}
            dealerScoreToCell={(dealerScore) => ({
              node: effectiveScoreToLabel(dealerScore.score),
            })}
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
              dealerScores={strategy.dealerScores}
              dealerScoreToCell={(dealerScore) => ({
                node: toPercentage(dealerScore.probability, decimals),
              })}
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
