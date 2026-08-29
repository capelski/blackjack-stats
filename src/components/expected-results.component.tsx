import { useStrategyContext } from '../strategy.context';
import { ExpectedResultsSummary } from './expected-results-summary.component';

export const ExpectedResults: React.FC = () => {
  const { rules, strategy } = useStrategyContext();

  return (
    <div className="expected-results">
      <ExpectedResultsSummary
        expectedResults={strategy.expectedResults}
        isSurrenderingEnabled={!!rules.surrendering}
      />
    </div>
  );
};
