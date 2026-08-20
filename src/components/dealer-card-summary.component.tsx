import React from 'react';
import { useDealerCardContext } from '../dealer-card.context';
import { DealerCardMatrix } from './dealer-card-matrix.component';
import { ExpectedResultsSummary } from './expected-results-summary.component';

export const DealerCardSummary: React.FC = () => {
  const { rules, strategy } = useDealerCardContext();

  return (
    strategy && (
      <React.Fragment>
        <ExpectedResultsSummary
          expectedResults={strategy.expectedResults}
          isSurrenderingEnabled={!!rules.surrendering}
        />
        <DealerCardMatrix rules={rules} strategy={strategy} />
      </React.Fragment>
    )
  );
};
