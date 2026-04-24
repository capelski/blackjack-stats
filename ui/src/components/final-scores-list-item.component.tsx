import { HandExtended } from '../types/hand.type';
import { FinalScoresListModal } from './final-scores-list-modal.component';
import { HandsListProps } from './hands-list-item.component';

export type FinalScoresListItemProps = Pick<HandsListProps, 'showBetMultiplier'> & {
  hands: string | HandExtended[];
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
    <div
      className="combination"
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: gridTemplateColumns.join(' '),
        padding: '8px 0',
      }}
    >
      <span style={columnStyle} className="cell score">
        {props.score}
      </span>

      <span style={columnStyle} className="cell probability">
        {props.probability}
      </span>

      <span style={columnStyle} className="cell hands">
        {Array.isArray(props.hands) ? props.hands.length : 'Hands'}
      </span>

      <span style={columnStyle} className="cell view">
        {Array.isArray(props.hands) && (
          <FinalScoresListModal
            hands={props.hands}
            score={props.score}
            showBetMultiplier={props.showBetMultiplier}
          />
        )}
      </span>
    </div>
  );
};
