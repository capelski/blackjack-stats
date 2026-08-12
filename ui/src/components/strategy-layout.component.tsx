import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import {
  actionsAnalysisRoute,
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  playerLabelUrlParam,
} from '../../constants';
import { urlParamToLabel } from '../logic/labels.logic';
import { SearchNavLink } from '../search-nav-link';
import { useStrategyContext } from '../strategy.context';
import { LoadingOverlay } from './loading-overlay.component';

export type StrategyLayoutComponentProps = PropsWithChildren<{
  title: string;
}>;

export const StrategyLayoutComponent: React.FC<StrategyLayoutComponentProps> = props => {
  const { t } = useTranslation();
  const { computing, strategy } = useStrategyContext();
  const params = useParams();

  const rawPlayerLabel = params[playerLabelUrlParam];
  const playerLabel = rawPlayerLabel && urlParamToLabel(rawPlayerLabel);

  return (
    <div>
      <h1>
        {props.title}
        {playerLabel ? ` - ${playerLabel}` : ''}
      </h1>

      {props.children}

      <LoadingOverlay loading={computing || !strategy}>
        <nav className="nested-navbar">
          <SearchNavLink to={materialHandsRoute}>{t('strategyLayout.hands')}</SearchNavLink>
          <SearchNavLink to={finalScoresRoute}>{t('strategyLayout.finalScores')}</SearchNavLink>
          <SearchNavLink to={expectedResultsRoute}>
            {t('strategyLayout.expectedResults')}
          </SearchNavLink>
          <SearchNavLink to={actionsAnalysisRoute}>
            {t('strategyLayout.actionsAnalysis')}
          </SearchNavLink>
        </nav>

        {strategy && <Outlet />}
      </LoadingOverlay>
    </div>
  );
};
