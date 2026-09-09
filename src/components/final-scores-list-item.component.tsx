import { ReactNode } from 'react';
import { useStrategyContext } from '../strategy.context';
import { MaterialHand } from '../types/material-hand.type';
import { FinalScoresListModal } from './final-scores-list-modal.component';

export type FinalScoresListItemProps = {
  hideScore?: boolean;
  modifiers: string;
  probability: ReactNode;
  score: string;
} & (
  | {
      combinations?: undefined;
      finalScoreId?: undefined;
      hands: string;
      isHeader: true;
    }
  | {
      combinations: string;
      finalScoreId: string;
      hands: MaterialHand[];
      isHeader?: undefined;
    }
);

export const FinalScoresListItem: React.FC<FinalScoresListItemProps> = (props) => {
  const { showBetMultiplier } = useStrategyContext();

  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
  };
  const gridTemplateColumns = [
    '1fr',
    ...(showBetMultiplier ? ['1fr'] : []),
    '1fr',
    '2fr',
    '1fr',
    '1fr',
  ];

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
      <td style={columnStyle}>{props.hideScore ? '' : props.score}</td>

      {showBetMultiplier && <td style={columnStyle}>{props.modifiers}</td>}

      <td style={columnStyle}>{props.isHeader ? props.hands : props.hands.length}</td>

      <td style={columnStyle}>{props.combinations}</td>

      <td style={columnStyle}>
        {!props.isHeader && (
          <FinalScoresListModal
            hands={props.hands}
            score={props.score}
            finalScoreId={props.finalScoreId}
          />
        )}
      </td>

      <td style={columnStyle}>{props.probability}</td>
    </tr>
  );
};
