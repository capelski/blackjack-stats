import { useStrategyContext } from '../strategy.context';
import { MaterialHandsListCore } from './material-hands-list-core.component';
import { HandsListProps } from './material-hands-list-item.component';

export const MaterialHandsList: React.FC<HandsListProps> = props => {
  const { materialHands, showBetMultiplier } = useStrategyContext();
  return (
    <MaterialHandsListCore
      {...props}
      hands={materialHands}
      nonFinalHandsControl={true}
      showBetMultiplier={showBetMultiplier}
    ></MaterialHandsListCore>
  );
};
