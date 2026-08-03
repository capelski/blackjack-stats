import React from 'react';
import { useTranslation } from 'react-i18next';
import { dealerFinalScores } from '../logic/dealer-data.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { getResult, resultToStyles } from '../logic/result.logic';
import { stand } from '../models/action.model';
import { lose, Result, win } from '../models/result.model';
import { useSettingsContext } from '../settings.context';
import { ResolvedHand } from '../types/resolved-hand.type';
import { ActionsBreakdownTitle } from './actions-breakdown-title.component';

type ActionsBreakdownStandRowProps = {
  dealerScore: React.ReactNode;
  edgeContribution: React.ReactNode;
  isHeader?: boolean;
  probability: React.ReactNode;
  result: React.ReactNode;
  style?: React.CSSProperties;
};

const ActionsBreakdownStandRow: React.FC<ActionsBreakdownStandRowProps> = props => {
  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
    padding: '8px',
  };

  return (
    <tr
      style={{
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr'].join(' '),
      }}
    >
      <td style={columnStyle}>{props.dealerScore}</td>
      <td style={columnStyle}>{props.probability}</td>
      <td style={{ ...columnStyle, ...props.style }}>{props.result}</td>
      <td style={columnStyle}>{props.edgeContribution}</td>
    </tr>
  );
};

const getEdgeContribution = (result: Result, dealerProbability: number): number => {
  return result === win ? dealerProbability : result === lose ? -dealerProbability : 0;
};

type ActionsBreakdownStandProps = {
  resolvedHand: ResolvedHand;
  sectionRef: React.RefObject<HTMLDivElement | null>;
};

export const ActionsBreakdownStand: React.FC<ActionsBreakdownStandProps> = ({
  resolvedHand,
  sectionRef,
}) => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();

  const totalEdgeContribution = dealerFinalScores.reduce(
    (reduced, dealerScore) =>
      reduced +
      getEdgeContribution(
        getResult(resolvedHand.effectiveScore, dealerScore.score),
        dealerScore.probability,
      ),
    0,
  );

  return (
    <div className="stand-section" ref={sectionRef}>
      <ActionsBreakdownTitle action={stand} />

      <table style={{ width: '100%' }}>
        <thead>
          <ActionsBreakdownStandRow
            dealerScore={t('actionsBreakdown.dealerScore')}
            edgeContribution={t('actionsBreakdown.edgeContribution')}
            isHeader={true}
            probability={t('commons.probability')}
            result={t('commons.result')}
          />
        </thead>

        <tbody>
          {dealerFinalScores.map(dealerScore => {
            const result = getResult(resolvedHand.effectiveScore, dealerScore.score);

            return (
              <ActionsBreakdownStandRow
                dealerScore={effectiveScoreToLabel(dealerScore.score)}
                edgeContribution={toPercentage(
                  getEdgeContribution(result, dealerScore.probability),
                  decimals,
                )}
                key={dealerScore.score}
                probability={toPercentage(dealerScore.probability, decimals)}
                result={t(`commons.${result}`)}
                style={resultToStyles(result)}
              />
            );
          })}

          <ActionsBreakdownStandRow
            dealerScore={t('commons.edge')}
            edgeContribution={toPercentage(totalEdgeContribution, decimals)}
            isHeader={true}
            probability=""
            result=""
          />
        </tbody>
      </table>
    </div>
  );
};
