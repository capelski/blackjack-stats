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
import { SettingsContext } from './settings.context';

const defaultStandThreshold = 17;
const standThresholdParam = 't';

const getStandThresholdFromQueryString = (): number => {
  if (typeof window === 'undefined') {
    return defaultStandThreshold;
  }

  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get(standThresholdParam);
  if (queryValue === null) {
    return defaultStandThreshold;
  }

  const threshold = Number(queryValue);

  return Number.isInteger(threshold) ? threshold : defaultStandThreshold;
};

const updateStandThresholdInQueryString = (threshold: number): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set(standThresholdParam, threshold.toString());
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
};

function App() {
  const { t, i18n } = useTranslation();
  const [decimals, setDecimals] = useState(2);
  const [standThreshold, setStandThreshold] = useState(getStandThresholdFromQueryString);

  const updateStandThreshold = (newValue: number) => {
    setStandThreshold(newValue);
    updateStandThresholdInQueryString(newValue);
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
                {getStrategyPageNestedRoutes()}
              </Route>
              <Route path={optimalActionsRoute} element={<OptimalActionsPage />}>
                {getStrategyPageNestedRoutes()}
              </Route>
              <Route index element={<Navigate to={standThresholdRoute} replace />} />
            </Route>
          ))}
          <Route index element={<Navigate to={defaultLanguage} replace />} />
        </Routes>
      </SettingsContext.Provider>
    </div>
  );
}

export default App;
