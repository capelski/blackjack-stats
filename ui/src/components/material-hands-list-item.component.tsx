export type HandsListProps = {
  hideAction?: boolean;
  hideScore?: boolean;
  showBetMultiplier?: boolean;
};

export type HandsListItemProps = HandsListProps & {
  action: string;
  betMultiplier: string;
  cards: string;
  score: string;
  isHeader?: boolean;
  probability: string;
};

export const HandsListItem: React.FC<HandsListItemProps> = props => {
  const gridTemplateColumns = [
    '3fr',
    ...(props.hideScore ? [] : ['1fr']),
    '1fr',
    ...(props.showBetMultiplier ? ['1fr'] : []),
    ...(props.hideAction ? [] : ['1fr']),
  ];
  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
  };

  return (
    <tr
      className="combination"
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: gridTemplateColumns.join(' '),
        padding: '8px 0',
      }}
    >
      <td style={columnStyle} className="cards">
        {props.cards}
      </td>

      {!props.hideScore && (
        <td style={columnStyle} className="score">
          {props.score}
        </td>
      )}

      <td style={columnStyle} className="probability">
        {props.probability}
      </td>

      {props.showBetMultiplier && (
        <td style={columnStyle} className="bet-size">
          {props.betMultiplier}
          {props.isHeader ? '' : 'x'}
        </td>
      )}

      {!props.hideAction && (
        <td style={columnStyle} className="action">
          {props.action}
        </td>
      )}
    </tr>
  );
};
