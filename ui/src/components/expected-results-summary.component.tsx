import { useTranslation } from 'react-i18next';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { lose, push, Result, win } from '../models/result.model';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';

type ExpectedResultsSummaryCardProps = {
  discriminator: Result | 'edge';
  subtitle?: string;
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
      <p>
        {props.value}
        {props.subtitle && <div style={{ fontStyle: 'italic' }}>{props.subtitle}</div>}
      </p>
    </div>
  );
};

export const ExpectedResultsSummary: React.FC = () => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { strategy } = useStrategyContext();

  return (
    <div
      className="expected-summary"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}
    >
      <ExpectedResultsSummaryCard
        discriminator={win}
        value={toPercentage(strategy.expectedResults.outcomes.win, decimals)}
      />
      <ExpectedResultsSummaryCard
        discriminator={push}
        value={toPercentage(strategy.expectedResults.outcomes.push, decimals)}
      />
      <ExpectedResultsSummaryCard
        discriminator={lose}
        value={toPercentage(strategy.expectedResults.outcomes.lose, decimals)}
      />
      <ExpectedResultsSummaryCard
        discriminator="edge"
        subtitle={t('expectedResults.bankruptIn', {
          rounds: toDecimal(1 / -strategy.expectedResults.edge, decimals),
        })}
        value={toPercentage(strategy.expectedResults.edge, decimals)}
      />
    </div>
  );
};
