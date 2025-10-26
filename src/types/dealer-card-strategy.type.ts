import { PlayerDecision } from './player-decision.type';

export type DealerCardStrategy = Record<string, Record<string, PlayerDecision>>;
