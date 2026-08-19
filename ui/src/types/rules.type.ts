import { Doubling } from '../models/doubling.model';

export type Rules = {
  blackjackAfterSplit?: boolean;
  doubling?: Doubling;
  doublingAfterSplit?: boolean;
  hitSplitAces?: boolean;
  splitting?: boolean;
  surrendering?: boolean;
};
