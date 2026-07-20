import React from 'react';
import { blackjackMultiplier } from '../logic/bet-multiplier.logic';
import { getSortedNumericKeys, toPercentage } from '../logic/numbers.logic';
import { useSettingsContext } from '../settings.context';
import { BetMultiplierMap } from '../types/bet-multiplier.type';

export type BetMultipliersCellProps = {
  map: BetMultiplierMap;
};

export const BetMultipliersCell: React.FC<BetMultipliersCellProps> = props => {
  const { decimals } = useSettingsContext();
  const keys = getSortedNumericKeys(props.map);

  return (
    <React.Fragment>
      {keys.map(betMultiplier => {
        const betMultiplierProbability = props.map[betMultiplier];
        const transformedValue = toPercentage(betMultiplierProbability, decimals);

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
