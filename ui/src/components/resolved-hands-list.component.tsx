import { useTranslation } from 'react-i18next';
import { toPercentage } from '../logic/numbers.logic';
import { getActionableResolvedHands } from '../logic/resolved-hands.logic';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { BetMultipliersCell } from './bet-multipliers-cell.component';
import { ResolvedHandsListItem } from './resolved-hands-list-item.component';

export const ResolvedHandsList: React.FC = () => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { decisionOverrides, onDecisionOverride, strategy } = useStrategyContext();
  const actionableResolvedHands = getActionableResolvedHands(strategy.resolvedHands);

  return (
    <div className="hand-actions-list">
      <table style={{ width: '100%' }}>
        <thead>
          <ResolvedHandsListItem
            actionRows={[
              {
                action: t('commons.action'),
                win: t('commons.win'),
                lose: t('commons.lose'),
                push: t('commons.push'),
                edge: t('commons.edge'),
              },
            ]}
            decision={t('commons.decision')}
            isHeader={true}
            label={t('commons.hand')}
          />
        </thead>

        <tbody>
          {actionableResolvedHands.map(resolvedHand => {
            const consequences = Object.values(resolvedHand.consequences);
            const selectedDecision = decisionOverrides[resolvedHand.label] ?? resolvedHand.action;

            return (
              <ResolvedHandsListItem
                actionRows={consequences.map(consequence => ({
                  action: consequence.action,
                  edge: toPercentage(consequence.edge, decimals),
                  lose: <BetMultipliersCell map={consequence.outcomesByBetMultiplier.lose} />,
                  push: <BetMultipliersCell map={consequence.outcomesByBetMultiplier.push} />,
                  win: <BetMultipliersCell map={consequence.outcomesByBetMultiplier.win} />,
                }))}
                decision={selectedDecision}
                key={resolvedHand.label}
                onDecisionOverride={onDecisionOverride}
                optimalDecision={resolvedHand.optimalConsequence.action}
                label={resolvedHand.label}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
