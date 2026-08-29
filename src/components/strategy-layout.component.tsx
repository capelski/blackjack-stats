import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  actionsAnalysisRoute,
  expectedResultsRoute,
  finalComparisonsRoute,
  finalScoresRoute,
  materialHandsRoute,
  playerLabelUrlParam,
} from '../../constants';
import { AnimatedOutlet } from '../animated-outlet';
import { urlParamToLabel } from '../logic/labels.logic';
import { SearchNavLink } from '../search-nav-link';
import { useStrategyContext } from '../strategy.context';

export type StrategyLayoutComponentProps = PropsWithChildren<{
  title?: string;
}>;

export const StrategyLayoutComponent: React.FC<StrategyLayoutComponentProps> = (props) => {
  const { t } = useTranslation();
  const { strategy } = useStrategyContext();
  const params = useParams();

  const rawPlayerLabel = params[playerLabelUrlParam];
  const playerLabel = rawPlayerLabel && urlParamToLabel(rawPlayerLabel);

  return (
    <div>
      {props.title && (
        <h1>
          {props.title}
          {playerLabel ? ` - ${playerLabel}` : ''}
        </h1>
      )}

      {props.children}

      <nav className="nested-navbar">
        <SearchNavLink to={materialHandsRoute}>{t('strategyLayout.hands')}</SearchNavLink>
        <SearchNavLink to={finalScoresRoute}>{t('strategyLayout.finalScores')}</SearchNavLink>
        <SearchNavLink to={finalComparisonsRoute}>
          {t('strategyLayout.finalComparisons')}
        </SearchNavLink>
        <SearchNavLink to={expectedResultsRoute}>
          {t('strategyLayout.expectedResults')}
        </SearchNavLink>
        <SearchNavLink to={actionsAnalysisRoute}>
          {t('strategyLayout.actionsAnalysis')}
        </SearchNavLink>
      </nav>

      {strategy && <AnimatedOutlet />}
    </div>
  );
};
