import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import { optimalRoiRoute, standThresholdRoute } from './models/routes.model';
import { getNavLinkStyle, getStrategyPageNestedRoutes } from './nav-utils';
import { OptimalRoiPage } from './pages/optimal-roi.page';
import { StandThresholdPage } from './pages/stand-threshold.page';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <NavLink to={standThresholdRoute} style={getNavLinkStyle}>
          Stand threshold
        </NavLink>
        <NavLink to={optimalRoiRoute} style={getNavLinkStyle}>
          Optimal ROI
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to={standThresholdRoute} replace />} />
        <Route path={standThresholdRoute} element={<StandThresholdPage />}>
          {getStrategyPageNestedRoutes()}
        </Route>
        <Route path={optimalRoiRoute} element={<OptimalRoiPage />}>
          {getStrategyPageNestedRoutes()}
        </Route>
        <Route path="*" element={<Navigate to={standThresholdRoute} replace />} />
      </Routes>
    </div>
  );
}

export default App;
