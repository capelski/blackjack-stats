import { Doubling } from '../../../enums/doubling.enum';
import { printDealerAwareStrategy } from '../../../logic/strategies/dealer-card.logic';

printDealerAwareStrategy({ doubling: Doubling.nine_to_eleven });
