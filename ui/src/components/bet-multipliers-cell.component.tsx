import React from 'react';
import { blackjackMultiplier } from '../logic/bet-multiplier.logic';
import { getSortedNumericKeys } from '../logic/numbers.logic';
import { BetMultiplierMap } from '../types/bet-multiplier.type';

export type BetMultipliersCellProps = {
  betMultiplierMap: BetMultiplierMap;
  transform: (value: number) => string;
};

export const BetMultipliersCell: React.FC<BetMultipliersCellProps> = props => {
  return (
    <React.Fragment>
      {getSortedNumericKeys(props.betMultiplierMap).map(betMultiplier => {
        const betMultiplierProbability = props.betMultiplierMap[betMultiplier];
        const transformedValue = props.transform(betMultiplierProbability);

        return (
          <div key={betMultiplier}>
            {betMultiplier <= blackjackMultiplier
              ? transformedValue
              : `${betMultiplier}x: ${transformedValue}`}
          </div>
        );
      })}
    </React.Fragment>
  );
};
