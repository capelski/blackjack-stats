import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Action } from '../models/action.model';
import { DecisionOverrideHandler } from '../types/decision-overrides.type';

export type ActionRow = {
  action: string;
  edge: string;
  lose: ReactNode;
  push: ReactNode;
  win: ReactNode;
};

export type ResolvedHandsListItemProps = {
  actionRows: ActionRow[];
  label: string;
} & (
  | {
      decision: string;
      isHeader: true;
      onDecisionOverride?: undefined;
      optimalDecision?: undefined;
    }
  | {
      decision: Action;
      isHeader?: false;
      onDecisionOverride: DecisionOverrideHandler;
      optimalDecision: Action;
    }
);

export const ResolvedHandsListItem: React.FC<ResolvedHandsListItemProps> = props => {
  const { t } = useTranslation();

  const gridTemplateColumns = ['1fr', '1fr', '1fr', '1fr', '1fr', '1fr', '1fr'];
  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
  };

  return (
    <React.Fragment>
      {props.actionRows.map((actionRow, index) => {
        const isFirstActionRow = index === 0;
        return (
          <tr
            key={actionRow.action}
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: gridTemplateColumns.join(' '),
              padding: '8px 0',
            }}
          >
            <td style={columnStyle}>{isFirstActionRow ? props.label : ''}</td>

            <td style={columnStyle}>
              {props.isHeader ? (
                props.decision
              ) : isFirstActionRow ? (
                <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
                  <select
                    onChange={event => {
                      props.onDecisionOverride(props.label, event.target.value as Action);
                    }}
                    value={props.decision}
                  >
                    {props.actionRows.map(actionOption => (
                      <option key={actionOption.action} value={actionOption.action}>
                        {t(`actions.${actionOption.action}`)}
                      </option>
                    ))}
                  </select>

                  {props.decision === props.optimalDecision ? '' : '⚠️'}
                </div>
              ) : (
                ''
              )}
            </td>

            <td
              style={{
                ...columnStyle,
                fontWeight:
                  props.isHeader || actionRow.action === props.optimalDecision ? 'bold' : 'normal',
              }}
            >
              {props.isHeader ? actionRow.action : t(`actions.${actionRow.action}`)}
            </td>

            <td style={columnStyle}>{actionRow.win}</td>

            <td style={columnStyle}>{actionRow.push}</td>

            <td style={columnStyle}>{actionRow.lose}</td>

            <td style={columnStyle}>{actionRow.edge}</td>
          </tr>
        );
      })}
    </React.Fragment>
  );
};
