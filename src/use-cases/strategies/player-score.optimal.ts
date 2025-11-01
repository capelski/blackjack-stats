import { Doubling } from '../../enums/doubling.enum';
import { printPlayerScoreStrategy } from '../../logic/player-score-strategy.logic';

printPlayerScoreStrategy({ doubling: Doubling.all, splitting: true });
