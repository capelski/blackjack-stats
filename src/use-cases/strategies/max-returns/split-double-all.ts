import { Doubling } from '../../../enums/doubling.enum';
import { printMaxReturnsStrategy } from '../../../logic/strategies/max-returns.logic';

printMaxReturnsStrategy('split-double-all', {
  doubling: Doubling.all,
  splitting: true,
});
