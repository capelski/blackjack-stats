import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type ActionRow = {
  action: string;
  edge: string;
  lose: ReactNode;
  push: ReactNode;
  win: ReactNode;
};

export type ResolvedHandsListItemProps = {
  actionRows: ActionRow[];
  decision: string;
  score: string;
} & (
  | {
      isHeader: true;
      optimalDecision?: undefined;
    }
  | {
      isHeader?: false;
      optimalDecision: string;
    }
);

export const ResolvedHandsListItem: React.FC<ResolvedHandsListItemProps> = props => {
  const { t } = useTranslation();

  const gridTemplateColumns = ['1fr', '1fr', '1fr', '1fr', '1fr', '1fr', '1fr'];
  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
  };

  return (
    <tr
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: gridTemplateColumns.join(' '),
        padding: '8px 0',
      }}
    >
      <td style={columnStyle} className="score">
        {props.score}
      </td>

      <td style={columnStyle} className="decision">
        {props.isHeader
          ? props.decision
          : `${t(`actions.${props.decision}`)}${
              props.decision === props.optimalDecision ? '' : ' ⚠️'
            }`}
      </td>

      <td style={columnStyle} className="action">
        {props.actionRows.map(({ action }) => (
          <div
            style={{
              fontWeight: props.isHeader || action === props.optimalDecision ? 'bold' : 'normal',
            }}
            key={action}
          >
            {props.isHeader ? action : t(`actions.${action}`)}
          </div>
        ))}
      </td>

      <td style={columnStyle}>
        {props.actionRows.map(({ action, win }) => (
          <div key={action}>{win}</div>
        ))}
      </td>

      <td style={columnStyle}>
        {props.actionRows.map(({ action, push }) => (
          <div key={action}>{push}</div>
        ))}
      </td>

      <td style={columnStyle}>
        {props.actionRows.map(({ action, lose }) => (
          <div key={action}>{lose}</div>
        ))}
      </td>

      <td style={columnStyle}>
        {props.actionRows.map(({ action, edge }) => (
          <div key={action}>{edge}</div>
        ))}
      </td>
    </tr>
  );
};
