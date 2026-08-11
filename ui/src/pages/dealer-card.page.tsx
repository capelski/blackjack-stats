import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DealerFinalScoresMatrix } from '../components/dealer-final-scores-matrix.component';
import { dealerFinalScoresByFirstCard } from '../logic/dealer-data.logic';
import { optimalActionsHandResolver } from '../logic/resolved-hands.logic';
import { getStrategyByFirstCard } from '../logic/strategy.logic';
import { Rules } from '../types/rules.type';
import { StrategyByFirstCard } from '../types/strategy.type';

export type OptimalActionsPageProps = {
  rules: Rules;
  setRules: (rules: Rules) => void;
};

export const DealerCardPage: React.FC<OptimalActionsPageProps> = props => {
  const { t } = useTranslation();
  const [, setComputing] = useState(false);
  const [, setStrategy] = useState<StrategyByFirstCard>(undefined!);

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
    <div>
      <h1>{t('titles.dealerCard')}</h1>

      <DealerFinalScoresMatrix />
    </div>
  );
};
