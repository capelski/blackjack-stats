import { useTranslation } from 'react-i18next';
import { getBetMultiplierLabel } from '../logic/bet-multiplier.logic';

export type HandsListProps = {
  hideAction?: boolean;
  hideScore?: boolean;
  showBetMultiplier?: boolean;
};

export type HandsListItemProps = HandsListProps & {
  action: string;
  cards: string;
  score: string;
  probability: string;
} & (
    | {
        betMultiplier: string;
        isHeader: true;
      }
    | {
        betMultiplier: number;
        isHeader?: undefined;
      }
  );

export const HandsListItem: React.FC<HandsListItemProps> = (props) => {
  const { t } = useTranslation();

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
          {props.isHeader ? props.betMultiplier : getBetMultiplierLabel(props.betMultiplier)}
        </td>
      )}

      {!props.hideAction && (
        <td style={columnStyle} className="action">
          {props.isHeader ? props.action : t(`actions.${props.action}`)}
        </td>
      )}
    </tr>
  );
};
