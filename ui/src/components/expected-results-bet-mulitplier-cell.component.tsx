import React from 'react';
import { blackjackMultiplier } from '../logic/bet-multiplier.logic';
import { getSortedNumericKeys, toPercentage } from '../logic/numbers.logic';
import { FinalComparison } from '../types/final-comparison.type';

export type BetMultipliersCellProps = {
  finalComparison: FinalComparison;
};

export const BetMultipliersCell: React.FC<BetMultipliersCellProps> = props => {
  const { probabilityByBetMultiplier } = props.finalComparison;
  return (
    <React.Fragment>
      {getSortedNumericKeys(probabilityByBetMultiplier).map(betMultiplier => {
        const betMultiplierProbability = probabilityByBetMultiplier[betMultiplier];

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
