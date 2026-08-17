import React from 'react';
import { useTranslation } from 'react-i18next';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { getResult, loseColor, resultToStyles, winColor } from '../logic/result.logic';
import { lose, Result, win } from '../models/result.model';
import { useSettingsContext } from '../settings.context';
import { FinalScoreBase } from '../types/final-score.type';
import { ResolvedHand } from '../types/resolved-hand.type';

type ActionsBreakdownStandRowProps = {
  dealerScore: string;
  probability: string;
  result: string;
  style?: React.CSSProperties;
} & (
  | {
      edgeContribution?: undefined;
      isHeader: true;
    }
  | {
      edgeContribution: number;
      isHeader?: undefined;
    }
);

const ActionsBreakdownStandRow: React.FC<ActionsBreakdownStandRowProps> = props => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();

  const columnStyle: React.CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : 'normal',
    padding: '8px',
  };

  const numericEdge = props.edgeContribution ?? 0;
  const edgeContributionColor =
    numericEdge > 0 ? winColor : numericEdge < 0 ? loseColor : undefined;

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
      <td style={{ ...columnStyle, color: edgeContributionColor }}>
        {props.isHeader
          ? t('actionsBreakdown.edgeContribution')
          : toPercentage(props.edgeContribution, decimals)}
      </td>
    </tr>
  );
};

const getEdgeContribution = (result: Result, dealerProbability: number): number => {
  return result === win ? dealerProbability : result === lose ? -dealerProbability : 0;
};

type ActionsBreakdownStandProps = {
  dealerScores: FinalScoreBase[];
  resolvedHand: ResolvedHand;
};

export const ActionsBreakdownStand: React.FC<ActionsBreakdownStandProps> = ({
  dealerScores,
  resolvedHand,
}) => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();

  const totalEdgeContribution = dealerScores.reduce(
    (reduced, dealerScore) =>
      reduced +
      getEdgeContribution(
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
        />
      </thead>

      <tbody>
        {dealerScores.map(dealerScore => {
          const result = getResult(resolvedHand.effectiveScore, dealerScore.score);

          return (
            <ActionsBreakdownStandRow
              dealerScore={effectiveScoreToLabel(dealerScore.score)}
              edgeContribution={getEdgeContribution(result, dealerScore.probability)}
              key={dealerScore.score}
              probability={toPercentage(dealerScore.probability, decimals)}
              result={t(`commons.${result}`)}
              style={{ color: resultToStyles(result)?.color }}
            />
          );
        })}

        <ActionsBreakdownStandRow
          dealerScore={t('commons.edge')}
          edgeContribution={totalEdgeContribution}
          probability=""
          result=""
        />
      </tbody>
    </table>
  );
};
