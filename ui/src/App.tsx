import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import { ExpectedResults } from './components/expected-results.component';
import { FinalScoresList } from './components/final-scores-list.component';
import { MaterialHandsList } from './components/material-hands-list.component';
import { ResolvedHandsList } from './components/resolved-hands-list.component';
import {
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  resolvedHandsRoute,
  standThresholdRoute,
} from './models/routes.model';
import { StandThresholdPage } from './pages/stand-threshold.page';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <NavLink
          to="/stand-threshold"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Stand threshold
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to={standThresholdRoute} replace />} />
        <Route path={standThresholdRoute} element={<StandThresholdPage />}>
          <Route index element={<Navigate to={materialHandsRoute} replace />} />
          <Route path={materialHandsRoute} element={<MaterialHandsList />} />
          <Route path={finalScoresRoute} element={<FinalScoresList />} />
          <Route path={expectedResultsRoute} element={<ExpectedResults />} />
          <Route path={resolvedHandsRoute} element={<ResolvedHandsList />} />
        </Route>
        <Route path="*" element={<Navigate to={standThresholdRoute} replace />} />
      </Routes>
    </div>
  );
}

export default App;
