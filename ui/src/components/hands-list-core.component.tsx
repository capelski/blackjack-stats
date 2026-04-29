import React, { useEffect, useMemo, useState } from 'react';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { HandWithAction } from '../types/hand.type';
import { HandsListItem, HandsListProps } from './hands-list-item.component';

const pageSize = 50;

export type HandsListCoreProps = HandsListProps & {
  hands: HandWithAction[];
  nonFinalHandsControl?: boolean;
};

export const HandsListCore: React.FC<HandsListCoreProps> = props => {
  const [cardsFilter, setCardsFilter] = useState('');
  const [showNonFinalHands, setShowNonFinalHands] = useState(false);
  const [page, setPage] = useState(1);

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

      const symbols = hand.cards.map(card => card.symbol).join(',');
      return symbols.includes(normalizedFilter);
    });
  }, [cardsFilter, props.hands, showNonFinalHands]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [cardsFilter, showNonFinalHands]);

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
          type="text"
          value={cardsFilter}
          onChange={event => setCardsFilter(event.target.value)}
          placeholder="Example: A,A"
          style={{ marginLeft: 8 }}
        />
        {props.nonFinalHandsControl && (
          <React.Fragment>
            <input
              type="checkbox"
              checked={showNonFinalHands}
              onChange={event => setShowNonFinalHands(event.target.checked)}
              style={{ marginLeft: 16 }}
            />
            <span>Non-final hands</span>
          </React.Fragment>
        )}
      </p>

      <p>Number of hands: {filteredHands.length}</p>

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

      {paginatedHands.map((hand, index) => (
        <HandsListItem
          {...props}
          key={`${currentPage}-${index}-${hand.label}`}
          action={hand.action}
          betMultiplier={toDecimal(hand.betMultiplier)}
          cards={hand.cards.map(card => card.symbol).join(', ')}
          label={hand.label}
          probability={toPercentage(hand.probability)}
        ></HandsListItem>
      ))}
    </div>
  );
};
