import React, { CSSProperties } from 'react';
import { dealerFinalScores } from '../logic/dealer-data.logic';
import { getRoi } from '../logic/edge.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { getSortedNumericKeys, toDecimal, toPercentage } from '../logic/numbers.logic';
import { useStrategyContext } from '../strategy.context';

type ExpectedResultsListRowProps = {
  isHeader?: boolean;
  lose: string;
  push: string;
  roi: string;
  score: string;
  win: string;
};

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
        gridTemplateColumns: `repeat(${dealerFinalScores.length + 2}, 1fr)`,
      }}
    >
      <div style={cellStyle}>{props.score}</div>

      <div style={cellStyle}>{props.win}</div>

      <div style={cellStyle}>{props.push}</div>

      <div style={cellStyle}>{props.lose}</div>

      <div style={cellStyle}>{props.roi}</div>
    </div>
  );
};

export const ExpectedResultsList: React.FC = () => {
  const { expectedResults } = useStrategyContext();

  return (
    <div>
      <ExpectedResultsListRow
        isHeader={true}
        lose="% Lose"
        push="% Push"
        score="Score"
        roi="ROI"
        win="% Win"
      />

      {getSortedNumericKeys(expectedResults.breakdown).map(playerScore => {
        const { outcomes, probability, edge } = expectedResults.breakdown[playerScore];

        return (
          <ExpectedResultsListRow
            key={playerScore}
            lose={toPercentage(outcomes.lose / probability)}
            push={toPercentage(outcomes.push / probability)}
            score={effectiveScoreToLabel(playerScore)}
            roi={toDecimal(getRoi(edge / probability))}
            win={toPercentage(outcomes.win / probability)}
          />
        );
      })}
    </div>
  );
};
