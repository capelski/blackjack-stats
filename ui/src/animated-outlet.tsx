import { Outlet } from 'react-router-dom';
import { getAnimationContainerClassName, useIsOutletContentChanging } from './animation-utils';

/**
 * Outlet wrapped in the element that the view transition animates when this route's content changes
 */
export const AnimatedOutlet: React.FC = () => {
  const isOutletContentChanging = useIsOutletContentChanging();

  return (
    <div className={getAnimationContainerClassName(isOutletContentChanging)}>
      <Outlet />
    </div>
  );
};
