import { useStrategyContext } from '../strategy.context';
import { HandsListCore } from './hands-list-core.component';
import { HandsListProps } from './hands-list-item.component';

export const HandsList: React.FC<HandsListProps> = props => {
  const { hands } = useStrategyContext();
  return <HandsListCore {...props} hands={hands} nonFinalHandsControl={true}></HandsListCore>;
};
