import React from 'react';
import { useTranslation } from 'react-i18next';
import { getHandStatus } from '../logic/abstract-hands.logic';
import { isDoubleBetAction } from '../logic/action.logic';
import { getBetMultiplier } from '../logic/bet-multiplier.logic';
import { getEdgeColor } from '../logic/edge.logic';
import { getNextHandLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { double, hit, split } from '../models/action.model';
import { cards, cardsNumber } from '../models/cards.model';
import { HandStatus } from '../models/hand-status.model';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { Card } from '../types/card.type';
import { ResolvedHand } from '../types/resolved-hand.type';

type NextHandGroup = {
  cards: Card[];
  edge: number;
  nextAction: HandStatus;
  nextHand: ResolvedHand;
  probability: number;
};

type ActionsBreakdownNextCardRowProps = {
  action: string;
  edge: string;
  nextCard: string;
  nextHand: string;
  probability: string;
  weightedEdge: string;
} & (
  | {
      edgeColor?: undefined;
      isHeader: true;
    }
  | {
      edgeColor: string;
      isHeader?: undefined;
    }
);

const ActionsBreakdownNextCardRow: React.FC<ActionsBreakdownNextCardRowProps> = (props) => {
  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
    padding: '8px',
  };

  const edgeColumnStyle = {
    ...columnStyle,
    color: props.edgeColor,
  };

  return (
    <tr
      style={{
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr', '1fr', '1fr'].join(' '),
      }}
    >
      <td style={columnStyle}>{props.nextCard}</td>
      <td style={columnStyle}>{props.probability}</td>
      <td style={columnStyle}>{props.nextHand}</td>
      <td style={columnStyle}>{props.action}</td>
      <td style={edgeColumnStyle}>{props.edge} </td>
      <td style={edgeColumnStyle}>{props.weightedEdge}</td>
    </tr>
  );
};

/** Groups of consecutive cards are displayed as a range (e.g. "6 - K" instead of "6, 7, 8, 9, 10, J, Q, K") */
const getNextCardsLabel = (groupCards: Card[]): string => {
  return groupCards.length > 1
    ? `${groupCards[0].symbol} - ${groupCards[groupCards.length - 1].symbol}`
    : groupCards[0].symbol;
};

type ActionsBreakdownNextCardProps = {
  /** All three actions draw a next card. When doubling, the bet is doubled and the next hand
   * can no longer be actioned, so it always stands. When splitting, the next card is drawn on top
   * of one of the split cards and the bet is doubled, because two hands are played */
  action: typeof double | typeof hit | typeof split;
  resolvedHand: ResolvedHand;
};

export const ActionsBreakdownNextCard: React.FC<ActionsBreakdownNextCardProps> = ({
  action,
  resolvedHand,
}) => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { rules, strategy } = useStrategyContext();

  const cardProbability = 1 / cardsNumber;
  const isDoubleBet = isDoubleBetAction(action);
  const betMultiplier = getBetMultiplier(1, { isDoubleBet });

  /** Different next cards can lead to the same next hand (e.g. any ten-valued card),
   * in which case they are displayed as a single row with their probabilities merged */
  const nextHandGroups = cards.reduce<NextHandGroup[]>((reduced, card) => {
    const nextLabel = getNextHandLabel(
      strategy.resolvedHandsList,
      rules,
      resolvedHand.label,
      action,
      card,
    );
    const nextHand = strategy.resolvedHandsMap[nextLabel];
    const group = reduced.find((x) => x.nextHand.label === nextHand.label);

    if (group) {
      group.cards.push(card);
      group.probability += cardProbability;
    } else {
      reduced.push({
        cards: [card],
        edge: nextHand.consequences[nextHand.action]!.edge,
        nextAction: getHandStatus(nextHand.action, nextHand.isActionable, nextHand.effectiveScore),
        nextHand,
        probability: cardProbability,
      });
    }

    return reduced;
  }, []);

  const totalEdge = nextHandGroups.reduce(
    (reduced, { edge, probability }) => reduced + edge * probability,
    0,
  );

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <ActionsBreakdownNextCardRow
          action={t('commons.action')}
          edge={t('commons.edge')}
          isHeader={true}
          nextCard={t('actionsBreakdown.nextCard')}
          nextHand={t('actionsBreakdown.nextHand')}
          probability={t('commons.probability')}
          weightedEdge={t('commons.weightedEdge')}
        />
      </thead>

      <tbody>
        {nextHandGroups.map(({ cards: groupCards, edge, nextAction, nextHand, probability }) => (
          <ActionsBreakdownNextCardRow
            action={t(`actions.${nextAction}`)}
            edge={toPercentage(edge, decimals)}
            edgeColor={getEdgeColor(edge)}
            key={nextHand.label}
            nextCard={getNextCardsLabel(groupCards)}
            nextHand={nextHand.labelAsInitial}
            probability={`${groupCards.length} / ${cardsNumber}`}
            weightedEdge={toPercentage(edge * probability, decimals)}
          />
        ))}

        <ActionsBreakdownNextCardRow
          action=""
          edge=""
          edgeColor={getEdgeColor(totalEdge)}
          nextCard={t('commons.edge')}
          nextHand=""
          probability=""
          weightedEdge={`${toPercentage(totalEdge, decimals)}${isDoubleBet ? ` x2 = ${toPercentage(totalEdge * betMultiplier, decimals)}` : ''}`}
        />
      </tbody>
    </table>
  );
};
