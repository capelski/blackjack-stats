import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useSearchParams } from 'react-router-dom';
import {
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  resolvedHandsRoute,
} from '../../../constants';
import { getNavLinkStyle } from '../nav-utils';
import { useStrategyContext } from '../strategy.context';

export type StrategyLayoutComponentProps = PropsWithChildren<{
  title: string;
}>;

export const StrategyLayoutComponent: React.FC<StrategyLayoutComponentProps> = props => {
  const { t } = useTranslation();
  const { computing, strategy } = useStrategyContext();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  return (
    <div>
      <h1>{props.title}</h1>

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
          <NavLink to={{ pathname: materialHandsRoute, search }} style={getNavLinkStyle}>
            {t('strategyLayout.hands')}
          </NavLink>
          <NavLink to={{ pathname: finalScoresRoute, search }} style={getNavLinkStyle}>
            {t('strategyLayout.finalScores')}
          </NavLink>
          <NavLink to={{ pathname: expectedResultsRoute, search }} style={getNavLinkStyle}>
            {t('strategyLayout.expectedResults')}
          </NavLink>
          <NavLink to={{ pathname: resolvedHandsRoute, search }} style={getNavLinkStyle}>
            {t('strategyLayout.actionsAnalysis')}
          </NavLink>
        </nav>

        {strategy && <Outlet />}
      </div>
    </div>
  );
};
