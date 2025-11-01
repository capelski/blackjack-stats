import { Doubling } from '../../enums/doubling.enum';
import { printMaxReturnsStrategy } from '../../logic/max-returns-strategy.logic';

printMaxReturnsStrategy({ doubling: Doubling.all, splitting: true });
