import React, { useMemo, useState } from 'react';
import { scoresToLabel } from '../logic/labels.logic';
import { serializeCards } from '../logic/material-hands.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { useStrategyContext } from '../strategy.context';
import { MaterialHand } from '../types/material-hand.type';
import { HandsListItem, HandsListProps } from './material-hands-list-item.component';

const pageSize = 50;

export type MaterialHandsListCoreProps = HandsListProps & {
  hands: MaterialHand[];
  nonFinalHandsControl?: boolean;
};

export const MaterialHandsListCore: React.FC<MaterialHandsListCoreProps> = props => {
  const { computing } = useStrategyContext();

  const [cardsFilter, setCardsFilter] = useState('');
  const [showNonFinalHands, setShowNonFinalHands] = useState(false);
  const [page, setPage] = useState(1);

  const updateCardsFilter = (value: string) => {
    setCardsFilter(value);
    setPage(1);
  };

  const updateShowNonFinalHands = (value: boolean) => {
    setShowNonFinalHands(value);
    setPage(1);
  };

  const filteredHands = useMemo(() => {
    const normalizedFilter = cardsFilter
      .trim()
      .toUpperCase()
      .replaceAll(' ', '');

    return props.hands.filter(hand => {
      if (!showNonFinalHands && !hand.isFinal) {
        return false;
      }

      if (!normalizedFilter) {
        return true;
      }

      const symbols = serializeCards(hand);
      return symbols.includes(normalizedFilter);
    });
  }, [cardsFilter, props.hands, showNonFinalHands]);

  const pages = Math.max(1, Math.ceil(filteredHands.length / pageSize));
  const currentPage = Math.min(page, pages);
  const paginatedHands = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHands.slice(start, start + pageSize);
  }, [currentPage, filteredHands]);

  return (
    <div className="hands-list">
      <p>
        Cards filter
        <input
          disabled={computing}
          type="text"
          value={cardsFilter}
          onChange={event => updateCardsFilter(event.target.value)}
          placeholder="Example: A,A"
          style={{ marginLeft: 8 }}
        />
        {props.nonFinalHandsControl && (
          <React.Fragment>
            <input
              type="checkbox"
              checked={showNonFinalHands}
              onChange={event => updateShowNonFinalHands(event.target.checked)}
              style={{ marginLeft: 16 }}
              disabled={computing}
            />
            <span>Non-final hands</span>
          </React.Fragment>
        )}
      </p>

      <p>Number of hands: {filteredHands.length}</p>

      <p>
        <button disabled={computing || currentPage === 1} onClick={() => setPage(currentPage - 1)}>
          Previous
        </button>
        <span style={{ margin: '0 12px' }}>
          Page {currentPage} of {pages}
        </span>
        <button
          disabled={computing || currentPage === pages}
          onClick={() => setPage(currentPage + 1)}
        >
          Next
        </button>
      </p>

      <table style={{ width: '100%' }}>
        <thead>
          <HandsListItem
            {...props}
            action="Action"
            betMultiplier="Bet multiplier"
            cards="Cards"
            isHeader={true}
            probability="Probability"
            score="Score"
          />
        </thead>

        <tbody>
          {paginatedHands.map((hand, index) => (
            <HandsListItem
              {...props}
              key={`${currentPage}-${index}-${hand.label}`}
              action={hand.action}
              betMultiplier={toDecimal(hand.betMultiplier)}
              cards={serializeCards(hand, ', ')}
              probability={toPercentage(hand.probability)}
              score={scoresToLabel(hand.scores)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
