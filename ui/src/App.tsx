import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import { CombinationsList } from './components/combinations-list.component';
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
        <Route path="/" element={<Navigate to="/stand-threshold" replace />} />
        <Route path="/stand-threshold" element={<StandThresholdPage />}>
          <Route index element={<Navigate to="combinations" replace />} />
          <Route path="combinations" element={<CombinationsList />} />
        </Route>
        <Route path="*" element={<Navigate to="/stand-threshold" replace />} />
      </Routes>
    </div>
  );
}

export default App;
