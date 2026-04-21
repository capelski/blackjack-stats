import { useMemo, useState } from 'react';
import { getCombinationsList } from '../logic/combinations-list.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { useStrategyContext } from '../strategy.context';
import { CombinationsListProps, CombinationsListRow } from './combinations-list-row.component';

export const CombinationsList: React.FC<CombinationsListProps> = props => {
  const { handResolver } = useStrategyContext();
  const [cardsFilter, setCardsFilter] = useState('');

  const combinations = useMemo(() => getCombinationsList(handResolver), [handResolver]);
  const filteredCombinations = useMemo(() => {
    const normalizedFilter = cardsFilter
      .trim()
      .toUpperCase()
      .replaceAll(' ', '');

    if (!normalizedFilter) {
      return combinations;
    }

    return combinations.filter(combination => {
      const symbols = combination.cards.map(card => card.symbol).join(',');
      return symbols.includes(normalizedFilter);
    });
  }, [cardsFilter, combinations]);

  return (
    <div className="combination-list">
      <p style={{ display: 'block', marginBottom: '12px' }}>
        Cards filter
        <input
          type="text"
          value={cardsFilter}
          onChange={event => setCardsFilter(event.target.value)}
          placeholder="Example: A,A"
          style={{ marginLeft: 8 }}
        />
      </p>

      <p>
        Number of combinations: {filteredCombinations.length}
        {cardsFilter.trim() ? ` (out of ${combinations.length})` : ''}
      </p>

      <CombinationsListRow
        {...props}
        action="Action"
        betMultiplier="Bet multiplier"
        cards="Cards"
        isHeader={true}
        label="Score"
        probability="Probability"
      ></CombinationsListRow>

      {filteredCombinations.slice(0, 25).map((combination, index) => (
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
