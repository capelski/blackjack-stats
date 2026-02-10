import { Doubling } from '../../../enums/doubling.enum';
import { printMaxReturnsStrategy } from '../../../logic/strategies/max-returns.logic';

printMaxReturnsStrategy('split-double-nine', {
  doubling: Doubling.nine_to_eleven,
  splitting: true,
});
