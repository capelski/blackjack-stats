import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { supportedLanguages } from '../../constants';
import './App.css';
import { DecimalsSelector } from './components/decimals-selector.component';
import { LanguageSelector } from './components/language-selector.component';
import { defaultLanguage } from './i18n';
import { optimalRoiRoute, standThresholdRoute } from './models/routes.model';
import { getLocalizedRoute, getNavLinkStyle, getStrategyPageNestedRoutes } from './nav-utils';
import { OptimalRoiPage } from './pages/optimal-roi.page';
import { StandThresholdPage } from './pages/stand-threshold.page';
import { SettingsContext } from './settings.context';

function App() {
  const { t, i18n } = useTranslation();
  const [decimals, setDecimals] = useState(2);

  return (
    <div className="app">
      <nav className="navbar">
        <NavLink to={getLocalizedRoute(i18n.language, standThresholdRoute)} style={getNavLinkStyle}>
          {t('titles.standThreshold')}
        </NavLink>
        <NavLink to={getLocalizedRoute(i18n.language, optimalRoiRoute)} style={getNavLinkStyle}>
          {t('titles.optimalRoi')}
        </NavLink>
        <LanguageSelector />
        <DecimalsSelector decimals={decimals} onDecimalsChange={setDecimals} />
      </nav>

      <SettingsContext.Provider value={{ decimals }}>
        <Routes>
          {supportedLanguages.map(language => (
            <Route key={language} path={language}>
              <Route path={standThresholdRoute} element={<StandThresholdPage />}>
                {getStrategyPageNestedRoutes()}
              </Route>
              <Route path={optimalRoiRoute} element={<OptimalRoiPage />}>
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
