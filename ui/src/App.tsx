import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import { HandsList } from './components/hands-list.component';
import { handsListRoute, standThresholdRoute } from './models/routes.model';
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
          <Route index element={<Navigate to={handsListRoute} replace />} />
          <Route path={handsListRoute} element={<HandsList />} />
        </Route>
        <Route path="*" element={<Navigate to={standThresholdRoute} replace />} />
      </Routes>
    </div>
  );
}

export default App;
