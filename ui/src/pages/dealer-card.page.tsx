import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import {
  dealerBreakdownRoute,
  dealerCardUrlParam,
  finalScoresRoute,
  playerLabelUrlParam,
  summaryRoute,
} from '../../constants';
import { LoadingOverlay } from '../components/loading-overlay.component';
import { RulesCheckboxes } from '../components/rules-checkboxes.component';
import { DealerCardContext } from '../dealer-card.context';
import { urlParamToLabel } from '../logic/labels.logic';
import { SearchNavLink } from '../search-nav-link';
import {
  DecisionOverrideByFirstCardHandler,
  DecisionOverridesByFirstCard,
} from '../types/decision-overrides.type';
import { Rules } from '../types/rules.type';
import { StrategyByFirstCard } from '../types/strategy.type';

export type DealerCardPageProps = {
  computing: boolean;
  decisionOverrides: DecisionOverridesByFirstCard;
  onDecisionOverride: DecisionOverrideByFirstCardHandler;
  rules: Rules;
  setRules: (rules: Rules) => void;
  strategy: StrategyByFirstCard;
};

export const DealerCardPage: React.FC<DealerCardPageProps> = props => {
  const { t } = useTranslation();
  const params = useParams();

  const dealerCard = params[dealerCardUrlParam];
  const rawPlayerLabel = params[playerLabelUrlParam];
  const playerLabel = rawPlayerLabel && urlParamToLabel(rawPlayerLabel);

  return (
    <LoadingOverlay loading={props.computing || !props.strategy}>
      <DealerCardContext.Provider
        value={{
          decisionOverrides: props.decisionOverrides,
          onDecisionOverride: props.onDecisionOverride,
          rules: props.rules,
          strategy: props.strategy,
        }}
      >
        <h1>
          {t('titles.dealerCard')}
          {dealerCard ? ` - ${playerLabel ? `${playerLabel} vs ` : ''}${dealerCard}` : ''}
        </h1>

        <RulesCheckboxes disabled={props.computing} rules={props.rules} setRules={props.setRules} />

        <nav className="nested-navbar">
          <SearchNavLink to={finalScoresRoute}>{t('dealerCard.dealerScores')}</SearchNavLink>
          <SearchNavLink to={summaryRoute}>{t('dealerCard.summary')}</SearchNavLink>
          <SearchNavLink to={dealerBreakdownRoute}>{t('dealerCard.breakdown')}</SearchNavLink>
        </nav>

        <Outlet />
      </DealerCardContext.Provider>
    </LoadingOverlay>
  );
};
