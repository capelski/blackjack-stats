import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';
import { optimalActionsRoute, standThresholdRoute, supportedLanguages } from '../constants';
import './App.css';
import { DecimalsSelector } from './components/decimals-selector.component';
import { LanguageSelector } from './components/language-selector.component';
import { defaultLanguage } from './i18n';
import { getLocalizedRoute, getStrategyPageNestedRoutes } from './nav-utils';
import { OptimalActionsPage } from './pages/optimal-actions.page';
import { StandThresholdPage } from './pages/stand-threshold.page';
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
import { DecisionOverrideHandler, DecisionOverridesMap } from './types/decision-overrides.type';
import { Rules } from './types/rules.type';
import { StandThresholds } from './types/stand-thresholds.type';

const defaultStandThreshold = 17;

function App() {
  const { t, i18n } = useTranslation();
  const [decimals, setDecimals] = useState(2);
  const {
    toggleParameters,
    getNumericParameter,
    getParameter,
    getSearchString,
  } = useSearchParamsUtils();
  const [standThresholdDecisionOverrides, setStandThresholdDecisionOverrides] = useState<
    DecisionOverridesMap
  >({});
  const [optimalActionsDecisionOverrides, setOptimalActionsDecisionOverrides] = useState<
    DecisionOverridesMap
  >({});

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
    return {
      regular: getNumericParameter(standThresholdParamName) ?? defaultStandThreshold,
      softScores: getNumericParameter(softStandThresholdParamName) ?? defaultStandThreshold,
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
      [softStandThresholdParamName, String(newValue.softScores), String(defaultStandThreshold)],
    ]);
  };

  const onStandThresholdDecisionOverride: DecisionOverrideHandler = (label, action) => {
    setStandThresholdDecisionOverrides(previous => ({ ...previous, [label]: action }));
  };

  const onOptimalActionsDecisionOverride: DecisionOverrideHandler = (label, action) => {
    setOptimalActionsDecisionOverrides(previous => ({ ...previous, [label]: action }));
  };

  const search = getSearchString();

  return (
    <div className="app">
      <nav className="navbar">
        <SearchNavLink to={getLocalizedRoute(i18n.language, standThresholdRoute)}>
          {t('titles.standThreshold')}
        </SearchNavLink>
        <SearchNavLink to={getLocalizedRoute(i18n.language, optimalActionsRoute)}>
          {t('titles.optimalActions')}
        </SearchNavLink>
        <LanguageSelector />
        <DecimalsSelector decimals={decimals} onDecimalsChange={setDecimals} />
      </nav>

      <SettingsContext.Provider value={{ decimals }}>
        <Routes>
          {supportedLanguages.map(language => (
            <Route key={language} path={language}>
              <Route
                path={standThresholdRoute}
                element={
                  <StandThresholdPage
                    decisionOverrides={standThresholdDecisionOverrides}
                    onDecisionOverride={onStandThresholdDecisionOverride}
                    setStandThresholds={updateStandThresholds}
                    standThresholds={standThresholds}
                  />
                }
              >
                {getStrategyPageNestedRoutes(search)}
              </Route>
              <Route
                path={optimalActionsRoute}
                element={
                  <OptimalActionsPage
                    decisionOverrides={optimalActionsDecisionOverrides}
                    onDecisionOverride={onOptimalActionsDecisionOverride}
                    rules={rules}
                    setRules={updateRules}
                  />
                }
              >
                {getStrategyPageNestedRoutes(search)}
              </Route>
              <Route
                index
                element={<Navigate to={{ pathname: standThresholdRoute, search }} replace />}
              />
            </Route>
          ))}
          <Route index element={<Navigate to={{ pathname: defaultLanguage, search }} replace />} />
        </Routes>
      </SettingsContext.Provider>
    </div>
  );
}

export default App;
