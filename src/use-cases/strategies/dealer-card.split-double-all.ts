import { Doubling } from '../../enums/doubling.enum';
import { printDealerCardStrategy } from '../../logic/dealer-card-strategy.logic';

printDealerCardStrategy({ doubling: Doubling.all, splitting: true });
