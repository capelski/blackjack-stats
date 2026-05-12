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

      {(computing || !strategy) && <p>Computing...</p>}

      {strategy && <Outlet />}
    </div>
  );
};
