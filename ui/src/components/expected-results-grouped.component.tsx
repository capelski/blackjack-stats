import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { getSortedNumericKeys, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { lose, push, win } from '../models/result.model';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { ExpectedResult } from '../types/expected-result.type';
import { BetMultipliersCell } from './bet-multipliers-cell.component';

type ExpectedResultsGroupedRowProps =
  | {
      expectedResult?: undefined;
      isHeader: true;
    }
  | {
      expectedResult: ExpectedResult;
      isHeader?: false;
    };

const ExpectedResultsGroupedRow: React.FC<ExpectedResultsGroupedRowProps> = props => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();

  const cellStyle: CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : undefined,
    padding: 8,
    textAlign: 'center',
  };

  return (
    <tr
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
      }}
    >
      <td style={cellStyle}>
        {props.expectedResult
          ? effectiveScoreToLabel(props.expectedResult.score)
          : t('commons.score')}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(win)) }}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.outcomesByBetMultiplier.win}
            transform={number => toPercentage(number, decimals)}
          />
        ) : (
          t('commons.win')
        )}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(push)) }}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.outcomesByBetMultiplier.push}
            transform={number => toPercentage(number, decimals)}
          />
        ) : (
          t('commons.push')
        )}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(lose)) }}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.outcomesByBetMultiplier.lose}
            transform={number => toPercentage(number, decimals)}
          />
        ) : (
          t('commons.lose')
        )}
      </td>

      <td style={cellStyle}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.probabilityByBetMultiplier}
            transform={number => toPercentage(number, decimals)}
          />
        ) : (
          t('commons.total')
        )}
      </td>
    </tr>
  );
};

export const ExpectedResultsGrouped: React.FC = () => {
  const { strategy } = useStrategyContext();

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <ExpectedResultsGroupedRow isHeader={true} />
      </thead>

      <tbody>
        {getSortedNumericKeys(strategy.expectedResults.breakdown).map(playerScore => {
          return (
            <ExpectedResultsGroupedRow
              key={playerScore}
              expectedResult={strategy.expectedResults.breakdown[playerScore]}
            />
          );
        })}
      </tbody>
    </table>
  );
};
