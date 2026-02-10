import { Doubling } from '../../../enums/doubling.enum';
import { printDealerAwareStrategy } from '../../../logic/strategies/dealer-card.logic';

printDealerAwareStrategy('double-nine', { doubling: Doubling.nine_to_eleven });
