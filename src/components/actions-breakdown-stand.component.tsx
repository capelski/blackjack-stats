import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEdgeColor } from '../logic/edge.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { getResult } from '../logic/result.logic';
import { lose, Result, win } from '../models/result.model';
import { useSettingsContext } from '../settings.context';
import { FinalScore } from '../types/final-score.type';
import { ResolvedHand } from '../types/resolved-hand.type';

type ActionsBreakdownStandRowProps = {
  dealerScore: string;
  probability: string;
  result: string;
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

const ActionsBreakdownStandRow: React.FC<ActionsBreakdownStandRowProps> = (props) => {
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
        gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr'].join(' '),
      }}
    >
      <td style={columnStyle}>{props.dealerScore}</td>
      <td style={columnStyle}>{props.probability}</td>
      <td style={edgeColumnStyle}>{props.result}</td>
      <td style={edgeColumnStyle}>{props.weightedEdge}</td>
    </tr>
  );
};

const getWeightedEdge = (result: Result, dealerProbability: number): number => {
  return result === win ? dealerProbability : result === lose ? -dealerProbability : 0;
};

type ActionsBreakdownStandProps = {
  dealerScores: FinalScore[];
  resolvedHand: ResolvedHand;
};

export const ActionsBreakdownStand: React.FC<ActionsBreakdownStandProps> = ({
  dealerScores,
  resolvedHand,
}) => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();

  const totalEdge = dealerScores.reduce(
    (reduced, dealerScore) =>
      reduced +
      getWeightedEdge(
        getResult(resolvedHand.effectiveScore, dealerScore.score),
        dealerScore.probability,
      ),
    0,
  );

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <ActionsBreakdownStandRow
          dealerScore={t('actionsBreakdown.dealerScore')}
          isHeader={true}
          probability={t('commons.probability')}
          result={t('commons.result')}
          weightedEdge={t('commons.weightedEdge')}
        />
      </thead>

      <tbody>
        {dealerScores.map((dealerScore) => {
          const result = getResult(resolvedHand.effectiveScore, dealerScore.score);
          const weightedEdge = getWeightedEdge(result, dealerScore.probability);

          return (
            <ActionsBreakdownStandRow
              dealerScore={effectiveScoreToLabel(dealerScore.score)}
              edgeColor={getEdgeColor(weightedEdge)}
              key={dealerScore.score}
              probability={toPercentage(dealerScore.probability, decimals)}
              result={t(`commons.${result}`)}
              weightedEdge={toPercentage(weightedEdge, decimals)}
            />
          );
        })}

        <ActionsBreakdownStandRow
          dealerScore={t('commons.edge')}
          edgeColor={getEdgeColor(totalEdge)}
          probability=""
          result=""
          weightedEdge={toPercentage(totalEdge, decimals)}
        />
      </tbody>
    </table>
  );
};
