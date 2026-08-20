import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { dealerCardRoute, optimalActionsRoute, standThresholdRoute } from '../constants';
import './App.css';
import { AppContext } from './app.context';
import { DecimalsSelector } from './components/decimals-selector.component';
import { LanguageSelector } from './components/language-selector.component';
import { dealerFinalScores, dealerFinalScoresByFirstCard } from './logic/dealer-data.logic';
import { optimalActionsHandResolver } from './logic/resolved-hands.logic';
import { getStrategy, getStrategyByFirstCard } from './logic/strategy.logic';
import { hit, stand } from './models/action.model';
import { doublingDisabled, sortedDoublingOptions } from './models/doubling.model';
import { getLocalizedRoute } from './nav-utils';
import { SearchNavLink } from './search-nav-link';
import {
  blackjackAfterSplitParamName,
  doublingAfterSplitParamName,
  doublingParamName,
  hitSplitAcesParamName,
  softStandThresholdParamName,
  splittingParamName,
  standThresholdParamName,
  surrenderingParamName,
  useSearchParamsUtils,
} from './search-params-utils';
import { SettingsContext } from './settings.context';
import {
  DecisionOverrideByFirstCardHandler,
  DecisionOverrideHandler,
  DecisionOverridesByFirstCard,
  DecisionOverridesMap,
} from './types/decision-overrides.type';
import { HandResolver } from './types/hand-resolution.type';
import { Rules } from './types/rules.type';
import { StandThresholds } from './types/stand-thresholds.type';
import { Strategy, StrategyByFirstCard } from './types/strategy.type';

const defaultStandThreshold = 17;

// Deliberately ignoring the app rules, as the stand threshold strategy doesn't depend on them
const standThresholdRules: Rules = {};

