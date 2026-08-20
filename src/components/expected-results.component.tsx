import { useTranslation } from 'react-i18next';
import { expectedResultsGroupedRoute, expectedResultsMatrixRoute } from '../../constants';
import { AnimatedOutlet } from '../animated-outlet';
import { SearchNavLink } from '../search-nav-link';
import { useStrategyContext } from '../strategy.context';
import { ExpectedResultsSummary } from './expected-results-summary.component';

export const ExpectedResults: React.FC = () => {
  const { t } = useTranslation();
  const { rules, strategy } = useStrategyContext();

  return (
    <div className="expected-results">
      <ExpectedResultsSummary
        expectedResults={strategy.expectedResults}
        isSurrenderingEnabled={!!rules.surrendering}
      />

      <nav className="nested-navbar">
        <SearchNavLink to={expectedResultsMatrixRoute}>{t('expectedResults.matrix')}</SearchNavLink>
        <SearchNavLink to={expectedResultsGroupedRoute}>
          {t('expectedResults.grouped')}
        </SearchNavLink>
      </nav>

      <AnimatedOutlet />
    </div>
  );
};
