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
  const keys = getSortedNumericKeys(props.map).filter(
    betMultiplier => props.map[betMultiplier] > 0,
  );

  return (
    <React.Fragment>
      {keys.length > 0
        ? keys.map(betMultiplier => {
            const betMultiplierProbability = props.map[betMultiplier];
            const transformedValue = toPercentage(betMultiplierProbability, decimals);

            // The "BJ" multiplier is skipped in tables where the Blackjacks are grouped separately
            const omitBlackjackMultiplierLabel = keys.length === 1;
            const displayValue =
              betMultiplier === 1 ||
              (betMultiplier === blackjackMultiplier && omitBlackjackMultiplierLabel)
                ? transformedValue
                : betMultiplier === blackjackMultiplier
                ? `BJ: ${transformedValue}`
                : `${betMultiplier}x: ${transformedValue}`;

            return <div key={betMultiplier}>{displayValue}</div>;
          })
        : '-'}
    </React.Fragment>
  );
};
