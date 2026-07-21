import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';
import { expectedResultsGroupedRoute, expectedResultsMatrixRoute } from '../../../constants';
import { getNavLinkStyle } from '../nav-utils';
import { useSearchParamsUtils } from '../search-params-utils';
import { ExpectedResultsSummary } from './expected-results-summary.component';

export const ExpectedResults: React.FC = () => {
  const { t } = useTranslation();
  const { getSearchString } = useSearchParamsUtils();
  const search = getSearchString();

  return (
    <div className="expected-results">
      <ExpectedResultsSummary />

      <nav className="nested-navbar">
        <NavLink to={{ pathname: expectedResultsMatrixRoute, search }} style={getNavLinkStyle}>
          {t('expectedResults.matrix')}
        </NavLink>
        <NavLink to={{ pathname: expectedResultsGroupedRoute, search }} style={getNavLinkStyle}>
          {t('expectedResults.grouped')}
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
