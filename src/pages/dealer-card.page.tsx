import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  dealerBreakdownRoute,
  dealerCardUrlParam,
  finalScoresRoute,
  playerLabelUrlParam,
  summaryRoute,
} from '../../constants';
import { AnimatedOutlet } from '../animated-outlet';
import { useAppContext } from '../app.context';
import { LoadingOverlay } from '../components/loading-overlay.component';
import { RulesControls } from '../components/rules-controls.component';
import { DealerCardContext } from '../dealer-card.context';
import { urlParamToLabel } from '../logic/labels.logic';
import { SearchNavLink } from '../search-nav-link';

export const DealerCardPage: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams();
  const {
    dealerCard: { compute, computing, strategy, onDecisionOverride },
    rules,
    setRules,
  } = useAppContext();

  const dealerCard = params[dealerCardUrlParam];
  const rawPlayerLabel = params[playerLabelUrlParam];
  const playerLabel = rawPlayerLabel && urlParamToLabel(rawPlayerLabel);

  useEffect(() => {
    if (!strategy) {
      // Compute the strategy the first time this page is rendered
      compute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadingOverlay loading={computing || !strategy}>
      <DealerCardContext.Provider value={{ onDecisionOverride, rules, strategy }}>
        <h1>
          {t('titles.dealerCard')}
          {dealerCard ? ` - ${playerLabel ? `${playerLabel} vs ` : ''}${dealerCard}` : ''}
        </h1>

        <RulesControls disabled={computing} rules={rules} setRules={setRules} />

        <nav className="nested-navbar">
          <SearchNavLink to={finalScoresRoute}>{t('dealerCard.dealerScores')}</SearchNavLink>
          <SearchNavLink to={summaryRoute}>{t('dealerCard.summary')}</SearchNavLink>
          <SearchNavLink to={dealerBreakdownRoute}>{t('dealerCard.breakdown')}</SearchNavLink>
        </nav>

        <AnimatedOutlet />
      </DealerCardContext.Provider>
    </LoadingOverlay>
  );
};
