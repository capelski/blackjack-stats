import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, NavLink, Route, Routes, useSearchParams } from 'react-router-dom';
import { optimalActionsRoute, standThresholdRoute, supportedLanguages } from '../../constants';
import './App.css';
import { DecimalsSelector } from './components/decimals-selector.component';
import { LanguageSelector } from './components/language-selector.component';
import { defaultLanguage } from './i18n';
import { getLocalizedRoute, getNavLinkStyle, getStrategyPageNestedRoutes } from './nav-utils';
import { OptimalActionsPage } from './pages/optimal-actions.page';
import { StandThresholdPage } from './pages/stand-threshold.page';
import { SettingsContext } from './settings.context';
import { Rules } from './types/rules.type';

const defaultStandThreshold = 17;
const standThresholdParam = 't';
const defaultRules: Rules = {};

function App() {
  const { t, i18n } = useTranslation();
  const [decimals, setDecimals] = useState(2);
  const [rules, setRules] = useState<Rules>(defaultRules);
  const [searchParams, setSearchParams] = useSearchParams();
  const [standThreshold, setStandThreshold] = useState(() => {
    const queryValue = searchParams.get(standThresholdParam);
    if (queryValue === null) {
      return defaultStandThreshold;
    }

    const threshold = Number(queryValue);

    return Number.isInteger(threshold) ? threshold : defaultStandThreshold;
  });

  const updateStandThreshold = (newValue: number) => {
    setStandThreshold(newValue);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(standThresholdParam, String(newValue));
    setSearchParams(nextSearchParams);
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
                element={<OptimalActionsPage rules={rules} setRules={setRules} />}
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
