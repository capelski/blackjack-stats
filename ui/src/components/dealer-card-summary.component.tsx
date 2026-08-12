import React from 'react';
import { useDealerCardContext } from '../dealer-card.context';
import { ExpectedResultsSummary } from './expected-results-summary.component';
import { LoadingOverlay } from './loading-overlay.component';
import { OptimalActionsMatrix } from './optimal-actions-matrix.component';

export const DealerCardSummary: React.FC = () => {
  const { computing, strategy } = useDealerCardContext();

  return (
    <LoadingOverlay loading={computing || !strategy}>
      {strategy && (
        <React.Fragment>
          <ExpectedResultsSummary expectedResults={strategy.expectedResults} />
          <OptimalActionsMatrix strategy={strategy} />
        </React.Fragment>
      )}
    </LoadingOverlay>
  );
};
