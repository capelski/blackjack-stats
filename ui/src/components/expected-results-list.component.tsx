import React, { CSSProperties } from 'react';
import { getRoi } from '../logic/edge.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { getSortedNumericKeys, toDecimal, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { useStrategyContext } from '../strategy.context';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { Outcomes } from '../types/outcomes.type';
import { BetMultipliersCell } from './bet-multipliers-cell.component';

type ExpectedResultsListRowProps = {
  score: string;
} & (
  | {
      edgeByBetMultiplier?: undefined;
      isHeader: true;
      probabilityByBetMultiplier?: undefined;
    }
  | {
      edgeByBetMultiplier: BetMultiplierMap;
      isHeader?: false;
      outcomes: Outcomes;
      probability: number;
      probabilityByBetMultiplier: BetMultiplierMap;
    }
);

const ExpectedResultsListRow: React.FC<ExpectedResultsListRowProps> = props => {
  const cellStyle: CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : undefined,
    padding: 8,
    textAlign: 'center',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
      }}
    >
      <div style={cellStyle}>{props.score}</div>

      <div style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles('Win')) }}>
        {props.probabilityByBetMultiplier ? (
          <BetMultipliersCell
            betMultiplierMap={props.probabilityByBetMultiplier}
            transform={number => toPercentage(number * props.outcomes.win)}
          />
        ) : (
          '% Win'
        )}
      </div>

      <div style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles('Push')) }}>
        {props.probabilityByBetMultiplier ? (
          <BetMultipliersCell
            betMultiplierMap={props.probabilityByBetMultiplier}
            transform={number => toPercentage(number * props.outcomes.push)}
          />
        ) : (
          '% Push'
        )}
      </div>

      <div style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles('Lose')) }}>
        {props.probabilityByBetMultiplier ? (
          <BetMultipliersCell
            betMultiplierMap={props.probabilityByBetMultiplier}
            transform={number => toPercentage(number * props.outcomes.lose)}
          />
        ) : (
          '% Lose'
        )}
      </div>

      <div style={cellStyle}>
        {props.edgeByBetMultiplier ? (
          <BetMultipliersCell
            betMultiplierMap={props.edgeByBetMultiplier}
            transform={number => toDecimal(getRoi(number / props.probability))}
          />
        ) : (
          'ROI'
        )}
      </div>
    </div>
  );
};

export const ExpectedResultsList: React.FC = () => {
  const { expectedResults } = useStrategyContext();

  return (
    <div>
      <ExpectedResultsListRow isHeader={true} score="Score" />

      {getSortedNumericKeys(expectedResults.breakdown).map(playerScore => {
        const {
          outcomes,
          probability,
          probabilityByBetMultiplier,
          edgeByBetMultiplier,
        } = expectedResults.breakdown[playerScore];

        return (
          <ExpectedResultsListRow
            key={playerScore}
            outcomes={outcomes}
            probability={probability}
            probabilityByBetMultiplier={probabilityByBetMultiplier}
            score={effectiveScoreToLabel(playerScore)}
            edgeByBetMultiplier={edgeByBetMultiplier}
          />
        );
      })}
    </div>
  );
};
