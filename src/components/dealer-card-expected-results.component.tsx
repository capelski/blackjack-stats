import React from 'react';
import { useDealerCardContext } from '../dealer-card.context';
import { ExpectedResultsSummary } from './expected-results-summary.component';

export const DealerCardExpectedResults: React.FC = () => {
  const { rules, strategy } = useDealerCardContext();

  return (
    strategy && (
      <div className="expected-results">
        <ExpectedResultsSummary
          expectedResults={strategy.expectedResults}
          isSurrenderingEnabled={!!rules.surrendering}
        />
      </div>
    )
  );
};
