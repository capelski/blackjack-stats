import React from 'react';
import { useTranslation } from 'react-i18next';
import { labelToUrlParam } from '../logic/labels.logic';
import { Action } from '../models/action.model';
import { useSearchParamsUtils } from '../search-params-utils';
import { DecisionOverrideHandler } from '../types/decision-overrides.type';

/** Edge of each action allowed for a hand. Actions that are not allowed are missing from the map */
export type EdgeByActionMap = {
  [action: string]: string;
};

export type ResolvedHandsListItemProps = {
  /** Actions displayed as columns, in the order they are displayed */
  actions: Action[];
  label: string;
} & (
  | {
      decision: string;
      edgeByAction?: undefined;
      isHeader: true;
      onDecisionOverride?: undefined;
      optimalDecision?: undefined;
    }
  | {
      decision: Action;
      edgeByAction: EdgeByActionMap;
      isHeader?: false;
      onDecisionOverride: DecisionOverrideHandler;
      optimalDecision: Action;
    }
);

export const ResolvedHandsListItem: React.FC<ResolvedHandsListItemProps> = props => {
  const { t } = useTranslation();
  const { navigateWithSearch } = useSearchParamsUtils();

  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
  };

  return (
    <tr
      style={{
        display: 'grid',
        gap: '16px',
        // A column for the hand label, one per action and the decision and breakdown columns
        gridTemplateColumns: Array(1 + props.actions.length + 2)
          .fill('1fr')
          .join(' '),
        padding: '8px 0',
      }}
    >
      <td style={columnStyle}>{props.label}</td>

      {props.actions.map(action => (
        <td
          key={action}
          style={{
            ...columnStyle,
            fontWeight: props.isHeader || action === props.optimalDecision ? 'bold' : 'normal',
          }}
        >
          {props.isHeader ? t(`actions.${action}`) : props.edgeByAction[action] ?? '-'}
        </td>
      ))}

      <td style={columnStyle}>
        {props.isHeader ? (
          props.decision
        ) : (
          <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
            <select
              onChange={event => {
                props.onDecisionOverride(props.label, event.target.value as Action);
              }}
              value={props.decision}
            >
              {props.actions
                .filter(action => props.edgeByAction[action])
                .map(action => (
                  <option key={action} value={action}>
                    {t(`actions.${action}`)}
                  </option>
                ))}
            </select>

            {props.decision === props.optimalDecision ? '' : '⚠️'}
          </div>
        )}
      </td>

      <td style={columnStyle}>
        {!props.isHeader && (
          <button
            onClick={() => {
              navigateWithSearch(labelToUrlParam(props.label));
            }}
          >
            {t('resolvedHandsList.viewBreakdown')}
          </button>
        )}
      </td>
    </tr>
  );
};
