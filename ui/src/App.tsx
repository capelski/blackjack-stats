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

const defaultStandThreshold = 17;
const standThresholdParam = 't';

function App() {
  const { t, i18n } = useTranslation();
  const [decimals, setDecimals] = useState(2);
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

  return (
    <div className="app">
      <nav className="navbar">
        <NavLink to={getLocalizedRoute(i18n.language, standThresholdRoute)} style={getNavLinkStyle}>
          {t('titles.standThreshold')}
        </NavLink>
        <NavLink to={getLocalizedRoute(i18n.language, optimalActionsRoute)} style={getNavLinkStyle}>
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
              <Route path={optimalActionsRoute} element={<OptimalActionsPage />}>
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
