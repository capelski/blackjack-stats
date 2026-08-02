import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import {
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  playerLabelUrlParam,
  resolvedHandsRoute,
} from '../../constants';
import { urlParamToLabel } from '../logic/labels.logic';
import { SearchNavLink } from '../search-nav-link';
import { useStrategyContext } from '../strategy.context';

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

      <div style={{ position: 'relative' }}>
        {(computing || !strategy) && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 100,
            }}
          >
            <h1>🔄</h1>
          </div>
        )}

        <nav className="nested-navbar">
          <SearchNavLink to={materialHandsRoute}>{t('strategyLayout.hands')}</SearchNavLink>
          <SearchNavLink to={finalScoresRoute}>{t('strategyLayout.finalScores')}</SearchNavLink>
          <SearchNavLink to={expectedResultsRoute}>
            {t('strategyLayout.expectedResults')}
          </SearchNavLink>
          <SearchNavLink to={resolvedHandsRoute}>
            {t('strategyLayout.actionsAnalysis')}
          </SearchNavLink>
        </nav>

        {strategy && <Outlet />}
      </div>
    </div>
  );
};
