import { Doubling } from '../../../enums/doubling.enum';
import { printDealerAwareStrategy } from '../../../logic/strategies/dealer-card.logic';

printDealerAwareStrategy('split-double-all', {
  doubling: Doubling.all,
  splitting: true,
});
