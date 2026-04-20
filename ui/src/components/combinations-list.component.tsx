import { useMemo } from 'react';
import { getCombinationsList } from '../logic/combinations-list.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { useStrategyContext } from '../strategy.context';
import { CombinationsListProps, CombinationsListRow } from './combinations-list-row.component';

export const CombinationsList: React.FC<CombinationsListProps> = props => {
  const { handResolver } = useStrategyContext();

  const combinations = useMemo(() => getCombinationsList(handResolver), [handResolver]);

  return (
    <div className="combination-list">
      <p>Number of combinations: {combinations.length}</p>

      <CombinationsListRow
        {...props}
        action="Action"
        betMultiplier="Bet multiplier"
        cards="Cards"
        isHeader={true}
        label="Score"
        probability="Probability"
      ></CombinationsListRow>

      {combinations.slice(0, 25).map((combination, index) => (
        <CombinationsListRow
          {...props}
          key={index}
          action={combination.action}
          betMultiplier={toDecimal(combination.betMultiplier)}
          cards={combination.cards.map(card => card.symbol).join(', ')}
          label={combination.label}
          probability={toPercentage(combination.probability)}
        ></CombinationsListRow>
      ))}
    </div>
  );
};