function App() {
  const { t, i18n } = useTranslation();
  const [decimals, setDecimals] = useState(2);
  const { toggleParameters, getNumericParameter, getParameter } = useSearchParamsUtils();

  // The strategies are undefined until they are computed for the first time
  const [computingStandThresholdStrategy, setComputingStandThresholdStrategy] = useState(false);
  const [standThresholdStrategy, setStandThresholdStrategy] = useState<Strategy>();
  const [computingOptimalActionsStrategy, setComputingOptimalActionsStrategy] = useState(false);
  const [optimalActionsStrategy, setOptimalActionsStrategy] = useState<Strategy>();
  const [computingDealerCardStrategy, setComputingDealerCardStrategy] = useState(false);
  const [dealerCardStrategy, setDealerCardStrategy] = useState<StrategyByFirstCard>();

  const [rules, setRules] = useState<Rules>(() => {
    const doubling = getParameter(doublingParamName, sortedDoublingOptions) ?? doublingDisabled;
    const splitting = getParameter(splittingParamName) === '1';
    const doublingAfterSplit = getParameter(doublingAfterSplitParamName) === '1';
    const hitSplitAces = getParameter(hitSplitAcesParamName) === '1';
    const blackjackAfterSplit = getParameter(blackjackAfterSplitParamName) === '1';
    const surrendering = getParameter(surrenderingParamName) === '1';

    return {
      doubling,
      splitting,
      doublingAfterSplit,
      hitSplitAces,
      blackjackAfterSplit,
      surrendering,
    };
  });

  const [standThresholds, setStandThresholds] = useState<StandThresholds>(() => {
    const regular = getNumericParameter(standThresholdParamName) ?? defaultStandThreshold;

    return {
      regular,
      softScores: getNumericParameter(softStandThresholdParamName) ?? regular,
    };
  });

  const computeStandThresholdStrategy = async (
    thresholds: StandThresholds,
    decisionOverrides: DecisionOverridesMap,
  ) => {
    setComputingStandThresholdStrategy(true);

    const standThresholdResolver: HandResolver = hand => {
      const thresholdToUse = hand.scores.length > 1 ? thresholds.softScores : thresholds.regular;
      return hand.effectiveScore >= thresholdToUse ? stand : hit;
    };

    const strategy = await getStrategy(
      standThresholdRules,
      standThresholdResolver,
      dealerFinalScores,
      decisionOverrides,
    );
    setStandThresholdStrategy(strategy);
    setComputingStandThresholdStrategy(false);
  };

  const computeOptimalActionsStrategy = async (
    rules: Rules,
    decisionOverrides: DecisionOverridesMap,
  ) => {
    setComputingOptimalActionsStrategy(true);

    const strategy = await getStrategy(
      rules,
      optimalActionsHandResolver,
      dealerFinalScores,
      decisionOverrides,
    );
    setOptimalActionsStrategy(strategy);
    setComputingOptimalActionsStrategy(false);
  };

  const computeDealerCardStrategy = async (
    rules: Rules,
    decisionOverrides: DecisionOverridesByFirstCard,
  ) => {
    setComputingDealerCardStrategy(true);

    const strategy = await getStrategyByFirstCard(
      rules,
      optimalActionsHandResolver,
      dealerFinalScoresByFirstCard,
      decisionOverrides,
    );
    setDealerCardStrategy(strategy);
    setComputingDealerCardStrategy(false);
  };

  const updateRules = (newRules: Rules) => {
    setRules(newRules);

    toggleParameters([
      [doublingParamName, newRules.doubling ?? doublingDisabled, doublingDisabled],
      [splittingParamName, newRules.splitting ? '1' : '0', '0'],
      [doublingAfterSplitParamName, newRules.doublingAfterSplit ? '1' : '0', '0'],
      [hitSplitAcesParamName, newRules.hitSplitAces ? '1' : '0', '0'],
      [blackjackAfterSplitParamName, newRules.blackjackAfterSplit ? '1' : '0', '0'],
      [surrenderingParamName, newRules.surrendering ? '1' : '0', '0'],
    ]);

    computeOptimalActionsStrategy(newRules, optimalActionsStrategy?.decisionOverrides ?? {});
    computeDealerCardStrategy(newRules, dealerCardStrategy?.decisionOverrides ?? {});
  };

  const updateStandThresholds = (newValue: StandThresholds) => {
    setStandThresholds(newValue);
    toggleParameters([
      [standThresholdParamName, String(newValue.regular), String(defaultStandThreshold)],
      [softStandThresholdParamName, String(newValue.softScores), String(newValue.regular)],
    ]);

    computeStandThresholdStrategy(newValue, standThresholdStrategy?.decisionOverrides ?? {});
  };

  const onStandThresholdDecisionOverride: DecisionOverrideHandler = (label, action) => {
    const nextDecisionOverrides: DecisionOverridesMap = {
      ...standThresholdStrategy?.decisionOverrides,
      [label]: action,
    };
    computeStandThresholdStrategy(standThresholds, nextDecisionOverrides);
  };

  const onOptimalActionsDecisionOverride: DecisionOverrideHandler = (label, action) => {
    const nextDecisionOverrides: DecisionOverridesMap = {
      ...optimalActionsStrategy?.decisionOverrides,
      [label]: action,
    };
    computeOptimalActionsStrategy(rules, nextDecisionOverrides);
  };

  const onDealerCardDecisionOverride: DecisionOverrideByFirstCardHandler = (
    firstCard,
    label,
    action,
  ) => {
    const decisionOverrides = dealerCardStrategy?.decisionOverrides ?? {};
    const nextDecisionOverrides: DecisionOverridesByFirstCard = {
      ...decisionOverrides,
      [firstCard]: { ...decisionOverrides[firstCard], [label]: action },
    };

    computeDealerCardStrategy(rules, nextDecisionOverrides);
  };

  // The strategies are only computed on mount. From then on, they are recomputed by the handlers
  // updating their inputs, which carry over the decision overrides of the previous strategy
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    computeStandThresholdStrategy(standThresholds, {});
    computeOptimalActionsStrategy(rules, {});
    computeDealerCardStrategy(rules, {});
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <SearchNavLink to={getLocalizedRoute(i18n.language, standThresholdRoute)}>
          {t('titles.standThreshold')}
        </SearchNavLink>
        <SearchNavLink to={getLocalizedRoute(i18n.language, optimalActionsRoute)}>
          {t('titles.optimalActions')}
        </SearchNavLink>
        <SearchNavLink to={getLocalizedRoute(i18n.language, dealerCardRoute)}>
          {t('titles.dealerCard')}
        </SearchNavLink>
        <LanguageSelector />
        <DecimalsSelector decimals={decimals} onDecimalsChange={setDecimals} />
      </nav>

      <SettingsContext.Provider value={{ decimals }}>
        <AppContext.Provider
          value={{
            dealerCard: {
              computing: computingDealerCardStrategy,
              onDecisionOverride: onDealerCardDecisionOverride,
              strategy: dealerCardStrategy!,
            },
            optimalActions: {
              computing: computingOptimalActionsStrategy,
              onDecisionOverride: onOptimalActionsDecisionOverride,
              strategy: optimalActionsStrategy!,
            },
            standThreshold: {
              computing: computingStandThresholdStrategy,
              onDecisionOverride: onStandThresholdDecisionOverride,
              rules: standThresholdRules,
              setThresholds: updateStandThresholds,
              strategy: standThresholdStrategy!,
              thresholds: standThresholds,
            },
            rules,
            setRules: updateRules,
          }}
        >
          <main className="animation-container">
            <Outlet />
          </main>
        </AppContext.Provider>
      </SettingsContext.Provider>
    </div>
  );
}

export default App;
