import { Doubling } from '../../../enums/doubling.enum';
import { printMaxReturnsStrategy } from '../../../logic/strategies/max-returns.logic';

printMaxReturnsStrategy({ doubling: Doubling.nine_to_eleven, splitting: true });
