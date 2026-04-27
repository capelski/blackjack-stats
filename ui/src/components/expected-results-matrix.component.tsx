import React, { CSSProperties } from 'react';
import { blackjackMultiplier } from '../logic/bet-multiplier.logic';
import { dealerFinalScores } from '../logic/dealer-data.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { getSortedNumericKeys, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { useStrategyContext } from '../strategy.context';
import { FinalComparison } from '../types/final-comparison.type';
import { FinalScore } from '../types/final-score.type';

const getBetMultipliersCell = (finalComparison: FinalComparison): React.ReactNode => {
  return (
    <React.Fragment>
      {getSortedNumericKeys(finalComparison.probabilityByBetMultiplier).map(betMultiplier => {
        const betMultiplierProbability = finalComparison.probabilityByBetMultiplier[betMultiplier];

        return (
          <div key={betMultiplier} className="expected-cell-breakdown">
            {betMultiplier <= blackjackMultiplier
              ? toPercentage(betMultiplierProbability)
              : `${betMultiplier}x: ${toPercentage(betMultiplierProbability)}`}
          </div>
        );
      })}
    </React.Fragment>
  );
};

type ExpectedResultsMatrixRowProps = {
  firstCell: string;
  dealerScoreToCell: (dealerScore: FinalScore) => { node: React.ReactNode; style?: CSSProperties };
  lastCell: string;
  isHeader?: boolean;
};

const ExpectedResultsMatrixRow: React.FC<ExpectedResultsMatrixRowProps> = props => {
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
      <div style={cellStyle}>{props.firstCell}</div>
      {dealerFinalScores.map(dealerScore => {
        const { node, style } = props.dealerScoreToCell(dealerScore);
        return (
          <div style={{ ...cellStyle, ...style }} key={dealerScore.score}>
            {node}
          </div>
        );
      })}
      <div style={cellStyle}>{props.lastCell}</div>
    </div>
  );
};

export const ExpectedResultsMatrix: React.FC = () => {
  const { expectedResults } = useStrategyContext();

  return (
    <div>
      <ExpectedResultsMatrixRow
        firstCell="Player \ Dealer"
        dealerScoreToCell={dealerScore => ({ node: effectiveScoreToLabel(dealerScore.score) })}
        lastCell="Total"
        isHeader={true}
      />

      {getSortedNumericKeys(expectedResults.breakdown).map(playerScore => {
        const expectedResult = expectedResults.breakdown[playerScore];

        return (
          <ExpectedResultsMatrixRow
            key={playerScore}
            firstCell={effectiveScoreToLabel(playerScore)}
            dealerScoreToCell={dealerScore => {
              const finalComparison = expectedResult.finalComparisons[dealerScore.score];

              return {
                style: resultToStyles(finalComparison.result),
                node: getBetMultipliersCell(finalComparison),
              };
            }}
            lastCell={toPercentage(expectedResult.probability)}
          />
        );
      })}

      <ExpectedResultsMatrixRow
        firstCell="Total"
        dealerScoreToCell={dealerScore => ({ node: toPercentage(dealerScore.probability) })}
        lastCell={toPercentage(expectedResults.probability)}
      />
    </div>
  );
};
