import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { lose, push, Result, win } from '../models/result.model';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { ExpectedResultsSummaryModal } from './expected-results-summary-modal.component';

type ExpectedResultsSummaryCardProps = PropsWithChildren<{
  discriminator: Result | 'edge';
}>;

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
      <p>{props.children}</p>
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
      <ExpectedResultsSummaryCard discriminator={win}>
        {toPercentage(strategy.expectedResults.outcomes.win, decimals)}
      </ExpectedResultsSummaryCard>
      <ExpectedResultsSummaryCard discriminator={push}>
        {toPercentage(strategy.expectedResults.outcomes.push, decimals)}
      </ExpectedResultsSummaryCard>
      <ExpectedResultsSummaryCard discriminator={lose}>
        {toPercentage(strategy.expectedResults.outcomes.lose, decimals)}
      </ExpectedResultsSummaryCard>
      <ExpectedResultsSummaryCard discriminator="edge">
        {toPercentage(strategy.expectedResults.edge, decimals)}
        <br />
        <i>
          {t('expectedResults.xRounds', {
            rounds: toDecimal(1 / -strategy.expectedResults.edge, decimals),
          })}{' '}
        </i>
        <ExpectedResultsSummaryModal edge={strategy.expectedResults.edge} />
      </ExpectedResultsSummaryCard>
    </div>
  );
};
