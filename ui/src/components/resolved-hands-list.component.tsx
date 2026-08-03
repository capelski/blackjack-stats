import { useTranslation } from 'react-i18next';
import { getActionableHands } from '../logic/abstract-hands.logic';
import { toPercentage } from '../logic/numbers.logic';
import { Action, double, hit, split, stand, surrender } from '../models/action.model';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { EdgeByActionMap, ResolvedHandsListItem } from './resolved-hands-list-item.component';

/** Actions in the order they are displayed as columns */
const actionColumns: Action[] = [stand, hit, double, split, surrender];

export const ResolvedHandsList: React.FC = () => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { decisionOverrides, onDecisionOverride, strategy } = useStrategyContext();
  const actionableResolvedHands = getActionableHands(strategy.resolvedHandsList);

  /** Actions that no hand allows (e.g. splitting, when the rule is disabled) don't get a column */
  const actions = actionColumns.filter(action =>
    actionableResolvedHands.some(resolvedHand => resolvedHand.consequences[action]),
  );

  return (
    <div className="hand-actions-list">
      <table style={{ width: '100%' }}>
        <thead>
          <ResolvedHandsListItem
            actions={actions}
            decision={t('commons.decision')}
            isHeader={true}
            label={t('commons.hand')}
          />
        </thead>

        <tbody>
          {actionableResolvedHands.map(resolvedHand => {
            const consequences = Object.values(resolvedHand.consequences);
            const selectedDecision = decisionOverrides[resolvedHand.label] ?? resolvedHand.action;

            const edgeByAction = consequences.reduce<EdgeByActionMap>((reduced, consequence) => {
              reduced[consequence.action] = toPercentage(consequence.edge, decimals);
              return reduced;
            }, {});

            return (
              <ResolvedHandsListItem
                actions={actions}
                decision={selectedDecision}
                edgeByAction={edgeByAction}
                key={resolvedHand.label}
                label={resolvedHand.label}
                onDecisionOverride={onDecisionOverride}
                optimalDecision={resolvedHand.optimalConsequence.action}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
