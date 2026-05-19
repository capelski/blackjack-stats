import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';
import { expectedResultsListRoute, expectedResultsMatrixRoute } from '../../../constants';
import { getNavLinkStyle } from '../nav-utils';
import { ExpectedResultsSummary } from './expected-results-summary.component';

export const ExpectedResults: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="expected-results">
      <ExpectedResultsSummary />

      <nav className="nested-navbar">
        <NavLink to={expectedResultsMatrixRoute} style={getNavLinkStyle}>
          {t('expectedResults.matrix')}
        </NavLink>
        <NavLink to={expectedResultsListRoute} style={getNavLinkStyle}>
          {t('expectedResults.list')}
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
