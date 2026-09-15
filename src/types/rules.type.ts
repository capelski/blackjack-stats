import { Doubling } from '../models/doubling.model';
import { Splitting } from '../models/splitting.model';

export type Rules = {
  blackjackAfterSplit?: boolean;
  doubling?: Doubling;
  doublingAfterSplit?: boolean;
  hitSplitAces?: boolean;
  splitting?: Splitting;
  surrendering?: boolean;
};
