import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { resultToStyles } from '../logic/result.logic';
import { lose, push, Result, surrender, win } from '../models/result.model';
import { useSettingsContext } from '../settings.context';
import { ExpectedResults } from '../types/expected-result.type';
import { BetMultipliersCell } from './bet-multipliers-cell.component';
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
      <div style={{ marginBottom: 8, marginTop: 8 }}>{props.children}</div>
    </div>
  );
};

type ExpectedResultsSummaryProps = {
  expectedResults: Pick<ExpectedResults, 'edge' | 'outcomesByBetMultiplier'>;
  isSurrenderingEnabled: boolean;
};

export const ExpectedResultsSummary: React.FC<ExpectedResultsSummaryProps> = props => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { expectedResults, isSurrenderingEnabled } = props;

  return (
    <div
      className="expected-summary"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${4 + (isSurrenderingEnabled ? 1 : 0)}, 1fr)`,
      }}
    >
      <ExpectedResultsSummaryCard discriminator={win}>
        <BetMultipliersCell map={expectedResults.outcomesByBetMultiplier.win} />
      </ExpectedResultsSummaryCard>
      <ExpectedResultsSummaryCard discriminator={push}>
        <BetMultipliersCell map={expectedResults.outcomesByBetMultiplier.push} />
      </ExpectedResultsSummaryCard>
      <ExpectedResultsSummaryCard discriminator={lose}>
        <BetMultipliersCell map={expectedResults.outcomesByBetMultiplier.lose} />
      </ExpectedResultsSummaryCard>
      {isSurrenderingEnabled && (
        <ExpectedResultsSummaryCard discriminator={surrender}>
          <BetMultipliersCell map={expectedResults.outcomesByBetMultiplier.surrender} />
        </ExpectedResultsSummaryCard>
      )}
      <ExpectedResultsSummaryCard discriminator="edge">
        {toPercentage(expectedResults.edge, decimals)}
        <br />
        <i>
          {t('expectedResults.xRounds', {
            rounds: toDecimal(1 / -expectedResults.edge, decimals),
          })}{' '}
        </i>
        <ExpectedResultsSummaryModal edge={expectedResults.edge} />
      </ExpectedResultsSummaryCard>
    </div>
  );
};
