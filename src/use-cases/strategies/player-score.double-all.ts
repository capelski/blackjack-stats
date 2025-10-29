import { Doubling } from '../../enums/doubling.enum';
import {
  getPlayerScoreStrategy,
  printPlayerScoreStrategy,
} from '../../logic/player-score-strategy.logic';

const playerScoreStrategy = getPlayerScoreStrategy({ doubling: Doubling.all });

printPlayerScoreStrategy(playerScoreStrategy);
