import { useTranslation } from 'react-i18next';
import { getRoi } from '../logic/edge.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { getActionableResolvedHands } from '../logic/resolved-hands.logic';
import { useStrategyContext } from '../strategy.context';
import { ResolvedHandsListItem } from './resolved-hands-list-item.component';

export const ResolvedHandsList: React.FC = () => {
  const { t } = useTranslation();
  const { strategy } = useStrategyContext();
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
                roi: t('commons.roi'),
              },
            ]}
            decision={t('commons.decision')}
            isHeader={true}
            score={t('commons.score')}
          />
        </thead>

        <tbody>
          {actionableResolvedHands.map(resolvedHand => {
            const consequences = Object.values(resolvedHand.consequences);

            return (
              <ResolvedHandsListItem
                actionRows={consequences.map(consequence => ({
                  action: consequence.action,
                  win: toPercentage(consequence.outcomes.win),
                  lose: toPercentage(consequence.outcomes.lose),
                  push: toPercentage(consequence.outcomes.push),
                  roi: toDecimal(getRoi(consequence.edge), 4),
                }))}
                decision={resolvedHand.action}
                key={resolvedHand.label}
                optimalDecision={resolvedHand.optimalConsequence.action}
                score={resolvedHand.label}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
