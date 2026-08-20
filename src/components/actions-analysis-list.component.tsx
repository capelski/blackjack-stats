import { useTranslation } from 'react-i18next';
import { getActionableHands } from '../logic/abstract-hands.logic';
import { toPercentage } from '../logic/numbers.logic';
import { sortedActions } from '../models/action.model';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { ActionsAnalysisListItem, EdgeByActionMap } from './actions-analysis-list-item.component';

export const ActionsAnalysisList: React.FC = () => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { onDecisionOverride, strategy } = useStrategyContext();
  const actionableResolvedHands = getActionableHands(strategy.resolvedHandsList);

  /** Actions that no hand allows (e.g. splitting, when the rule is disabled) don't get a column */
  const actions = sortedActions.filter(action =>
    actionableResolvedHands.some(resolvedHand => resolvedHand.consequences[action]),
  );

  return (
    <div className="hand-actions-list">
      <table style={{ width: '100%' }}>
        <thead>
          <ActionsAnalysisListItem
            actions={actions}
            action={t('commons.action')}
            isHeader={true}
            label={t('commons.hand')}
          />
        </thead>

        <tbody>
          {actionableResolvedHands.map(resolvedHand => {
            const consequences = Object.values(resolvedHand.consequences);
            const selectedDecision =
              strategy.decisionOverrides[resolvedHand.label] ?? resolvedHand.action;

            const edgeByAction = consequences.reduce<EdgeByActionMap>((reduced, consequence) => {
              reduced[consequence.action] = toPercentage(consequence.edge, decimals);
              return reduced;
            }, {});

            return (
              <ActionsAnalysisListItem
                actions={actions}
                action={selectedDecision}
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
