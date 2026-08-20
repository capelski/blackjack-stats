import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { playerLabelUrlParam } from '../../constants';
import { getActionableHands } from '../logic/abstract-hands.logic';
import { urlParamToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { loseColor, winColor } from '../logic/result.logic';
import { Action, sortedActions, stand, surrender } from '../models/action.model';
import { selectedActionParamName, useSearchParamsUtils } from '../search-params-utils';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { ResolvedHand } from '../types/resolved-hand.type';
import { ActionsBreakdownNextCard } from './actions-breakdown-next-card.component';
import { ActionsBreakdownStand } from './actions-breakdown-stand.component';

const ActionBreakdownRow: React.FC<{ action: Action; resolvedHand: ResolvedHand }> = ({
  action,
  resolvedHand,
}) => {
  const { strategy } = useStrategyContext();

  return action === stand ? (
    <ActionsBreakdownStand dealerScores={strategy.dealerScores} resolvedHand={resolvedHand} />
  ) : action === surrender ? null : (
    <ActionsBreakdownNextCard action={action} resolvedHand={resolvedHand} />
  );
};

const isExpandable = (action: Action): boolean => {
  return action !== surrender;
};

const getCellStyle = (isHighlighted: boolean): React.CSSProperties => ({
  fontWeight: isHighlighted ? 'bold' : 'normal',
  padding: '8px',
});

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: ['1fr', '1fr'].join(' '),
};

/** Edge of each action available for the hand, so that they can be compared at a glance.
 * The optimal action is highlighted and each action embeds its own breakdown */
export const ActionsBreakdown: React.FC = () => {
  const { t } = useTranslation();
  const { deleteParameter, getParameter, setParameter } = useSearchParamsUtils();
  const { decimals } = useSettingsContext();
  const { strategy } = useStrategyContext();
  const params = useParams();

  const expandedRowRef = useRef<HTMLTableRowElement>(null);

  /** The expanded action is kept in the URL, so breakdowns can be linked to */
  const expandedAction = getParameter(selectedActionParamName, sortedActions);

  // Anchoring through the URL hash doesn't work, because the rows are rendered only once
  // the strategy has been computed (i.e. after the browser navigation has completed)
  useEffect(() => {
    expandedRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [expandedAction]);

  const toggleAction = (action: Action) => {
    if (action === expandedAction) {
      deleteParameter(selectedActionParamName);
    } else {
      setParameter(selectedActionParamName, action);
    }
  };

  const rawPlayerLabel = params[playerLabelUrlParam];
  const playerLabel = rawPlayerLabel && urlParamToLabel(rawPlayerLabel);

  const resolvedHand = getActionableHands(strategy.resolvedHandsList).find(
    resolvedHand => resolvedHand.label === playerLabel,
  );

  if (!resolvedHand) {
    return (
      <div className="actions-breakdown">
        <h3>{t('actionsBreakdown.notFound', { label: playerLabel })}</h3>
      </div>
    );
  }

  const consequences = sortedActions
    .map(action => resolvedHand.consequences[action])
    .filter(consequence => !!consequence);

  return (
    <div className="actions-breakdown">
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={rowStyle}>
            <td style={getCellStyle(true)}>{t('commons.action')}</td>
            <td style={getCellStyle(true)}>{t('commons.edge')}</td>
          </tr>
        </thead>

        <tbody>
          {consequences.map(({ action, edge }) => {
            const isOptimal = action === resolvedHand.optimalConsequence.action;
            const isExpanded = action === expandedAction;
            const edgeColor = edge > 0 ? winColor : edge < 0 ? loseColor : undefined;

            return (
              <React.Fragment key={action}>
                <tr
                  onClick={isExpandable(action) ? () => toggleAction(action) : undefined}
                  style={{ ...rowStyle, cursor: isExpandable(action) ? 'pointer' : undefined }}
                >
                  <td style={getCellStyle(isOptimal)}>
                    {isExpandable(action) && <span>{isExpanded ? '▾' : '▸'} </span>}
                    {t(`actions.${action}`)}
                  </td>
                  <td style={{ ...getCellStyle(isOptimal), color: edgeColor }}>
                    {toPercentage(edge, decimals)}
                  </td>
                </tr>

                {isExpanded && isExpandable(action) && (
                  <tr ref={expandedRowRef} style={{ display: 'block' }}>
                    <td colSpan={2} style={{ display: 'block', padding: '0 8px 16px' }}>
                      <ActionBreakdownRow action={action} resolvedHand={resolvedHand} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
