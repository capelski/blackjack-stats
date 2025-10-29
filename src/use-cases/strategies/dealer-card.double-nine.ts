import { Doubling } from '../../enums/doubling.enum';
import {
  getDealerCardStrategy,
  printDealerCardStrategy,
} from '../../logic/dealer-card-strategy.logic';

const dealerCardStrategy = getDealerCardStrategy({ doubling: Doubling.nine_to_eleven });

printDealerCardStrategy(dealerCardStrategy);
