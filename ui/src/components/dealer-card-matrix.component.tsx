import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { getActionableHands } from '../logic/abstract-hands.logic';
import { compactRows, getRowLabel, OptimalActionsRow } from '../logic/optimal-actions.logic';
import { getEnabledActions } from '../logic/rules.logic';
import { actionAbbreviations } from '../models/action.model';
import { sortedCardSymbols } from '../models/cards.model';
import { dealerSummaryModeParamName, useSearchParamsUtils } from '../search-params-utils';
import { Rules } from '../types/rules.type';
import { StrategyByFirstCard } from '../types/strategy.type';

const compactView = 'compact';
const fullView = 'full';
type OptimalActionsView = typeof compactView | typeof fullView;
const views: OptimalActionsView[] = [compactView, fullView];

const getCellStyle = (isHeader: boolean): CSSProperties => ({
  fontWeight: isHeader ? 'bold' : undefined,
  padding: 8,
  textAlign: 'center',
});

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${1 + sortedCardSymbols.length}, 1fr)`,
};

const legendStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  justifyContent: 'center',
  padding: 8,
  textAlign: 'center',
};

export type DealerCardMatrixProps = {
  rules: Rules;
  strategy: StrategyByFirstCard;
};

export const DealerCardMatrix: React.FC<DealerCardMatrixProps> = props => {
  const { t } = useTranslation();
  const { useUrlState } = useSearchParamsUtils();

  const [view, setView] = useUrlState(dealerSummaryModeParamName, fullView, views);

  const enabledActions = getEnabledActions(props.rules);

  /** The player hands do not depend on the dealer card, so any breakdown entry can define the rows */
  const [firstBreakdown] = Object.values(props.strategy.breakdown);
  const playerHands = firstBreakdown ? getActionableHands(firstBreakdown.resolvedHandsList) : [];

  const rows = playerHands.map<OptimalActionsRow>(playerHand => ({
    actions: sortedCardSymbols.map(
      cardSymbol =>
        props.strategy.breakdown[cardSymbol]?.resolvedHandsMap[playerHand.label]?.action,
    ),
    labels: [playerHand.label],
  }));

  const displayedRows = view === compactView ? compactRows(rows) : rows;

  return (
    <div>
      {t('optimalActions.view')}:{' '}
      <select value={view} onChange={e => setView(e.target.value as OptimalActionsView)}>
        {views.map(viewOption => (
          <option key={viewOption} value={viewOption}>
            {t(`optimalActions.modes.${viewOption}`)}
          </option>
        ))}
      </select>
      <table style={{ width: '100%' }}>
        <caption>
          <div style={legendStyle}>
            {enabledActions.map((action, index) => (
              <span key={action}>
                <b>{actionAbbreviations[action]}</b> = {t(`actions.${action}`)}
                {/** The separator belongs to the preceding item, so it never wraps on its own line */}
                {index < enabledActions.length - 1 && ' /'}
              </span>
            ))}
          </div>
        </caption>

        <thead>
          <tr style={rowStyle}>
            <td style={getCellStyle(true)}>{t('commons.hand')}</td>
            {sortedCardSymbols.map(cardSymbol => (
              <td key={cardSymbol} style={getCellStyle(true)}>
                {cardSymbol}
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayedRows.map(row => {
            const label = getRowLabel(row);
            return (
              <tr key={label} style={rowStyle}>
                <td style={getCellStyle(true)}>{label}</td>
                {row.actions.map((action, index) => (
                  <td key={sortedCardSymbols[index]} style={getCellStyle(false)}>
                    {action ? actionAbbreviations[action] : '-'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
