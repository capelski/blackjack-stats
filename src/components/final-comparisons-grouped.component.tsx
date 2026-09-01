import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { getBetMultiplierLabel } from '../logic/bet-multiplier.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { lose, push, Result, surrender, win } from '../models/result.model';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { ExpectedResult } from '../types/expected-result.type';

/** Probabilities that can't occur are displayed as a dash */
const toCellValue = (probability: number, decimals: number): string =>
  probability > 0 ? toPercentage(probability, decimals) : '-';

type FinalComparisonsGroupedRowProps = {
  isSurrenderingEnabled: boolean;
} & (
  | {
      betMultiplier?: undefined;
      expectedResult?: undefined;
      isHeader: true;
    }
  | {
      betMultiplier: number;
      expectedResult: ExpectedResult;
      hideScore?: boolean;
      isHeader?: false;
    }
);

const FinalComparisonsGroupedRow: React.FC<FinalComparisonsGroupedRowProps> = (props) => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { showBetMultiplier } = useStrategyContext();

  const cellStyle: CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : undefined,
    padding: 8,
    textAlign: 'center',
  };

  const getOutcomeCell = (outcomeResult: Result): React.ReactNode =>
    props.expectedResult
      ? toCellValue(props.expectedResult.outcomes[outcomeResult], decimals)
      : t(`commons.${outcomeResult}`);

  return (
    <tr
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${
          (showBetMultiplier ? 6 : 5) + (props.isSurrenderingEnabled ? 1 : 0)
        }, 1fr)`,
      }}
    >
      <td style={cellStyle}>
        {props.expectedResult
          ? !props.hideScore && effectiveScoreToLabel(props.expectedResult.score)
          : t('commons.score')}
      </td>

      {showBetMultiplier && (
        <td style={cellStyle}>
          {props.expectedResult
            ? getBetMultiplierLabel(props.expectedResult.betMultiplier)
            : t('commons.betMultiplier')}
        </td>
      )}

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(win)) }}>
        {getOutcomeCell(win)}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(push)) }}>
        {getOutcomeCell(push)}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(lose)) }}>
        {getOutcomeCell(lose)}
      </td>

      {props.isSurrenderingEnabled && (
        <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(surrender)) }}>
          {getOutcomeCell(surrender)}
        </td>
      )}

      <td style={cellStyle}>
        {props.expectedResult
          ? toCellValue(props.expectedResult.probability, decimals)
          : t('commons.total')}
      </td>
    </tr>
  );
};

export const FinalComparisonsGrouped: React.FC = () => {
  const { rules, strategy } = useStrategyContext();

  const surrenderingEnabled = !!rules.surrendering;

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <FinalComparisonsGroupedRow isHeader={true} isSurrenderingEnabled={surrenderingEnabled} />
      </thead>

      <tbody>
        {strategy.finalScores.map((playerScore, index) => {
          const isSameAsPrevious =
            index > 0 && strategy.finalScores[index - 1].score === playerScore.score;

          return (
            <FinalComparisonsGroupedRow
              betMultiplier={playerScore.betMultiplier}
              expectedResult={strategy.expectedResults.breakdown[playerScore.id]}
              isSurrenderingEnabled={surrenderingEnabled}
              hideScore={isSameAsPrevious}
              key={playerScore.id}
            />
          );
        })}
      </tbody>
    </table>
  );
};
