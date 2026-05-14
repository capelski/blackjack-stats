import React, { CSSProperties } from 'react';
import { getRoi } from '../logic/edge.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { getSortedNumericKeys, toDecimal, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
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
        {props.expectedResult ? effectiveScoreToLabel(props.expectedResult.score) : 'Score'}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles('Win')) }}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.probabilityByBetMultiplier}
            transform={number =>
              toPercentage(
                number * props.expectedResult.probability * props.expectedResult.outcomes.win,
              )
            }
          />
        ) : (
          '% Win'
        )}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles('Push')) }}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.probabilityByBetMultiplier}
            transform={number =>
              toPercentage(
                number * props.expectedResult.probability * props.expectedResult.outcomes.push,
              )
            }
          />
        ) : (
          '% Push'
        )}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles('Lose')) }}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.probabilityByBetMultiplier}
            transform={number =>
              toPercentage(
                number * props.expectedResult.probability * props.expectedResult.outcomes.lose,
              )
            }
          />
        ) : (
          '% Lose'
        )}
      </td>

      <td style={cellStyle}>
        {props.expectedResult ? (
          <BetMultipliersCell
            betMultiplierMap={props.expectedResult.edgeByBetMultiplier}
            transform={number => toDecimal(getRoi(number), 4)}
          />
        ) : (
          'ROI'
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
