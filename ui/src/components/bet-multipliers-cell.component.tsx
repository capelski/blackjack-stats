import React from 'react';
import { blackjackMultiplier } from '../logic/bet-multiplier.logic';
import { getSortedNumericKeys } from '../logic/numbers.logic';
import { BetMultiplierMap } from '../types/bet-multiplier.type';

export type BetMultipliersCellProps = {
  betMultiplierMap: BetMultiplierMap;
  transform: (value: number) => string;
};

export const BetMultipliersCell: React.FC<BetMultipliersCellProps> = props => {
  const keys = getSortedNumericKeys(props.betMultiplierMap);

  return (
    <React.Fragment>
      {keys.map(betMultiplier => {
        const betMultiplierProbability = props.betMultiplierMap[betMultiplier];
        const transformedValue = props.transform(betMultiplierProbability);

        return (
          <div key={betMultiplier}>
            {betMultiplier > blackjackMultiplier
              ? `${betMultiplier}x: ${transformedValue}`
              : betMultiplier === blackjackMultiplier && keys.length > 1
              ? `BJ: ${transformedValue}`
              : transformedValue}
          </div>
        );
      })}
    </React.Fragment>
  );
};
