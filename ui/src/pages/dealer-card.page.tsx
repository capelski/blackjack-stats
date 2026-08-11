import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { finalScoresRoute, summaryRoute } from '../../constants';
import { DealerCardContext } from '../dealer-card.context';
import { dealerFinalScoresByFirstCard } from '../logic/dealer-data.logic';
import { optimalActionsHandResolver } from '../logic/resolved-hands.logic';
import { getStrategyByFirstCard } from '../logic/strategy.logic';
import { SearchNavLink } from '../search-nav-link';
import { Rules } from '../types/rules.type';
import { StrategyByFirstCard } from '../types/strategy.type';

export type OptimalActionsPageProps = {
  rules: Rules;
  setRules: (rules: Rules) => void;
};

export const DealerCardPage: React.FC<OptimalActionsPageProps> = props => {
  const { t } = useTranslation();
  const [computing, setComputing] = useState(false);
  const [strategy, setStrategy] = useState<StrategyByFirstCard>(undefined!);

  const computeStrategy = async (rules: Rules) => {
    setComputing(true);

    const strategy = await getStrategyByFirstCard(
      rules,
      optimalActionsHandResolver,
      dealerFinalScoresByFirstCard,
    );
    setStrategy(strategy);
    setComputing(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(props.rules);
  }, [props.rules]);

  return (
    <DealerCardContext.Provider value={{ computing, strategy }}>
      <div>
        <h1>{t('titles.dealerCard')}</h1>

        <nav className="nested-navbar">
          <SearchNavLink to={finalScoresRoute}>{t('dealerCard.dealerScores')}</SearchNavLink>
          <SearchNavLink to={summaryRoute}>{t('dealerCard.summary')}</SearchNavLink>
        </nav>

        <Outlet />
      </div>
    </DealerCardContext.Provider>
  );
};
