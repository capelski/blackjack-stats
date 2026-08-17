import React from 'react';
import { useDealerCardContext } from '../dealer-card.context';
import { ExpectedResultsSummary } from './expected-results-summary.component';
import { OptimalActionsMatrix } from './optimal-actions-matrix.component';

export const DealerCardSummary: React.FC = () => {
  const { rules, strategy } = useDealerCardContext();

  return (
    strategy && (
      <React.Fragment>
        <ExpectedResultsSummary
          expectedResults={strategy.expectedResults}
          isSurrenderingEnabled={!!rules.surrendering}
        />
        <OptimalActionsMatrix rules={rules} strategy={strategy} />
      </React.Fragment>
    )
  );
};
