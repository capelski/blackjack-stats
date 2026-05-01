import { getRoi } from '../logic/edge.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { getResolvedHandsForDisplay } from '../logic/resolved-hands.logic';
import { useStrategyContext } from '../strategy.context';
import { ResolvedHandsListItem } from './resolved-hands-list-item.component';

export const ResolvedHandsList: React.FC = () => {
  const { resolvedHands } = useStrategyContext();
  const resolvedHandsForDisplay = getResolvedHandsForDisplay(resolvedHands);

  return (
    <div className="hand-actions-list">
      <ResolvedHandsListItem
        actionRows={[{ action: 'Action', win: 'Win', lose: 'Lose', push: 'Push', roi: 'Roi' }]}
        decision="Decision"
        isHeader={true}
        score="Score"
      />

      {resolvedHandsForDisplay.map(resolvedHand => {
        const consequences = Object.values(resolvedHand.consequences);

        return (
          <ResolvedHandsListItem
            actionRows={consequences.map(consequence => ({
              action: consequence.action,
              win: toPercentage(consequence.outcomes.win),
              lose: toPercentage(consequence.outcomes.lose),
              push: toPercentage(consequence.outcomes.push),
              roi: toDecimal(getRoi(consequence.edge)),
            }))}
            decision={resolvedHand.action}
            isDecisionOptimal={resolvedHand.action === resolvedHand.optimalConsequence.action}
            key={resolvedHand.label}
            score={resolvedHand.label}
          />
        );
      })}
    </div>
  );
};
