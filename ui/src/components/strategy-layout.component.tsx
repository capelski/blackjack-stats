import { PropsWithChildren } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  resolvedHandsRoute,
} from '../models/routes.model';
import { getNavLinkStyle } from '../nav-utils';
import { useStrategyContext } from '../strategy.context';

export type StrategyLayoutComponentProps = PropsWithChildren<{
  title: string;
}>;

export const StrategyLayoutComponent: React.FC<StrategyLayoutComponentProps> = props => {
  const { computing, strategy } = useStrategyContext();

  return (
    <div>
      <h1>{props.title}</h1>

      {props.children}

      <div style={{ position: resolvedHandsRoute ? 'relative' : 'static' }}>
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
          <NavLink to={materialHandsRoute} style={getNavLinkStyle}>
            Hands
          </NavLink>
          <NavLink to={finalScoresRoute} style={getNavLinkStyle}>
            Final Scores
          </NavLink>
          <NavLink to={expectedResultsRoute} style={getNavLinkStyle}>
            Expected Results
          </NavLink>
          <NavLink to={resolvedHandsRoute} style={getNavLinkStyle}>
            Hand Actions
          </NavLink>
        </nav>

        {strategy && <Outlet />}
      </div>
    </div>
  );
};
