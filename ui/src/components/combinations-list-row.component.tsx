export type CombinationsListProps = {
  hideAction?: boolean;
  hideLabel?: boolean;
  isHeader?: boolean;
  showBetMultiplier?: boolean;
};

export type CombinationsListRowProps = CombinationsListProps & {
  label: string;
  cards: string;
  probability: string;
  betMultiplier: string;
  action: string;
};

export const CombinationsListRow: React.FC<CombinationsListRowProps> = props => {
  const gridTemplateColumns = [
    '3fr',
    ...(props.hideLabel ? [] : ['1fr']),
    '1fr',
    ...(props.showBetMultiplier ? ['1fr'] : []),
    ...(props.hideAction ? [] : ['1fr']),
  ];
  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
  };

  return (
    <div
      className="combination"
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: gridTemplateColumns.join(' '),
        padding: '8px 0',
      }}
    >
      <span style={columnStyle} className="cell cards">
        {props.cards}
      </span>

      {!props.hideLabel && (
        <span style={columnStyle} className="cell score">
          {props.label}
        </span>
      )}

      <span style={columnStyle} className="cell probability">
        {props.probability}
      </span>

      {props.showBetMultiplier && (
        <span style={columnStyle} className="cell bet-size">
          {props.betMultiplier}
          {props.isHeader ? '' : 'x'}
        </span>
      )}

      {!props.hideAction && (
        <span style={columnStyle} className={`cell action ${props.action.toLowerCase()}`}>
          {props.action}
        </span>
      )}
    </div>
  );
};
