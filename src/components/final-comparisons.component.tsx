import { useTranslation } from 'react-i18next';
import { finalComparisonsGroupedRoute, finalComparisonsMatrixRoute } from '../../constants';
import { AnimatedOutlet } from '../animated-outlet';
import { SearchNavLink } from '../search-nav-link';

export const FinalComparisons: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="final-comparisons">
      <nav className="nested-navbar">
        <SearchNavLink to={finalComparisonsMatrixRoute}>
          {t('finalComparisons.matrix')}
        </SearchNavLink>
        <SearchNavLink to={finalComparisonsGroupedRoute}>
          {t('finalComparisons.grouped')}
        </SearchNavLink>
      </nav>

      <AnimatedOutlet />
    </div>
  );
};
