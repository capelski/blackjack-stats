import { MaterialHand } from '../types/material-hand.type';
import { FinalScoresListModal } from './final-scores-list-modal.component';
import { HandsListProps } from './material-hands-list-item.component';

export type FinalScoresListItemProps = Pick<HandsListProps, 'showBetMultiplier'> & {
  hands: string | MaterialHand[];
  isHeader?: boolean;
  probability: string;
  score: string;
};

export const FinalScoresListItem: React.FC<FinalScoresListItemProps> = props => {
  const gridTemplateColumns = ['1fr', '1fr', '1fr', '1fr'];
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
      <td style={columnStyle} className="score">
        {props.score}
      </td>

      <td style={columnStyle} className="probability">
        {props.probability}
      </td>

      <td style={columnStyle} className="hands">
        {Array.isArray(props.hands) ? props.hands.length : props.hands}
      </td>

      <td style={columnStyle} className="view">
        {Array.isArray(props.hands) && (
          <FinalScoresListModal
            hands={props.hands}
            score={props.score}
            showBetMultiplier={props.showBetMultiplier}
          />
        )}
      </td>
    </tr>
  );
};
