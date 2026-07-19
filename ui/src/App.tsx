import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { optimalActionsRoute, standThresholdRoute, supportedLanguages } from '../../constants';
import './App.css';
import { DecimalsSelector } from './components/decimals-selector.component';
import { LanguageSelector } from './components/language-selector.component';
import { defaultLanguage } from './i18n';
import { getLocalizedRoute, getNavLinkStyle, getStrategyPageNestedRoutes } from './nav-utils';
import { OptimalActionsPage } from './pages/optimal-actions.page';
import { StandThresholdPage } from './pages/stand-threshold.page';
import {
  blackjackAfterSplitParam,
  doublingAfterSplitParam,
  doublingParam,
  hitSplitAcesParam,
  splittingParam,
  standThresholdParam,
  useSearchParamsUtils,
} from './search-params-utils';
import { SettingsContext } from './settings.context';
import { Rules } from './types/rules.type';

const defaultStandThreshold = 17;

function App() {
  const { t, i18n } = useTranslation();
  const [decimals, setDecimals] = useState(2);
  const { searchParams, toggleParameter, toggleParameters } = useSearchParamsUtils();

  const [rules, setRules] = useState<Rules>(() => {
    const doubling = searchParams.get(doublingParam) === '1';
    const splitting = searchParams.get(splittingParam) === '1';
    const doublingAfterSplit = searchParams.get(doublingAfterSplitParam) === '1';
    const hitSplitAces = searchParams.get(hitSplitAcesParam) === '1';
    const blackjackAfterSplit = searchParams.get(blackjackAfterSplitParam) === '1';

    return {
      doubling,
      splitting,
      doublingAfterSplit,
      hitSplitAces,
      blackjackAfterSplit,
    };
  });

  const [standThreshold, setStandThreshold] = useState(() => {
    const queryValue = searchParams.get(standThresholdParam);
    if (queryValue === null) {
      return defaultStandThreshold;
    }

    const threshold = Number(queryValue);

    return Number.isInteger(threshold) ? threshold : defaultStandThreshold;
  });

  const updateRules = (newRules: Rules) => {
    setRules(newRules);

    toggleParameters([
      [doublingParam, newRules.doubling ? '1' : '0', '0'],
      [splittingParam, newRules.splitting ? '1' : '0', '0'],
      [doublingAfterSplitParam, newRules.doublingAfterSplit ? '1' : '0', '0'],
      [hitSplitAcesParam, newRules.hitSplitAces ? '1' : '0', '0'],
      [blackjackAfterSplitParam, newRules.blackjackAfterSplit ? '1' : '0', '0'],
    ]);
  };

  const updateStandThreshold = (newValue: number) => {
    setStandThreshold(newValue);
    toggleParameter(standThresholdParam, String(newValue), String(defaultStandThreshold));
  };

  const search = searchParams.toString();

  return (
    <div className="app">
      <nav className="navbar">
        <NavLink
          to={{
            pathname: getLocalizedRoute(i18n.language, standThresholdRoute),
            search,
          }}
          style={getNavLinkStyle}
        >
          {t('titles.standThreshold')}
        </NavLink>
        <NavLink
          to={{
            pathname: getLocalizedRoute(i18n.language, optimalActionsRoute),
            search,
          }}
          style={getNavLinkStyle}
        >
          {t('titles.optimalActions')}
        </NavLink>
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
                    standThreshold={standThreshold}
                    setStandThreshold={updateStandThreshold}
                  />
                }
              >
                {getStrategyPageNestedRoutes(searchParams)}
              </Route>
              <Route
                path={optimalActionsRoute}
                element={<OptimalActionsPage rules={rules} setRules={updateRules} />}
              >
                {getStrategyPageNestedRoutes(searchParams)}
              </Route>
              <Route
                index
                element={
                  <Navigate
                    to={{ pathname: standThresholdRoute, search: searchParams.toString() }}
                    replace
                  />
                }
              />
            </Route>
          ))}
          <Route
            index
            element={
              <Navigate
                to={{ pathname: defaultLanguage, search: searchParams.toString() }}
                replace
              />
            }
          />
        </Routes>
      </SettingsContext.Provider>
    </div>
  );
}

export default App;
