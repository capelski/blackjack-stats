import { Doubling } from '../../../enums/doubling.enum';
import { printDealerAwareStrategy } from '../../../logic/strategies/dealer-card.logic';

printDealerAwareStrategy({ doubling: Doubling.all, splitting: true });
