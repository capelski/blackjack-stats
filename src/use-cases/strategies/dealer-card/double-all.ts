import { Doubling } from '../../../enums/doubling.enum';
import { printDealerAwareStrategy } from '../../../logic/strategies/dealer-card.logic';

printDealerAwareStrategy('double-all', { doubling: Doubling.all });
