import { useStrategyContext } from '../strategy.context';
import { MaterialHandsListCore } from './material-hands-list-core.component';
import { HandsListProps } from './material-hands-list-item.component';

export const MaterialHandsList: React.FC<HandsListProps> = (props) => {
  const { strategy, showHandModifiers } = useStrategyContext();
  return (
    <MaterialHandsListCore
      {...props}
      hands={strategy.materialHands}
      nonFinalHandsControl={true}
      showHandModifiers={showHandModifiers}
    ></MaterialHandsListCore>
  );
};
