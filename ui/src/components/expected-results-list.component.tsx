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

type ExpectedResultsListRowProps =
  | {
      expectedResult?: undefined;
      isHeader: true;
    }
  | {
      expectedResult: ExpectedResult;
      isHeader?: false;
    };

const ExpectedResultsListRow: React.FC<ExpectedResultsListRowProps> = props => {
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
            betMultiplierMap={props.expectedResult.probabilityByBetMultiplier}
            transform={number =>
              toPercentage(
                number * props.expectedResult.probability * props.expectedResult.outcomes.win,
                decimals,
              )
            }
          />
        ) : (
          t('commons.win')
        )}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(push)) }}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.probabilityByBetMultiplier}
            transform={number =>
              toPercentage(
                number * props.expectedResult.probability * props.expectedResult.outcomes.push,
                decimals,
              )
            }
          />
        ) : (
          t('commons.push')
        )}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(lose)) }}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.probabilityByBetMultiplier}
            transform={number =>
              toPercentage(
                number * props.expectedResult.probability * props.expectedResult.outcomes.lose,
                decimals,
              )
            }
          />
        ) : (
          t('commons.lose')
        )}
      </td>

      <td style={cellStyle}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.edgeByBetMultiplier}
            transform={number => toPercentage(number, decimals)}
          />
        ) : (
          t('commons.edge')
        )}
      </td>
    </tr>
  );
};

export const ExpectedResultsList: React.FC = () => {
  const { strategy } = useStrategyContext();

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <ExpectedResultsListRow isHeader={true} />
      </thead>

      <tbody>
        {getSortedNumericKeys(strategy.expectedResults.breakdown).map(playerScore => {
          return (
            <ExpectedResultsListRow
              key={playerScore}
              expectedResult={strategy.expectedResults.breakdown[playerScore]}
            />
          );
        })}
      </tbody>
    </table>
  );
};
