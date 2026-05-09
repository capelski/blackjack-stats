import { ExpectedResultsList } from './expected-results-list.component';
import { ExpectedResultsMatrix } from './expected-results-matrix.component';
import { ExpectedResultsSummary } from './expected-results-summary.component';

export const ExpectedResults: React.FC = () => {
  return (
    <div className="expected-results">
      <ExpectedResultsSummary />
      <ExpectedResultsMatrix />
      <ExpectedResultsList />
    </div>
  );
};
