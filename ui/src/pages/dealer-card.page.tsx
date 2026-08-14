import React, { useEffect, useState } from 'react';
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
import { dealerFinalScoresByFirstCard } from '../logic/dealer-data.logic';
import { getOverridesResolver } from '../logic/decision-overrides.logic';
import { urlParamToLabel } from '../logic/labels.logic';
import { optimalActionsHandResolver } from '../logic/resolved-hands.logic';
import { getStrategyByFirstCard } from '../logic/strategy.logic';
import { SearchNavLink } from '../search-nav-link';
import {
  DecisionOverrideByFirstCardHandler,
  DecisionOverridesByFirstCard,
} from '../types/decision-overrides.type';
import { Rules } from '../types/rules.type';
import { StrategyByFirstCard } from '../types/strategy.type';

export type DealerCardPageProps = {
  decisionOverrides: DecisionOverridesByFirstCard;
  onDecisionOverride: DecisionOverrideByFirstCardHandler;
  rules: Rules;
  setRules: (rules: Rules) => void;
};

export const DealerCardPage: React.FC<DealerCardPageProps> = props => {
  const { t } = useTranslation();
  const [computing, setComputing] = useState(false);
  const [strategy, setStrategy] = useState<StrategyByFirstCard>(undefined!);
  const params = useParams();

  const dealerCard = params[dealerCardUrlParam];
  const rawPlayerLabel = params[playerLabelUrlParam];
  const playerLabel = rawPlayerLabel && urlParamToLabel(rawPlayerLabel);

  const computeStrategy = async (rules: Rules, decisionOverrides: DecisionOverridesByFirstCard) => {
    setComputing(true);

    const strategy = await getStrategyByFirstCard(
      rules,
      firstCard =>
        getOverridesResolver(optimalActionsHandResolver, decisionOverrides[firstCard] ?? {}),
      dealerFinalScoresByFirstCard,
    );
    setStrategy(strategy);
    setComputing(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(props.rules, props.decisionOverrides);
  }, [props.decisionOverrides, props.rules]);

  return (
    <LoadingOverlay loading={computing || !strategy}>
      <DealerCardContext.Provider
        value={{
          decisionOverrides: props.decisionOverrides,
          onDecisionOverride: props.onDecisionOverride,
          rules: props.rules,
          strategy,
        }}
      >
        <h1>
          {t('titles.dealerCard')}
          {dealerCard ? ` - ${playerLabel ? `${playerLabel} vs ` : ''}${dealerCard}` : ''}
        </h1>

        <RulesCheckboxes disabled={computing} rules={props.rules} setRules={props.setRules} />

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
