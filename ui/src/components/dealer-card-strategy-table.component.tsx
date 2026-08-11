import React from 'react';
import { useDealerCardContext } from '../dealer-card.context';
import { ExpectedResultsSummary } from './expected-results-summary.component';
import { OptimalActionsMatrix } from './optimal-actions-matrix.component';

export const DealerCardStrategyTable: React.FC = () => {
  const { computing, strategy } = useDealerCardContext();

  return (
    <div style={{ position: 'relative' }}>
      {(computing || !strategy) && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 100,
          }}
        >
          <h1>🔄</h1>
        </div>
      )}

      {strategy && (
        <React.Fragment>
          <ExpectedResultsSummary expectedResults={strategy.expectedResults} />
          <OptimalActionsMatrix strategy={strategy} />
        </React.Fragment>
      )}
    </div>
  );
};
