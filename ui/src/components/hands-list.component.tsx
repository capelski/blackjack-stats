import { useEffect, useMemo, useState } from 'react';
import { getCombinationsList } from '../logic/combinations-list.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { useStrategyContext } from '../strategy.context';
import { HandsListItem, HandsListProps } from './hands-list-item.component';

const pageSize = 50;

export const HandsList: React.FC<HandsListProps> = props => {
  const { handResolver } = useStrategyContext();
  const [cardsFilter, setCardsFilter] = useState('');
  const [finalHandsOnly, setFinalHandsOnly] = useState(false);
  const [page, setPage] = useState(1);

  const combinations = useMemo(() => getCombinationsList(handResolver), [handResolver]);
  const filteredCombinations = useMemo(() => {
    const normalizedFilter = cardsFilter
      .trim()
      .toUpperCase()
      .replaceAll(' ', '');

    return combinations.filter(combination => {
      if (finalHandsOnly && !combination.isFinal) {
        return false;
      }

      if (!normalizedFilter) {
        return true;
      }

      const symbols = combination.cards.map(card => card.symbol).join(',');
      return symbols.includes(normalizedFilter);
    });
  }, [cardsFilter, combinations, finalHandsOnly]);

  useEffect(() => {
    setPage(1);
  }, [cardsFilter, finalHandsOnly]);

  const pages = Math.max(1, Math.ceil(filteredCombinations.length / pageSize));
  const currentPage = Math.min(page, pages);
  const paginatedCombinations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCombinations.slice(start, start + pageSize);
  }, [currentPage, filteredCombinations]);

  return (
    <div className="combination-list">
      <p>
        Cards filter
        <input
          type="text"
          value={cardsFilter}
          onChange={event => setCardsFilter(event.target.value)}
          placeholder="Example: A,A"
          style={{ marginLeft: 8 }}
        />
        <input
          type="checkbox"
          checked={finalHandsOnly}
          onChange={event => setFinalHandsOnly(event.target.checked)}
          style={{ marginLeft: 16 }}
        />
        <span>Final hands only</span>
      </p>

      <p>
        Number of combinations: {filteredCombinations.length}
        {cardsFilter.trim() ? ` (out of ${combinations.length})` : ''}
      </p>

      <p>
        <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
          Previous
        </button>
        <span style={{ margin: '0 12px' }}>
          Page {currentPage} of {pages}
        </span>
        <button disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>
          Next
        </button>
      </p>

      <HandsListItem
        {...props}
        action="Action"
        betMultiplier="Bet multiplier"
        cards="Cards"
        isHeader={true}
        label="Score"
        probability="Probability"
      ></HandsListItem>

      {paginatedCombinations.map((combination, index) => (
        <HandsListItem
          {...props}
          key={`${currentPage}-${index}-${combination.label}`}
          action={combination.action}
          betMultiplier={toDecimal(combination.betMultiplier)}
          cards={combination.cards.map(card => card.symbol).join(', ')}
          label={combination.label}
          probability={toPercentage(combination.probability)}
        ></HandsListItem>
      ))}
    </div>
  );
};
