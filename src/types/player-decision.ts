import { Outcomes } from './outcomes';

export type PlayerDecision = {
  stand: Outcomes;
  hit: Outcomes;
  decision: 'hit' | 'stand';
};
