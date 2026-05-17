import { useTranslation } from 'react-i18next';
import { getRoi } from '../logic/edge.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { lose, push, Result, win } from '../models/result.model';
import { useStrategyContext } from '../strategy.context';

type ExpectedResultsSummaryCardProps = {
  discriminator: Result | 'roi';
  value: string;
};

const ExpectedResultsSummaryCard: React.FC<ExpectedResultsSummaryCardProps> = props => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        ...(resultToStyles(props.discriminator as Result) ?? { border: '1px solid #ccc' }),
        textAlign: 'center',
        margin: 8,
        borderRadius: '0.5rem',
      }}
    >
      <h3>{t(`commons.${props.discriminator}`)}</h3>
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
        discriminator={win}
        value={toPercentage(strategy.expectedResults.outcomes.win)}
      />
      <ExpectedResultsSummaryCard
        discriminator={push}
        value={toPercentage(strategy.expectedResults.outcomes.push)}
      />
      <ExpectedResultsSummaryCard
        discriminator={lose}
        value={toPercentage(strategy.expectedResults.outcomes.lose)}
      />
      <ExpectedResultsSummaryCard
        discriminator="roi"
        value={toDecimal(getRoi(strategy.expectedResults.edge), 4)}
      />
    </div>
  );
};
