import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { expectedResultsGroupedRoute, expectedResultsMatrixRoute } from '../../constants';
import { SearchNavLink } from '../search-nav-link';
import { ExpectedResultsSummary } from './expected-results-summary.component';

export const ExpectedResults: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="expected-results">
      <ExpectedResultsSummary />

      <nav className="nested-navbar">
        <SearchNavLink to={expectedResultsMatrixRoute}>{t('expectedResults.matrix')}</SearchNavLink>
        <SearchNavLink to={expectedResultsGroupedRoute}>
          {t('expectedResults.grouped')}
        </SearchNavLink>
      </nav>

      <Outlet />
    </div>
  );
};
