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
    <div
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: gridTemplateColumns.join(' '),
        padding: '8px 0',
      }}
    >
      <span style={columnStyle} className="score">
        {props.score}
      </span>

      <span style={columnStyle} className="decision">
        {props.decision} {!props.isDecisionOptimal && !props.isHeader ? ' ⚠️' : ''}
      </span>

      <span style={columnStyle} className="action">
        {props.actionRows.map(({ action }) => (
          <div key={action}>{action}</div>
        ))}
      </span>

      <span style={columnStyle} className="win">
        {props.actionRows.map(({ action, win }) => (
          <div key={action}>{win}</div>
        ))}
      </span>

      <span style={columnStyle} className="push">
        {props.actionRows.map(({ action, push }) => (
          <div key={action}>{push}</div>
        ))}
      </span>

      <span style={columnStyle} className="lose">
        {props.actionRows.map(({ action, lose }) => (
          <div key={action}>{lose}</div>
        ))}
      </span>

      <span style={columnStyle} className="roi">
        {props.actionRows.map(({ action, roi }) => (
          <div key={action}>{roi}</div>
        ))}
      </span>
    </div>
  );
};
