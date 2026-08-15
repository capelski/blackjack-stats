import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import {
  dealerCardRoute,
  optimalActionsRoute,
  standThresholdRoute,
  supportedLanguages,
} from '../constants';
import './App.css';
import { DecimalsSelector } from './components/decimals-selector.component';
import { LanguageSelector } from './components/language-selector.component';
import { DealerCardPageNestedRoutes } from './dealer-card-page-nested-routes';
import { defaultLanguage } from './i18n';
import { dealerFinalScores, dealerFinalScoresByFirstCard } from './logic/dealer-data.logic';
import { getOverridesResolver } from './logic/decision-overrides.logic';
import { optimalActionsHandResolver } from './logic/resolved-hands.logic';
import { getStrategy, getStrategyByFirstCard } from './logic/strategy.logic';
import { hit, stand } from './models/action.model';
import { getLocalizedRoute } from './nav-utils';
import { DealerCardPage } from './pages/dealer-card.page';
import { OptimalActionsPage } from './pages/optimal-actions.page';
import { StandThresholdPage } from './pages/stand-threshold.page';
import { SearchNavLink } from './search-nav-link';
import { SearchNavigate } from './search-navigate';
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
import { StrategyPageNestedRoutes } from './strategy-page-nested-routes';
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
  const [standThresholdDecisionOverrides, setStandThresholdDecisionOverrides] = useState<
    DecisionOverridesMap
  >({});
  const [optimalActionsDecisionOverrides, setOptimalActionsDecisionOverrides] = useState<
    DecisionOverridesMap
  >({});
  const [dealerCardDecisionOverrides, setDealerCardDecisionOverrides] = useState<
    DecisionOverridesByFirstCard
  >({});

  const [computingStandThresholdStrategy, setComputingStandThresholdStrategy] = useState(false);
  const [standThresholdStrategy, setStandThresholdStrategy] = useState<Strategy>(undefined!);
  const [computingOptimalActionsStrategy, setComputingOptimalActionsStrategy] = useState(false);
  const [optimalActionsStrategy, setOptimalActionsStrategy] = useState<Strategy>(undefined!);
  const [computingDealerCardStrategy, setComputingDealerCardStrategy] = useState(false);
  const [dealerCardStrategy, setDealerCardStrategy] = useState<StrategyByFirstCard>(undefined!);

  const [rules, setRules] = useState<Rules>(() => {
    const doubling = getParameter(doublingParamName) === '1';
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

  const updateRules = (newRules: Rules) => {
    setRules(newRules);

    toggleParameters([
      [doublingParamName, newRules.doubling ? '1' : '0', '0'],
      [splittingParamName, newRules.splitting ? '1' : '0', '0'],
      [doublingAfterSplitParamName, newRules.doublingAfterSplit ? '1' : '0', '0'],
      [hitSplitAcesParamName, newRules.hitSplitAces ? '1' : '0', '0'],
      [blackjackAfterSplitParamName, newRules.blackjackAfterSplit ? '1' : '0', '0'],
      [surrenderingParamName, newRules.surrendering ? '1' : '0', '0'],
    ]);
  };

  const updateStandThresholds = (newValue: StandThresholds) => {
    setStandThresholds(newValue);
    toggleParameters([
      [standThresholdParamName, String(newValue.regular), String(defaultStandThreshold)],
      [softStandThresholdParamName, String(newValue.softScores), String(newValue.regular)],
    ]);
  };

  const onStandThresholdDecisionOverride: DecisionOverrideHandler = (label, action) => {
    setStandThresholdDecisionOverrides(previous => ({ ...previous, [label]: action }));
  };

  const onOptimalActionsDecisionOverride: DecisionOverrideHandler = (label, action) => {
    setOptimalActionsDecisionOverrides(previous => ({ ...previous, [label]: action }));
  };

  const onDealerCardDecisionOverride: DecisionOverrideByFirstCardHandler = (
    firstCard,
    label,
    action,
  ) => {
    setDealerCardDecisionOverrides(previous => ({
      ...previous,
      [firstCard]: { ...previous[firstCard], [label]: action },
    }));
  };

  const computeStandThresholdStrategy = async (
    thresholds: StandThresholds,
    decisionOverrides: DecisionOverridesMap,
  ) => {
    setComputingStandThresholdStrategy(true);

    const standThresholdResolver: HandResolver = hand => {
      const thresholdToUse = hand.scores.length > 1 ? thresholds.softScores : thresholds.regular;
      return hand.effectiveScore >= thresholdToUse ? stand : hit;
    };

    const handResolver = getOverridesResolver(standThresholdResolver, decisionOverrides);

    const strategy = await getStrategy(standThresholdRules, handResolver, dealerFinalScores);
    setStandThresholdStrategy(strategy);
    setComputingStandThresholdStrategy(false);
  };

  const computeOptimalActionsStrategy = async (
    rules: Rules,
    decisionOverrides: DecisionOverridesMap,
  ) => {
    setComputingOptimalActionsStrategy(true);

    const handResolver = getOverridesResolver(optimalActionsHandResolver, decisionOverrides);

    const strategy = await getStrategy(rules, handResolver, dealerFinalScores);
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
      firstCard =>
        getOverridesResolver(optimalActionsHandResolver, decisionOverrides[firstCard] ?? {}),
      dealerFinalScoresByFirstCard,
    );
    setDealerCardStrategy(strategy);
    setComputingDealerCardStrategy(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStandThresholdStrategy(standThresholds, standThresholdDecisionOverrides);
  }, [standThresholdDecisionOverrides, standThresholds]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeOptimalActionsStrategy(rules, optimalActionsDecisionOverrides);
  }, [optimalActionsDecisionOverrides, rules]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeDealerCardStrategy(rules, dealerCardDecisionOverrides);
  }, [dealerCardDecisionOverrides, rules]);

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
        <Routes>
          {supportedLanguages.map(language => (
            <Route key={language} path={language}>
              <Route
                path={dealerCardRoute}
                element={
                  <DealerCardPage
                    computing={computingDealerCardStrategy}
                    decisionOverrides={dealerCardDecisionOverrides}
                    onDecisionOverride={onDealerCardDecisionOverride}
                    rules={rules}
                    setRules={updateRules}
                    strategy={dealerCardStrategy}
                  />
                }
              >
                {DealerCardPageNestedRoutes()}
              </Route>
              <Route
                path={optimalActionsRoute}
                element={
                  <OptimalActionsPage
                    computing={computingOptimalActionsStrategy}
                    decisionOverrides={optimalActionsDecisionOverrides}
                    onDecisionOverride={onOptimalActionsDecisionOverride}
                    rules={rules}
                    setRules={updateRules}
                    strategy={optimalActionsStrategy}
                  />
                }
              >
                {StrategyPageNestedRoutes()}
              </Route>
              <Route
                path={standThresholdRoute}
                element={
                  <StandThresholdPage
                    computing={computingStandThresholdStrategy}
                    decisionOverrides={standThresholdDecisionOverrides}
                    onDecisionOverride={onStandThresholdDecisionOverride}
                    rules={standThresholdRules}
                    setStandThresholds={updateStandThresholds}
                    standThresholds={standThresholds}
                    strategy={standThresholdStrategy}
                  />
                }
              >
                {StrategyPageNestedRoutes()}
              </Route>
              <Route index element={<SearchNavigate to={standThresholdRoute} />} />
            </Route>
          ))}
          <Route index element={<SearchNavigate to={defaultLanguage} />} />
        </Routes>
      </SettingsContext.Provider>
    </div>
  );
}

export default App;
