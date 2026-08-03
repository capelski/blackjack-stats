import React from 'react';
import { useTranslation } from 'react-i18next';
import { getNextHandLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { hit } from '../models/action.model';
import { cards, cardsNumber } from '../models/cards.model';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { Card } from '../types/card.type';
import { ResolvedHand } from '../types/resolved-hand.type';
import { ActionsBreakdownTitle } from './actions-breakdown-title.component';

type NextHandGroup = {
  cards: Card[];
  edge: number;
  nextHand: ResolvedHand;
  probability: number;
};

type ActionsBreakdownHitRowProps = {
  decision: React.ReactNode;
  edge: React.ReactNode;
  edgeContribution: React.ReactNode;
  isHeader?: boolean;
  nextCard: React.ReactNode;
  nextHand: React.ReactNode;
  probability: React.ReactNode;
};

const ActionsBreakdownHitRow: React.FC<ActionsBreakdownHitRowProps> = props => {
  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
    padding: '8px',
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
      <td style={columnStyle}>{props.decision}</td>
      <td style={columnStyle}>{props.edge}</td>
      <td style={columnStyle}>{props.edgeContribution}</td>
    </tr>
  );
};

/** Groups of consecutive cards are displayed as a range (e.g. "6 - K" instead of "6, 7, 8, 9, 10, J, Q, K") */
const getNextCardsLabel = (groupCards: Card[]): string => {
  return groupCards.length > 1
    ? `${groupCards[0].symbol} - ${groupCards[groupCards.length - 1].symbol}`
    : groupCards[0].symbol;
};

type ActionsBreakdownHitProps = {
  resolvedHand: ResolvedHand;
  sectionRef: React.RefObject<HTMLDivElement | null>;
};

export const ActionsBreakdownHit: React.FC<ActionsBreakdownHitProps> = ({
  resolvedHand,
  sectionRef,
}) => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { rules, strategy } = useStrategyContext();

  const cardProbability = 1 / cardsNumber;

  /** Different next cards can lead to the same next hand (e.g. any ten-valued card),
   * in which case they are displayed as a single row with their probabilities merged */
  const nextHandGroups = cards.reduce<NextHandGroup[]>((reduced, card) => {
    const nextLabel = getNextHandLabel(
      strategy.resolvedHandsList,
      rules,
      resolvedHand.label,
      hit,
      card,
    );
    const nextHand = strategy.resolvedHandsMap[nextLabel];
    const group = reduced.find(x => x.nextHand.label === nextHand.label);

    if (group) {
      group.cards.push(card);
      group.probability += cardProbability;
    } else {
      reduced.push({
        cards: [card],
        edge: nextHand.consequences[nextHand.action]!.edge,
        nextHand,
        probability: cardProbability,
      });
    }

    return reduced;
  }, []);

  const totalEdgeContribution = nextHandGroups.reduce(
    (reduced, { edge, probability }) => reduced + edge * probability,
    0,
  );

  return (
    <div className="hit-section" ref={sectionRef}>
      <ActionsBreakdownTitle action={hit} />

      <table style={{ width: '100%' }}>
        <thead>
          <ActionsBreakdownHitRow
            decision={t('commons.decision')}
            edge={t('commons.edge')}
            edgeContribution={t('actionsBreakdown.edgeContribution')}
            isHeader={true}
            nextCard={t('actionsBreakdown.nextCard')}
            nextHand={t('actionsBreakdown.nextHand')}
            probability={t('commons.probability')}
          />
        </thead>

        <tbody>
          {nextHandGroups.map(({ cards: groupCards, edge, nextHand, probability }) => (
            <ActionsBreakdownHitRow
              decision={t(`actions.${nextHand.action}`)}
              edge={toPercentage(edge, decimals)}
              edgeContribution={toPercentage(edge * probability, decimals)}
              key={nextHand.label}
              nextCard={getNextCardsLabel(groupCards)}
              nextHand={nextHand.labelAsInitial}
              probability={`${groupCards.length} / ${cardsNumber}`}
            />
          ))}

          <ActionsBreakdownHitRow
            decision=""
            edge=""
            edgeContribution={toPercentage(totalEdgeContribution, decimals)}
            isHeader={true}
            nextCard={t('commons.total')}
            nextHand=""
            probability=""
          />
        </tbody>
      </table>
    </div>
  );
};
