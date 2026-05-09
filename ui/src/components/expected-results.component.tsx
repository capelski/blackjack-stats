import { NavLink, Outlet } from 'react-router-dom';
import { expectedResultsListRoute, expectedResultsMatrixRoute } from '../models/routes.model';
import { getNavLinkStyle } from '../nav-utils';
import { ExpectedResultsSummary } from './expected-results-summary.component';

export const ExpectedResults: React.FC = () => {
  return (
    <div className="expected-results">
      <ExpectedResultsSummary />

      <nav className="nested-navbar">
        <NavLink to={expectedResultsMatrixRoute} style={getNavLinkStyle}>
          Matrix
        </NavLink>
        <NavLink to={expectedResultsListRoute} style={getNavLinkStyle}>
          List
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
