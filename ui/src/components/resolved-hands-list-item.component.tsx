export type ActionRow = {
  action: string;
  lose: string;
  push: string;
  roi: string;
  win: string;
};

export type ResolvedHandsListItemProps = {
  actionRows: ActionRow[];
  decision: string;
  isDecisionOptimal?: boolean;
  isHeader?: boolean;
  score: string;
};

export const ResolvedHandsListItem: React.FC<ResolvedHandsListItemProps> = props => {
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
        {props.decision} {!props.isDecisionOptimal && !props.isHeader ? ' ⚠️' : ''}
      </td>

      <td style={columnStyle} className="action">
        {props.actionRows.map(({ action }) => (
          <div key={action}>{action}</div>
        ))}
      </td>

      <td style={columnStyle} className="win">
        {props.actionRows.map(({ action, win }) => (
          <div key={action}>{win}</div>
        ))}
      </td>

      <td style={columnStyle} className="push">
        {props.actionRows.map(({ action, push }) => (
          <div key={action}>{push}</div>
        ))}
      </td>

      <td style={columnStyle} className="lose">
        {props.actionRows.map(({ action, lose }) => (
          <div key={action}>{lose}</div>
        ))}
      </td>

      <td style={columnStyle} className="roi">
        {props.actionRows.map(({ action, roi }) => (
          <div key={action}>{roi}</div>
        ))}
      </td>
    </tr>
  );
};
