import { getRoi } from '../logic/edge.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { Result } from '../models/result.model';
import { useStrategyContext } from '../strategy.context';

type ExpectedResultsSummaryCardProps = {
  title: 'Win' | 'Push' | 'Lose' | 'ROI';
  value: string;
};

const ExpectedResultsSummaryCard: React.FC<ExpectedResultsSummaryCardProps> = props => {
  return (
    <div
      style={{
        ...(resultToStyles(props.title as Result) ?? { border: '1px solid #ccc' }),
        textAlign: 'center',
        margin: 8,
        borderRadius: '0.5rem',
      }}
    >
      <h3>{props.title}</h3>
      <p>{props.value}</p>
    </div>
  );
};

export const ExpectedResultsSummary: React.FC = () => {
  const { strategy } = useStrategyContext();

  return (
    <div
      className="expected-summary"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}
    >
      <ExpectedResultsSummaryCard
        title="Win"
        value={toPercentage(strategy.expectedResults.outcomes.win)}
      />
      <ExpectedResultsSummaryCard
        title="Push"
        value={toPercentage(strategy.expectedResults.outcomes.push)}
      />
      <ExpectedResultsSummaryCard
        title="Lose"
        value={toPercentage(strategy.expectedResults.outcomes.lose)}
      />
      <ExpectedResultsSummaryCard
        title="ROI"
        value={toDecimal(getRoi(strategy.expectedResults.edge), 4)}
      />
    </div>
  );
};
