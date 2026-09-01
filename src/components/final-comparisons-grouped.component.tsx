import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { resultToStyles } from '../logic/result.logic';
import { lose, push, surrender, win } from '../models/result.model';
import { useStrategyContext } from '../strategy.context';
import { ExpectedResult } from '../types/expected-result.type';
import { BetMultipliersCell } from './bet-multipliers-cell.component';

type FinalComparisonsGroupedRowProps = {
  isSurrenderingEnabled: boolean;
} & (
  | {
      expectedResult?: undefined;
      isHeader: true;
    }
  | {
      expectedResult: ExpectedResult;
      isHeader?: false;
    }
);

const FinalComparisonsGroupedRow: React.FC<FinalComparisonsGroupedRowProps> = (props) => {
  const { t } = useTranslation();

  const cellStyle: CSSProperties = {
    fontWeight: props.isHeader ? 'bold' : undefined,
    padding: 8,
    textAlign: 'center',
  };

  return (
    <tr
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${5 + (props.isSurrenderingEnabled ? 1 : 0)}, 1fr)`,
      }}
    >
      <td style={cellStyle}>
        {props.expectedResult
          ? effectiveScoreToLabel(props.expectedResult.score)
          : t('commons.score')}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(win)) }}>
        {props.expectedResult ? (
          <BetMultipliersCell map={props.expectedResult.outcomesByBetMultiplier.win} />
        ) : (
          t('commons.win')
        )}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(push)) }}>
        {props.expectedResult ? (
          <BetMultipliersCell map={props.expectedResult.outcomesByBetMultiplier.push} />
        ) : (
          t('commons.push')
        )}
      </td>

      <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(lose)) }}>
        {props.expectedResult ? (
          <BetMultipliersCell map={props.expectedResult.outcomesByBetMultiplier.lose} />
        ) : (
          t('commons.lose')
        )}
      </td>

      {props.isSurrenderingEnabled && (
        <td style={{ ...cellStyle, ...(props.isHeader ? {} : resultToStyles(surrender)) }}>
          {props.expectedResult ? (
            <BetMultipliersCell map={props.expectedResult.outcomesByBetMultiplier.surrender} />
          ) : (
            t('commons.surrender')
          )}
        </td>
      )}

      <td style={cellStyle}>
        {props.expectedResult ? (
          <BetMultipliersCell map={props.expectedResult.probabilityByBetMultiplier} />
        ) : (
          t('commons.total')
        )}
      </td>
    </tr>
  );
};

export const FinalComparisonsGrouped: React.FC = () => {
  const { rules, strategy } = useStrategyContext();

  const surrenderingEnabled = !!rules.surrendering;

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <FinalComparisonsGroupedRow isHeader={true} isSurrenderingEnabled={surrenderingEnabled} />
      </thead>

      <tbody>
        {strategy.finalScores.map((playerScore) => {
          return (
            <FinalComparisonsGroupedRow
              key={playerScore.id}
              expectedResult={strategy.expectedResults.breakdown[playerScore.id]}
              isSurrenderingEnabled={surrenderingEnabled}
            />
          );
        })}
      </tbody>
    </table>
  );
};
